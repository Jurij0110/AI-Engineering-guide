// WasteClassificationLab: Interactive simulation of transfer learning for binary waste classification (Recyclable vs Organic).
// Models VGG16 feature extraction vs fine-tuning (unfreezing top block), data augmentation,
// confusion matrix dynamics, recyclable contamination rates, and decision threshold tuning.

export function evaluateWasteClassification(state = {}, challenge = {}) {
  const modelMode = state.model_mode || "feature_extraction"; // feature_extraction | fine_tuning | from_scratch
  const augmentation = state.data_augmentation || "enabled";
  const learningRate = Number(state.learning_rate ?? 0.0001);
  const epochs = Math.max(1, Math.min(10, parseInt(state.epochs ?? 10, 10)));
  const threshold = Math.max(0.3, Math.min(0.8, Number(state.decision_threshold ?? 0.5)));

  // Parameter calculation (VGG16 base 14,714,688 + Dense 512 + Dense 512 + Dense 1)
  const baseParams = 14714688;
  const headParams = (8192 * 512 + 512) + (512 * 512 + 512) + (512 * 1 + 1); // 4,194,816 + 262,656 + 513 = 4,457,985
  const totalParams = baseParams + headParams; // 19,172,673

  let trainableParams = 0;
  let frozenParams = 0;

  if (modelMode === "from_scratch") {
    trainableParams = totalParams;
    frozenParams = 0;
  } else if (modelMode === "fine_tuning") {
    // Block 5 unfrozen (~7,079,424 params)
    const unfrozenBase = 7079424;
    trainableParams = unfrozenBase + headParams;
    frozenParams = totalParams - trainableParams;
  } else {
    // feature_extraction: base frozen
    trainableParams = headParams;
    frozenParams = baseParams;
  }

  // Model convergence and performance
  const isAugmented = augmentation === "enabled";
  const augBonus = isAugmented ? 0.01 : -0.06;

  let baseAcc = 0.85;
  let baseLoss = 0.38;
  let status = "Feature Extractor";
  let diagnosis = "";

  if (modelMode === "feature_extraction") {
    const progress = Math.min(1.0, epochs / 10);
    baseAcc = 0.65 + (0.84 - 0.65) * progress + augBonus;
    baseLoss = Math.max(0.35, 0.65 - (0.65 - 0.38) * progress);
    status = "VGG16 Feature Extractor";
  } else if (modelMode === "fine_tuning") {
    if (learningRate > 0.0005) {
      baseAcc = 0.62;
      baseLoss = 0.75;
      status = "Suboptimal Convergence";
    } else {
      const progress = Math.min(1.0, epochs / 10);
      baseAcc = 0.72 + (0.90 - 0.72) * progress + augBonus;
      baseLoss = Math.max(0.24, 0.55 - (0.55 - 0.28) * progress);
      status = "Fine-Tuned VGG16 (Block 5)";
    }
  } else {
    // from_scratch
    const progress = Math.min(1.0, epochs / 10);
    baseAcc = 0.52 + (0.70 - 0.52) * progress + augBonus;
    baseLoss = Math.max(0.58, 1.20 - 0.5 * progress);
    status = "Trained From Scratch";
  }

  const testAccuracy = Math.min(0.96, Math.max(0.45, Number(baseAcc.toFixed(3))));
  const testLoss = Number(baseLoss.toFixed(3));

  if (modelMode === "feature_extraction") {
    diagnosis = `Feature Extraction: Pretrained VGG16 base frozen (14.7M params); custom dense classifier evaluated on illustrative 800-image training distribution. Reaches modeled ~${(testAccuracy * 100).toFixed(0)}% accuracy. ${isAugmented ? "Image augmentation suppresses overfitting." : "Absence of augmentation increases validation loss divergence."}`;
  } else if (modelMode === "fine_tuning") {
    if (learningRate > 0.0005) {
      diagnosis = "Warning: Learning rate is too aggressive for fine-tuning! Feature maps in Block 5 risk gradient destabilization without exponential decay.";
    } else {
      diagnosis = `Fine-Tuning: Block 5 convolutional filters adapted to industrial waste textures with step decay scheduler. Accurately discriminates wrinkled organic scraps from smooth recyclable plastics (modeled ~${(testAccuracy * 100).toFixed(0)}% test accuracy).`;
    }
  } else {
    diagnosis = "From Scratch: Untrained randomly initialized weights struggle without pre-training on the illustrative 800-sample set. High loss and severe sensitivity to background noise.";
  }

  // Confusion matrix modeling on 200 test images (100 Organic 'O', 100 Recyclable 'R')
  // Base capability:
  const nTotal = 200;
  const nOrganic = 100;
  const nRecyclable = 100;

  // Threshold effect: Higher threshold -> stricter on classifying as Recyclable (reduces False Recyclable, reduces contamination)
  const threshOffset = (threshold - 0.5) * 40; // e.g. at 0.65, +6 towards Organic

  let trueRecyclable = Math.round(nRecyclable * testAccuracy - threshOffset * 0.5);
  trueRecyclable = Math.max(20, Math.min(98, trueRecyclable));
  const falseOrganic = nRecyclable - trueRecyclable;

  let trueOrganic = Math.round(nOrganic * testAccuracy + threshOffset * 0.6);
  trueOrganic = Math.max(20, Math.min(98, trueOrganic));
  const falseRecyclable = nOrganic - trueOrganic;

  // Contamination rate: Organic waste mistakenly mixed into Recyclable stream
  const totalPredictedRecyclable = trueRecyclable + falseRecyclable;
  const contaminationRate = totalPredictedRecyclable > 0
    ? Number(((falseRecyclable / totalPredictedRecyclable) * 100).toFixed(1))
    : 0;

  // Precision and Recall for Recyclables
  const precisionRecyclable = totalPredictedRecyclable > 0
    ? Number((trueRecyclable / totalPredictedRecyclable).toFixed(3))
    : 0;
  const recallRecyclable = Number((trueRecyclable / nRecyclable).toFixed(3));

  // Challenge evaluation
  const targetMode = challenge.model_mode || "fine_tuning";
  const maxContamination = challenge.max_contamination ?? 12.0;
  const minAccuracy = challenge.min_accuracy ?? 0.85;

  const challengeComplete =
    modelMode === targetMode &&
    testAccuracy >= minAccuracy &&
    contaminationRate <= maxContamination;

  return {
    modelMode,
    augmentation,
    learningRate,
    epochs,
    threshold,
    totalParams,
    trainableParams,
    frozenParams,
    testAccuracy,
    testLoss,
    trueRecyclable,
    falseRecyclable,
    trueOrganic,
    falseOrganic,
    contaminationRate,
    precisionRecyclable,
    recallRecyclable,
    status,
    diagnosis,
    challengeComplete
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderSVG(res) {
    const w = 540;
    const h = 180;

    // Contamination alert color
    const contColor = res.contaminationRate <= 10.0 ? "#1a7f37" : (res.contaminationRate <= 18.0 ? "#9a6700" : "#cf222e");

    return `
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width: 100%; max-width: 100%; height: auto; display: block;" role="img" aria-label="Waste Classification Confusion Matrix and Contamination Metrics">
        <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff" stroke="#d0d7de" stroke-width="1" rx="6" />

        <!-- Left Panel: 2x2 Confusion Matrix Heatmap -->
        <text x="14" y="20" font-size="11" font-weight="bold" fill="#24292f">Illustrative Confusion Matrix (200 Test Samples)</text>
        <line x1="14" y1="26" x2="250" y2="26" stroke="#e1e4e8" stroke-width="1" />

        <!-- Matrix Header Labels -->
        <text x="96" y="40" font-size="9" font-weight="bold" fill="#57606a">Pred Organic (0)</text>
        <text x="180" y="40" font-size="9" font-weight="bold" fill="#57606a">Pred Recyclable (1)</text>

        <!-- Row 1: True Organic -->
        <text x="14" y="68" font-size="9" font-weight="bold" fill="#57606a">True 'O'</text>
        <!-- Cell True Organic (Correct) -->
        <rect x="80" y="48" width="85" height="38" fill="#dafbe1" stroke="#82e596" rx="3" />
        <text x="122" y="66" font-size="12" font-weight="bold" fill="#116329" text-anchor="middle">${res.trueOrganic}</text>
        <text x="122" y="78" font-size="7.5" fill="#1a7f37" text-anchor="middle">True Organic</text>

        <!-- Cell False Recyclable (Contamination!) -->
        <rect x="170" y="48" width="85" height="38" fill="#ffebe9" stroke="#ff8182" rx="3" />
        <text x="212" y="66" font-size="12" font-weight="bold" fill="#a40e26" text-anchor="middle">${res.falseRecyclable}</text>
        <text x="212" y="78" font-size="7.5" fill="#cf222e" text-anchor="middle">False Recyclable ⚠</text>

        <!-- Row 2: True Recyclable -->
        <text x="14" y="112" font-size="9" font-weight="bold" fill="#57606a">True 'R'</text>
        <!-- Cell False Organic -->
        <rect x="80" y="92" width="85" height="38" fill="#fff8c5" stroke="#d4a72c" rx="3" />
        <text x="122" y="110" font-size="12" font-weight="bold" fill="#744500" text-anchor="middle">${res.falseOrganic}</text>
        <text x="122" y="122" font-size="7.5" fill="#744500" text-anchor="middle">False Organic</text>

        <!-- Cell True Recyclable -->
        <rect x="170" y="92" width="85" height="38" fill="#dafbe1" stroke="#82e596" rx="3" />
        <text x="212" y="110" font-size="12" font-weight="bold" fill="#116329" text-anchor="middle">${res.trueRecyclable}</text>
        <text x="212" y="122" font-size="7.5" fill="#1a7f37" text-anchor="middle">True Recyclable</text>

        <!-- Summary under matrix -->
        <text x="14" y="150" font-size="9" fill="#57606a">Decision Threshold (τ): <tspan font-weight="bold" fill="#24292f">${res.threshold.toFixed(2)}</tspan></text>
        <text x="14" y="164" font-size="9" fill="#57606a">Params: <tspan font-weight="bold" fill="#0969da">${(res.trainableParams / 1e6).toFixed(2)}M trainable</tspan> of ${(res.totalParams / 1e6).toFixed(1)}M</text>

        <!-- Vertical Divider -->
        <line x1="270" y1="12" x2="270" y2="168" stroke="#e1e4e8" stroke-width="1" />

        <!-- Right Panel: Industrial Sorting & Contamination Analysis -->
        <text x="285" y="20" font-size="11" font-weight="bold" fill="#24292f">EcoClean Facility Sorting Performance</text>
        <line x1="285" y1="26" x2="526" y2="26" stroke="#e1e4e8" stroke-width="1" />

        <!-- Recyclable Batch Contamination Metric -->
        <text x="285" y="44" font-size="10" font-weight="bold" fill="#24292f">Recycling Batch Contamination Rate:</text>
        <rect x="285" y="50" width="160" height="14" fill="#f6f8fa" stroke="#d0d7de" rx="3" />
        <rect x="285" y="50" width="${Math.round(160 * Math.min(1.0, res.contaminationRate / 50))}" height="14" fill="${contColor}" rx="3" />
        <text x="452" y="62" font-size="10" font-weight="bold" fill="${contColor}">${res.contaminationRate}%</text>

        <!-- Precision & Recall -->
        <text x="285" y="82" font-size="9.5" fill="#57606a">Recyclable Precision: <tspan font-weight="bold" fill="#24292f">${(res.precisionRecyclable * 100).toFixed(1)}%</tspan></text>
        <text x="285" y="98" font-size="9.5" fill="#57606a">Recyclable Recall: <tspan font-weight="bold" fill="#24292f">${(res.recallRecyclable * 100).toFixed(1)}%</tspan></text>
        <text x="285" y="114" font-size="9.5" fill="#57606a">Overall Accuracy: <tspan font-weight="bold" fill="#24292f">${(res.testAccuracy * 100).toFixed(1)}%</tspan> | Loss: <tspan font-weight="bold" fill="#24292f">${res.testLoss}</tspan></text>

        <!-- Status Card -->
        <rect x="285" y="128" width="240" height="38" fill="${res.contaminationRate <= 12.0 && res.testAccuracy >= 0.85 ? "#dafbe1" : "#fff8c5"}" stroke="${res.contaminationRate <= 12.0 && res.testAccuracy >= 0.85 ? "#82e596" : "#d4a72c"}" rx="4" />
        <text x="293" y="144" font-size="9.5" font-weight="bold" fill="${res.contaminationRate <= 12.0 && res.testAccuracy >= 0.85 ? "#116329" : "#744500"}">${res.status}</text>
        <text x="293" y="158" font-size="8.5" fill="#57606a">${res.contaminationRate <= 12.0 ? "Acceptable purity for automated baling facility." : "High contamination: organic waste degrades recycling lots."}</text>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateWasteClassification(state, spec?.challenge?.success);

    const testAccElem = root.querySelector("[data-metric='test-acc']");
    if (testAccElem) testAccElem.textContent = `${(res.testAccuracy * 100).toFixed(1)}%`;

    const contamElem = root.querySelector("[data-metric='contamination-rate']");
    if (contamElem) contamElem.textContent = `${res.contaminationRate}%`;

    const precisionElem = root.querySelector("[data-metric='precision']");
    if (precisionElem) precisionElem.textContent = `${(res.precisionRecyclable * 100).toFixed(1)}%`;

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
        <div data-waste-classification-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Test Accuracy:</span> <strong data-metric="test-acc">85.0%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Contamination Rate:</span> <strong data-metric="contamination-rate">15.0%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Recyclable Precision:</span> <strong data-metric="precision">85.0%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Sorting Status:</span> <strong data-metric="status">Feature Extractor</strong></div>
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
            <strong>Industrial Waste Sorting Diagnostic:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Waste Classification Transfer Learning Simulator.";
      const res = evaluateWasteClassification(state, spec?.challenge?.success);
      return `Waste Classification Simulation: Model mode ${res.modelMode}, Augmentation ${res.augmentation}, Threshold ${res.threshold}. Test accuracy: ${(res.testAccuracy * 100).toFixed(1)}%, Contamination rate: ${res.contaminationRate}%, Precision: ${(res.precisionRecyclable * 100).toFixed(1)}%, Recall: ${(res.recallRecyclable * 100).toFixed(1)}%. Status: ${res.status}. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
