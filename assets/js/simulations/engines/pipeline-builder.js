// PipelineBuilder Engine: Scikit-learn Pipeline and GridSearchCV Explorer

export function buildPipelineConfig({ scaler = "standard", featureSelect = "none", model = "logistic" } = {}) {
  const steps = [];
  steps.push({ name: "scaler", type: "scaler", value: scaler });
  if (featureSelect !== "none") {
    steps.push({ name: "feature_selection", type: "selector", value: featureSelect });
  }
  steps.push({ name: "estimator", type: "model", value: model });
  return { steps };
}

export function simulateGridSearch(paramGrid, cvFolds = 5) {
  let totalCandidates = 1;
  for (const key of Object.keys(paramGrid)) {
    totalCandidates *= paramGrid[key].length;
  }
  const totalFits = totalCandidates * cvFolds;
  const bestScore = 0.885;
  const testScore = 0.872;
  return { totalCandidates, totalFits, bestScore, testScore };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function update() {
    if (!root || !currentSpec) return;
    const scaler = currentControls.scaler || "standard";
    const model = currentControls.model || "logistic";
    const cvFolds = parseInt(currentControls.cv_folds ?? 5, 10);

    const pipe = buildPipelineConfig({ scaler, featureSelect: "none", model });
    const gridRes = simulateGridSearch({ C: [0.1, 1.0, 10.0], solver: ["lbfgs", "liblinear"] }, cvFolds);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const cvElem = root.querySelector("[data-metric='best-cv']");
    if (cvElem) cvElem.textContent = (gridRes.bestScore * 100).toFixed(1) + "%";

    const testElem = root.querySelector("[data-metric='test-score']");
    if (testElem) testElem.textContent = (gridRes.testScore * 100).toFixed(1) + "%";

    const fitsElem = root.querySelector("[data-metric='total-fits']");
    if (fitsElem) fitsElem.textContent = gridRes.totalFits;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-pipeline-builder class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Best CV Score:</span> <strong data-metric="best-cv">88.5%</strong></div>
            <div class="metric-card"><span class="label">Test Score:</span> <strong data-metric="test-score">87.2%</strong></div>
            <div class="metric-card"><span class="label">Total Fits:</span> <strong data-metric="total-fits">30</strong></div>
          </div>
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
      return "Interactive scikit-learn Pipeline and GridSearchCV tuning dashboard.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

