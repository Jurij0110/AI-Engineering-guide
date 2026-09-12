// ProjectionLab Simulation Engine: PCA, Explained Variance, and Dimensionality Reduction

export function computePCA2D(data) {
  const n = data.length;
  if (n === 0) return { components: [], explainedVarianceRatio: [0, 0], projected: [] };

  // Center data
  let meanX = 0, meanY = 0;
  for (const p of data) {
    meanX += p.x;
    meanY += p.y;
  }
  meanX /= n;
  meanY /= n;

  // Covariance matrix
  let varX = 0, varY = 0, covXY = 0;
  for (const p of data) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    varX += dx * dx;
    varY += dy * dy;
    covXY += dx * dy;
  }
  varX /= (n - 1) || 1;
  varY /= (n - 1) || 1;
  covXY /= (n - 1) || 1;

  // Eigenvalues of 2x2 matrix [[varX, covXY], [covXY, varY]]
  const trace = varX + varY;
  const det = varX * varY - covXY * covXY;
  const sqrtDisc = Math.sqrt(Math.max(0, trace * trace / 4 - det));
  const lambda1 = trace / 2 + sqrtDisc;
  const lambda2 = Math.max(0, trace / 2 - sqrtDisc);

  const totalVar = Math.max(1e-9, lambda1 + lambda2);
  const evr1 = lambda1 / totalVar;
  const evr2 = lambda2 / totalVar;

  // First eigenvector
  let v1 = { x: 1, y: 0 };
  if (Math.abs(covXY) > 1e-6) {
    const vy = lambda1 - varX;
    const norm = Math.sqrt(covXY * covXY + vy * vy);
    v1 = { x: covXY / norm, y: vy / norm };
  }

  return {
    mean: { x: meanX, y: meanY },
    components: [v1, { x: -v1.y, y: v1.x }],
    explainedVarianceRatio: [evr1, evr2],
    projected: data.map(p => ({
      pc1: (p.x - meanX) * v1.x + (p.y - meanY) * v1.y,
      pc2: (p.x - meanX) * (-v1.y) + (p.y - meanY) * v1.x
    }))
  };
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

export function generateProjectionData({ correlation = 0.8, samples = 40, seed = 42 }) {
  const rng = mulberry32(seed);
  const data = [];
  for (let i = 0; i < samples; i++) {
    const u1 = (rng() - 0.5) * 4;
    const u2 = (rng() - 0.5) * 2;
    const x = u1;
    const y = correlation * u1 + Math.sqrt(1 - correlation * correlation) * u2;
    data.push({ x, y });
  }
  return data;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderProjectionSVG(data, pca) {
    const width = 480, height = 280, padding = 30;
    const xScale = (x) => padding + ((x + 3) / 6) * (width - 2 * padding);
    const yScale = (y) => height - padding - ((y + 3) / 6) * (height - 2 * padding);

    let pointsSvg = "";
    for (const p of data) {
      pointsSvg += `<circle cx="${xScale(p.x)}" cy="${yScale(p.y)}" r="4.5" fill="var(--color-primary, #0f62fe)"/>`;
    }

    let vectorSvg = "";
    if (pca.components && pca.components.length > 0) {
      const v = pca.components[0];
      const mx = pca.mean.x, my = pca.mean.y;
      const x1 = xScale(mx - v.x * 2.2), y1 = yScale(my - v.y * 2.2);
      const x2 = xScale(mx + v.x * 2.2), y2 = yScale(my + v.y * 2.2);
      vectorSvg = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#da1e28" stroke-width="2.5"/>`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="projection-scatter-chart" role="img" aria-label="PCA Projection Scatter Plot">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${vectorSvg}
        ${pointsSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const nComponents = parseInt(currentControls.n_components ?? currentSpec.controls.find(c => c.id === "n_components")?.default ?? 2, 10);
    const correlation = parseFloat(currentControls.correlation ?? currentSpec.controls.find(c => c.id === "correlation")?.default ?? 0.85);

    const data = generateProjectionData({ correlation, samples: 40, seed: 42 });
    const pca = computePCA2D(data);

    const explained = (pca.explainedVarianceRatio[0] * 100).toFixed(1) + "%";
    const diagnosis = pca.explainedVarianceRatio[0] >= 0.80 ? "High Dimensional Compression" : "Moderate Compression";

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderProjectionSVG(data, pca);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = diagnosis;

    const varElem = root.querySelector("[data-metric='variance']");
    if (varElem) varElem.textContent = explained;

    const compElem = root.querySelector("[data-metric='components']");
    if (compElem) compElem.textContent = nComponents;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-projection-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">High Dimensional Compression</strong></div>
            <div class="metric-card"><span class="label">PC1 Explained:</span> <strong data-metric="variance">88.5%</strong></div>
            <div class="metric-card"><span class="label">Components:</span> <strong data-metric="components">2</strong></div>
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
      return "Interactive PCA projection plot showing 2D scatter and leading principal component eigenvector.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

