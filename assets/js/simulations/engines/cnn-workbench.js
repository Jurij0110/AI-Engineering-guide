// CNNWorkbench Engine: 2D Convolution Filters, Stride/Padding Mathematics & MaxPooling

export function computeConvOutputSize(inputSize, kernelSize, padding = 0, stride = 1) {
  return Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
}

export function applyConvolution2D(input, kernel, stride = 1) {
  const inH = input.length, inW = input[0].length;
  const kH = kernel.length, kW = kernel[0].length;
  const outH = Math.floor((inH - kH) / stride) + 1;
  const outW = Math.floor((inW - kW) / stride) + 1;

  const output = [];
  for (let r = 0; r < outH; r++) {
    const row = [];
    for (let c = 0; c < outW; c++) {
      let sum = 0;
      for (let kr = 0; kr < kH; kr++) {
        for (let kc = 0; kc < kW; kc++) {
          sum += input[r * stride + kr][c * stride + kc] * kernel[kr][kc];
        }
      }
      row.push(Math.max(0, sum)); // ReLU
    }
    output.push(row);
  }
  return output;
}

export function applyMaxPooling2D(input, poolSize = 2) {
  const inH = input.length, inW = input[0].length;
  const outH = Math.floor(inH / poolSize);
  const outW = Math.floor(inW / poolSize);

  const output = [];
  for (let r = 0; r < outH; r++) {
    const row = [];
    for (let c = 0; c < outW; c++) {
      let maxVal = -Infinity;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          const val = input[r * poolSize + pr][c * poolSize + pc];
          if (val > maxVal) maxVal = val;
        }
      }
      row.push(maxVal);
    }
    output.push(row);
  }
  return output;
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderGridSVG(grid, title, color = "#0f62fe") {
    const cellSize = 22;
    const h = grid.length, w = grid[0].length;
    const totalW = w * cellSize, totalH = h * cellSize;

    let cells = "";
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const val = grid[r][c];
        const opacity = Math.min(1, Math.max(0.1, val / 8));
        cells += `
          <rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize-1}" height="${cellSize-1}" fill="${color}" fill-opacity="${opacity}" rx="2"/>
          <text x="${c * cellSize + cellSize/2}" y="${r * cellSize + cellSize/2 + 3}" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">${val.toFixed(0)}</text>
        `;
      }
    }

    return `
      <div class="grid-card">
        <span class="grid-title">${title} (${w}x${h})</span>
        <svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" style="display:block; margin: 4px auto;">
          ${cells}
        </svg>
      </div>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const filterType = currentControls.filter || currentSpec.controls.find(c => c.id === "filter")?.default || "sobel_v";
    const stride = parseInt(currentControls.stride ?? 1, 10);
    const pool = parseInt(currentControls.pool ?? 2, 10);

    const inputGrid = [
      [2, 2, 2, 0, 0, 0],
      [2, 2, 2, 0, 0, 0],
      [2, 2, 2, 0, 0, 0],
      [0, 0, 0, 4, 4, 4],
      [0, 0, 0, 4, 4, 4],
      [0, 0, 0, 4, 4, 4]
    ];

    let kernel = [[1, 0, -1], [2, 0, -2], [1, 0, -1]]; // Sobel vertical
    if (filterType === "sobel_h") kernel = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
    else if (filterType === "outline") kernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];

    const convOut = applyConvolution2D(inputGrid, kernel, stride);
    const poolOut = applyMaxPooling2D(convOut, pool);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap; gap:10px;">
          ${renderGridSVG(inputGrid, "Input Image", "#8a3ffc")}
          <span style="font-size:20px; font-weight:bold; color:#555;">* Conv =></span>
          ${renderGridSVG(convOut, "Feature Map", "#0f62fe")}
          <span style="font-size:20px; font-weight:bold; color:#555;">=> MaxPool =></span>
          ${renderGridSVG(poolOut, "Pooled Output", "#24a148")}
        </div>
      `;
    }

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const convDimElem = root.querySelector("[data-metric='conv-dim']");
    if (convDimElem) convDimElem.textContent = `${convOut[0].length}x${convOut.length}`;

    const poolDimElem = root.querySelector("[data-metric='pool-dim']");
    if (poolDimElem) poolDimElem.textContent = `${poolOut[0].length}x${poolOut.length}`;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-cnn-workbench class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Conv Feature Dim:</span> <strong data-metric="conv-dim">4x4</strong></div>
            <div class="metric-card"><span class="label">Pooled Dim:</span> <strong data-metric="pool-dim">2x2</strong></div>
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
      return "Interactive 2D Convolution and MaxPooling vision workbench illustrating feature map extraction.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

