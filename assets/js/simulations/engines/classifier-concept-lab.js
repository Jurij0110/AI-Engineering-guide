// ClassifierConceptLab Engine: Confusion matrix, metrics, and classification workflows

export function computeConfusionMatrix(yTrue, yProbs, threshold = 0.5) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const actual = yTrue[i];
    const pred = yProbs[i] >= threshold ? 1 : 0;
    if (actual === 1 && pred === 1) tp++;
    else if (actual === 0 && pred === 1) fp++;
    else if (actual === 0 && pred === 0) tn++;
    else if (actual === 1 && pred === 0) fn++;
  }
  return { tp, fp, tn, fn };
}

export function calculatePerformanceMetrics(cm) {
  const total = cm.tp + cm.fp + cm.tn + cm.fn;
  const accuracy = total > 0 ? (cm.tp + cm.tn) / total : 0;
  const precision = (cm.tp + cm.fp) > 0 ? cm.tp / (cm.tp + cm.fp) : 0;
  const recall = (cm.tp + cm.fn) > 0 ? cm.tp / (cm.tp + cm.fn) : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const specificity = (cm.tn + cm.fp) > 0 ? cm.tn / (cm.tn + cm.fp) : 0;
  return { accuracy, precision, recall, f1, specificity };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function update() {
    if (!root || !currentSpec) return;
    const threshold = parseFloat(currentControls.threshold ?? 0.5);
    const balance = parseFloat(currentControls.balance ?? 0.5);
    
    // Synthetic dataset probabilities
    const actual = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const probs = [0.92, 0.85, 0.78, 0.65, 0.58, 0.48, 0.42, 0.35, 0.68, 0.52, 0.44, 0.38, 0.28, 0.18, 0.12, 0.05];
    
    const cm = computeConfusionMatrix(actual, probs, threshold);
    const metrics = calculatePerformanceMetrics(cm);

    const tpEl = root.querySelector("[data-cell='tp']");
    if (tpEl) tpEl.textContent = cm.tp;
    const fpEl = root.querySelector("[data-cell='fp']");
    if (fpEl) fpEl.textContent = cm.fp;
    const fnEl = root.querySelector("[data-cell='fn']");
    if (fnEl) fnEl.textContent = cm.fn;
    const tnEl = root.querySelector("[data-cell='tn']");
    if (tnEl) tnEl.textContent = cm.tn;

    const accEl = root.querySelector("[data-metric='accuracy']");
    if (accEl) accEl.textContent = (metrics.accuracy * 100).toFixed(1) + "%";
    const precEl = root.querySelector("[data-metric='precision']");
    if (precEl) precEl.textContent = (metrics.precision * 100).toFixed(1) + "%";
    const recEl = root.querySelector("[data-metric='recall']");
    if (recEl) recEl.textContent = (metrics.recall * 100).toFixed(1) + "%";
    const f1El = root.querySelector("[data-metric='f1']");
    if (f1El) f1El.textContent = metrics.f1.toFixed(3);
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-classifier-concept-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">85.0%</strong></div>
            <div class="metric-card"><span class="label">Precision:</span> <strong data-metric="precision">80.0%</strong></div>
            <div class="metric-card"><span class="label">Recall:</span> <strong data-metric="recall">85.0%</strong></div>
            <div class="metric-card"><span class="label">F1-Score:</span> <strong data-metric="f1">0.824</strong></div>
          </div>
          <div class="matrix-wrapper">
            <table class="confusion-matrix-table" role="table" aria-label="Confusion Matrix">
              <thead>
                <tr><th></th><th>Pred Positive</th><th>Pred Negative</th></tr>
              </thead>
              <tbody>
                <tr><th>Actual Positive</th><td data-cell="tp" class="cell-tp">0</td><td data-cell="fn" class="cell-fn">0</td></tr>
                <tr><th>Actual Negative</th><td data-cell="fp" class="cell-fp">0</td><td data-cell="tn" class="cell-tn">0</td></tr>
              </tbody>
            </table>
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
      return "Interactive confusion matrix explorer with threshold and class-balance adjustment.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

