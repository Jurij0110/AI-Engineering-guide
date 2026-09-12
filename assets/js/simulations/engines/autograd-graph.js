// AutogradGraph Engine: Computation Graph and Chain Rule Backpropagation

export function computeBackpropagation({ x = 1.0, y = 1.0, w = 0.5, b = 0.0, lr = 0.1 } = {}) {
  const z = w * x + b;
  const a = 1 / (1 + Math.exp(-z)); // Sigmoid activation
  const loss = 0.5 * (a - y) * (a - y);

  const dL_da = (a - y);
  const da_dz = a * (1 - a);
  const dz_dw = x;
  const dz_db = 1.0;

  const dL_dw = dL_da * da_dz * dz_dw;
  const dL_db = dL_da * da_dz * dz_db;

  const newW = w - lr * dL_dw;
  const newB = b - lr * dL_db;

  return { z, a, loss, dL_da, da_dz, dz_dw, dL_dw, dL_db, newW, newB };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderGraphSVG(res, x, y, w, b) {
    const width = 480, height = 200;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="autograd-flow-chart" role="img" aria-label="Autograd Computation Graph">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <!-- Nodes -->
        <g class="graph-node" transform="translate(60, 100)">
          <circle r="22" fill="#8a3ffc"/>
          <text text-anchor="middle" y="4" fill="#fff" font-size="10">x=${x.toFixed(1)}</text>
        </g>
        <g class="graph-node" transform="translate(180, 100)">
          <circle r="24" fill="#0f62fe"/>
          <text text-anchor="middle" y="-2" fill="#fff" font-size="10">z=${res.z.toFixed(2)}</text>
          <text text-anchor="middle" y="10" fill="#fff" font-size="8">dz/dw=${res.dz_dw.toFixed(1)}</text>
        </g>
        <g class="graph-node" transform="translate(300, 100)">
          <circle r="24" fill="#0f62fe"/>
          <text text-anchor="middle" y="-2" fill="#fff" font-size="10">a=${res.a.toFixed(2)}</text>
          <text text-anchor="middle" y="10" fill="#fff" font-size="8">da/dz=${res.da_dz.toFixed(2)}</text>
        </g>
        <g class="graph-node" transform="translate(420, 100)">
          <circle r="22" fill="#da1e28"/>
          <text text-anchor="middle" y="-2" fill="#fff" font-size="10">Loss</text>
          <text text-anchor="middle" y="10" fill="#fff" font-size="8">${res.loss.toFixed(3)}</text>
        </g>

        <!-- Forward / Backward Arrows -->
        <line x1="85" y1="100" x2="155" y2="100" stroke="#0f62fe" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="205" y1="100" x2="275" y2="100" stroke="#0f62fe" stroke-width="2"/>
        <line x1="325" y1="100" x2="395" y2="100" stroke="#0f62fe" stroke-width="2"/>

        <text x="240" y="160" text-anchor="middle" font-size="11" fill="#161616">Chain Rule: dL/dw = (dL/da) * (da/dz) * (dz/dw) = ${res.dL_dw.toFixed(4)}</text>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const w = parseFloat(currentControls.w ?? currentSpec.controls.find(c => c.id === "w")?.default ?? 0.5);
    const lr = parseFloat(currentControls.lr ?? currentSpec.controls.find(c => c.id === "lr")?.default ?? 0.2);
    const x = 1.5, y = 1.0;

    const res = computeBackpropagation({ x, y, w, b: 0.1, lr });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderGraphSVG(res, x, y, w, 0.1);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const gradElem = root.querySelector("[data-metric='grad-w']");
    if (gradElem) gradElem.textContent = res.dL_dw.toFixed(4);

    const newWElem = root.querySelector("[data-metric='new-w']");
    if (newWElem) newWElem.textContent = res.newW.toFixed(3);
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-autograd-graph class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Weight Gradient (dL/dw):</span> <strong data-metric="grad-w">-0.1240</strong></div>
            <div class="metric-card"><span class="label">Updated Weight (w'):</span> <strong data-metric="new-w">0.525</strong></div>
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
      return "Interactive computation graph showing forward propagation values and backward chain-rule gradient calculations.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

