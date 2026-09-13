// KerasTunerLab: Interactive simulation of Hyperparameter Tuning with Keras Tuner
// Models RandomSearch, Hyperband, and Bayesian Optimization over hp.Int (units) and hp.Float (learning_rate),
// reflecting the exact 10-trial search from the IBM MNIST lab notebook.

const CANONICAL_TRIALS = [
  { id: "Trial 04", trialNum: 4, units: 128, lr: 0.000173, score: 0.92545, rank: 1 },
  { id: "Trial 03", trialNum: 3, units: 128, lr: 0.000135, score: 0.92395, rank: 2 },
  { id: "Trial 00", trialNum: 0, units: 256, lr: 0.000347, score: 0.92325, rank: 3 },
  { id: "Trial 07", trialNum: 7, units: 224, lr: 0.000511, score: 0.92245, rank: 4 },
  { id: "Trial 01", trialNum: 1, units: 224, lr: 0.000738, score: 0.91770, rank: 5 },
  { id: "Trial 02", trialNum: 2, units: 320, lr: 0.000884, score: 0.91485, rank: 6 },
  { id: "Trial 06", trialNum: 6, units: 224, lr: 0.001442, score: 0.90700, rank: 7 },
  { id: "Trial 08", trialNum: 8, units: 128, lr: 0.004869, score: 0.89270, rank: 8 },
  { id: "Trial 05", trialNum: 5, units: 288, lr: 0.002255, score: 0.88260, rank: 9 },
  { id: "Trial 09", trialNum: 9, units: 288, lr: 0.002678, score: 0.88240, rank: 10 }
];

