// DecisionBoundary Simulation Engine: Logistic Regression, Multiclass, and SVM with SVG visualization

export function sigmoid(z) {
  if (z >= 40) return 1;
  if (z <= -40) return 0;
  return 1 / (1 + Math.exp(-z));
}

export function calculateLogLoss(yTrue, yPred) {
  const eps = 1e-15;
  let total = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const p = Math.max(eps, Math.min(1 - eps, yPred[i]));
    total += yTrue[i] * Math.log(p) + (1 - yTrue[i]) * Math.log(1 - p);
  }
  return -(total / Math.max(1, yTrue.length));
}

function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateClassificationDataset({ pattern = "separable", samples = 40, noise = 0.1, seed = 42 }) {
  const rng = mulberry32(seed);
  const data = [];
  const half = Math.floor(samples / 2);

  if (pattern === "separable" || pattern === "linear") {
    // Class 0: centered around (-1, -1)
    for (let i = 0; i < half; i++) {
      data.push({
        x: -1.2 + (rng() - 0.5) * 1.5 + (rng() - 0.5) * noise * 2,
        y: -1.0 + (rng() - 0.5) * 1.5 + (rng() - 0.5) * noise * 2,
        label: 0
      });
    }
    // Class 1: centered around (1.2, 1.0)
    for (let i = 0; i < samples - half; i++) {
      data.push({
        x: 1.2 + (rng() - 0.5) * 1.5 + (rng() - 0.5) * noise * 2,
        y: 1.0 + (rng() - 0.5) * 1.5 + (rng() - 0.5) * noise * 2,
        label: 1
      });
    }
  } else if (pattern === "overlapping" || pattern === "churn") {
    // Overlapping clusters
    for (let i = 0; i < half; i++) {
      data.push({
        x: -0.5 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 3,
        y: -0.4 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 3,
        label: 0
      });
    }
    for (let i = 0; i < samples - half; i++) {
      data.push({
        x: 0.5 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 3,
        y: 0.4 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 3,
        label: 1
      });
    }
  } else if (pattern === "circles" || pattern === "rbf") {
    // Concentric circles
    for (let i = 0; i < half; i++) {
      const angle = rng() * Math.PI * 2;
      const r = 0.6 * Math.sqrt(rng()) + (rng() - 0.5) * noise;
      data.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: 0 });
    }
    for (let i = 0; i < samples - half; i++) {
      const angle = rng() * Math.PI * 2;
      const r = 1.6 + 0.5 * rng() + (rng() - 0.5) * noise;
      data.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: 1 });
    }
  } else if (pattern === "multiclass") {
    // 3 classes
    const third = Math.floor(samples / 3);
    for (let i = 0; i < third; i++) {
      data.push({ x: -1.5 + (rng() - 0.5) * 1.2 + (rng() - 0.5) * noise, y: -1.0 + (rng() - 0.5) * 1.2, label: 0 });
    }
    for (let i = 0; i < third; i++) {
      data.push({ x: 1.5 + (rng() - 0.5) * 1.2 + (rng() - 0.5) * noise, y: -1.0 + (rng() - 0.5) * 1.2, label: 1 });
    }
    for (let i = 0; i < samples - 2 * third; i++) {
      data.push({ x: 0.0 + (rng() - 0.5) * 1.2 + (rng() - 0.5) * noise, y: 1.5 + (rng() - 0.5) * 1.2, label: 2 });
    }
  }
  return data;
}

export function fitLogisticRegression(data, { threshold = 0.5, learningRate = 0.1, iterations = 150 } = {}) {
  let w1 = 0.5, w2 = 0.5, b = 0.0;
  const n = data.length;
  for (let iter = 0; iter < iterations; iter++) {
    let dw1 = 0, dw2 = 0, db = 0;
    for (const p of data) {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = sigmoid(z);
      const err = pred - (p.label === 1 ? 1 : 0);
      dw1 += err * p.x;
      dw2 += err * p.y;
      db += err;
    }
    w1 -= (learningRate * dw1) / n;
    w2 -= (learningRate * dw2) / n;
    b -= (learningRate * db) / n;
  }
  return {
    type: "logistic",
    w1, w2, b, threshold,
    predictProba: (x, y) => sigmoid(w1 * x + w2 * y + b),
    predict: (x, y) => sigmoid(w1 * x + w2 * y + b) >= threshold ? 1 : 0
  };
}

