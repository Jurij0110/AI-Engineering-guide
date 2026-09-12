// EmbeddingSpace Engine: Pretrained Feature Extractors, Frozen Weights & Transfer Learning

export function evaluateTransferLearningConfig({ backbone = "vgg16", fineTuneLayers = 0 } = {}) {
  const baseParams = backbone === "vgg16" ? 14714688 : 23587712;
  const topParams = 514;
  const trainableParams = fineTuneLayers === 0 ? topParams : (topParams + fineTuneLayers * 1250000);
  const trainingSpeed = fineTuneLayers === 0 ? "Very Fast" : "Moderate";

  return {
    backbone,
    baseParams,
    trainableParams,
    trainingSpeed,
    diagnosis: "Balanced"
  };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderTransferSVG(backbone, fineTuneLayers) {
    const width = 480, height = 180;
    const isFrozen = (fineTuneLayers === 0);

    return `
      <svg viewBox="0 0 ${width} ${height}" class="transfer-learning-chart" role="img" aria-label="Pretrained Backbone and Transfer Learning Head">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <!-- Base Model -->
        <rect x="40" y="35" width="220" height="110" fill="${isFrozen ? '#8a3ffc' : '#ff832b'}" rx="4"/>
        <text x="150" y="75" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">${backbone.toUpperCase()} Backbone (ImageNet)</text>
        <text x="150" y="95" text-anchor="middle" fill="#fff" font-size="10">${isFrozen ? 'FROZEN (trainable = False)' : `Fine-tuning top ${fineTuneLayers} layers`}</text>
        <text x="150" y="115" text-anchor="middle" fill="#fff" font-size="9">14.7M Parameters</text>

        <!-- Arrow -->
        <line x1="265" y1="90" x2="295" y2="90" stroke="#0f62fe" stroke-width="3"/>

        <!-- New Head -->
        <rect x="300" y="45" width="140" height="90" fill="#24a148" rx="4"/>
        <text x="370" y="80" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Custom Dense Head</text>
        <text x="370" y="100" text-anchor="middle" fill="#fff" font-size="9">Dense(256) -> Dense(1)</text>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const backbone = currentControls.backbone || currentSpec.controls.find(c => c.id === "backbone")?.default || "vgg16";
    const fineTuneLayers = parseInt(currentControls.fine_tune_layers ?? 0, 10);

    const res = evaluateTransferLearningConfig({ backbone, fineTuneLayers });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderTransferSVG(backbone, fineTuneLayers);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const paramsElem = root.querySelector("[data-metric='trainable-params']");
    if (paramsElem) paramsElem.textContent = res.trainableParams > 1000 ? (res.trainableParams / 1000000).toFixed(2) + "M" : res.trainableParams;

    const speedElem = root.querySelector("[data-metric='speed']");
    if (speedElem) speedElem.textContent = res.trainingSpeed;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-embedding-space class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Trainable Parameters:</span> <strong data-metric="trainable-params">514</strong></div>
            <div class="metric-card"><span class="label">Training Speed:</span> <strong data-metric="speed">Very Fast</strong></div>
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
      return "Interactive pretrained deep neural network transfer learning and feature extraction studio.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

