// SequenceModelLab Engine: Recurrent Neural Networks, Unrolling over Time & LSTM Memory Cells

export function simulateRecurrentMemory(modelType = "lstm", seqLength = 10) {
  const retentionProfile = [];
  const decayRate = modelType === "lstm" ? 0.98 : 0.72;

  for (let t = 1; t <= seqLength; t++) {
    retentionProfile.push(Math.pow(decayRate, t));
  }

  return {
    retentionProfile,
    retentionAtT10: retentionProfile[retentionProfile.length - 1],
    diagnosis: modelType === "lstm" ? "Balanced" : (seqLength >= 8 ? "Vanishing Gradient" : "Balanced")
  };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderMemorySVG(modelType, seqLength) {
    const width = 480, height = 200;
    const { retentionProfile } = simulateRecurrentMemory(modelType, seqLength);
    const stepW = (width - 80) / seqLength;

    let bars = "";
    retentionProfile.forEach((ret, i) => {
      const x = 50 + i * stepW;
      const barH = ret * 130;
      const y = 160 - barH;
      const color = modelType === "lstm" ? "#24a148" : (ret < 0.2 ? "#da1e28" : "#0f62fe");

      bars += `
        <rect x="${x}" y="${y}" width="${stepW * 0.7}" height="${barH}" fill="${color}" rx="2"/>
        <text x="${x + (stepW * 0.35)}" y="${y - 4}" text-anchor="middle" font-size="8" fill="#555">${(ret * 100).toFixed(0)}%</text>
        <text x="${x + (stepW * 0.35)}" y="175" text-anchor="middle" font-size="9" fill="#161616">t=${i+1}</text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" class="sequence-memory-chart" role="img" aria-label="Sequence Model Memory Retention Curve">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="40" y1="160" x2="${width-20}" y2="160" stroke="#ccc"/>
        <text x="15" y="30" font-size="11" font-weight="bold" fill="#0f62fe">${modelType.toUpperCase()} Temporal Memory Retention</text>
        ${bars}
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const modelType = currentControls.model_type || currentSpec.controls.find(c => c.id === "model_type")?.default || "lstm";
    const seqLength = parseInt(currentControls.seq_length ?? 10, 10);

    const res = simulateRecurrentMemory(modelType, seqLength);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderMemorySVG(modelType, seqLength);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = res.diagnosis;

    const retElem = root.querySelector("[data-metric='retention']");
    if (retElem) retElem.textContent = (res.retentionAtT10 * 100).toFixed(1) + "%";
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-sequence-model-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Time Step T Retention:</span> <strong data-metric="retention">81.7%</strong></div>
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
      return "Interactive recurrent neural network temporal memory and LSTM gating visualization.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

