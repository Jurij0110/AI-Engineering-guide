// NeuralNetworkLab Engine: Multi-layer Perceptron, Forward Propagation, and Layer Topology Explorer

export function applyActivation(z, activation = "relu") {
  switch (activation) {
    case "relu":
      return Math.max(0, z);
    case "sigmoid":
      return 1 / (1 + Math.exp(-z));
    case "tanh":
      return Math.tanh(z);
    case "linear":
    default:
      return z;
  }
}

export function calculateLayerParameters(topology) {
  let totalWeights = 0;
  let totalBiases = 0;
  for (let i = 0; i < topology.length - 1; i++) {
    const current = topology[i];
    const next = topology[i + 1];
    totalWeights += current * next;
    totalBiases += next;
  }
  return {
    totalWeights,
    totalBiases,
    totalParams: totalWeights + totalBiases
  };
}

export function computeForwardPass(inputs, topology, hiddenActivation = "relu", outputActivation = "softmax") {
  const layerOutputs = [[...inputs]];

  let currentVals = [...inputs];
  for (let l = 0; l < topology.length - 1; l++) {
    const nextSize = topology[l + 1];
    const isOutput = (l === topology.length - 2);
    const nextVals = [];

    for (let j = 0; j < nextSize; j++) {
      let z = 0.1 * (j + 1); // deterministic pseudo-bias
      for (let i = 0; i < currentVals.length; i++) {
        const w = Math.sin((l + 1) * 3 + (i + 1) * 2 + (j + 1));
        z += currentVals[i] * w;
      }
      const act = isOutput ? (outputActivation === "softmax" ? z : applyActivation(z, outputActivation)) : applyActivation(z, hiddenActivation);
      nextVals.push(act);
    }

    if (isOutput && outputActivation === "softmax") {
      const maxZ = Math.max(...nextVals);
      const exps = nextVals.map(v => Math.exp(v - maxZ));
      const sumExp = exps.reduce((a, b) => a + b, 0);
      const softmaxVals = exps.map(e => e / sumExp);
      layerOutputs.push(softmaxVals);
      currentVals = softmaxVals;
    } else {
      layerOutputs.push(nextVals);
      currentVals = nextVals;
    }
  }

  const outputProbabilities = layerOutputs[layerOutputs.length - 1];
  return { layerOutputs, outputProbabilities };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderNetworkSVG(topology, forwardRes) {
    const width = 500, height = 240;
    const nLayers = topology.length;
    const layerSpacing = (width - 100) / (nLayers - 1 || 1);

    let nodes = [];
    let nodeCoordinates = [];

    for (let l = 0; l < nLayers; l++) {
      const layerSize = topology[l];
      const layerX = 50 + l * layerSpacing;
      const nodeSpacing = (height - 60) / (layerSize + 1 || 1);
      const layerNodes = [];

      for (let n = 0; n < layerSize; n++) {
        const nodeY = 30 + (n + 1) * nodeSpacing;
        const val = forwardRes.layerOutputs[l]?.[n] ?? 0;
        layerNodes.push({ x: layerX, y: nodeY, val, layer: l, index: n });
      }
      nodeCoordinates.push(layerNodes);
    }

    let edgesSvg = "";
    for (let l = 0; l < nLayers - 1; l++) {
      for (const src of nodeCoordinates[l]) {
        for (const dst of nodeCoordinates[l + 1]) {
          const weight = Math.sin((l + 1) * 3 + (src.index + 1) * 2 + (dst.index + 1));
          const color = weight >= 0 ? "#0f62fe" : "#ff832b";
          const opacity = Math.min(0.8, Math.max(0.2, Math.abs(weight)));
          edgesSvg += `<line x1="${src.x}" y1="${src.y}" x2="${dst.x}" y2="${dst.y}" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.5"/>`;
        }
      }
    }

    let nodesSvg = "";
    for (let l = 0; l < nLayers; l++) {
      for (const node of nodeCoordinates[l]) {
        const isInput = (l === 0);
        const isOutput = (l === nLayers - 1);
        const color = isInput ? "#8a3ffc" : (isOutput ? "#24a148" : "#0f62fe");

        nodesSvg += `
          <g class="network-node">
            <circle cx="${node.x}" cy="${node.y}" r="12" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text x="${node.x}" y="${node.y + 3}" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">${node.val.toFixed(1)}</text>
          </g>
        `;
      }
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="neural-network-graph" role="img" aria-label="Neural Network Architecture Diagram">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${edgesSvg}
        ${nodesSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;

    const depth = parseInt(currentControls.depth ?? currentSpec.controls.find(c => c.id === "depth")?.default ?? 2, 10);
    const hiddenWidth = parseInt(currentControls.hidden_width ?? currentSpec.controls.find(c => c.id === "hidden_width")?.default ?? 4, 10);
    const activation = currentControls.activation || currentSpec.controls.find(c => c.id === "activation")?.default || "relu";

    const topology = [2];
    for (let i = 0; i < depth; i++) topology.push(hiddenWidth);
    topology.push(2); // Binary/multiclass 2 outputs

    const params = calculateLayerParameters(topology);
    const inputs = [0.7, -0.3];
    const forwardRes = computeForwardPass(inputs, topology, activation, "softmax");

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderNetworkSVG(topology, forwardRes);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const paramElem = root.querySelector("[data-metric='params']");
    if (paramElem) paramElem.textContent = params.totalParams;

    const probElem = root.querySelector("[data-metric='confidence']");
    if (probElem) probElem.textContent = (forwardRes.outputProbabilities[0] * 100).toFixed(1) + "%";

    const lossElem = root.querySelector("[data-metric='loss']");
    if (lossElem) {
      const loss = -Math.log(Math.max(1e-4, forwardRes.outputProbabilities[0]));
      lossElem.textContent = loss.toFixed(3);
    }
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-neural-network-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Total Parameters:</span> <strong data-metric="params">26</strong></div>
            <div class="metric-card"><span class="label">Class 1 Confidence:</span> <strong data-metric="confidence">72.4%</strong></div>
            <div class="metric-card"><span class="label">Loss:</span> <strong data-metric="loss">0.323</strong></div>
          </div>
          <div data-chart-container class="chart-wrapper"></div>
          <div class="controls-panel">
            ${spec.controls.map(c => `
              <div class="control-group">
                <label for="ctrl-${c.id}">${c.label}</label>
                ${c.type === "select" ? `
                  <select id="ctrl-${c.id}" data-control="${c.id}">
                    ${c.options.map(o => `<option value="${o.value}" ${o.value === c.default ? "selected" : ""}>${o.label}</option>`).join("")}
                  </select>
                ` : `
                  <input type="${c.type}" id="ctrl-${c.id}" data-control="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.default}">
                `}
              </div>
            `).join("")}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-control]").forEach(input => {
        input.addEventListener("input", (e) => {
          currentControls[e.target.dataset.control] = e.target.value;
          update();
        });
      });

      update();
    },
    update,
    reset() {
      if (!currentSpec) return;
      for (const ctrl of currentSpec.controls) currentControls[ctrl.id] = ctrl.default;
      update();
    },
    getAccessibleSummary() {
      return "Interactive Multi-Layer Perceptron neural network architecture and forward-propagation visualization.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

