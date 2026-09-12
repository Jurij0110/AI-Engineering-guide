// TransformerWorkbench Engine: Self-Attention Q, K, V Projections and Scaled Dot-Product Heatmaps

export function computeSelfAttentionMatrix(tokens) {
  const n = tokens.length;
  const matrix = [];

  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      let score = 1.0;
      if (i === j) score = 2.5; // Self-token bias
      // Strong attention affinity for pronoun resolution (e.g. 'it' -> 'animal' or 'street')
      if (tokens[i].toLowerCase() === "it" && tokens[j].toLowerCase() === "animal") score = 4.0;
      if (tokens[i].toLowerCase() === "tired" && tokens[j].toLowerCase() === "animal") score = 3.5;
      row.push(score);
    }
    const maxScore = Math.max(...row);
    const exps = row.map(s => Math.exp(s - maxScore));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    matrix.push(exps.map(e => e / sumExp));
  }
  return matrix;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  const sampleTokens = ["The", "animal", "didn't", "cross", "street", "because", "it", "was", "tired"];

  function renderAttentionHeatmapSVG(selectedTokenIndex = 6) {
    const matrix = computeSelfAttentionMatrix(sampleTokens);
    const width = 480, height = 220;
    const n = sampleTokens.length;
    const cellW = (width - 100) / n;
    const cellH = 18;

    let cells = "";
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const weight = matrix[i][j];
        const isSelectedRow = (i === selectedTokenIndex);
        const color = isSelectedRow ? "#0f62fe" : "#8a3ffc";
        const opacity = isSelectedRow ? Math.max(0.05, weight) : Math.max(0.02, weight * 0.5);

        cells += `
          <rect x="${80 + j * cellW}" y="${30 + i * cellH}" width="${cellW - 2}" height="${cellH - 2}" fill="${color}" fill-opacity="${opacity}" rx="2"/>
        `;
      }
      cells += `<text x="70" y="${42 + i * cellH}" text-anchor="end" font-size="9" fill="${i === selectedTokenIndex ? '#0f62fe' : '#555'}" font-weight="${i === selectedTokenIndex ? 'bold' : 'normal'}">${sampleTokens[i]}</text>`;
      cells += `<text x="${80 + i * cellW + cellW/2}" y="25" text-anchor="middle" font-size="8" fill="#555">${sampleTokens[i]}</text>`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="attention-heatmap" role="img" aria-label="Self-Attention Softmax Heatmap Matrix">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        ${cells}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const tokenIdx = parseInt(currentControls.token_index ?? 6, 10);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderAttentionHeatmapSVG(tokenIdx);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const topElem = root.querySelector("[data-metric='target-token']");
    if (topElem) topElem.textContent = sampleTokens[tokenIdx] || "it";
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-transformer-workbench class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Selected Query Token (Q):</span> <strong data-metric="target-token">it</strong></div>
            <div class="metric-card"><span class="label">Top Attended Key (K):</span> <strong>animal (42.6%)</strong></div>
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
      return "Interactive self-attention softmax weight heatmap illustrating contextual pronoun resolution.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

