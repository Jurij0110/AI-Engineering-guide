// TransferLearningLab: Pre-trained Backbone Freezing, Fine-Tuning & Generalization

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateTransferLearning(state, challenge = {}) {
  const backbone = state.backbone || "vgg16"; // vgg16 | resnet50
  const strategy = state.strategy || "feature_extractor"; // feature_extractor | fine_tuning | scratch
  const dataSize = state.dataSize || "small"; // small | medium | large
  const headUnits = Number(state.headUnits || 256);
  const optimizer = state.optimizer || "adam";
  const learningRate = Number(state.learningRate || 0.0001);

  const baseParams = backbone === "vgg16" ? 14714688 : 23587712;
  const headParams = (512 + 1) * headUnits + (headUnits + 1) * 2; // binary/2-class

  let trainableParams = 0;
  let frozenParams = 0;

  if (strategy === "feature_extractor") {
    frozenParams = baseParams;
    trainableParams = headParams;
  } else if (strategy === "fine_tuning") {
    const unfrozenBase = backbone === "vgg16" ? 7079424 : 4454912; // top 4 layers
    frozenParams = baseParams - unfrozenBase;
    trainableParams = unfrozenBase + headParams;
  } else {
    // scratch
    frozenParams = 0;
    trainableParams = baseParams + headParams;
  }

  // Model convergence and generalization modeling
  let trainAcc = 0.85;
  let valAcc = 0.82;
  let overfitRisk = "Low";

  if (strategy === "scratch") {
    if (dataSize === "small") {
      trainAcc = 0.98;
      valAcc = 0.54;
      overfitRisk = "Severe Overfitting (Backbone lacks data to generalize)";
    } else if (dataSize === "medium") {
      trainAcc = 0.91;
      valAcc = 0.76;
      overfitRisk = "Moderate Overfitting";
    } else {
      trainAcc = 0.94;
      valAcc = 0.91;
      overfitRisk = "Low";
    }
  } else if (strategy === "feature_extractor") {
    if (dataSize === "small") {
      trainAcc = 0.88;
      valAcc = 0.86;
      overfitRisk = "Minimal (Pretrained weights intact)";
    } else {
      trainAcc = 0.90;
      valAcc = 0.88;
      overfitRisk = "Minimal";
    }
  } else if (strategy === "fine_tuning") {
    if (learningRate >= 0.005) {
      trainAcc = 0.72;
      valAcc = 0.65;
      overfitRisk = "High (Catastrophic forgetting from excessive LR)";
    } else if (dataSize === "small" && learningRate > 0.0005) {
      trainAcc = 0.96;
      valAcc = 0.78;
      overfitRisk = "Moderate Overfitting (Fine-tuned top layers without enough data)";
    } else {
      // Optimal fine tuning with small LR
      trainAcc = 0.97;
      valAcc = 0.94;
      overfitRisk = "Low (Optimal transfer learning performance)";
    }
  }

  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  let explanation = `With ${backbone.toUpperCase()} using ${strategy.replace("_", " ")} on ${dataSize} dataset (LR=${learningRate}): Train Acc=${(trainAcc * 100).toFixed(1)}%, Val Acc=${(valAcc * 100).toFixed(1)}%. ${overfitRisk}.`;

  return {
    valid: true,
    backbone,
    strategy,
    dataSize,
    trainableParams,
    frozenParams,
    trainAcc,
    valAcc,
    overfitRisk,
    challengeComplete,
    explanation
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = null;
  let inputs = null;
  let output = null;
  let summary = "";

  function render() {
    if (!root) return;
    const result = evaluateTransferLearning(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.status.textContent = result.challengeComplete ? "Challenge complete!" : result.overfitRisk.startsWith("Low") || result.overfitRisk.startsWith("Minimal") ? "Good Generalization" : "Attention Required";
    output.status.dataset.valid = String(result.challengeComplete);

    output.metrics.innerHTML = `
      <div class="metric-card"><span class="label">Trainable Params:</span> <strong>${result.trainableParams.toLocaleString()}</strong></div>
      <div class="metric-card"><span class="label">Frozen Params:</span> <strong>${result.frozenParams.toLocaleString()}</strong></div>
      <div class="metric-card"><span class="label">Val Accuracy:</span> <strong style="color: ${result.valAcc >= 0.85 ? '#24a148' : '#da1e28'}">${(result.valAcc * 100).toFixed(1)}%</strong></div>
      <div class="metric-card"><span class="label">Overfit Risk:</span> <strong>${result.overfitRisk.split(' ')[0]}</strong></div>
    `;

    // Visual flow & learning curve preview
    output.diagram.replaceChildren();
    const container = make(doc, "div", "tl-container-view");

    // Architecture representation
    const archBar = make(doc, "div", "tl-arch-bar");
    archBar.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom: 12px;">
        <span class="badge" style="background:${result.frozenParams > 0 ? '#0f62fe' : '#8a3ffc'}; color:#fff; padding:6px 12px; border-radius:4px;">
          ${result.backbone.toUpperCase()} Base (${result.strategy === 'frozen_all' || result.strategy === 'feature_extractor' ? 'FROZEN' : result.strategy === 'fine_tuning' ? 'TOP-4 UNFROZEN' : 'ALL TRAINABLE'})
        </span>
        <span style="font-weight:bold;">&rarr;</span>
        <span class="badge" style="background:#0043ce; color:#fff; padding:6px 12px; border-radius:4px;">GlobalAveragePooling2D</span>
        <span style="font-weight:bold;">&rarr;</span>
        <span class="badge" style="background:#24a148; color:#fff; padding:6px 12px; border-radius:4px;">Dense(${state.headUnits || 256}, ReLU)</span>
        <span style="font-weight:bold;">&rarr;</span>
        <span class="badge" style="background:#da1e28; color:#fff; padding:6px 12px; border-radius:4px;">Dense(1, Sigmoid)</span>
      </div>
    `;

    // Simulated Learning curve SVG
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 300 120");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "120");
    svg.style.background = "#fff";
    svg.style.borderRadius = "4px";
    svg.style.border = "1px solid #e0e0e0";

    const tY = 110 - result.trainAcc * 90;
    const vY = 110 - result.valAcc * 90;

    svg.innerHTML = `
      <line x1="30" y1="110" x2="280" y2="110" stroke="#ccc" stroke-width="1"/>
      <line x1="30" y1="20" x2="30" y2="110" stroke="#ccc" stroke-width="1"/>
      <text x="5" y="65" font-size="9" fill="#666">Acc</text>
      <text x="140" y="118" font-size="9" fill="#666">Epochs (1 &rarr; 10)</text>

      <!-- Train curve -->
      <path d="M 30 95 Q 120 70, 270 ${tY}" fill="none" stroke="#0f62fe" stroke-width="2.5"/>
      <circle cx="270" cy="${tY}" r="4" fill="#0f62fe"/>
      <text x="210" y="${Math.max(25, tY - 8)}" font-size="9" fill="#0f62fe" font-weight="bold">Train: ${(result.trainAcc*100).toFixed(0)}%</text>

      <!-- Val curve -->
      <path d="M 30 98 Q 120 80, 270 ${vY}" fill="none" stroke="#24a148" stroke-width="2.5" stroke-dasharray="${result.overfitRisk.includes("Overfitting") ? "4,3" : "none"}"/>
      <circle cx="270" cy="${vY}" r="4" fill="#24a148"/>
      <text x="210" y="${Math.min(105, vY + 15)}" font-size="9" fill="#24a148" font-weight="bold">Val: ${(result.valAcc*100).toFixed(0)}%</text>
    `;

    container.append(archBar, svg);
    output.diagram.append(container);

    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: strategy safely addresses the dataset constraints."
      : "Challenge in progress: choose the correct transfer learning strategy.";

    summary = `${output.status.textContent}. ${result.explanation} ${output.challenge.textContent}`;
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("DOM container and LessonSpec required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((c) => [c.id, String(c.default)]));
      inputs = {};
      const doc = container.ownerDocument;

      root = make(doc, "div", "transfer-learning-lab lab-container");
      root.setAttribute("data-transfer-learning-lab", "");

      const note = make(doc, "p", "lab-note", "Transfer Learning & Fine-Tuning Lab — inspect backbone layer freezing, trainable parameter allocation, and validation accuracy dynamics.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `tl-${control.id}`;
        label.setAttribute("for", id);
        let input;

        if (control.type === "select") {
          input = make(doc, "select");
          input.id = id;
          input.setAttribute("data-control", control.id);
          for (const opt of control.options) {
            const optEl = make(doc, "option", "", opt.label);
            optEl.value = opt.value;
            if (String(opt.value) === String(control.default)) optEl.selected = true;
            input.append(optEl);
          }
        } else {
          input = make(doc, "input");
          input.id = id;
          input.type = control.type;
          input.setAttribute("data-control", control.id);
          if (control.min !== undefined) input.min = String(control.min);
          if (control.max !== undefined) input.max = String(control.max);
          if (control.step !== undefined) input.step = String(control.step);
          input.value = String(control.default);
        }

        input.addEventListener("input", (e) => {
          state[control.id] = e.target.value;
          render();
        });

        inputs[control.id] = input;
        group.append(label, input);
        controlsWrapper.append(group);
      }
      root.append(controlsWrapper);

      const display = make(doc, "div", "tl-display");
      const status = make(doc, "div", "tl-status");
      const metrics = make(doc, "div", "tl-metrics metrics-row");
      const diagram = make(doc, "div", "tl-diagram chart-wrapper");
      const explanation = make(doc, "p", "tl-explanation");
      const challenge = make(doc, "div", "tl-challenge");

      display.append(status, metrics, diagram, explanation, challenge);
      root.append(display);

      output = { status, metrics, diagram, explanation, challenge };
      container.append(root);
      render();
    },
    update() {
      render();
    },
    reset() {
      if (!spec) return;
      for (const c of spec.controls) {
        state[c.id] = String(c.default);
        if (inputs[c.id]) inputs[c.id].value = String(c.default);
      }
      render();
    },
    getAccessibleSummary() {
      return summary || "Interactive Transfer Learning and Fine-Tuning Lab.";
    },
    destroy() {
      if (root) {
        root.replaceChildren();
        root.remove();
      }
      root = null;
      spec = null;
      state = null;
      inputs = null;
      output = null;
    }
  };
}

