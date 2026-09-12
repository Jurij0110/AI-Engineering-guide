// ClusterExplorer Simulation Engine: K-Means, DBSCAN, HDBSCAN, and Silhouette Metrics

function distance(p1, p2) {
  const dx = p1.x - p2.x, dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function runKMeans(data, { k = 3, maxIter = 20, seed = 42 } = {}) {
  const n = data.length;
  if (n === 0) return { centroids: [], assignments: [], inertia: 0 };
  k = Math.min(k, n);

  // Initialize centroids
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor((i * n) / k);
    centroids.push({ x: data[idx].x, y: data[idx].y });
  }

  let assignments = new Array(n).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let minCluster = 0;
      for (let c = 0; c < k; c++) {
        const d = distance(data[i], centroids[c]);
        if (d < minDist) {
          minDist = d;
          minCluster = c;
        }
      }
      if (assignments[i] !== minCluster) {
        assignments[i] = minCluster;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Update centroids
    const counts = new Array(k).fill(0);
    const sums = Array.from({ length: k }, () => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      sums[c].x += data[i].x;
      sums[c].y += data[i].y;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c] = { x: sums[c].x / counts[c], y: sums[c].y / counts[c] };
      }
    }
  }

  let inertia = 0;
  for (let i = 0; i < n; i++) {
    const d = distance(data[i], centroids[assignments[i]]);
    inertia += d * d;
  }

  return { centroids, assignments, inertia };
}

export function runDBSCAN(data, { eps = 0.8, minSamples = 3 } = {}) {
  const n = data.length;
  const labels = new Array(n).fill(undefined);
  let clusterId = 0;

  for (let i = 0; i < n; i++) {
    if (labels[i] !== undefined) continue;

    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (distance(data[i], data[j]) <= eps) neighbors.push(j);
    }

    if (neighbors.length < minSamples) {
      labels[i] = -1; // Noise
      continue;
    }

    labels[i] = clusterId;
    const queue = [...neighbors.filter(idx => idx !== i)];

    while (queue.length > 0) {
      const q = queue.shift();
      if (labels[q] === -1) labels[q] = clusterId;
      if (labels[q] !== undefined) continue;

      labels[q] = clusterId;
      const qNeighbors = [];
      for (let j = 0; j < n; j++) {
        if (distance(data[q], data[j]) <= eps) qNeighbors.push(j);
      }
      if (qNeighbors.length >= minSamples) {
        for (const nb of qNeighbors) {
          if (!queue.includes(nb) && labels[nb] === undefined) queue.push(nb);
        }
      }
    }
    clusterId++;
  }

  return { labels, numClusters: clusterId };
}

export function calculateSilhouetteScore(data, assignments) {
  const n = data.length;
  if (n <= 1) return 0;
  const clusters = [...new Set(assignments.filter(c => c !== -1))];
  if (clusters.length <= 1) return 0;

  let totalSilhouette = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const c = assignments[i];
    if (c === -1) continue;

    // a(i): mean intra-cluster distance
    let aSum = 0, aCount = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j && assignments[j] === c) {
        aSum += distance(data[i], data[j]);
        aCount++;
      }
    }
    const a = aCount > 0 ? aSum / aCount : 0;

    // b(i): min mean distance to other clusters
    let minB = Infinity;
    for (const otherC of clusters) {
      if (otherC === c) continue;
      let bSum = 0, bCount = 0;
      for (let j = 0; j < n; j++) {
        if (assignments[j] === otherC) {
          bSum += distance(data[i], data[j]);
          bCount++;
        }
      }
      if (bCount > 0) {
        const meanB = bSum / bCount;
        if (meanB < minB) minB = meanB;
      }
    }

    if (minB === Infinity) minB = 0;
    const maxVal = Math.max(a, minB);
    const s = maxVal > 0 ? (minB - a) / maxVal : 0;
    totalSilhouette += s;
    count++;
  }

  return count > 0 ? totalSilhouette / count : 0;
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

