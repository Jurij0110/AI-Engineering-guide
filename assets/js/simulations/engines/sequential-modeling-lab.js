// SequentialModelingLab: Time Series Forecasting with Transformers and Sequential Model Taxonomy

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateSequentialModel(state, challenge = {}) {
  const mode = state.mode || "time_series"; // time_series | taxonomy

  if (mode === "taxonomy") {
    const arch = state.arch || "transformer"; // simple_rnn | lstm | gru | conv1d | transformer
    const seqLen = Number(state.seqLen || 100);

    let parallelTraining = false;
    let longRangeRetention = 0;
    let vanishingGradientRisk = "Low";
    let inferenceComplexity = "O(N)";

    if (arch === "simple_rnn") {
      parallelTraining = false;
      longRangeRetention = Math.max(0.01, Math.pow(0.75, seqLen / 10));
      vanishingGradientRisk = seqLen > 20 ? "Severe (Vanishing Gradients over time)" : "Moderate";
      inferenceComplexity = "O(N) recurrent steps";
    } else if (arch === "lstm" || arch === "gru") {
      parallelTraining = false;
      longRangeRetention = Math.max(0.2, Math.pow(0.96, seqLen / 20));
      vanishingGradientRisk = seqLen > 200 ? "Moderate" : "Low (Gated memory highway)";
      inferenceComplexity = "O(N) recurrent steps";
    } else if (arch === "conv1d") {
      parallelTraining = true;
      longRangeRetention = 0.55;
      vanishingGradientRisk = "Low";
      inferenceComplexity = "O(N / stride)";
    } else if (arch === "transformer") {
      parallelTraining = true;
      longRangeRetention = 0.94; // Global self-attention preserves direct token-to-token connections
      vanishingGradientRisk = "None (Direct self-attention pathways)";
      inferenceComplexity = "O(N^2) full attention or O(N) cached";
    }

    const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
    const explanation = `${arch.toUpperCase()} on sequence length ${seqLen}: Parallel training is ${parallelTraining ? "SUPPORTED (O(1) sequential steps)" : "UNSUPPORTED (O(N) recurrence bottleneck)"}. Long-range retention at horizon is ${(longRangeRetention * 100).toFixed(0)}%. ${vanishingGradientRisk}.`;

    return {
      mode,
      valid: true,
      arch,
      seqLen,
      parallelTraining,
      longRangeRetention,
      vanishingGradientRisk,
      inferenceComplexity,
      challengeComplete,
      explanation
    };
  }

  // Default: time_series forecasting
  const modelType = state.modelType || "transformer"; // transformer | lstm | arima
  const lookback = Number(state.lookback || 60);
  const batchSize = Number(state.batchSize || 32);
  const activation = state.activation || "relu";
  const dropout = Number(state.dropout || 0.1);

  let mseLoss = 0.045;
  let trainTimeSeconds = 12;
  let longRangeFidelity = 0.88;

  if (modelType === "transformer") {
    mseLoss = activation === "relu" ? 0.024 : 0.038;
    if (batchSize === 16) {
      mseLoss -= 0.003;
      trainTimeSeconds = 18;
    } else if (batchSize === 64) {
      mseLoss += 0.004;
      trainTimeSeconds = 8;
    }
    longRangeFidelity = lookback >= 60 ? 0.93 : 0.82;
  } else if (modelType === "lstm") {
    mseLoss = 0.048;
    trainTimeSeconds = 24;
    longRangeFidelity = lookback > 60 ? 0.68 : 0.79;
  } else {
    // arima
    mseLoss = 0.092;
    trainTimeSeconds = 4;
    longRangeFidelity = 0.45;
  }

  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
  const explanation = `${modelType.toUpperCase()} forecasting with ${lookback}-step lookback window and batch size ${batchSize} (${activation}): Achieves MSE loss of ${mseLoss.toFixed(3)} in ~${trainTimeSeconds}s training time. Long-range temporal fidelity is ${(longRangeFidelity * 100).toFixed(0)}%.`;

  return {
    mode,
    valid: true,
    modelType,
    lookback,
    batchSize,
    activation,
    dropout,
    mseLoss,
    trainTimeSeconds,
    longRangeFidelity,
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
    const result = evaluateSequentialModel(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.status.textContent = result.challengeComplete ? "Challenge complete!" : "Model Configured";
    output.status.dataset.valid = String(result.challengeComplete);

    output.diagram.replaceChildren();

    if (result.mode === "taxonomy") {
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">Parallel Training:</span> <strong style="color:${result.parallelTraining ? '#24a148' : '#da1e28'}">${result.parallelTraining ? "Yes (GPU Accelerated)" : "No (Sequential)"}</strong></div>
        <div class="metric-card"><span class="label">Long-Range Retention:</span> <strong>${(result.longRangeRetention * 100).toFixed(0)}%</strong></div>
        <div class="metric-card"><span class="label">Vanishing Gradient:</span> <strong>${result.vanishingGradientRisk.split(' ')[0]}</strong></div>
        <div class="metric-card"><span class="label">Inference Steps:</span> <strong>${result.inferenceComplexity}</strong></div>
      `;

      // Comparative taxonomy visual
      const taxBox = make(doc, "div", "seq-taxonomy-view");
      taxBox.innerHTML = `
        <div style="padding:14px; background:var(--paper); border:1px solid var(--line);">
          <div style="font-weight:bold; margin-bottom:10px; font-size:11px;">Architecture Characteristics (${result.arch.toUpperCase()}):</div>
          <table style="width:100%; font-size:10px; border-collapse:collapse;">
            <tr style="border-bottom:1px solid #ddd; background:#f4f4f4;">
              <th style="padding:6px; text-align:left;">Property</th>
              <th style="padding:6px; text-align:left;">SimpleRNN</th>
              <th style="padding:6px; text-align:left;">LSTM / GRU</th>
              <th style="padding:6px; text-align:left;">Conv1D</th>
              <th style="padding:6px; text-align:left; background:#e0e7ff; font-weight:bold;">Transformer</th>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:6px; font-weight:bold;">Parallel Training</td>
              <td style="padding:6px; color:#da1e28;">No</td>
              <td style="padding:6px; color:#da1e28;">No</td>
              <td style="padding:6px; color:#24a148;">Yes</td>
              <td style="padding:6px; color:#24a148; background:#e0e7ff; font-weight:bold;">Yes [O(1)]</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:6px; font-weight:bold;">Long-Range Context</td>
              <td style="padding:6px; color:#da1e28;">Poor (&le;15 steps)</td>
              <td style="padding:6px; color:#f1c21b;">Good (&le;100 steps)</td>
              <td style="padding:6px;">Receptive field bounded</td>
              <td style="padding:6px; color:#24a148; background:#e0e7ff; font-weight:bold;">Global Self-Attention</td>
            </tr>
            <tr>
              <td style="padding:6px; font-weight:bold;">Gradient Flow</td>
              <td style="padding:6px; color:#da1e28;">Vanishing/Exploding</td>
              <td style="padding:6px;">Gated additive cell</td>
              <td style="padding:6px;">Standard conv</td>
              <td style="padding:6px; color:#24a148; background:#e0e7ff; font-weight:bold;">Direct shortcut links</td>
            </tr>
          </table>
        </div>
      `;
      output.diagram.append(taxBox);
    } else {
      // Default: time_series
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">MSE Loss:</span> <strong style="color:${result.mseLoss < 0.03 ? '#24a148' : '#525252'}">${result.mseLoss.toFixed(3)}</strong></div>
        <div class="metric-card"><span class="label">Training Time:</span> <strong>${result.trainTimeSeconds}s</strong></div>
        <div class="metric-card"><span class="label">Lookback Window:</span> <strong>${result.lookback} time steps</strong></div>
        <div class="metric-card"><span class="label">Long-Range Fidelity:</span> <strong>${(result.longRangeFidelity * 100).toFixed(0)}%</strong></div>
      `;

      // Time series forecasting SVG
      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 320 140");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "140");
      svg.style.background = "#fff";
      svg.style.borderRadius = "4px";
      svg.style.border = "1px solid #e0e0e0";

      // Synthetic sine + trend signal
      const points = [];
      const predPoints = [];
      for (let t = 0; t < 25; t++) {
        const x = 30 + t * 11;
        const actualY = 70 - Math.sin(t * 0.4) * 35 - t * 0.8;
        points.push(`${x},${actualY.toFixed(1)}`);

        // Predicted points (diverges slightly if MSE is higher)
        const error = (result.mseLoss * 80) * Math.cos(t * 0.7);
        const predY = actualY + (t > 15 ? error : 0);
        predPoints.push(`${x},${predY.toFixed(1)}`);
      }

      svg.innerHTML = `
        <line x1="30" y1="120" x2="300" y2="120" stroke="#ccc" stroke-width="1"/>
        <line x1="30" y1="20" x2="30" y2="120" stroke="#ccc" stroke-width="1"/>
        <text x="35" y="15" font-size="9" font-weight="bold" fill="#0f62fe">${result.modelType.toUpperCase()} Forecasting vs Ground Truth</text>

        <!-- Shaded Lookback Window -->
        <rect x="30" y="20" width="${result.lookback * 1.5}" height="100" fill="#e0e7ff" fill-opacity="0.4"/>
        <text x="35" y="115" font-size="8" fill="#4f46e5">Lookback (${result.lookback})</text>

        <!-- Ground Truth Path -->
        <polyline points="${points.join(' ')}" fill="none" stroke="#525252" stroke-width="2"/>
        
        <!-- Prediction Path -->
        <polyline points="${predPoints.slice(15).join(' ')}" fill="none" stroke="#24a148" stroke-width="2.5" stroke-dasharray="4,2"/>
        
        <circle cx="${predPoints[predPoints.length-1].split(',')[0]}" cy="${predPoints[predPoints.length-1].split(',')[1]}" r="3" fill="#24a148"/>
        <text x="210" y="30" font-size="8" fill="#525252">&mdash; Ground Truth</text>
        <text x="210" y="42" font-size="8" fill="#24a148" font-weight="bold">- - Predicted (MSE: ${result.mseLoss.toFixed(3)})</text>
      `;

      output.diagram.append(svg);
    }

    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: configuration meets lesson specifications."
      : "Challenge in progress: tune parameters to satisfy the challenge.";

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

      root = make(doc, "div", "sequential-modeling-lab lab-container");
      root.setAttribute("data-sequential-modeling-lab", "");

      const note = make(doc, "p", "lab-note", "Sequential Modeling & Time Series Lab — inspect sequence models, lookback windows, training parallelizability, and forecast accuracy.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `seq-mod-${control.id}`;
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

      const display = make(doc, "div", "seq-mod-display");
      const status = make(doc, "div", "seq-mod-status");
      const metrics = make(doc, "div", "seq-mod-metrics metrics-row");
      const diagram = make(doc, "div", "seq-mod-diagram chart-wrapper");
      const explanation = make(doc, "p", "seq-mod-explanation");
      const challenge = make(doc, "div", "seq-mod-challenge");

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
      return summary || "Interactive Sequential Modeling and Time Series Workbench.";
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

