// EnsembleLab Simulation Engine: Bagging, Random Forests, Boosting, and Bias-Variance Decomposition

export function calculateBiasVariance({ method = "bagging", nEstimators = 10, maxDepth = 3, learningRate = 0.1 } = {}) {
  // Analytical decomposition model based on bias-variance ensemble theory
  let baseBiasSq, baseVariance;
  if (maxDepth <= 1) {
    baseBiasSq = 0.45; // High bias (underfit stump)
    baseVariance = 0.08; // Low variance
  } else if (maxDepth <= 3) {
    baseBiasSq = 0.15;
    baseVariance = 0.18;
  } else {
    baseBiasSq = 0.04; // Low bias (deep tree)
    baseVariance = 0.50; // High variance
  }

  let biasSq, variance;
  if (method === "bagging" || method === "rf") {
    biasSq = baseBiasSq * 1.02; // Bagging slightly increases bias
    const rho = 0.25; // Average correlation between tree predictions
    variance = rho * baseVariance + ((1 - rho) / Math.max(1, nEstimators)) * baseVariance;
  } else {
    // Boosting sequentially reduces bias
    biasSq = baseBiasSq * Math.exp(-0.08 * nEstimators * (learningRate / 0.1));
    variance = baseVariance * (1 + 0.03 * Math.sqrt(nEstimators));
  }

  const noise = 0.05; // Irreducible Bayes error
  const totalError = biasSq + variance + noise;
  const accuracy = Math.max(0.5, Math.min(0.98, 1 - Math.sqrt(totalError) * 0.7));
  const diagnosis = (biasSq > 0.25) ? "Underfit" : (variance > 0.30 ? "Overfit" : "Balanced");

  return { biasSq, variance, noise, totalError, accuracy, diagnosis };
}

export function simulateEnsemble(params) {
  return calculateBiasVariance(params);
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderBiasVarianceSVG(metrics, method, nEstimators, maxDepth) {
    const width = 480, height = 240, padding = 35;
    
    // Bar chart of Bias^2, Variance, Total Error
    const barWidth = 60;
    const maxVal = 0.8;
    const hScale = (v) => (v / maxVal) * (height - 2 * padding);

    const bH = hScale(metrics.biasSq);
    const vH = hScale(metrics.variance);
    const tH = hScale(metrics.totalError);

    return `
      <svg viewBox="0 0 ${width} ${height}" class="ensemble-bv-chart" role="img" aria-label="Bias-Variance Tradeoff Bar Chart">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#888"/>
        
        <!-- Bias Bar -->
        <rect x="80" y="${height - padding - bH}" width="${barWidth}" height="${bH}" fill="#0f62fe" rx="3"/>
        <text x="110" y="${height - padding + 18}" text-anchor="middle" font-size="11" fill="var(--color-text, #161616)">Bias² (${metrics.biasSq.toFixed(2)})</text>
        
        <!-- Variance Bar -->
        <rect x="200" y="${height - padding - vH}" width="${barWidth}" height="${vH}" fill="#ff832b" rx="3"/>
        <text x="230" y="${height - padding + 18}" text-anchor="middle" font-size="11" fill="var(--color-text, #161616)">Variance (${metrics.variance.toFixed(2)})</text>
        
        <!-- Total Error Bar -->
        <rect x="320" y="${height - padding - tH}" width="${barWidth}" height="${tH}" fill="#da1e28" rx="3"/>
        <text x="350" y="${height - padding + 18}" text-anchor="middle" font-size="11" fill="var(--color-text, #161616)">Total Err (${metrics.totalError.toFixed(2)})</text>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const method = currentControls.method || currentSpec.controls.find(c => c.id === "method")?.default || "bagging";
    const nEstimators = parseInt(currentControls.n_estimators ?? currentSpec.controls.find(c => c.id === "n_estimators")?.default ?? 20, 10);
    const maxDepth = parseInt(currentControls.max_depth ?? currentSpec.controls.find(c => c.id === "max_depth")?.default ?? 3, 10);
    const learningRate = parseFloat(currentControls.learning_rate ?? currentSpec.controls.find(c => c.id === "learning_rate")?.default ?? 0.1);

    const metrics = calculateBiasVariance({ method, nEstimators, maxDepth, learningRate });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderBiasVarianceSVG(metrics, method, nEstimators, maxDepth);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = metrics.diagnosis;

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = (metrics.accuracy * 100).toFixed(1) + "%";

    const errElem = root.querySelector("[data-metric='total-error']");
    if (errElem) errElem.textContent = metrics.totalError.toFixed(3);
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-ensemble-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">92.0%</strong></div>
            <div class="metric-card"><span class="label">Total Error:</span> <strong data-metric="total-error">0.180</strong></div>
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
      return "Interactive ensemble bias-variance explorer showing error decomposition and model accuracy across bagging and boosting.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

