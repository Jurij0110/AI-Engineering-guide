// DiffusionLab: Interactive simulation of forward noising, reverse denoising,
// noise schedules (linear vs cosine), and convolutional transpose reconstruction.

// Deterministic Pseudo-Random Number Generator (Linear Congruential Generator)
function pseudoRandom(seed) {
  let s = (seed % 2147483647 + 2147483647) % 2147483647;
  return function() {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Canonical 8x8 bitmap representing MNIST digit "3" (pixel intensities 0.0 to 1.0)
const DIGIT_3_PIXELS = [
  0.0, 0.2, 0.8, 0.9, 0.8, 0.2, 0.0, 0.0,
  0.0, 0.6, 0.9, 0.4, 0.9, 0.8, 0.1, 0.0,
  0.0, 0.1, 0.1, 0.0, 0.8, 0.9, 0.1, 0.0,
  0.0, 0.0, 0.3, 0.8, 0.9, 0.6, 0.0, 0.0,
  0.0, 0.0, 0.1, 0.2, 0.9, 0.9, 0.2, 0.0,
  0.0, 0.1, 0.0, 0.0, 0.5, 0.9, 0.3, 0.0,
  0.0, 0.6, 0.8, 0.4, 0.8, 0.9, 0.1, 0.0,
  0.0, 0.2, 0.8, 0.9, 0.8, 0.3, 0.0, 0.0
];

export function evaluateDiffusion(state = {}, challenge = {}) {
  const step = Math.max(0, Math.min(50, parseInt(state.step ?? 25, 10)));
  const noiseFactor = Math.max(0.05, Math.min(1.0, parseFloat(state.noise_factor ?? 0.5)));
  const schedule = state.schedule || "linear";
  const backbone = state.backbone || "conv_transpose";
  const mode = state.mode || "reverse_denoising";

  // Calculate schedule alpha_bar (cumulative signal retention)
  let alphaBar;
  if (schedule === "cosine") {
    // Cosine schedule: alpha_bar(t) = cos^2(((t / T) + s) / (1 + s) * pi / 2)
    const s = 0.008;
    const tNorm = (step / 50 + s) / (1 + s);
    alphaBar = Math.cos(tNorm * Math.PI * 0.5) ** 2;
  } else {
    // Linear schedule: linear interpolation of beta from 0.0001 to 0.02
    const progress = step / 50;
    alphaBar = Math.max(0.01, 1 - 0.98 * progress);
  }

  // Effective noise fraction
  const noiseFraction = Math.sqrt(Math.max(0, 1 - alphaBar));
  const effectiveNoise = Math.min(1.0, noiseFactor * noiseFraction);

  // Architectural error factor
  let backboneMseFactor = 0.032;
  let backboneLabel = "Keras Conv2D + Conv2DTranspose Decoder";
  if (backbone === "dense_bottleneck") {
    backboneMseFactor = 0.068;
    backboneLabel = "Dense Flatten Bottleneck";
  } else if (backbone === "frozen_backbone") {
    backboneMseFactor = 0.024;
    backboneLabel = "Frozen Base + Fine-Tuned Top Layers";
  }

  // Simulated Reconstruction MSE and SNR
  const reconstructionMse = backboneMseFactor * (1.0 + 2.2 * effectiveNoise);
  const snrDb = Math.max(-15, Math.min(32, 10 * Math.log10(Math.max(0.001, alphaBar) / (effectiveNoise * effectiveNoise + 0.001))));
  const psnrDb = Math.max(10, Math.min(38, 10 * Math.log10(1.0 / (reconstructionMse + 1e-6))));

  let status = "Balanced Denoising";
  if (step === 0 || effectiveNoise < 0.12) {
    status = "Pristine Signal";
  } else if (step >= 45 || effectiveNoise > 0.85) {
    status = "Pure Gaussian Diffusion";
  } else if (effectiveNoise > 0.55) {
    status = "High Noise Dissipation";
  } else {
    status = "Coherent Reconstruction";
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Diffusion step ${step}/50 under ${schedule} schedule with noise factor ${noiseFactor.toFixed(2)}. Model (${backboneLabel}) achieves simulated reconstruction MSE of ${reconstructionMse.toFixed(4)} and PSNR ${psnrDb.toFixed(1)} dB (SNR: ${snrDb.toFixed(1)} dB).`;

  return {
    step,
    noiseFactor,
    schedule,
    backbone,
    mode,
    alphaBar,
    effectiveNoise,
    snrDb,
    reconstructionMse,
    psnrDb,
    status,
    challengeComplete,
    explanation
  };
}

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderVisualSVG(res) {
    const prng = pseudoRandom(spec?.scenario?.seed || 42 + res.step);
    const width = 540, height = 180;
    const boxSize = 120, boxY = 30;

    function renderPixelGrid(xOffset, pixelFn, label, sub) {
      const cellSize = boxSize / 8;
      let rects = "";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const val = Math.max(0, Math.min(1, pixelFn(r, c)));
          const hex = Math.round(val * 255).toString(16).padStart(2, "0");
          const fill = `#${hex}${hex}${hex}`;
          rects += `<rect x="${xOffset + c * cellSize}" y="${boxY + r * cellSize}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" fill="${fill}" rx="1"/>`;
        }
      }
      return `
        <g>
          <rect x="${xOffset - 2}" y="${boxY - 2}" width="${boxSize + 4}" height="${boxSize + 4}" fill="#24292e" rx="3"/>
          ${rects}
          <text x="${xOffset + boxSize / 2}" y="${boxY + boxSize + 16}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">${label}</text>
          <text x="${xOffset + boxSize / 2}" y="${boxY + boxSize + 27}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="8">${sub}</text>
        </g>
      `;
    }

    // Stage 1: Clean Target x_0
    const cleanGrid = renderPixelGrid(20, (r, c) => DIGIT_3_PIXELS[r * 8 + c], "Clean Image x₀", "Target MNIST digit");

    // Stage 2: Corrupted Noisy x_t
    const noisyGrid = renderPixelGrid(180, (r, c) => {
      const orig = DIGIT_3_PIXELS[r * 8 + c];
      const noise = (prng() - 0.5) * 2 * res.effectiveNoise;
      return orig * Math.sqrt(Math.max(0, res.alphaBar)) + noise;
    }, `Noisy x_t (t=${res.step})`, `${(res.effectiveNoise * 100).toFixed(0)}% noise`);

    // Stage 3: Denoised Reconstruction x_hat_0
    const denoisedGrid = renderPixelGrid(340, (r, c) => {
      const orig = DIGIT_3_PIXELS[r * 8 + c];
      const residual = (prng() - 0.5) * res.reconstructionMse * 3;
      return orig + residual;
    }, "Denoised Output x̂₀", `MSE: ${res.reconstructionMse.toFixed(4)}`);

    // Arrows
    const arrows = `
      <path d="M 148 90 L 172 90 M 166 84 L 172 90 L 166 96" stroke="var(--accent, #0969da)" stroke-width="2" fill="none"/>
      <path d="M 308 90 L 332 90 M 326 84 L 332 90 L 326 96" stroke="var(--accent, #0969da)" stroke-width="2" fill="none"/>
      <text x="160" y="78" text-anchor="middle" fill="var(--accent, #0969da)" font-size="8" font-weight="bold">+Noise</text>
      <text x="320" y="78" text-anchor="middle" fill="#1f883d" font-size="8" font-weight="bold">Denoise</text>
    `;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="diffusion-pipeline-svg" role="img" aria-label="Diffusion forward and reverse visual process">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        ${cleanGrid}
        ${arrows}
        ${noisyGrid}
        ${denoisedGrid}
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateDiffusion(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const snrElem = root.querySelector("[data-metric='snr']");
    if (snrElem) snrElem.textContent = `${res.snrDb.toFixed(1)} dB`;

    const mseElem = root.querySelector("[data-metric='mse']");
    if (mseElem) mseElem.textContent = res.reconstructionMse.toFixed(4);

    const psnrElem = root.querySelector("[data-metric='psnr']");
    if (psnrElem) psnrElem.textContent = `${res.psnrDb.toFixed(1)} dB`;

    const statusElem = root.querySelector("[data-metric='status']");
    if (statusElem) statusElem.textContent = res.status;

    const challengeElem = root.querySelector("[data-testid='challenge-status']");
    if (challengeElem && spec?.challenge) {
      challengeElem.textContent = res.challengeComplete
        ? `Challenge complete: ${spec.challenge.prompt}`
        : `Challenge in progress: ${spec.challenge.prompt}`;
      challengeElem.dataset.success = String(res.challengeComplete);
    }
  }

  function applyControls(candidate = {}) {
    if (!candidate || typeof candidate !== "object") return;
    for (const [k, v] of Object.entries(candidate)) {
      state[k] = v;
      const input = root?.querySelector(`[data-control="${k}"]`);
      if (input) input.value = v;
    }
    updateView();
  }

  return {
    mount(container, lessonSpec) {
      root = container;
      spec = lessonSpec;
      state = {};
      for (const ctrl of spec.controls) state[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-diffusion-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Status:</span> <strong data-metric="status">Balanced Denoising</strong></div>
            <div class="metric-card"><span class="label">Simulated SNR:</span> <strong data-metric="snr">12.5 dB</strong></div>
            <div class="metric-card"><span class="label">Reconstruction MSE:</span> <strong data-metric="mse">0.0350</strong></div>
            <div class="metric-card"><span class="label">PSNR:</span> <strong data-metric="psnr">24.5 dB</strong></div>
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
                    ${c.options.map(o => `<option value="${o.value}" ${String(o.value) === String(c.default) ? "selected" : ""}>${o.label}</option>`).join("")}
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
          state[e.target.dataset.control] = e.target.value;
          updateView();
        });
        input.addEventListener("change", (e) => {
          state[e.target.dataset.control] = e.target.value;
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
      if (!spec) return;
      for (const ctrl of spec.controls) {
        state[ctrl.id] = ctrl.default;
        const input = root?.querySelector(`[data-control="${ctrl.id}"]`);
        if (input) input.value = ctrl.default;
      }
      updateView();
    },
    getAccessibleSummary() {
      if (!spec) return "Interactive diffusion forward noising and reverse denoising simulator.";
      const res = evaluateDiffusion(state, spec?.challenge?.success);
      return `Diffusion model at step ${res.step}/50 under ${res.schedule} schedule. Effective noise: ${(res.effectiveNoise * 100).toFixed(0)}%. Simulated MSE: ${res.reconstructionMse.toFixed(4)}, SNR: ${res.snrDb.toFixed(1)} dB, PSNR: ${res.psnrDb.toFixed(1)} dB. Status: ${res.status}.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
