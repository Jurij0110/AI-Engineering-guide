// GANLab: Interactive simulation of Generative Adversarial Networks in Keras
// Models generator vs discriminator minimax balance, LeakyReLU activation stability,
// BatchNormalization effects, and Nash equilibrium convergence.

// Deterministic Pseudo-Random Number Generator
function pseudoRandom(seed) {
  let s = (seed % 2147483647 + 2147483647) % 2147483647;
  return function() {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Canonical 8x8 bitmap representing MNIST digit "7"
const DIGIT_7_PIXELS = [
  0.0, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.0,
  0.0, 0.1, 0.1, 0.2, 0.3, 0.9, 0.8, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.8, 0.9, 0.1, 0.0,
  0.0, 0.0, 0.0, 0.5, 0.9, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.2, 0.9, 0.8, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.7, 0.9, 0.2, 0.0, 0.0, 0.0,
  0.0, 0.2, 0.9, 0.7, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.1, 0.8, 0.4, 0.0, 0.0, 0.0, 0.0
];

export function evaluateGAN(state = {}, challenge = {}) {
  const epoch = Math.max(0, Math.min(400, parseInt(state.epoch ?? 200, 10)));
  const activation = state.activation || "leaky_relu";
  const batchNorm = state.batch_norm || "enabled";
  const latentDim = parseInt(state.latent_dim ?? 100, 10);
  const balance = state.balance || "balanced";

  let dLoss, gLoss, dAccuracy, fidEstimate, status, diagnosis;

  if (activation === "standard_relu") {
    // Dying ReLU failure: neurons output zero gradients, training breaks
    dLoss = 0.045;
    gLoss = 5.60;
    dAccuracy = 99.2;
    fidEstimate = 265.0;
    status = "Dying ReLU Gradient Vanishing";
    diagnosis = "Failure: Standard ReLU causes dead neurons when receiving negative inputs. Discriminator easily overpowers generator; generator gradients vanish permanently.";
  } else if (batchNorm === "disabled" && epoch >= 150) {
    // Mode collapse: lack of batch normalization leads to internal covariate shift
    dLoss = 0.18;
    gLoss = 3.85;
    dAccuracy = 88.5;
    fidEstimate = 175.0;
    status = "Mode Collapse / Instability";
    diagnosis = "Instability: Without BatchNormalization, generator representations collapse to repeated low-diversity blurry patterns.";
  } else if (balance === "d_overpowered") {
    // Discriminator trained too fast
    dLoss = 0.025;
    gLoss = 4.95;
    dAccuracy = 98.6;
    fidEstimate = 205.0;
    status = "Discriminator Overpowered";
    diagnosis = "Suboptimal: Discriminator easily identifies synthetic images, starving generator of useful gradients. Keep 1:1 alternating updates.";
  } else if (balance === "g_overpowered") {
    // Generator learning rate excessive
    dLoss = 2.10;
    gLoss = 0.42;
    dAccuracy = 25.0;
    fidEstimate = 160.0;
    status = "Generator Overpowering D";
    diagnosis = "Unstable: Discriminator cannot provide meaningful feedback, leading to erratic generated artifacts.";
  } else {
    // Healthy Minimax / Nash Equilibrium with LeakyReLU and BatchNorm
    const progress = epoch / 400;
    if (epoch === 0) {
      dLoss = 0.693; // -ln(0.5)
      gLoss = 0.693;
      dAccuracy = 50.0;
      fidEstimate = 225.0;
      status = "Initial Random Noise";
      diagnosis = "Untrained generator outputs pure random noise. Discriminator operates at 50% random chance.";
    } else if (epoch < 100) {
      dLoss = 0.65 - 0.05 * progress;
      gLoss = 0.85 + 0.4 * progress;
      dAccuracy = 50.0 + 15.0 * progress;
      fidEstimate = 225.0 - 140.0 * progress;
      status = "Coarse Shapes Emerging";
      diagnosis = "Adversarial feedback guides generator to produce primitive strokes and rough digit contours.";
    } else {
      // Converging towards Nash Equilibrium (dLoss ~ 0.55-0.69, dAccuracy ~ 50-55%)
      dLoss = 0.68 - 0.08 * (1 - Math.exp(-progress * 3));
      gLoss = 1.15 + 0.15 * Math.sin(progress * Math.PI);
      dAccuracy = 52.5 - 2.0 * progress;
      fidEstimate = Math.max(16.5, 220.0 * Math.exp(-progress * 4.4));
      status = "Nash Equilibrium Achieved";
      diagnosis = "Optimal: Generator creates realistic synthetic digits that fool discriminator ~50% of the time, establishing stable minimax equilibrium.";
    }
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Keras GAN at epoch ${epoch}/400 (${latentDim}D latent noise, ${activation}, BatchNorm ${batchNorm}, balance: ${balance}). D-loss: ${dLoss.toFixed(3)}, G-loss: ${gLoss.toFixed(3)}, D-accuracy: ${dAccuracy.toFixed(1)}%, FID: ~${fidEstimate.toFixed(1)}. State: ${status}.`;

  return {
    epoch,
    activation,
    batchNorm,
    latentDim,
    balance,
    dLoss,
    gLoss,
    dAccuracy,
    fidEstimate,
    status,
    diagnosis,
    challengeComplete,
    explanation
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderVisualSVG(res) {
    const prng = pseudoRandom(spec?.scenario?.seed || 77 + res.epoch);
    const width = 540, height = 180;

    // SVG Left Panel: Adversarial Minimax Loss Curve
    const graphWidth = 220, graphHeight = 130, graphX = 20, graphY = 30;
    const epochX = graphX + (res.epoch / 400) * graphWidth;

    // SVG Right Panel: Generated Output Sample Visualizer
    const sampleBoxSize = 90, sampleY = 35;
    const realX = 275, genX = 405;

    function renderPixelGrid(xOffset, pixelFn, label, sub) {
      const cellSize = sampleBoxSize / 8;
      let rects = "";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const val = Math.max(0, Math.min(1, pixelFn(r, c)));
          const hex = Math.round(val * 255).toString(16).padStart(2, "0");
          const fill = `#${hex}${hex}${hex}`;
          rects += `<rect x="${xOffset + c * cellSize}" y="${sampleY + r * cellSize}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" fill="${fill}" rx="1"/>`;
        }
      }
      return `
        <g>
          <rect x="${xOffset - 2}" y="${sampleY - 2}" width="${sampleBoxSize + 4}" height="${sampleBoxSize + 4}" fill="#24292e" rx="3"/>
          ${rects}
          <text x="${xOffset + sampleBoxSize / 2}" y="${sampleY + sampleBoxSize + 16}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">${label}</text>
          <text x="${xOffset + sampleBoxSize / 2}" y="${sampleY + sampleBoxSize + 27}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="8">${sub}</text>
        </g>
      `;
    }

    // Real MNIST Sample
    const realGrid = renderPixelGrid(realX, (r, c) => DIGIT_7_PIXELS[r * 8 + c], "Real Target", "Label = 1.0");

    // Generator Output Sample
    let genGrid;
    if (res.status.includes("Dying ReLU")) {
      // Dead neurons output flat gray / blank
      genGrid = renderPixelGrid(genX, () => 0.15, "Generator Output", "Zero Gradients");
    } else if (res.status.includes("Mode Collapse")) {
      // Mode collapse: repetitive blurry smudge
      genGrid = renderPixelGrid(genX, (r, c) => (r >= 3 && r <= 5 && c >= 3 && c <= 5 ? 0.7 : 0.05), "Generator Output", "Mode Collapsed");
    } else if (res.epoch === 0) {
      // Pure Gaussian noise
      genGrid = renderPixelGrid(genX, () => prng(), "Generator Output", "Initial Noise");
    } else {
      // Progressive emergence of realistic digit
      const progress = res.epoch / 400;
      genGrid = renderPixelGrid(genX, (r, c) => {
        const orig = DIGIT_7_PIXELS[r * 8 + c];
        const noise = (prng() - 0.5) * (1.0 - progress) * 1.5;
        return Math.max(0, Math.min(1, orig * progress + noise));
      }, "Generator G(z)", `FID: ~${res.fidEstimate.toFixed(0)}`);
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="gan-workbench-svg" role="img" aria-label="GAN Minimax Losses and Generator Samples">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Minimax Loss Graph -->
        <g>
          <rect x="${graphX}" y="${graphY}" width="${graphWidth}" height="${graphHeight}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="3"/>
          <text x="${graphX + graphWidth / 2}" y="${graphY - 8}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Minimax Loss Dynamics</text>
          
          <!-- Ideal Equilibrium Reference Line (ln 2 = 0.693) -->
          <line x1="${graphX}" y1="${graphY + graphHeight * 0.6}" x2="${graphX + graphWidth}" y2="${graphY + graphHeight * 0.6}" stroke="#8c959f" stroke-dasharray="3,3" stroke-width="1"/>
          <text x="${graphX + graphWidth - 4}" y="${graphY + graphHeight * 0.6 - 3}" text-anchor="end" fill="#656d76" font-size="7">Nash Eq (0.693)</text>
          
          <!-- D_loss curve -->
          <path d="M ${graphX} ${graphY + graphHeight * 0.6} Q ${graphX + 80} ${graphY + graphHeight * 0.4} ${graphX + graphWidth} ${graphY + graphHeight * (res.status.includes('Vanishing') ? 0.95 : 0.55)}" fill="none" stroke="#0969da" stroke-width="2"/>
          
          <!-- G_loss curve -->
          <path d="M ${graphX} ${graphY + graphHeight * 0.6} Q ${graphX + 80} ${graphY + graphHeight * 0.25} ${graphX + graphWidth} ${graphY + graphHeight * (res.status.includes('Vanishing') ? 0.1 : 0.4)}" fill="none" stroke="#1f883d" stroke-width="2"/>
          
          <!-- Current Epoch Marker -->
          <line x1="${epochX}" y1="${graphY}" x2="${epochX}" y2="${graphY + graphHeight}" stroke="#cf222e" stroke-width="1.5"/>
          <circle cx="${epochX}" cy="${graphY + graphHeight * 0.5}" r="3" fill="#cf222e"/>
          
          <!-- Legend -->
          <circle cx="${graphX + 15}" cy="${graphY + 12}" r="3" fill="#0969da"/>
          <text x="${graphX + 22}" y="${graphY + 15}" fill="#0969da" font-size="8" font-weight="bold">D Loss</text>
          <circle cx="${graphX + 70}" cy="${graphY + 12}" r="3" fill="#1f883d"/>
          <text x="${graphX + 77}" y="${graphY + 15}" fill="#1f883d" font-size="8" font-weight="bold">G Loss</text>
        </g>

        <!-- Right Side Samples -->
        ${realGrid}
        ${genGrid}
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateGAN(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const dLossElem = root.querySelector("[data-metric='dloss']");
    if (dLossElem) dLossElem.textContent = res.dLoss.toFixed(3);

    const gLossElem = root.querySelector("[data-metric='gloss']");
    if (gLossElem) gLossElem.textContent = res.gLoss.toFixed(3);

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = `${res.dAccuracy.toFixed(1)}%`;

    const fidElem = root.querySelector("[data-metric='fid']");
    if (fidElem) fidElem.textContent = `~${res.fidEstimate.toFixed(0)}`;

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
        <div data-gan-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Status:</span> <strong data-metric="status">Equilibrium</strong></div>
            <div class="metric-card"><span class="label">D-Loss:</span> <strong data-metric="dloss">0.600</strong></div>
            <div class="metric-card"><span class="label">G-Loss:</span> <strong data-metric="gloss">1.200</strong></div>
            <div class="metric-card"><span class="label">D-Accuracy:</span> <strong data-metric="accuracy">52.0%</strong></div>
            <div class="metric-card"><span class="label">FID Estimate:</span> <strong data-metric="fid">~25</strong></div>
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
      if (!spec) return "Interactive GAN minimax generator-discriminator training simulator.";
      const res = evaluateGAN(state, spec?.challenge?.success);
      return `GAN model at epoch ${res.epoch}/400 with ${res.activation} and BatchNorm ${res.batchNorm}. D-loss: ${res.dLoss.toFixed(3)}, G-loss: ${res.gLoss.toFixed(3)}, D-accuracy: ${res.dAccuracy.toFixed(1)}%. Status: ${res.status}. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
