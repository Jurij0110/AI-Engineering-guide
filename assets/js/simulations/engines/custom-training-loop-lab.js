// CustomTrainingLoopLab: Interactive simulation of Custom Training Loops in Keras
// Models GradientTape automatic differentiation, forward pass logits, loss calculation,
// optimizer.apply_gradients weight updates, SparseCategoricalAccuracy accumulators, and CustomCallback hooks.

export function evaluateCustomTrainingLoop(state = {}, challenge = {}) {
  const epoch = Math.max(1, Math.min(5, parseInt(state.epoch ?? 1, 10)));
  const step = Math.max(0, Math.min(1800, parseInt(state.step ?? 0, 10)));
  const optimizer = state.optimizer ?? "adam";
  const metricTracking = state.metric_tracking ?? "enabled";
  const callbackHook = state.callback_hook ?? "on_epoch_end";
  const batchSize = parseInt(state.batch_size ?? 32, 10);

  // Total steps across 5 epochs of 1,875 batches (60,000 / 32)
  const totalBatchesPerEpoch = Math.round(60000 / batchSize);
  const totalStepIndex = (epoch - 1) * totalBatchesPerEpoch + step;
  const maxSteps = 5 * totalBatchesPerEpoch;
  const progress = Math.min(1.0, totalStepIndex / maxSteps);

  // Optimizer convergence factor
  const optFactor = optimizer === "adam" ? 1.0 : 0.65;

  let lossValue;
  let accuracyValue;

  if (totalStepIndex === 0) {
    lossValue = 2.348;
    accuracyValue = 0.218;
  } else if (epoch === 1 && step <= 200) {
    const p = step / 200;
    lossValue = 2.348 * (1 - p) + 0.368 * p;
    accuracyValue = 0.218 * (1 - p) + 0.837 * p;
  } else if (epoch === 1) {
    const p = (step - 200) / (totalBatchesPerEpoch - 200);
    lossValue = 0.368 * Math.exp(-p * 0.8) + 0.05 * Math.sin(step * 0.02);
    accuracyValue = 0.837 + 0.086 * (1 - Math.exp(-p * 2.0));
  } else {
    // Epochs 2 - 5: Convergence modeled after lab outputs
    const epochBaseLoss = [0, 0.155, 0.091, 0.047, 0.028, 0.016][epoch];
    const epochBaseAcc = [0, 0.923, 0.964, 0.975, 0.982, 0.988][epoch];
    const stepProgress = step / totalBatchesPerEpoch;

    lossValue = epochBaseLoss * (1 - stepProgress * 0.45) * (1 / optFactor);
    accuracyValue = Math.min(0.995, epochBaseAcc + (0.992 - epochBaseAcc) * stepProgress * 0.5 * optFactor);
  }

  // Formatting metrics
  const displayLoss = Number(lossValue.toFixed(4));
  const displayAccuracy = metricTracking === "enabled" ? Number((accuracyValue * 100).toFixed(2)) : null;

  // Modeled gradient norm
  const gradNorm = (Math.max(0.012, 1.45 * Math.exp(-progress * 3.8))).toFixed(3);

  // Custom callback log
  let callbackLog = "None (Callback disabled)";
  if (callbackHook === "on_epoch_end") {
    const epochLoss = (lossValue * 0.85).toFixed(4);
    const epochAcc = (accuracyValue * 0.99).toFixed(4);
    callbackLog = `End of epoch ${epoch}, loss: ${epochLoss}, accuracy: ${epochAcc}`;
  }

  const tapeStatus = step === 0 && epoch === 1
    ? "Initialized (Initial forward pass)"
    : "Active (Forward tape -> tape.gradient -> apply_gradients)";

  const explanation = `Custom training loop at Epoch ${epoch}/5, Step ${step} (batch size: ${batchSize}, optimizer: ${optimizer.toUpperCase()}). Loss: ${displayLoss}, Accuracy: ${displayAccuracy !== null ? displayAccuracy + '%' : 'Disabled'}, Gradients L2 Norm: ${gradNorm}.`;

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  return {
    epoch,
    step,
    optimizer,
    metricTracking,
    callbackHook,
    batchSize,
    loss: displayLoss,
    accuracy: displayAccuracy,
    gradNorm,
    tapeStatus,
    callbackLog,
    explanation,
    challengeComplete
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderVisualSVG(res) {
    const width = 560, height = 210;

    // Left Chart: Loss & Accuracy Convergence
    const chartX = 20, chartY = 35, chartW = 230, chartH = 130;
    const progressX = chartX + ((res.epoch - 1) / 4 * 0.8 + (res.step / 1800) * 0.2) * chartW;

    // Right Flow: 4-Step Gradient Tape Cycle
    const flowX = 275, flowY = 35, flowW = 265, flowH = 155;

    return `
      <svg viewBox="0 0 ${width} ${height}" class="custom-loop-svg" role="img" aria-label="Custom Training Loop Architecture and Convergence" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left Panel: Loss & Metric Progression -->
        <g>
          <rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${chartX + chartW / 2}" y="${chartY - 8}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Step-by-Step Training Convergence</text>
          
          <!-- Grid lines -->
          <line x1="${chartX}" y1="${chartY + chartH * 0.25}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.25}" stroke="#f0f2f4"/>
          <line x1="${chartX}" y1="${chartY + chartH * 0.5}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.5}" stroke="#f0f2f4"/>
          <line x1="${chartX}" y1="${chartY + chartH * 0.75}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.75}" stroke="#f0f2f4"/>

          <!-- Loss Curve (decreasing) -->
          <path d="M ${chartX} ${chartY + 15} Q ${chartX + 25} ${chartY + 95} ${chartX + chartW} ${chartY + chartH - 12}" fill="none" stroke="#cf222e" stroke-width="2"/>
          
          <!-- Accuracy Curve (increasing) -->
          ${res.metricTracking === 'enabled' ? `
            <path d="M ${chartX} ${chartY + chartH - 25} Q ${chartX + 30} ${chartY + 30} ${chartX + chartW} ${chartY + 15}" fill="none" stroke="#1a7f37" stroke-width="2"/>
          ` : ""}

          <!-- Current Step Cursor -->
          <line x1="${progressX}" y1="${chartY}" x2="${progressX}" y2="${chartY + chartH}" stroke="#0969da" stroke-width="1.5" stroke-dasharray="2,2"/>
          <circle cx="${progressX}" cy="${chartY + Math.max(10, Math.min(chartH - 10, (res.loss / 2.5) * chartH))}" r="4" fill="#cf222e"/>

          <!-- Legend -->
          <circle cx="${chartX + 12}" cy="${chartY + chartH - 8}" r="3" fill="#cf222e"/>
          <text x="${chartX + 18}" y="${chartY + chartH - 5}" fill="#cf222e" font-size="7" font-weight="bold">Loss: ${res.loss}</text>
          ${res.metricTracking === 'enabled' ? `
            <circle cx="${chartX + 85}" cy="${chartY + chartH - 8}" r="3" fill="#1a7f37"/>
            <text x="${chartX + 91}" y="${chartY + chartH - 5}" fill="#1a7f37" font-size="7" font-weight="bold">Acc: ${res.accuracy}%</text>
          ` : ""}
          <text x="${chartX + chartW - 5}" y="${chartY + chartH - 5}" text-anchor="end" fill="#656d76" font-size="7">Ep ${res.epoch} St ${res.step}</text>
        </g>

        <!-- Right Panel: GradientTape Mechanics -->
        <g>
          <rect x="${flowX}" y="${flowY}" width="${flowW}" height="${flowH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${flowX + flowW / 2}" y="${flowY - 8}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">tf.GradientTape Execution Loop</text>
          
          <!-- Stage 1: Forward Pass inside Tape -->
          <rect x="${flowX + 10}" y="${flowY + 12}" width="${flowW - 20}" height="26" rx="3" fill="#ddf4ff" stroke="#54aeff"/>
          <text x="${flowX + 18}" y="${flowY + 28}" fill="#0969da" font-size="8" font-weight="bold">1. with tf.GradientTape() as tape:</text>
          <text x="${flowX + flowW - 16}" y="${flowY + 28}" text-anchor="end" fill="#0969da" font-size="7">logits = model(x_batch)</text>

          <!-- Stage 2: Loss Computation -->
          <rect x="${flowX + 10}" y="${flowY + 44}" width="${flowW - 20}" height="26" rx="3" fill="#fff8c5" stroke="#d4a72c"/>
          <text x="${flowX + 18}" y="${flowY + 60}" fill="#9a6700" font-size="8" font-weight="bold">2. loss_value = loss_fn(y_batch, logits)</text>
          <text x="${flowX + flowW - 16}" y="${flowY + 60}" text-anchor="end" fill="#9a6700" font-size="7">SparseCategoricalCE</text>

          <!-- Stage 3: tape.gradient -->
          <rect x="${flowX + 10}" y="${flowY + 76}" width="${flowW - 20}" height="26" rx="3" fill="#ffebe9" stroke="#ff8182"/>
          <text x="${flowX + 18}" y="${flowY + 92}" fill="#cf222e" font-size="8" font-weight="bold">3. grads = tape.gradient(loss, weights)</text>
          <text x="${flowX + flowW - 16}" y="${flowY + 92}" text-anchor="end" fill="#cf222e" font-size="7">||dL/dw||=${res.gradNorm}</text>

          <!-- Stage 4: optimizer.apply_gradients -->
          <rect x="${flowX + 10}" y="${flowY + 108}" width="${flowW - 20}" height="32" rx="3" fill="#dafbe1" stroke="#4ac26b"/>
          <text x="${flowX + 18}" y="${flowY + 122}" fill="#1a7f37" font-size="8" font-weight="bold">4. optimizer.apply_gradients(zip(grads, w))</text>
          <text x="${flowX + 18}" y="${flowY + 134}" fill="#656d76" font-size="7">Metric: ${res.metricTracking === 'enabled' ? 'accuracy.update_state()' : 'Skipped'} | Callback: ${res.callbackHook}</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateCustomTrainingLoop(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const epochElem = root.querySelector("[data-metric='epoch-step']");
    if (epochElem) epochElem.textContent = `Ep ${res.epoch} / St ${res.step}`;

    const lossElem = root.querySelector("[data-metric='loss']");
    if (lossElem) lossElem.textContent = res.loss.toFixed(4);

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = res.accuracy !== null ? `${res.accuracy.toFixed(1)}%` : "Disabled";

    const gradElem = root.querySelector("[data-metric='grad-norm']");
    if (gradElem) gradElem.textContent = res.gradNorm;

    const logElem = root.querySelector("[data-metric='callback-log']");
    if (logElem) logElem.textContent = res.callbackLog;

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
        <div data-custom-loop-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Progress:</span> <strong data-metric="epoch-step">Ep 1 / St 0</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Batch Loss:</span> <strong data-metric="loss">2.3480</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Metric Accuracy:</span> <strong data-metric="accuracy">21.8%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Gradient Norm:</span> <strong data-metric="grad-norm">1.450</strong></div>
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
          <div style="margin-top: 8px; padding: 10px 12px; background: #24292e; color: #f6f8fa; border-radius: 4px; font-family: monospace; font-size: 10px; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap;">
            <span style="color: #79c0ff;">[Callback stdout]</span> <span data-metric="callback-log">None (Callback disabled)</span>
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
      if (!spec) return "Interactive Custom Training Loop Simulator.";
      const res = evaluateCustomTrainingLoop(state, spec?.challenge?.success);
      return `Custom training loop at epoch ${res.epoch}, step ${res.step}. Batch loss: ${res.loss}, Metric accuracy: ${res.accuracy !== null ? res.accuracy + '%' : 'Disabled'}. Optimizer: ${res.optimizer}, Gradient norm: ${res.gradNorm}.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
