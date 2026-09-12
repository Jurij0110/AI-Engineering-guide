// TreeExplorer Simulation Engine: Recursive Decision Tree Splits and Visualization

export function calculateEntropy(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let ent = 0;
  for (const c of counts) {
    if (c > 0) {
      const p = c / total;
      ent -= p * Math.log2(p);
    }
  }
  return ent;
}

export function calculateGini(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let sumSq = 0;
  for (const c of counts) {
    const p = c / total;
    sumSq += p * p;
  }
  return 1 - sumSq;
}

export function calculateInformationGain(parentCounts, childCountsList, criterion = "entropy") {
  const fn = criterion === "entropy" ? calculateEntropy : calculateGini;
  const parentImpurity = fn(parentCounts);
  const totalSamples = parentCounts.reduce((a, b) => a + b, 0);
  if (totalSamples === 0) return 0;

  let weightedChildImpurity = 0;
  for (const childCounts of childCountsList) {
    const childTotal = childCounts.reduce((a, b) => a + b, 0);
    if (childTotal > 0) {
      weightedChildImpurity += (childTotal / totalSamples) * fn(childCounts);
    }
  }
  return parentImpurity - weightedChildImpurity;
}

export function buildDecisionTree(data, { maxDepth = 3, criterion = "gini", minSamplesSplit = 2 } = {}) {
  function getClassCounts(items) {
    let c0 = 0, c1 = 0;
    for (const item of items) {
      if (item.label === 1) c1++;
      else c0++;
    }
    return [c0, c1];
  }

  function buildNode(items, depth) {
    const counts = getClassCounts(items);
    const majority = counts[1] > counts[0] ? 1 : 0;
    const impurity = (criterion === "entropy" ? calculateEntropy : calculateGini)(counts);

    if (depth >= maxDepth || items.length < minSamplesSplit || counts[0] === 0 || counts[1] === 0) {
      return { isLeaf: true, majority, samples: items.length, counts, impurity, depth };
    }

    // Evaluate best split feature and threshold
    let bestGain = -1;
    let bestSplit = null;

    for (const feature of ["x", "y"]) {
      const values = [...new Set(items.map(i => i[feature]))].sort((a, b) => a - b);
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        const left = items.filter(it => it[feature] <= threshold);
        const right = items.filter(it => it[feature] > threshold);
        if (left.length === 0 || right.length === 0) continue;

        const gain = calculateInformationGain(counts, [getClassCounts(left), getClassCounts(right)], criterion);
        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { feature, threshold, left, right };
        }
      }
    }

    if (!bestSplit || bestGain <= 1e-4) {
      return { isLeaf: true, majority, samples: items.length, counts, impurity, depth };
    }

    return {
      isLeaf: false,
      feature: bestSplit.feature,
      threshold: bestSplit.threshold,
      gain: bestGain,
      samples: items.length,
      counts,
      impurity,
      depth,
      left: buildNode(bestSplit.left, depth + 1),
      right: buildNode(bestSplit.right, depth + 1)
    };
  }

  return buildNode(data, 0);
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

export function generateTreeDataset({ pattern = "drug", samples = 40, seed = 42 }) {
  const rng = mulberry32(seed);
  const data = [];
  for (let i = 0; i < samples; i++) {
    const x = (rng() - 0.5) * 6; // Age / Sodium
    const y = (rng() - 0.5) * 6; // Blood Pressure / Potassium
    let label = 0;
    if (pattern === "drug") {
      label = (x > 0.5 && y > -0.5) || (x < -1.5 && y < 1.0) ? 1 : 0;
    } else {
      label = (x * y > 0) ? 1 : 0; // XOR pattern
    }
    data.push({ x, y, label });
  }
  return data;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function predictTree(node, x, y) {
    if (node.isLeaf) return node.majority;
    const val = node.feature === "x" ? x : y;
    return val <= node.threshold ? predictTree(node.left, x, y) : predictTree(node.right, x, y);
  }

  function renderTreeSVG(treeNode) {
    const width = 480, height = 260;
    let nodesSvg = "";
    let linesSvg = "";

    function traverse(node, x, y, dx) {
      if (!node) return;
      const text = node.isLeaf
        ? `Class ${node.majority} (n=${node.samples})`
        : `${node.feature.toUpperCase()} <= ${node.threshold.toFixed(1)}`;
      const fill = node.isLeaf ? (node.majority === 1 ? "#ff832b" : "#0f62fe") : "#393939";

      nodesSvg += `
        <g class="tree-node">
          <rect x="${x - 55}" y="${y - 14}" width="110" height="28" rx="4" fill="${fill}"/>
          <text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff" font-size="11" font-family="sans-serif">${text}</text>
        </g>
      `;

      if (!node.isLeaf) {
        const leftX = x - dx, leftY = y + 55;
        const rightX = x + dx, rightY = y + 55;
        linesSvg += `<line x1="${x}" y1="${y + 14}" x2="${leftX}" y2="${leftY - 14}" stroke="#888" stroke-width="1.5"/>`;
        linesSvg += `<line x1="${x}" y1="${y + 14}" x2="${rightX}" y2="${rightY - 14}" stroke="#888" stroke-width="1.5"/>`;
        traverse(node.left, leftX, leftY, dx / 2);
        traverse(node.right, rightX, rightY, dx / 2);
      }
    }

    traverse(treeNode, width / 2, 30, width / 4);

    return `
      <svg viewBox="0 0 ${width} ${height}" class="tree-hierarchy-chart" role="img" aria-label="Decision tree hierarchy">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${linesSvg}
        ${nodesSvg}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const maxDepth = parseInt(currentControls.max_depth ?? currentSpec.controls.find(c => c.id === "max_depth")?.default ?? 3, 10);
    const criterion = currentControls.criterion || currentSpec.controls.find(c => c.id === "criterion")?.default || "gini";
    const samples = parseInt(currentControls.samples ?? currentSpec.controls.find(c => c.id === "samples")?.default ?? 40, 10);

    const data = generateTreeDataset({ pattern: "drug", samples, seed: 42 });
    const tree = buildDecisionTree(data, { maxDepth, criterion });

    let correct = 0;
    for (const p of data) {
      if (predictTree(tree, p.x, p.y) === p.label) correct++;
    }
    const accuracy = correct / data.length;
    const diagnosis = accuracy >= 0.85 ? "Balanced" : (accuracy >= 0.70 ? "Underfit" : "Overfit");

    const treeContainer = root.querySelector("[data-tree-container]");
    if (treeContainer) treeContainer.innerHTML = renderTreeSVG(tree);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = diagnosis;

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = (accuracy * 100).toFixed(1) + "%";

    const depthElem = root.querySelector("[data-metric='depth']");
    if (depthElem) depthElem.textContent = maxDepth;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-tree-explorer-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">90.0%</strong></div>
            <div class="metric-card"><span class="label">Tree Depth:</span> <strong data-metric="depth">3</strong></div>
          </div>
          <div data-tree-container class="chart-wrapper"></div>
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
      return "Interactive decision tree split visualizer displaying hierarchical split thresholds, leaf assignments, and accuracy.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

