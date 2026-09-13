// ModelOptimizationLab: Interactive simulation of Model Optimization Techniques
// Models weight initialization (He vs Glorot vs Random), learning rate scheduling,
// Batch Normalization, tfmot weight pruning (sparsity 0-75%), and TFLite INT8 quantization.

export function evaluateModelOptimization(state = {}, challenge = {}) {
  const initMethod = state.init_method || "he_normal";
  const lrSchedule = state.lr_schedule || "exponential_decay";
  const batchNorm = state.batch_norm || "enabled";
  const sparsity = Math.max(0, Math.min(75, parseInt(state.pruning_sparsity ?? 50, 10)));
  const quantization = state.quantization || "int8_tflite";

  // Base Accuracy modeling
  let acc = 96.5;
  if (initMethod === "he_normal") acc += 1.6;
  else if (initMethod === "glorot_uniform") acc += 0.8;
  else if (initMethod === "random_normal") acc -= 12.0; // Vanishing/exploding activations

  if (batchNorm === "enabled") acc += 0.6;
  else acc -= 0.8;

  if (lrSchedule === "exponential_decay") acc += 0.4;

  // Pruning penalty
  if (sparsity === 25) acc -= 0.1;
  else if (sparsity === 50) acc -= 0.35;
  else if (sparsity === 75) acc -= 1.4;

  // Quantization penalty & size/latency factor
  let quantAccDelta = 0.0;
  let bytesPerParam = 4.0; // float32
  let latencyMultiplier = 1.0;

  if (quantization === "fp16") {
    quantAccDelta = -0.05;
    bytesPerParam = 2.0;
    latencyMultiplier = 0.58;
  } else if (quantization === "int8_tflite") {
    quantAccDelta = -0.25;
    bytesPerParam = 1.0;
    latencyMultiplier = 0.25;
  }

  acc += quantAccDelta;
  const validationAccuracy = Math.max(70.0, Math.min(99.0, Number(acc.toFixed(2))));

  // Model size and latency
  const totalParameters = 101770; // 784 * 128 + 128 + 128 * 10 + 10
  const nonZeroRatio = (100 - sparsity) / 100;
  
  // Uncompressed baseline is ~4.07 MB (32-bit floats)
  const baseSizeMb = (totalParameters * 4) / (1024 * 1024) * 10; // scaled realistic container overhead ~4.1 MB
  const rawSizeMb = (totalParameters * bytesPerParam) / (1024 * 1024) * 10;
  // With sparse zip compression, zeroed parameters compress by ~80%
  const compressedSizeMb = Number((rawSizeMb * (1 - 0.75 * (sparsity / 100))).toFixed(2));

  const baselineLatencyMs = 18.5;
  const inferenceLatencyMs = Number((baselineLatencyMs * latencyMultiplier * (1 - 0.25 * (sparsity / 100))).toFixed(1));

  const compressionRatio = Number((baseSizeMb / compressedSizeMb).toFixed(1));
  const speedupRatio = Number((baselineLatencyMs / inferenceLatencyMs).toFixed(1));

  let status = "Balanced Optimization";
  let diagnosis = "";

  if (initMethod === "random_normal") {
    status = "Degraded (Initialization Instability)";
    diagnosis = "Severe: Unscaled random normal initialization leads to vanishing activations in deep ReLU networks. HeNormal is required to maintain variance 2/n_in.";
  } else if (sparsity >= 75) {
    status = "Aggressive Pruning (Accuracy Drop)";
    diagnosis = "Suboptimal: 75% weight sparsity exceeds the model's redundancy capacity, inducing a measurable drop in validation accuracy.";
  } else if (quantization === "int8_tflite" && sparsity === 50 && initMethod === "he_normal") {
    status = "Optimal Edge Deployment";
    diagnosis = "Optimal: Combining HeNormal initialization, 50% polynomial pruning, and INT8 quantization delivers ~7x compression and ~4.7x speedup with less than 0.6% accuracy change.";
  } else {
    status = "Partially Optimized";
    diagnosis = "Standard optimization pipeline active. Further compression possible via INT8 TFLite quantization or structured pruning.";
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Optimization: ${initMethod}, ${lrSchedule}, BN=${batchNorm}, Pruning=${sparsity}%, Quant=${quantization}. Val Acc: ${validationAccuracy}%, Model Size: ${compressedSizeMb} MB (${compressionRatio}x compression), Latency: ${inferenceLatencyMs} ms (${speedupRatio}x speedup). Status: ${status}.`;

  return {
    initMethod,
    lrSchedule,
    batchNorm,
    sparsity,
    quantization,
    validationAccuracy,
    compressedSizeMb,
    inferenceLatencyMs,
    compressionRatio,
    speedupRatio,
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
    const width = 560, height = 210;

    // Left Panel: Comparison Bar Chart (Baseline vs Optimized)
    const barX = 25, barY = 35, barW = 250, barH = 145;

    // Baseline values: Size = 4.1 MB, Latency = 18.5 ms, Sparsity = 0%
    const baseSize = 4.1;
    const baseLatency = 18.5;

    const sizeBarW = (res.compressedSizeMb / baseSize) * 80;
    const latBarW = (res.inferenceLatencyMs / baseLatency) * 80;
    const sparseBarW = (res.sparsity / 100) * 80;

    // Right Panel: Pruned Weight Distribution & Quantization Grids
    const distX = 300, distY = 35, distW = 235, distH = 145;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="model-opt-svg" role="img" aria-label="Model Optimization Metrics and Pruning Distribution" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Trade-off Metrics Comparison -->
        <g>
          <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${barX + barW / 2}" y="${barY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Compression & Speedup Benchmarks</text>
          
          <!-- Metric 1: Model Size -->
          <text x="${barX + 12}" y="${barY + 25}" font-size="8" font-weight="bold" fill="#24292f">Model Size:</text>
          <rect x="${barX + 85}" y="${barY + 16}" width="80" height="12" rx="2" fill="#eaeef2"/>
          <rect x="${barX + 85}" y="${barY + 16}" width="${Math.max(4, sizeBarW)}" height="12" rx="2" fill="#0969da"/>
          <text x="${barX + 175}" y="${barY + 25}" font-size="8" fill="#57606a">${res.compressedSizeMb} MB (${res.compressionRatio}x)</text>

          <!-- Metric 2: Inference Latency -->
          <text x="${barX + 12}" y="${barY + 58}" font-size="8" font-weight="bold" fill="#24292f">Latency:</text>
          <rect x="${barX + 85}" y="${barY + 49}" width="80" height="12" rx="2" fill="#eaeef2"/>
          <rect x="${barX + 85}" y="${barY + 49}" width="${Math.max(4, latBarW)}" height="12" rx="2" fill="#1a7f37"/>
          <text x="${barX + 175}" y="${barY + 58}" font-size="8" fill="#57606a">${res.inferenceLatencyMs} ms (${res.speedupRatio}x)</text>

          <!-- Metric 3: Weight Sparsity -->
          <text x="${barX + 12}" y="${barY + 91}" font-size="8" font-weight="bold" fill="#24292f">Sparsity:</text>
          <rect x="${barX + 85}" y="${barY + 82}" width="80" height="12" rx="2" fill="#eaeef2"/>
          <rect x="${barX + 85}" y="${barY + 82}" width="${Math.max(2, sparseBarW)}" height="12" rx="2" fill="#8250df"/>
          <text x="${barX + 175}" y="${barY + 91}" font-size="8" fill="#57606a">${res.sparsity}% zeroed</text>

          <!-- Metric 4: Validation Accuracy -->
          <text x="${barX + 12}" y="${barY + 124}" font-size="8" font-weight="bold" fill="#24292f">Val Accuracy:</text>
          <rect x="${barX + 85}" y="${barY + 115}" width="80" height="12" rx="2" fill="#eaeef2"/>
          <rect x="${barX + 85}" y="${barY + 115}" width="${Math.max(4, (res.validationAccuracy / 100) * 80)}" height="12" rx="2" fill="${res.validationAccuracy > 96 ? '#1a7f37' : '#cf222e'}"/>
          <text x="${barX + 175}" y="${barY + 124}" font-size="8" font-weight="bold" fill="${res.validationAccuracy > 96 ? '#1a7f37' : '#cf222e'}">${res.validationAccuracy}%</text>
        </g>

        <!-- Right: Weight Pruning & Quantization Inspector -->
        <g>
          <rect x="${distX}" y="${distY}" width="${distW}" height="${distH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${distX + distW / 2}" y="${distY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Weight Sparsity & Quantization Bins</text>
          
          <!-- Gaussian Weight Bell Curve -->
          <path d="M ${distX + 20} ${distY + 95} Q ${distX + distW / 2} ${distY + 15} ${distX + distW - 20} ${distY + 95}" fill="none" stroke="#54aeff" stroke-width="2"/>
          
          <!-- Pruned Zero Band in Center -->
          ${res.sparsity > 0 ? `
            <rect x="${distX + distW / 2 - (res.sparsity / 100) * 45}" y="${distY + 25}" width="${(res.sparsity / 100) * 90}" height="70" fill="rgba(207, 34, 46, 0.15)" stroke="#cf222e" stroke-dasharray="2,2"/>
            <text x="${distX + distW / 2}" y="${distY + 65}" text-anchor="middle" fill="#cf222e" font-size="8" font-weight="bold">Pruned to Zero (${res.sparsity}%)</text>
          ` : ""}

          <!-- Quantization levels indicator -->
          <line x1="${distX + 20}" y1="${distY + 95}" x2="${distX + distW - 20}" y2="${distY + 95}" stroke="#8c959f" stroke-width="1.5"/>
          <text x="${distX + 25}" y="${distY + 115}" font-size="7" fill="#57606a">Quant Format:</text>
          <text x="${distX + 85}" y="${distY + 115}" font-size="7" font-weight="bold" fill="#0969da">${res.quantization.toUpperCase()}</text>
          <text x="${distX + 25}" y="${distY + 130}" font-size="7" fill="#57606a">Weight Init:</text>
          <text x="${distX + 85}" y="${distY + 130}" font-size="7" font-weight="bold" fill="#24292f">${res.initMethod} (BN: ${res.batchNorm})</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateModelOptimization(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const sizeElem = root.querySelector("[data-metric='model-size']");
    if (sizeElem) sizeElem.textContent = `${res.compressedSizeMb} MB (${res.compressionRatio}x)`;

    const latElem = root.querySelector("[data-metric='latency']");
    if (latElem) latElem.textContent = `${res.inferenceLatencyMs} ms (${res.speedupRatio}x)`;

    const accElem = root.querySelector("[data-metric='val-acc']");
    if (accElem) accElem.textContent = `${res.validationAccuracy}%`;

    const statusElem = root.querySelector("[data-metric='status']");
    if (statusElem) statusElem.textContent = res.status;

    const diagElem = root.querySelector("[data-metric='diagnosis']");
    if (diagElem) diagElem.textContent = res.diagnosis;

    const challengeElem = root.querySelector("[data-testid='challenge-status']");
    if (challengeElem && spec?.challenge) {
      challengeElem.textContent = res.challengeComplete
        ? `Challenge complete: ${spec.challenge.prompt}`
        : `Challenge in progress: ${spec.challenge.prompt}`;
      challengeElem.dataset.success = String(res.challengeComplete);
    }
  }

  function notifyChange() {
    if (root && typeof root.dispatchEvent === "function") {
      try {
        const evt = typeof Event === "function"
          ? new Event("change", { bubbles: true })
          : { type: "change", bubbles: true };
        root.dispatchEvent(evt);
      } catch (_) {}
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
        <div data-model-opt-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Status:</span> <strong data-metric="status">Optimal Edge</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Model Size:</span> <strong data-metric="model-size">0.55 MB</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Latency:</span> <strong data-metric="latency">3.9 ms</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Val Accuracy:</span> <strong data-metric="val-acc">98.1%</strong></div>
          </div>
          ${spec.presets && spec.presets.length > 0 ? `
            <div class="presets-row" style="display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; max-width: 100%; box-sizing: border-box;">
              ${spec.presets.map(p => `
                <button type="button" class="preset-btn" data-preset-id="${p.id}" style="min-height: 36px; padding: 8px 12px; color: var(--ink); background: var(--surface); border: 1px solid var(--line); font-size: 10px; font-weight: 600; cursor: pointer; max-width: 100%; white-space: normal; text-align: center;">
                  ${p.label}
                </button>
              `).join("")}
            </div>
          ` : ""}
          <div data-chart-container class="chart-wrapper" style="min-width: 0; max-width: 100%; box-sizing: border-box; overflow-x: auto;"></div>
          <div style="margin-top: 8px; padding: 10px 12px; background: #f6f8fa; border: 1px solid var(--line, #d0d7de); border-radius: 4px; font-size: 11px; line-height: 1.5; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
            <strong>Optimization Diagnosis:</strong> <span data-metric="diagnosis"></span>
          </div>
          <div class="controls-panel" style="margin-top: 8px; min-width: 0; max-width: 100%; box-sizing: border-box;">
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
          <div class="simulation-disclosure" data-simulation-disclosure style="margin-top: 8px; padding: 6px 10px; background: #fff8c5; border: 1px solid #d4a72c; border-radius: 4px; font-size: 9.5px; color: #744500; line-height: 1.4; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
            <strong>Notice:</strong> Illustrative simulation — no network is trained and values are not measured benchmarks.
          </div>
          ${spec.challenge ? `
            <div class="challenge-status" data-testid="challenge-status" style="margin-top: 8px; padding: 12px 14px; background: #eef1ec; border-left: 3px solid var(--accent); font-size: 10px; line-height: 1.6; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
              Challenge in progress: ${spec.challenge.prompt}
            </div>
          ` : ""}
        </div>
      `;

      root.querySelectorAll("[data-control]").forEach(input => {
        const handler = (e) => {
          state[e.target.dataset.control] = e.target.value;
          updateView();
        };
        input.addEventListener("input", handler);
        input.addEventListener("change", handler);
      });

      root.querySelectorAll("[data-preset-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const presetId = btn.dataset.presetId;
          const preset = spec.presets.find(p => p.id === presetId);
          if (preset?.values) {
            applyControls(preset.values);
            notifyChange();
          }
        });
      });

      updateView();
    },
    update(candidate = {}) {
      applyControls(candidate);
      notifyChange();
    },
    reset() {
      if (!spec) return;
      for (const ctrl of spec.controls) {
        state[ctrl.id] = ctrl.default;
        const input = root?.querySelector(`[data-control="${ctrl.id}"]`);
        if (input) input.value = ctrl.default;
      }
      updateView();
      notifyChange();
    },
    getAccessibleSummary() {
      if (!spec) return "Interactive Model Optimization Simulator.";
      const res = evaluateModelOptimization(state, spec?.challenge?.success);
      return `Model optimization simulation: ${res.initMethod} init, BN ${res.batchNorm}, Pruning ${res.sparsity}%, Quantization ${res.quantization}. Size: ${res.compressedSizeMb} MB (${res.compressionRatio}x compression), Latency: ${res.inferenceLatencyMs} ms, Validation accuracy: ${res.validationAccuracy}%. Status: ${res.status}.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
