// NeighborExplorer Simulation Engine: k-Nearest Neighbors distance metrics and voting

export function calculateDistance(p1, p2, metric = "euclidean") {
  const dx = Math.abs(p1.x - p2.x);
  const dy = Math.abs(p1.y - p2.y);
  if (metric === "manhattan") return dx + dy;
  if (metric === "chebyshev") return Math.max(dx, dy);
  return Math.sqrt(dx * dx + dy * dy);
}

export function findKNearestNeighbors(data, queryPoint, k = 5, metric = "euclidean") {
  const withDist = data.map(point => ({
    point,
    distance: calculateDistance(point, queryPoint, metric)
  }));
  withDist.sort((a, b) => a.distance - b.distance);
  return withDist.slice(0, Math.min(k, withDist.length));
}

export function predictKNN(neighbors, weights = "uniform") {
  let score0 = 0, score1 = 0;
  for (const item of neighbors) {
    const w = weights === "distance" ? 1 / Math.max(1e-4, item.distance) : 1;
    if (item.point.label === 1) score1 += w;
    else score0 += w;
  }
  return score1 >= score0 ? 1 : 0;
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

export function generateKNNData({ samples = 40, noise = 0.2, seed = 42 }) {
  const rng = mulberry32(seed);
  const data = [];
  const half = Math.floor(samples / 2);
  for (let i = 0; i < half; i++) {
    data.push({
      x: -1.0 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 2,
      y: -1.0 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 2,
      label: 0
    });
  }
  for (let i = 0; i < samples - half; i++) {
    data.push({
      x: 1.0 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 2,
      y: 1.0 + (rng() - 0.5) * 2.0 + (rng() - 0.5) * noise * 2,
      label: 1
    });
  }
  return data;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderKNNSVG(data, neighbors, queryPoint) {
    const width = 480, height = 300, padding = 30;
    const xScale = (x) => padding + ((x + 3) / 6) * (width - 2 * padding);
    const yScale = (y) => height - padding - ((y + 3) / 6) * (height - 2 * padding);

    const qx = xScale(queryPoint.x);
    const qy = yScale(queryPoint.y);

    const maxDist = neighbors.length > 0 ? neighbors[neighbors.length - 1].distance : 1;
    const radiusPixels = ((maxDist) / 6) * (width - 2 * padding);

    let pointsSvg = "";
    for (const p of data) {
      const cx = xScale(p.x);
      const cy = yScale(p.y);
      const color = p.label === 1 ? "var(--color-accent, #ff832b)" : "var(--color-primary, #0f62fe)";
      pointsSvg += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${color}"/>`;
    }

    let linesSvg = "";
    for (const n of neighbors) {
      linesSvg += `<line x1="${qx}" y1="${qy}" x2="${xScale(n.point.x)}" y2="${yScale(n.point.y)}" stroke="#888" stroke-dasharray="2,2"/>`;
    }

    const querySvg = `
      <circle cx="${qx}" cy="${qy}" r="${Math.max(8, radiusPixels)}" fill="none" stroke="var(--color-accent, #ff832b)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <circle cx="${qx}" cy="${qy}" r="6" fill="#da1e28" stroke="#fff" stroke-width="1.5"/>
    `;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="knn-scatter-chart" role="img" aria-label="KNN neighborhood scatter plot">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${linesSvg}
        ${pointsSvg}
        ${querySvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const k = parseInt(currentControls.k ?? currentSpec.controls.find(c => c.id === "k")?.default ?? 5, 10);
    const metric = currentControls.metric || currentSpec.controls.find(c => c.id === "metric")?.default || "euclidean";
    const weights = currentControls.weights || currentSpec.controls.find(c => c.id === "weights")?.default || "uniform";
    const samples = parseInt(currentControls.samples ?? currentSpec.controls.find(c => c.id === "samples")?.default ?? 40, 10);

    const data = generateKNNData({ samples, noise: 0.15, seed: 42 });
    const queryPoint = { x: 0.2, y: 0.2 };
    const neighbors = findKNearestNeighbors(data, queryPoint, k, metric);
    const pred = predictKNN(neighbors, weights);

    let correct = 0;
    for (const p of data) {
      const nbs = findKNearestNeighbors(data.filter(d => d !== p), p, k, metric);
      if (predictKNN(nbs, weights) === p.label) correct++;
    }
    const accuracy = correct / data.length;
    const diagnosis = accuracy >= 0.85 ? "Balanced" : (accuracy >= 0.70 ? "Underfit" : "Overfit");

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderKNNSVG(data, neighbors, queryPoint);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = diagnosis;

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = (accuracy * 100).toFixed(1) + "%";

    const kElem = root.querySelector("[data-metric='k']");
    if (kElem) kElem.textContent = k;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-neighbor-explorer-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">90.0%</strong></div>
            <div class="metric-card"><span class="label">K Neighbors:</span> <strong data-metric="k">5</strong></div>
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
      return "Interactive k-Nearest Neighbors scatter plot showing query point, distance radius, and neighbor voting.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

