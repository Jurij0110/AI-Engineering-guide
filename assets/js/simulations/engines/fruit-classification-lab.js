// FruitClassificationLab: Interactive simulation of transfer learning for 24-class fruit classification.
// Models pre-trained VGG16 feature extraction vs fine-tuning (unfreezing last 5 layers),
// data augmentation pipeline, learning rate dynamics, and top-3 class prediction distributions.

export function evaluateFruitClassification(state = {}, challenge = {}) {
  const stage = state.training_stage || "feature_extraction"; // feature_extraction | fine_tuning | from_scratch
  const augmentation = state.data_augmentation || "enabled";
  const learningRate = Number(state.learning_rate ?? 0.001);
  const epochs = Math.max(1, Math.min(10, parseInt(state.epochs ?? 5, 10)));
  const unfrozenLayers = Math.max(0, Math.min(19, parseInt(state.unfrozen_layers ?? (stage === "fine_tuning" ? 5 : (stage === "from_scratch" ? 19 : 0)), 10)));

  // Architecture parameters (VGG16 backbone + GlobalAveragePooling2D + Dense 256 + BatchNorm + Dropout + Dense 24)
  const baseParams = 14714688;
  const headParams = (512 * 256 + 256) + (256 * 4) + (256 * 24 + 24); // 131,328 + 1,024 + 6,168 = 138,520
  const totalParams = baseParams + headParams;

  let trainableParams = 0;
  let frozenParams = 0;

  if (stage === "from_scratch" || unfrozenLayers >= 19) {
    trainableParams = totalParams;
    frozenParams = 0;
  } else if (stage === "fine_tuning" || unfrozenLayers > 0) {
    // VGG16 Block 5 convolutions (3 conv layers of 512 filters: 3 * (3*3*512*512 + 512) = 7,079,424 params)
    const block5Params = 7079424;
    const unfrozenBase = unfrozenLayers === 5
      ? block5Params
      : Math.min(baseParams, Math.round(baseParams * (unfrozenLayers / 19)));
    trainableParams = unfrozenBase + headParams;
    frozenParams = totalParams - trainableParams;
  } else {
    // feature_extraction (base completely frozen)
    trainableParams = headParams;
    frozenParams = baseParams;
  }

  // Model convergence and accuracy modeling
  let isCatastrophic = false;
  let status = "Converging";
  let diagnosis = "";

  const isAugmented = augmentation === "enabled";
  const augBonus = isAugmented ? 0.06 : -0.05;
  const overfitGap = isAugmented ? 0.04 : 0.18;

  let baseValAcc = 0.65;
  let baseTestAcc = 0.66;
  let baseValLoss = 1.10;

  if (stage === "feature_extraction") {
    // Stage 1: Frozen VGG16 base
    const progress = Math.min(1.0, epochs / 5);
    baseValAcc = 0.26 + (0.64 - 0.26) * progress + augBonus;
    baseTestAcc = baseValAcc + 0.02;
    baseValLoss = Math.max(0.95, 2.68 - (2.68 - 1.10) * progress);
    status = "Feature Extraction (Head Only)";
  } else if (stage === "fine_tuning") {
    if (learningRate >= 0.001) {
      // High learning rate in fine tuning destroys pretrained weights
      isCatastrophic = true;
      baseValAcc = 0.42;
      baseTestAcc = 0.40;
      baseValLoss = 2.45;
      status = "Catastrophic Forgetting";
    } else {
      // Optimal fine tuning with lr <= 1e-4 (ideally 1e-5)
      const progress = Math.min(1.0, epochs / 5);
      baseValAcc = 0.67 + (0.81 - 0.67) * progress + augBonus;
      baseTestAcc = Math.min(0.86, baseValAcc + 0.02);
      baseValLoss = Math.max(0.58, 1.05 - (1.05 - 0.64) * progress);
      status = "Fine-Tuning (Last 5 Layers)";
    }
  } else {
    // from_scratch
    const progress = Math.min(1.0, epochs / 5);
    baseValAcc = 0.15 + (0.45 - 0.15) * progress + augBonus;
    baseTestAcc = baseValAcc - 0.04;
    baseValLoss = Math.max(1.85, 3.80 - 1.5 * progress);
    status = "Training from Scratch (Cold Init)";
  }

  const valAccuracy = Math.min(0.95, Math.max(0.10, Number(baseValAcc.toFixed(3))));
  const testAccuracy = Math.min(0.95, Math.max(0.08, Number(baseTestAcc.toFixed(3))));
  const trainAccuracy = Math.min(0.99, Number((valAccuracy + overfitGap).toFixed(3)));

  if (stage === "feature_extraction") {
    diagnosis = `Feature Extraction: VGG16 base is frozen (${(frozenParams / 1e6).toFixed(1)}M params). Training custom dense head (256 units, Dropout 0.3, 24 softmax classes). ${isAugmented ? "Data augmentation suppresses overfitting on illustrative 64x64 fruit samples." : "No data augmentation causes noticeable validation gap."}`;
  } else if (stage === "fine_tuning") {
    if (isCatastrophic) {
      diagnosis = "Warning: Learning rate is too high (>=1e-3) for fine-tuning! Drastic gradient updates destroyed pre-trained VGG16 convolution feature detectors.";
    } else {
      diagnosis = `Fine-Tuning: Last ${unfrozenLayers} base layers of VGG16 unfrozen with reduced learning rate (${learningRate}). Model adapts deep receptive filters to fruit contours, approaching modeled ${(testAccuracy * 100).toFixed(0)}% test accuracy across 24 fruit categories.`;
    }
  } else {
    diagnosis = "Training from scratch: 14.8M parameters initialized randomly. Without ImageNet pre-training, convergence on small 64x64 resolution images is sluggish and prone to severe overfitting.";
  }
  const valLoss = Number(baseValLoss.toFixed(3));
  const trainLoss = Number((valLoss * 0.75).toFixed(3));

  // Top-3 confidence modeling for sample fruit ("Granny Smith Apple", True class: Apple)
  let top1Class = "Apple (Granny Smith)";
  let top1Prob = Math.min(0.96, Math.max(0.35, Number((testAccuracy * 1.05).toFixed(2))));
  let top2Class = "Peach";
  let top2Prob = Number(((1 - top1Prob) * 0.65).toFixed(2));
  let top3Class = "Golden Delicious Apple";
  let top3Prob = Number((1 - top1Prob - top2Prob).toFixed(2));

  if (isCatastrophic) {
    top1Class = "Unknown / Mixed";
    top1Prob = 0.28;
    top2Class = "Peach";
    top2Prob = 0.24;
    top3Class = "Orange";
    top3Prob = 0.19;
  }

  // Challenge check
  const targetStage = challenge.training_stage || "fine_tuning";
  const targetAug = challenge.data_augmentation || "enabled";
  const minAccuracy = challenge.min_accuracy ?? 0.75;

  const challengeComplete =
    stage === targetStage &&
    augmentation === targetAug &&
    testAccuracy >= minAccuracy &&
    !isCatastrophic;

  return {
    stage,
    augmentation,
    learningRate,
    epochs,
    unfrozenLayers,
    totalParams,
    trainableParams,
    frozenParams,
    trainAccuracy,
    valAccuracy,
    testAccuracy,
    trainLoss,
    valLoss,
    isCatastrophic,
    status,
    diagnosis,
    top1Class,
    top1Prob,
    top2Class,
    top2Prob,
    top3Class,
    top3Prob,
    challengeComplete
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderSVG(res) {
    // 2-panel chart: Left = Accuracy/Loss training curves, Right = Top-3 Fruit Predictions
    const w = 540;
    const h = 180;

    // Progress bar for test accuracy
    const accPercent = Math.round(res.testAccuracy * 100);
    const accBarW = Math.round(180 * res.testAccuracy);

    // Color theme
    const strokeColor = res.isCatastrophic ? "#cf222e" : (res.testAccuracy >= 0.75 ? "#1a7f37" : "#0969da");

    return `
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width: 100%; max-width: 100%; height: auto; display: block;" role="img" aria-label="Fruit Classification Transfer Learning Curves and Predictions">
        <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff" stroke="#d0d7de" stroke-width="1" rx="6" />

        <!-- Left Panel: Learning Curves & Accuracy -->
        <text x="14" y="20" font-size="11" font-weight="bold" fill="#24292f">VGG16 Fruit Classifier Training & Generalization</text>
        <line x1="14" y1="26" x2="260" y2="26" stroke="#e1e4e8" stroke-width="1" />

        <!-- Metrics Bars -->
        <text x="14" y="44" font-size="10" fill="#57606a">Test Set Accuracy (24 Classes):</text>
        <rect x="14" y="50" width="180" height="14" fill="#f6f8fa" stroke="#d0d7de" rx="3" />
        <rect x="14" y="50" width="${accBarW}" height="14" fill="${strokeColor}" rx="3" />
        <text x="200" y="62" font-size="10" font-weight="bold" fill="#24292f">${accPercent}%</text>

        <text x="14" y="80" font-size="9.5" fill="#57606a">Validation Loss: <tspan font-weight="bold" fill="#24292f">${res.valLoss}</tspan> | Train Loss: <tspan font-weight="bold" fill="#24292f">${res.trainLoss}</tspan></text>
        <text x="14" y="96" font-size="9.5" fill="#57606a">Validation Acc: <tspan font-weight="bold" fill="#24292f">${(res.valAccuracy * 100).toFixed(1)}%</tspan> | Train Acc: <tspan font-weight="bold" fill="#24292f">${(res.trainAccuracy * 100).toFixed(1)}%</tspan></text>

        <!-- Parameter Breakdown -->
        <text x="14" y="118" font-size="10" font-weight="bold" fill="#24292f">VGG16 Parameter Partition:</text>
        <rect x="14" y="124" width="240" height="10" fill="#eaeef2" rx="2" />
        <rect x="14" y="124" width="${Math.round(240 * (res.trainableParams / res.totalParams))}" height="10" fill="#0969da" rx="2" />
        <text x="14" y="146" font-size="9" fill="#57606a">Trainable: <tspan font-weight="bold" fill="#0969da">${(res.trainableParams / 1e6).toFixed(2)}M</tspan> | Frozen: <tspan font-weight="bold" fill="#57606a">${(res.frozenParams / 1e6).toFixed(2)}M</tspan> (Total: 14.85M)</text>
        <text x="14" y="162" font-size="9" fill="#57606a">Resolution: 64x64x3 | Augmentation: <tspan font-weight="bold" fill="#24292f">${res.augmentation}</tspan></text>

        <!-- Divider -->
        <line x1="275" y1="12" x2="275" y2="168" stroke="#e1e4e8" stroke-width="1" />

        <!-- Right Panel: Inference Confidence Distribution -->
        <text x="290" y="20" font-size="11" font-weight="bold" fill="#24292f">Test Sample: "Granny Smith Apple" Confidence</text>
        <line x1="290" y1="26" x2="526" y2="26" stroke="#e1e4e8" stroke-width="1" />

        <!-- Top-1 -->
        <text x="290" y="46" font-size="9.5" fill="#24292f">1. ${res.top1Class}:</text>
        <rect x="290" y="52" width="160" height="12" fill="#f6f8fa" stroke="#d0d7de" rx="2" />
        <rect x="290" y="52" width="${Math.round(160 * res.top1Prob)}" height="12" fill="#1a7f37" rx="2" />
        <text x="456" y="62" font-size="9.5" font-weight="bold" fill="#1a7f37">${Math.round(res.top1Prob * 100)}%</text>

        <!-- Top-2 -->
        <text x="290" y="78" font-size="9.5" fill="#24292f">2. ${res.top2Class}:</text>
        <rect x="290" y="84" width="160" height="12" fill="#f6f8fa" stroke="#d0d7de" rx="2" />
        <rect x="290" y="84" width="${Math.round(160 * res.top2Prob)}" height="12" fill="#6e7781" rx="2" />
        <text x="456" y="94" font-size="9.5" font-weight="bold" fill="#57606a">${Math.round(res.top2Prob * 100)}%</text>

        <!-- Top-3 -->
        <text x="290" y="110" font-size="9.5" fill="#24292f">3. ${res.top3Class}:</text>
        <rect x="290" y="116" width="160" height="12" fill="#f6f8fa" stroke="#d0d7de" rx="2" />
        <rect x="290" y="116" width="${Math.round(160 * res.top3Prob)}" height="12" fill="#8c959f" rx="2" />
        <text x="456" y="126" font-size="9.5" font-weight="bold" fill="#57606a">${Math.round(res.top3Prob * 100)}%</text>

        <!-- Status Indicator Box -->
        <rect x="290" y="136" width="236" height="28" fill="${res.isCatastrophic ? "#ffebe9" : (res.testAccuracy >= 0.75 ? "#dafbe1" : "#ddf4ff")}" stroke="${res.isCatastrophic ? "#ff8182" : (res.testAccuracy >= 0.75 ? "#82e596" : "#54aeff")}" rx="4" />
        <text x="296" y="153" font-size="9.5" font-weight="bold" fill="${res.isCatastrophic ? "#a40e26" : (res.testAccuracy >= 0.75 ? "#116329" : "#0550ae")}">${res.status}</text>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateFruitClassification(state, spec?.challenge?.success);

    const testAccElem = root.querySelector("[data-metric='test-acc']");
    if (testAccElem) testAccElem.textContent = `${(res.testAccuracy * 100).toFixed(1)}%`;

    const valLossElem = root.querySelector("[data-metric='val-loss']");
    if (valLossElem) valLossElem.textContent = res.valLoss.toFixed(2);

    const trainableElem = root.querySelector("[data-metric='trainable-params']");
    if (trainableElem) trainableElem.textContent = `${(res.trainableParams / 1e6).toFixed(2)}M`;

    const statusElem = root.querySelector("[data-metric='status']");
    if (statusElem) statusElem.textContent = res.status;

    const chartElem = root.querySelector("[data-chart-container]");
    if (chartElem) chartElem.innerHTML = renderSVG(res);

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
        <div data-fruit-classification-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Test Accuracy:</span> <strong data-metric="test-acc">66.0%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Validation Loss:</span> <strong data-metric="val-loss">1.10</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Trainable Params:</span> <strong data-metric="trainable-params">0.14M</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Pipeline Status:</span> <strong data-metric="status">Feature Extraction</strong></div>
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
            <strong>Transfer Learning Analysis:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Fruit Classification Transfer Learning Simulator.";
      const res = evaluateFruitClassification(state, spec?.challenge?.success);
      return `Fruit Classification Simulation: Stage ${res.stage}, Data augmentation ${res.augmentation}, LR ${res.learningRate}, Unfrozen layers ${res.unfrozenLayers}. Test accuracy: ${(res.testAccuracy * 100).toFixed(1)}%, Val loss: ${res.valLoss}, Trainable params: ${(res.trainableParams / 1e6).toFixed(2)}M. Status: ${res.status}. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