export function generateClusterDataset({ pattern = "blobs", samples = 45, noise = 0.15, seed = 42 }) {
  const rng = mulberry32(seed);
  const data = [];
  const third = Math.floor(samples / 3);

  if (pattern === "blobs" || pattern === "customers") {
    // 3 spherical blobs
    const centers = [{ x: -1.5, y: -1.2 }, { x: 1.5, y: -1.0 }, { x: 0.0, y: 1.5 }];
    for (let c = 0; c < 3; c++) {
      const count = (c === 2) ? samples - 2 * third : third;
      for (let i = 0; i < count; i++) {
        data.push({
          x: centers[c].x + (rng() - 0.5) * 1.2 + (rng() - 0.5) * noise * 2,
          y: centers[c].y + (rng() - 0.5) * 1.2 + (rng() - 0.5) * noise * 2
        });
      }
    }
  } else if (pattern === "moons" || pattern === "density") {
    // 2 interleaving crescents
    const half = Math.floor(samples / 2);
    for (let i = 0; i < half; i++) {
      const angle = (i / half) * Math.PI;
      data.push({
        x: Math.cos(angle) * 1.5 + (rng() - 0.5) * noise,
        y: Math.sin(angle) * 1.5 + (rng() - 0.5) * noise
      });
    }
    for (let i = 0; i < samples - half; i++) {
      const angle = (i / (samples - half)) * Math.PI;
      data.push({
        x: 1.0 - Math.cos(angle) * 1.5 + (rng() - 0.5) * noise,
        y: -0.5 - Math.sin(angle) * 1.5 + (rng() - 0.5) * noise
      });
    }
  }
  return data;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  const colors = ["#0f62fe", "#ff832b", "#198038", "#8a3ffc", "#0072c3", "#da1e28"];

  function renderClusterSVG(data, assignments, centroids = []) {
    const width = 480, height = 280, padding = 30;
    const xScale = (x) => padding + ((x + 3) / 6) * (width - 2 * padding);
    const yScale = (y) => height - padding - ((y + 3) / 6) * (height - 2 * padding);

    let pointsSvg = "";
    for (let i = 0; i < data.length; i++) {
      const p = data[i];
      const cx = xScale(p.x);
      const cy = yScale(p.y);
      const c = assignments[i];
      const color = (c === -1 || c === undefined) ? "#888" : colors[c % colors.length];
      pointsSvg += `<circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/>`;
    }

    let centroidsSvg = "";
    for (let c = 0; c < centroids.length; c++) {
      const cen = centroids[c];
      const cx = xScale(cen.x);
      const cy = yScale(cen.y);
      centroidsSvg += `
        <g class="centroid-marker">
          <circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#161616" stroke-width="2.5"/>
          <line x1="${cx - 6}" y1="${cy}" x2="${cx + 6}" y2="${cy}" stroke="#161616" stroke-width="2"/>
          <line x1="${cx}" y1="${cy - 6}" x2="${cx}" y2="${cy + 6}" stroke="#161616" stroke-width="2"/>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="cluster-scatter-chart" role="img" aria-label="Cluster Scatter Plot">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${pointsSvg}
        ${centroidsSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const algo = currentControls.algorithm || currentSpec.controls.find(c => c.id === "algorithm")?.default || "kmeans";
    const k = parseInt(currentControls.k ?? currentSpec.controls.find(c => c.id === "k")?.default ?? 3, 10);
    const eps = parseFloat(currentControls.eps ?? currentSpec.controls.find(c => c.id === "eps")?.default ?? 0.8);
    const minSamples = parseInt(currentControls.min_samples ?? currentSpec.controls.find(c => c.id === "min_samples")?.default ?? 3, 10);
    const pattern = currentControls.pattern || currentSpec.controls.find(c => c.id === "pattern")?.default || "blobs";

    const data = generateClusterDataset({ pattern, samples: 45, noise: 0.15, seed: 42 });

    let assignments = [], centroids = [], numClusters = 0, inertia = 0;
    if (algo === "kmeans") {
      const res = runKMeans(data, { k });
      assignments = res.assignments;
      centroids = res.centroids;
      inertia = res.inertia;
      numClusters = k;
    } else {
      const res = runDBSCAN(data, { eps, minSamples });
      assignments = res.labels;
      numClusters = res.numClusters;
      inertia = 0;
    }

    const silhouette = calculateSilhouetteScore(data, assignments);
    const diagnosis = silhouette >= 0.60 ? "Balanced" : (silhouette >= 0.40 ? "Weak Structure" : "Poor Clusters");

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderClusterSVG(data, assignments, centroids);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = diagnosis;

    const silElem = root.querySelector("[data-metric='silhouette']");
    if (silElem) silElem.textContent = silhouette.toFixed(3);

    const kElem = root.querySelector("[data-metric='clusters']");
    if (kElem) kElem.textContent = numClusters;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-cluster-workbench class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Silhouette Score:</span> <strong data-metric="silhouette">0.720</strong></div>
            <div class="metric-card"><span class="label">Clusters:</span> <strong data-metric="clusters">3</strong></div>
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
      return "Interactive 2D clustering plot showing point assignments, cluster centroids, and silhouette cohesion score.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