export function evaluateKerasTuner(state = {}, challenge = {}) {
  const algorithm = state.algorithm || "random_search";
  const maxTrials = Math.max(5, Math.min(15, parseInt(state.max_trials ?? 10, 10)));
  const executionsPerTrial = Math.max(1, Math.min(2, parseInt(state.executions_per_trial ?? 2, 10)));
  const selectedTrial = state.selected_trial || "best";

  // Filter available trials by trial number limit
  const activeTrials = CANONICAL_TRIALS.filter(t => t.trialNum < maxTrials);
  
  // Best trial from active set
  const sorted = [...activeTrials].sort((a, b) => b.score - a.score);
  const bestTrial = sorted[0];

  let inspectedTrial = bestTrial;
  if (selectedTrial !== "best" && selectedTrial !== "all") {
    const found = activeTrials.find(t => t.id.toLowerCase().includes(selectedTrial.toLowerCase()) || String(t.trialNum) === String(selectedTrial));
    if (found) inspectedTrial = found;
  }

  // Simulated elapsed search time
  const timePerExecutionSec = 57; // ~1m 53s per trial of 2 executions
  const totalSeconds = activeTrials.length * executionsPerTrial * timePerExecutionSec;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const elapsedTimeStr = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

  // Variance reduction note
  const varianceReduction = executionsPerTrial === 2
    ? "2 executions per trial: Reduces stochastic variance by ~29% (average of 2 runs)."
    : "1 execution per trial: Faster search, but susceptible to single-run initialization noise.";

  let algorithmNote = "";
  if (algorithm === "random_search") {
    algorithmNote = "RandomSearch: Samples hyperparameter space uniformly in logarithmic scale.";
  } else if (algorithm === "hyperband") {
    algorithmNote = "Hyperband: Allocates resources dynamically via adaptive early-stopping.";
  } else {
    algorithmNote = "Bayesian Optimization: Probabilistic model builds surrogate function over validation surface.";
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Keras Tuner (${algorithm}, max_trials=${maxTrials}, executions=${executionsPerTrial}). Best configuration: ${bestTrial.id} with ${bestTrial.units} units, lr=${bestTrial.lr.toExponential(3)}, val_accuracy=${(bestTrial.score * 100).toFixed(2)}%. Total search time: ${elapsedTimeStr}.`;

  return {
    algorithm,
    maxTrials,
    executionsPerTrial,
    selectedTrial,
    activeTrials,
    bestTrial,
    inspectedTrial,
    elapsedTimeStr,
    varianceReduction,
    algorithmNote,
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

    // Scatter plot space: X = lr (log scale 1e-4 to 1e-2), Y = units (32 to 512)
    const plotX = 40, plotY = 30, plotW = 260, plotH = 145;

    // Convert lr log scale to pixel X
    function lrToX(lr) {
      const minLog = Math.log10(0.0001); // -4
      const maxLog = Math.log10(0.01);   // -2
      const valLog = Math.log10(lr);
      return plotX + ((valLog - minLog) / (maxLog - minLog)) * plotW;
    }

    // Convert units to pixel Y
    function unitsToY(units) {
      const minUnits = 32;
      const maxUnits = 512;
      return plotY + plotH - ((units - minUnits) / (maxUnits - minUnits)) * plotH;
    }

    // Render trial circles
    const trialDots = res.activeTrials.map(t => {
      const cx = lrToX(t.lr);
      const cy = unitsToY(t.units);
      const isBest = t.id === res.bestTrial.id;
      const isSelected = t.id === res.inspectedTrial.id;

      // Color from red (0.88) to green (0.925)
      const normScore = Math.max(0, Math.min(1, (t.score - 0.88) / (0.9255 - 0.88)));
      const fill = isBest ? "#1a7f37" : (normScore > 0.7 ? "#2da44e" : (normScore > 0.4 ? "#d4a72c" : "#cf222e"));
      const r = isBest ? 6 : (isSelected ? 5 : 4);

      return `
        <g>
          ${isBest ? `<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#e3b341" stroke-width="2" stroke-dasharray="2,2"/>` : ""}
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="1.5"/>
          <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="7" fill="#24292f" font-weight="${isBest ? 'bold' : 'normal'}">${t.id.replace('Trial ', 'T')}</text>
        </g>
      `;
    }).join("");

    // Top 4 Leaderboard on Right Side
    const sorted = [...res.activeTrials].sort((a, b) => b.score - a.score).slice(0, 4);
    const boardX = 325, boardY = 30, boardW = 215, boardH = 145;

    const boardRows = sorted.map((t, idx) => {
      const rowY = boardY + 28 + idx * 26;
      const isBest = idx === 0;
      return `
        <rect x="${boardX + 8}" y="${rowY - 10}" width="${boardW - 16}" height="22" rx="3" fill="${isBest ? '#dafbe1' : '#f6f8fa'}" stroke="${isBest ? '#4ac26b' : '#d0d7de'}"/>
        <text x="${boardX + 16}" y="${rowY + 5}" font-size="8" font-weight="bold" fill="${isBest ? '#1a7f37' : '#24292f'}">#${idx + 1} ${t.id}</text>
        <text x="${boardX + 80}" y="${rowY + 5}" font-size="8" fill="#57606a">${t.units}u, ${t.lr.toExponential(1)}</text>
        <text x="${boardX + boardW - 16}" y="${rowY + 5}" text-anchor="end" font-size="8" font-weight="bold" fill="${isBest ? '#1a7f37' : '#24292f'}">${(t.score * 100).toFixed(2)}%</text>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" class="keras-tuner-svg" role="img" aria-label="Keras Tuner Hyperparameter Landscape" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Search Space Scatter Plot -->
        <g>
          <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${plotX + plotW / 2}" y="${plotY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Search Space (Units vs Learning Rate)</text>
          
          <!-- Axis Labels -->
          <text x="${plotX + plotW / 2}" y="${plotY + plotH + 18}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="8">learning_rate (Float log: 1e-4 -> 1e-2)</text>
          <text x="${plotX - 10}" y="${plotY + plotH / 2}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="8" transform="rotate(-90 ${plotX - 10} ${plotY + plotH / 2})">units (Int: 32-512)</text>
          
          <!-- Grid Lines -->
          <line x1="${plotX}" y1="${plotY + plotH * 0.5}" x2="${plotX + plotW}" y2="${plotY + plotH * 0.5}" stroke="#f0f2f4"/>
          <line x1="${plotX + plotW * 0.5}" y1="${plotY}" x2="${plotX + plotW * 0.5}" y2="${plotY + plotH}" stroke="#f0f2f4"/>

          <!-- Trial Points -->
          ${trialDots}
        </g>

        <!-- Right: Results Summary Leaderboard -->
        <g>
          <rect x="${boardX}" y="${boardY}" width="${boardW}" height="${boardH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${boardX + boardW / 2}" y="${boardY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Top Trials Leaderboard</text>
          ${boardRows}
          <text x="${boardX + boardW / 2}" y="${boardY + boardH - 8}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="7">Search time: ${res.elapsedTimeStr} (${res.executionsPerTrial} execs/trial)</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateKerasTuner(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const bestScoreElem = root.querySelector("[data-metric='best-score']");
    if (bestScoreElem) bestScoreElem.textContent = `${(res.bestTrial.score * 100).toFixed(2)}%`;

    const bestUnitsElem = root.querySelector("[data-metric='best-units']");
    if (bestUnitsElem) bestUnitsElem.textContent = `${res.bestTrial.units} units`;

    const bestLrElem = root.querySelector("[data-metric='best-lr']");
    if (bestLrElem) bestLrElem.textContent = res.bestTrial.lr.toExponential(3);

    const timeElem = root.querySelector("[data-metric='elapsed-time']");
    if (timeElem) timeElem.textContent = res.elapsedTimeStr;

    const summaryElem = root.querySelector("[data-metric='diagnosis']");
    if (summaryElem) summaryElem.textContent = `${res.algorithmNote} ${res.varianceReduction}`;

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
        <div data-keras-tuner-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Best Val Accuracy:</span> <strong data-metric="best-score">92.55%</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Optimal Units:</span> <strong data-metric="best-units">128 units</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Optimal LR:</span> <strong data-metric="best-lr">1.73e-4</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Total Elapsed Time:</span> <strong data-metric="elapsed-time">19m 03s</strong></div>
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
            <strong>Tuning Diagnostics:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Keras Tuner Hyperparameter Simulator.";
      const res = evaluateKerasTuner(state, spec?.challenge?.success);
      return `Keras Tuner simulation: Algorithm ${res.algorithm}, ${res.maxTrials} trials, ${res.executionsPerTrial} executions per trial. Best configuration: ${res.bestTrial.id} with ${res.bestTrial.units} units and learning rate ${res.bestTrial.lr.toExponential(3)}, achieving ${(res.bestTrial.score * 100).toFixed(2)}% validation accuracy.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
