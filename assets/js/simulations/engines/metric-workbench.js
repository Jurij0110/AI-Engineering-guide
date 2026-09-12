// MetricWorkbench Engine: Multi-domain Evaluation (Classification, Regression, Clustering)

export function computeClassificationMetrics({ tp = 0, fp = 0, fn = 0, tn = 0 } = {}) {
  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
  return { accuracy, precision, recall, f1, specificity };
}

export function computeRegressionMetrics(yTrue, yPred) {
  const n = yTrue.length;
  if (n === 0) return { mae: 0, mse: 0, rmse: 0, r2: 0 };

  let sumAbs = 0, sumSq = 0, meanY = 0;
  for (let i = 0; i < n; i++) meanY += yTrue[i];
  meanY /= n;

  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const err = yPred[i] - yTrue[i];
    sumAbs += Math.abs(err);
    sumSq += err * err;
    const diffMean = yTrue[i] - meanY;
    ssTot += diffMean * diffMean;
  }

  const mae = sumAbs / n;
  const mse = sumSq / n;
  const rmse = Math.sqrt(mse);
  const r2 = ssTot > 1e-12 ? 1 - sumSq / ssTot : (sumSq === 0 ? 1 : 0);

  return { mae, mse, rmse, r2 };
}

export function computeClusteringEvaluation({ k = 3, separation = "high" } = {}) {
  let silhouette = 0.72;
  let daviesBouldin = 0.55;
  let inertia = 45.2;

  if (separation === "low") {
    silhouette = 0.38;
    daviesBouldin = 1.42;
    inertia = 120.5;
  } else if (separation === "moderate") {
    silhouette = 0.54;
    daviesBouldin = 0.88;
    inertia = 78.0;
  }

  return { silhouette, daviesBouldin, inertia, k };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function update() {
    if (!root || !currentSpec) return;
    const domain = currentSpec.id.includes("regression") ? "regression" : (currentSpec.id.includes("cluster") || currentSpec.id.includes("unsupervised") ? "clustering" : "classification");

    const threshold = parseFloat(currentControls.threshold ?? currentSpec.controls.find(c => c.id === "threshold")?.default ?? 0.5);
    const noise = parseFloat(currentControls.noise ?? currentSpec.controls.find(c => c.id === "noise")?.default ?? 0.15);

    let primaryLabel = "Accuracy", primaryVal = "88.0%", secondaryLabel = "F1-Score", secondaryVal = "0.865", diagnosis = "Balanced";

    if (domain === "regression") {
      const yTrue = [10, 20, 30, 40, 50, 60];
      const yPred = yTrue.map(y => y + (threshold - 0.5) * 10 + (Math.random() - 0.5) * noise * 20);
      const metrics = computeRegressionMetrics(yTrue, yPred);
      primaryLabel = "R² Score";
      primaryVal = (metrics.r2 * 100).toFixed(1) + "%";
      secondaryLabel = "RMSE";
      secondaryVal = metrics.rmse.toFixed(2);
      diagnosis = metrics.r2 >= 0.85 ? "Balanced" : (metrics.r2 >= 0.65 ? "Moderate Fit" : "Underfit");
    } else if (domain === "clustering") {
      const sep = noise < 0.2 ? "high" : (noise < 0.4 ? "moderate" : "low");
      const k = parseInt(currentControls.k ?? 3, 10);
      const evalMetrics = computeClusteringEvaluation({ k, separation: sep });
      primaryLabel = "Silhouette Score";
      primaryVal = evalMetrics.silhouette.toFixed(3);
      secondaryLabel = "Davies-Bouldin";
      secondaryVal = evalMetrics.daviesBouldin.toFixed(2);
      diagnosis = evalMetrics.silhouette >= 0.60 ? "Balanced" : (evalMetrics.silhouette >= 0.40 ? "Moderate" : "Weak Structure");
    } else {
      const tp = Math.round(50 * (1 - threshold * 0.4));
      const fp = Math.round(15 * (1 - threshold));
      const fn = Math.round(20 * threshold);
      const tn = Math.round(60 * threshold);
      const metrics = computeClassificationMetrics({ tp, fp, fn, tn });
      primaryLabel = "Accuracy";
      primaryVal = (metrics.accuracy * 100).toFixed(1) + "%";
      secondaryLabel = "F1-Score";
      secondaryVal = metrics.f1.toFixed(3);
      diagnosis = metrics.f1 >= 0.80 ? "Balanced" : "Suboptimal";
    }

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = diagnosis;

    const pLabelElem = root.querySelector("[data-primary-label]");
    if (pLabelElem) pLabelElem.textContent = primaryLabel;
    const pValElem = root.querySelector("[data-metric='primary']");
    if (pValElem) pValElem.textContent = primaryVal;

    const sLabelElem = root.querySelector("[data-secondary-label]");
    if (sLabelElem) sLabelElem.textContent = secondaryLabel;
    const sValElem = root.querySelector("[data-metric='secondary']");
    if (sValElem) sValElem.textContent = secondaryVal;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-metric-workbench class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label" data-primary-label>Accuracy:</span> <strong data-metric="primary">88.0%</strong></div>
            <div class="metric-card"><span class="label" data-secondary-label>F1-Score:</span> <strong data-metric="secondary">0.865</strong></div>
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
      return "Interactive model evaluation workbench showing key classification, regression, or clustering metrics.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

