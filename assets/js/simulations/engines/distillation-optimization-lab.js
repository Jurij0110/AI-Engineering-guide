// DistillationOptimizationLab: Interactive simulation of Knowledge Distillation and Model Optimization
// Models teacher-student distillation loss with softmax temperature scaling, dark knowledge transfer,
// and mixed precision acceleration for TensorFlow model deployment.

export function evaluateDistillation(state = {}, challenge = {}) {
  const mode = state.training_mode || "distillation";
  const temperature = Math.max(1, Math.min(8, parseInt(state.temperature ?? 3, 10)));
  const studentUnits = Math.max(16, Math.min(64, parseInt(state.student_units ?? 32, 10)));
  const precision = state.precision || "mixed_float16";
  const epochs = Math.max(1, Math.min(5, parseInt(state.epochs ?? 2, 10)));

  // Parameter counts for 784-input MNIST classification
  const teacherUnits = 128;
  const teacherParams = 784 * teacherUnits + teacherUnits + teacherUnits * 10 + 10; // 101,770
  const studentParams = 784 * studentUnits + studentUnits + studentUnits * 10 + 10; // e.g. 25,450 for 32 units

  const compressionRatio = Number((teacherParams / studentParams).toFixed(1));

  // Latency modeling
  const isMixed = precision === "mixed_float16";
  const precisionLatencyFactor = isMixed ? 0.55 : 1.0;
  const teacherLatencyMs = Number((14.2 * precisionLatencyFactor).toFixed(1));
  const baseStudentLatency = 14.2 * (studentUnits / teacherUnits);
  const studentLatencyMs = Number((baseStudentLatency * precisionLatencyFactor).toFixed(1));
  const speedupRatio = Number((14.2 / studentLatencyMs).toFixed(1));

  // Accuracy modeling
  const teacherAccuracy = 98.20;
  let studentAcc = 0;

  if (mode === "scratch_hard_labels") {
    // Trained without teacher on hard one-hot labels
    const unitCap = studentUnits === 16 ? 91.5 : (studentUnits === 32 ? 93.8 : 95.4);
    studentAcc = unitCap - (5 - epochs) * 0.8;
  } else {
    // Knowledge distillation with teacher guidance
    let tempBonus = 0;
    if (temperature === 3) tempBonus = 1.6; // optimal temperature for MNIST
    else if (temperature === 2 || temperature === 5) tempBonus = 1.1;
    else if (temperature === 1) tempBonus = 0.2; // too sharp, mimics hard labels
    else if (temperature === 8) tempBonus = 0.5; // too diffuse, washed out signal

    const unitBase = studentUnits === 16 ? 94.2 : (studentUnits === 32 ? 96.2 : 97.4);
    studentAcc = unitBase + tempBonus - (5 - epochs) * 0.4;
  }

  const studentAccuracy = Math.min(teacherAccuracy, Number(studentAcc.toFixed(2)));
  const accuracyRetention = Number(((studentAccuracy / teacherAccuracy) * 100).toFixed(1));

  // Simulated soft probabilities for target digit "7" at temperature T
  // Raw logits for [0..9]: digit 7 has 8.0, digit 1 has 4.2, digit 9 has 3.5, others ~0.5
  const rawLogits = [0.4, 4.2, 1.2, 0.5, 0.6, 0.3, 0.2, 8.0, 0.8, 3.5];
  const expValues = rawLogits.map(l => Math.exp(l / temperature));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  const softProbs = expValues.map(v => Number((v / sumExp).toFixed(3)));

  let status = "Distillation Active";
  let diagnosis = "";

  if (mode === "scratch_hard_labels") {
    status = "Hard Label Training (No Distillation)";
    diagnosis = `Student model (${studentUnits} units) trained from scratch on 1-hot labels achieves only ${studentAccuracy}%. Missing the teacher's inter-class similarity distribution (dark knowledge).`;
  } else if (temperature === 3 && studentUnits === 32 && isMixed) {
    status = "Optimal Distillation & FP16 Speedup";
    diagnosis = `Optimal: Student with 75% fewer parameters retains ${accuracyRetention}% of teacher performance (${studentAccuracy}% vs ${teacherAccuracy}%) while delivering a ${speedupRatio}x inference speedup with mixed_float16.`;
  } else if (temperature === 1) {
    status = "Temperature Too Low (T=1)";
    diagnosis = "Low temperature (T=1) produces sharp probabilities approaching standard cross-entropy, suppressing subtle inter-class correlations.";
  } else {
    status = "Distillation Converging";
    diagnosis = `Student matches softened teacher logits at T=${temperature}. Retains ${accuracyRetention}% of teacher accuracy with ${compressionRatio}x parameter compression.`;
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Distillation: mode=${mode}, T=${temperature}, student_units=${studentUnits}, precision=${precision}, epochs=${epochs}. Student Acc: ${studentAccuracy}% (Teacher: ${teacherAccuracy}%, retention: ${accuracyRetention}%), Compression: ${compressionRatio}x (${studentParams.toLocaleString()} vs ${teacherParams.toLocaleString()} params), Latency: ${studentLatencyMs} ms (${speedupRatio}x speedup).`;

  return {
    mode,
    temperature,
    studentUnits,
    precision,
    epochs,
    teacherParams,
    studentParams,
    compressionRatio,
    teacherAccuracy,
    studentAccuracy,
    accuracyRetention,
    teacherLatencyMs,
    studentLatencyMs,
    speedupRatio,
    softProbs,
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

    // Left Panel: Teacher vs Student Topology
    const topoX = 20, topoY = 35, topoW = 240, topoH = 145;

    // Right Panel: Softened Softmax Probabilities Bar Chart for Digit 7
    const probX = 280, probY = 35, probW = 260, probH = 145;

    // Render probability bars for classes 0 to 9
    const barWidth = 18;
    const barGap = 6;
    const probBars = res.softProbs.map((p, idx) => {
      const bx = probX + 15 + idx * (barWidth + barGap);
      const bh = Math.max(3, p * 90);
      const by = probY + probH - 25 - bh;
      const isDominant = idx === 7;
      const isDarkKnowledge = idx === 1 || idx === 9;

      const fill = isDominant ? "#0969da" : (isDarkKnowledge ? "#1a7f37" : "#8c959f");

      return `
        <g>
          <rect x="${bx}" y="${by}" width="${barWidth}" height="${bh}" rx="2" fill="${fill}"/>
          <text x="${bx + barWidth / 2}" y="${probY + probH - 12}" text-anchor="middle" font-size="8" font-weight="${isDominant ? 'bold' : 'normal'}" fill="#24292f">${idx}</text>
          <text x="${bx + barWidth / 2}" y="${by - 4}" text-anchor="middle" font-size="6.5" fill="${fill}">${(p * 100).toFixed(0)}%</text>
        </g>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" class="distill-opt-svg" role="img" aria-label="Knowledge Distillation Network and Softmax Probabilities" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Teacher vs Student Topology -->
        <g>
          <rect x="${topoX}" y="${topoY}" width="${topoW}" height="${topoH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${topoX + topoW / 2}" y="${topoY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Teacher -> Student Distillation Pipeline</text>
          
          <!-- Teacher Box -->
          <rect x="${topoX + 12}" y="${topoY + 16}" width="${topoW - 24}" height="42" rx="3" fill="#ddf4ff" stroke="#54aeff"/>
          <text x="${topoX + 20}" y="${topoY + 32}" font-size="9" font-weight="bold" fill="#0969da">Teacher Model (128 Units)</text>
          <text x="${topoX + 20}" y="${topoY + 46}" font-size="7.5" fill="#57606a">${res.teacherParams.toLocaleString()} params | ${res.teacherAccuracy}% acc | ${res.teacherLatencyMs} ms</text>

          <!-- Softmax Temperature Arrow -->
          <line x1="${topoX + topoW / 2}" y1="${topoY + 58}" x2="${topoX + topoW / 2}" y2="${topoY + 84}" stroke="#1a7f37" stroke-width="2" stroke-dasharray="2,2"/>
          <rect x="${topoX + topoW / 2 - 40}" y="${topoY + 65}" width="80" height="15" rx="3" fill="#dafbe1" stroke="#4ac26b"/>
          <text x="${topoX + topoW / 2}" y="${topoY + 76}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#1a7f37">Softmax (T = ${res.temperature})</text>

          <!-- Student Box -->
          <rect x="${topoX + 12}" y="${topoY + 88}" width="${topoW - 24}" height="44" rx="3" fill="${res.mode === 'distillation' ? '#fff8c5' : '#f6f8fa'}" stroke="${res.mode === 'distillation' ? '#d4a72c' : '#d0d7de'}"/>
          <text x="${topoX + 20}" y="${topoY + 104}" font-size="9" font-weight="bold" fill="${res.mode === 'distillation' ? '#9a6700' : '#24292f'}">Student Model (${res.studentUnits} Units)</text>
          <text x="${topoX + 20}" y="${topoY + 118}" font-size="7.5" fill="#57606a">${res.studentParams.toLocaleString()} params (${res.compressionRatio}x smaller) | ${res.studentAccuracy}% acc</text>
        </g>

        <!-- Right: Softened Probability Distribution (Digit 7) -->
        <g>
          <rect x="${probX}" y="${probY}" width="${probW}" height="${probH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${probX + probW / 2}" y="${probY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Teacher Soft Probabilities (Input: Digit "7")</text>
          
          ${probBars}

          <!-- Legend -->
          <text x="${probX + 15}" y="${probY + 16}" font-size="7" fill="#0969da" font-weight="bold">Target Class (7)</text>
          <text x="${probX + 100}" y="${probY + 16}" font-size="7" fill="#1a7f37" font-weight="bold">Dark Knowledge (1, 9)</text>
          <text x="${probX + probW - 12}" y="${probY + 16}" text-anchor="end" font-size="7" fill="#57606a">T = ${res.temperature}</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateDistillation(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const studentAccElem = root.querySelector("[data-metric='student-acc']");
    if (studentAccElem) studentAccElem.textContent = `${res.studentAccuracy}%`;

    const retentionElem = root.querySelector("[data-metric='retention']");
    if (retentionElem) retentionElem.textContent = `${res.accuracyRetention}%`;

    const compressElem = root.querySelector("[data-metric='compression']");
    if (compressElem) compressElem.textContent = `${res.compressionRatio}x smaller`;

    const speedupElem = root.querySelector("[data-metric='speedup']");
    if (speedupElem) speedupElem.textContent = `${res.speedupRatio}x (${res.studentLatencyMs} ms)`;

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
        <div data-distill-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Student Accuracy:</span> <strong data-metric="student-acc">97.4%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Teacher Retention:</span> <strong data-metric="retention">99.2%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Parameter Cut:</span> <strong data-metric="compression">4.0x smaller</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Inference Speedup:</span> <strong data-metric="speedup">3.9x (3.6 ms)</strong></div>
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
            <strong>Distillation Diagnostic:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Knowledge Distillation Simulator.";
      const res = evaluateDistillation(state, spec?.challenge?.success);
      return `Knowledge distillation simulation: Mode ${res.mode}, Temperature ${res.temperature}, student units ${res.studentUnits}, precision ${res.precision}. Student accuracy: ${res.studentAccuracy}% (retains ${res.accuracyRetention}% of teacher ${res.teacherAccuracy}%). Compression: ${res.compressionRatio}x, Latency: ${res.studentLatencyMs} ms.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
