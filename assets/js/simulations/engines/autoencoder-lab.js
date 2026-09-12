// AutoencoderLab Engine: Encoder-Decoder Bottlenecks, Dimensionality Reduction & Denoising

export function simulateAutoencoderReconstruction({ inputDim = 784, latentDim = 32, noiseLevel = 0.1 } = {}) {
  const compressionRatio = inputDim / latentDim;
  const reconstructionMse = (0.01 + noiseLevel * 0.08) * (1 + 16 / latentDim);

  return {
    inputDim,
    latentDim,
    compressionRatio,
    reconstructionMse,
    diagnosis: reconstructionMse < 0.08 ? "Balanced" : "Suboptimal"
  };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderBottleneckSVG(inputDim, latentDim) {
    const width = 480, height = 180;
    return `
      <svg viewBox="0 0 ${width} ${height}" class="autoencoder-bottleneck-chart" role="img" aria-label="Autoencoder Bottleneck Compression Diagram">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        
        <!-- Input Block -->
        <rect x="30" y="30" width="60" height="120" fill="#8a3ffc" rx="4"/>
        <text x="60" y="95" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">Input</text>
        <text x="60" y="110" text-anchor="middle" fill="#fff" font-size="9">${inputDim}D</text>

        <!-- Encoder Funnel -->
        <polygon points="95,40 200,65 200,115 95,140" fill="#0f62fe" fill-opacity="0.3"/>
        <text x="145" y="95" text-anchor="middle" fill="#0f62fe" font-size="10" font-weight="bold">Encoder</text>

        <!-- Bottleneck -->
        <rect x="210" y="65" width="40" height="50" fill="#ff832b" rx="4"/>
        <text x="230" y="90" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">Latent</text>
        <text x="230" y="104" text-anchor="middle" fill="#fff" font-size="8">${latentDim}D</text>

        <!-- Decoder Funnel -->
        <polygon points="260,65 365,40 365,140 260,115" fill="#24a148" fill-opacity="0.3"/>
        <text x="315" y="95" text-anchor="middle" fill="#24a148" font-size="10" font-weight="bold">Decoder</text>

        <!-- Reconstruction Block -->
        <rect x="375" y="30" width="60" height="120" fill="#24a148" rx="4"/>
        <text x="405" y="95" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">Output</text>
        <text x="405" y="110" text-anchor="middle" fill="#fff" font-size="9">${inputDim}D</text>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !currentSpec) return;
    const latentDim = parseInt(currentControls.latent_dim ?? currentSpec.controls.find(c => c.id === "latent_dim")?.default ?? 32, 10);
    const noiseLevel = parseFloat(currentControls.noise ?? 0.1);

    const res = simulateAutoencoderReconstruction({ inputDim: 784, latentDim, noiseLevel });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderBottleneckSVG(784, latentDim);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = res.diagnosis;

    const ratioElem = root.querySelector("[data-metric='compression']");
    if (ratioElem) ratioElem.textContent = res.compressionRatio.toFixed(1) + "x";

    const lossElem = root.querySelector("[data-metric='mse']");
    if (lossElem) lossElem.textContent = res.reconstructionMse.toFixed(4);

    const challengeElem = root.querySelector("[data-testid='challenge-status']");
    if (challengeElem && currentSpec.challenge?.success) {
      const isSuccess = Object.entries(currentSpec.challenge.success).every(([k, v]) => {
        if (k === "latent_dim") return parseInt(currentControls.latent_dim, 10) === parseInt(v, 10);
        if (k === "noise") return Math.abs(parseFloat(currentControls.noise) - parseFloat(v)) < 0.001;
        if (k === "diagnosis") return res.diagnosis === v;
        return String(currentControls[k]) === String(v);
      });
      challengeElem.textContent = isSuccess
        ? `Challenge complete: ${currentSpec.challenge.prompt}`
        : `Challenge in progress: ${currentSpec.challenge.prompt}`;
      challengeElem.dataset.success = String(isSuccess);
    }
  }

  function applyControls(candidate = {}) {
    if (!candidate || typeof candidate !== "object") return;
    for (const [k, v] of Object.entries(candidate)) {
      currentControls[k] = v;
      const input = root?.querySelector(`[data-control="${k}"]`);
      if (input) input.value = v;
    }
    updateView();
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-autoencoder-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Compression Ratio:</span> <strong data-metric="compression">24.5x</strong></div>
            <div class="metric-card"><span class="label">Reconstruction MSE:</span> <strong data-metric="mse">0.0240</strong></div>
          </div>
          ${spec.presets && spec.presets.length > 0 ? `
            <div class="presets-row" style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${spec.presets.map(p => `
                <button type="button" class="preset-btn" data-preset-id="${p.id}" style="min-height: 36px; padding: 8px 12px; color: var(--ink); background: var(--surface); border: 1px solid var(--line); font-size: 10px; font-weight: 600; cursor: pointer;">
                  ${p.label}
                </button>
              `).join("")}
            </div>
          ` : ""}
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
          ${spec.challenge ? `
            <div class="challenge-status" data-testid="challenge-status" style="margin: 0; padding: 12px 14px; background: #eef1ec; border-left: 3px solid var(--accent); font-size: 10px; line-height: 1.6;">
              Challenge in progress: ${spec.challenge.prompt}
            </div>
          ` : ""}
        </div>
      `;

      root.querySelectorAll("[data-control]").forEach(input => {
        input.addEventListener("input", (e) => {
          currentControls[e.target.dataset.control] = e.target.value;
          updateView();
        });
      });

      root.querySelectorAll("[data-preset-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const presetId = btn.dataset.presetId;
          const preset = spec.presets.find(p => p.id === presetId);
          if (preset?.values) applyControls(preset.values);
        });
      });

      updateView();
    },
    update(candidate = {}) {
      applyControls(candidate);
    },
    reset() {
      if (!currentSpec) return;
      for (const ctrl of currentSpec.controls) {
        currentControls[ctrl.id] = ctrl.default;
        const input = root?.querySelector(`[data-control="${ctrl.id}"]`);
        if (input) input.value = ctrl.default;
      }
      updateView();
    },
    getAccessibleSummary() {
      if (!currentSpec) return "Interactive autoencoder encoder-decoder bottleneck compression and denoising simulator.";
      const latentDim = parseInt(currentControls.latent_dim ?? 32, 10);
      const noiseLevel = parseFloat(currentControls.noise ?? 0.1);
      const res = simulateAutoencoderReconstruction({ inputDim: 784, latentDim, noiseLevel });
      return `Autoencoder bottleneck: 784D input compressed to ${latentDim}D latent representation (${res.compressionRatio.toFixed(1)}x compression) with noise level ${noiseLevel}. Simulated Reconstruction MSE: ${res.reconstructionMse.toFixed(4)}. Diagnosis: ${res.diagnosis}.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      currentSpec = null;
      currentControls = {};
    }
  };
}

