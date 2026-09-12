// RegularizationLab Engine: Ridge, Lasso, and ElasticNet Coefficient Shrinkage

export function computeRegularizedCoefficients(baseWeights, { type = "ridge", lambda = 1.0 } = {}) {
  const weights = baseWeights.map(w => {
    if (type === "ridge") {
      return w / (1 + lambda * 0.5);
    } else {
      // Soft thresholding for Lasso
      const sign = Math.sign(w);
      const mag = Math.abs(w) - lambda * 0.4;
      return mag > 0 ? sign * mag : 0;
    }
  });

  const sparseCount = weights.filter(w => Math.abs(w) < 1e-6).length;
  const valMse = 0.15 + (lambda < 0.1 ? 0.25 : (lambda > 5.0 ? 0.40 : 0.02 * Math.abs(lambda - 1.0)));
  const diagnosis = (lambda > 5.0) ? "Underfit" : (lambda < 0.1 ? "Overfit" : "Balanced");

  return { weights, sparseCount, valMse, diagnosis };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  const baseWeights = [3.2, -2.1, 1.4, -0.6, 2.8, -0.3];

  function renderCoefficientsSVG(weights, baseW) {
    const width = 480, height = 220, padding = 35;
    const barW = 24;
    const maxVal = 3.5;
    const scale = (v) => (v / maxVal) * ((height - 2 * padding) / 2);
    const zeroY = height / 2;

    let barsSvg = "";
    for (let i = 0; i < weights.length; i++) {
      const x = padding + 20 + i * 65;
      const h = scale(weights[i]);
      const y = h >= 0 ? zeroY - h : zeroY;
      const absH = Math.abs(h);
      const isZero = Math.abs(weights[i]) < 1e-4;
      const color = isZero ? "#888" : (weights[i] >= 0 ? "#0f62fe" : "#ff832b");

      barsSvg += `
        <g class="coeff-bar">
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(2, absH)}" fill="${color}" rx="2"/>
          <text x="${x + barW/2}" y="${height - 10}" text-anchor="middle" font-size="10" fill="#555">θ${i+1}</text>
          <text x="${x + barW/2}" y="${weights[i] >= 0 ? y - 4 : y + absH + 11}" text-anchor="middle" font-size="10" fill="#161616">${weights[i].toFixed(2)}</text>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="regularization-coeff-chart" role="img" aria-label="Regularization Coefficients Bar Chart">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="#888" stroke-dasharray="2,2"/>
        ${barsSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const type = currentControls.type || currentSpec.controls.find(c => c.id === "type")?.default || "ridge";
    const lambda = parseFloat(currentControls.lambda ?? currentSpec.controls.find(c => c.id === "lambda")?.default ?? 1.0);

    const res = computeRegularizedCoefficients(baseWeights, { type, lambda });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderCoefficientsSVG(res.weights, baseWeights);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = res.diagnosis;

    const mseElem = root.querySelector("[data-metric='val-mse']");
    if (mseElem) mseElem.textContent = res.valMse.toFixed(3);

    const zeroElem = root.querySelector("[data-metric='sparse']");
    if (zeroElem) zeroElem.textContent = res.sparseCount;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-regularization-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Validation MSE:</span> <strong data-metric="val-mse">0.150</strong></div>
            <div class="metric-card"><span class="label">Zeroed Weights:</span> <strong data-metric="sparse">0</strong></div>
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
      return "Interactive regularization explorer showing Ridge L2 shrinkage and Lasso L1 feature elimination.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