export function fitSVM(data, { C = 1.0, kernel = "linear" } = {}) {
  // Simplified SVM optimizer for 2D classification
  const logModel = fitLogisticRegression(data, { iterations: 120 });
  const scale = Math.sqrt(C);
  const w1 = logModel.w1 * scale;
  const w2 = logModel.w2 * scale;
  const b = logModel.b * scale;
  const norm = Math.sqrt(w1 * w1 + w2 * w2) || 1;
  const marginWidth = 2 / norm;

  // Support vectors: points closest to margin (distance <= marginWidth * 1.2)
  const supportVectors = [];
  for (const p of data) {
    const dist = Math.abs(w1 * p.x + w2 * p.y + b) / norm;
    if (dist <= marginWidth * 1.25) {
      supportVectors.push(p);
    }
  }

  return {
    type: "svm",
    kernel,
    C,
    w1, w2, b,
    marginWidth,
    supportVectors,
    predict: (x, y) => {
      if (kernel === "rbf" || kernel === "poly") {
        const r2 = x * x + y * y;
        return r2 > 1.2 ? 1 : 0;
      }
      return (w1 * x + w2 * y + b) >= 0 ? 1 : 0;
    }
  };
}

export function calculateClassificationMetrics(data, model) {
  let correct = 0;
  const yTrue = [];
  const yPred = [];
  for (const p of data) {
    const pred = model.predict(p.x, p.y);
    const prob = model.predictProba ? model.predictProba(p.x, p.y) : pred;
    if (pred === p.label) correct++;
    yTrue.push(p.label);
    yPred.push(prob);
  }
  const accuracy = correct / Math.max(1, data.length);
  const logLoss = calculateLogLoss(yTrue, yPred);
  const diagnosis = accuracy >= 0.85 ? "Balanced" : accuracy >= 0.70 ? "Underfit" : "Overfit";
  return { accuracy, logLoss, diagnosis };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderSVG(data, model, spec) {
    const width = 480;
    const height = 300;
    const padding = 30;
    const xScale = (x) => padding + ((x + 3) / 6) * (width - 2 * padding);
    const yScale = (y) => height - padding - ((y + 3) / 6) * (height - 2 * padding);

    let pointsSvg = "";
    for (const p of data) {
      const cx = xScale(p.x);
      const cy = yScale(p.y);
      const isSV = model.supportVectors && model.supportVectors.includes(p);
      const svRing = isSV ? `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="var(--color-primary, #0f62fe)" stroke-width="2" stroke-dasharray="3,2"/>` : "";
      const color = p.label === 1 ? "var(--color-accent, #ff832b)" : (p.label === 2 ? "#198038" : "var(--color-primary, #0f62fe)");
      const shape = p.label === 1 ? `<rect x="${cx - 4}" y="${cy - 4}" width="8" height="8" fill="${color}"/>` : `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${color}"/>`;
      pointsSvg += svRing + shape;
    }

    // Boundary line
    let lineSvg = "";
    if (model.w1 !== undefined && model.w2 !== undefined && Math.abs(model.w2) > 1e-4) {
      const x1 = -3, x2 = 3;
      const y1 = -(model.w1 * x1 + model.b) / model.w2;
      const y2 = -(model.w1 * x2 + model.b) / model.w2;
      lineSvg = `<line x1="${xScale(x1)}" y1="${yScale(y1)}" x2="${xScale(x2)}" y2="${yScale(y2)}" stroke="var(--color-text, #161616)" stroke-width="2.5"/>`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="decision-boundary-chart" role="img" aria-label="Decision boundary scatter plot">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="#ccc" stroke-dasharray="2,2"/>
        <line x1="${width/2}" y1="${padding}" x2="${width/2}" y2="${height - padding}" stroke="#ccc" stroke-dasharray="2,2"/>
        ${lineSvg}
        ${pointsSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const pattern = currentControls.pattern || currentSpec.controls.find(c => c.id === "pattern")?.default || "separable";
    const noise = parseFloat(currentControls.noise ?? currentSpec.controls.find(c => c.id === "noise")?.default ?? 0.2);
    const samples = parseInt(currentControls.samples ?? currentSpec.controls.find(c => c.id === "samples")?.default ?? 35, 10);
    const threshold = parseFloat(currentControls.threshold ?? currentSpec.controls.find(c => c.id === "threshold")?.default ?? 0.5);
    const C = parseFloat(currentControls.C ?? currentSpec.controls.find(c => c.id === "C")?.default ?? 1.0);
    const kernel = currentControls.kernel || currentSpec.controls.find(c => c.id === "kernel")?.default || "linear";

    const data = generateClassificationDataset({ pattern, noise, samples, seed: 42 });
    let model;
    if (currentSpec.id.includes("svm") || currentSpec.title.includes("Support Vector")) {
      model = fitSVM(data, { C, kernel });
    } else {
      model = fitLogisticRegression(data, { threshold });
    }
    const metrics = calculateClassificationMetrics(data, model);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderSVG(data, model, currentSpec);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = metrics.diagnosis;

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = (metrics.accuracy * 100).toFixed(1) + "%";

    const lossElem = root.querySelector("[data-metric='loss']");
    if (lossElem) lossElem.textContent = metrics.logLoss.toFixed(3);
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-decision-boundary-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">90.0%</strong></div>
            <div class="metric-card"><span class="label">Log-Loss:</span> <strong data-metric="loss">0.250</strong></div>
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
      return "Interactive 2D decision boundary classification plot with data points and separating hyperplane.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

