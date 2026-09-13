// QLearningLab: Interactive simulation of Q-Learning and Bellman Optimality Updates
// Models state-action Q-values Q(s, a), Bellman TD updates Q(s, a) += alpha * [r + gamma * max(Q(s', a')) - Q(s, a)],
// epsilon-greedy exploration, experience replay sampling, and CartPole pole-balancing convergence.

const BASE_Q_TABLE = {
  s0_balanced: { push_left: 42.5, push_right: 43.1 },
  s1_slight_tilt: { push_left: 31.2, push_right: 58.4 },
  s2_falling: { push_left: 8.5, push_right: 82.0 },
  s3_edge: { push_left: 76.5, push_right: 12.0 }
};

export function evaluateQLearning(state = {}, challenge = {}) {
  const currentState = state.current_state || "s1_slight_tilt";
  const action = state.selected_action || "push_right";
  const alpha = Math.max(0.01, Math.min(0.5, parseFloat(state.learning_rate ?? 0.1)));
  const gamma = Math.max(0.5, Math.min(0.99, parseFloat(state.discount_factor ?? 0.95)));
  const epsilon = Math.max(0.01, Math.min(1.0, parseFloat(state.exploration_epsilon ?? 0.2)));
  const batchSize = Math.max(1, Math.min(64, parseInt(state.batch_size ?? 32, 10)));
  const trainingMode = state.training_mode || "tabular_bellman";

  // State transitions: taking push_right in s1_slight_tilt corrects it to s0_balanced with r=+1
  // taking push_left worsens it to s2_falling with r=+1 (or r=-10 on terminal fail)
  let nextState = "s0_balanced";
  let reward = 1.0;
  let isTerminal = false;

  if (currentState === "s1_slight_tilt") {
    if (action === "push_right") {
      nextState = "s0_balanced";
      reward = 1.0;
    } else {
      nextState = "s2_falling";
      reward = 0.0;
    }
  } else if (currentState === "s2_falling") {
    if (action === "push_right") {
      nextState = "s1_slight_tilt";
      reward = 1.0;
    } else {
      nextState = "s3_edge";
      reward = -10.0;
      isTerminal = true;
    }
  } else if (currentState === "s3_edge") {
    if (action === "push_left") {
      nextState = "s1_slight_tilt";
      reward = 1.0;
    } else {
      nextState = "s3_edge";
      reward = -10.0;
      isTerminal = true;
    }
  } else {
    // s0_balanced
    nextState = action === "push_left" ? "s1_slight_tilt" : "s0_balanced";
    reward = 1.0;
  }

  // Bellman computation
  const currentQ = BASE_Q_TABLE[currentState][action];
  const nextQValues = BASE_Q_TABLE[nextState];
  const maxNextQ = isTerminal ? 0.0 : Math.max(nextQValues.push_left, nextQValues.push_right);
  const futureDiscounted = Number((gamma * maxNextQ).toFixed(2));
  const tdTarget = Number((reward + futureDiscounted).toFixed(2));
  const tdError = Number((tdTarget - currentQ).toFixed(2));
  const updatedQ = Number((currentQ + alpha * tdError).toFixed(2));

  // Modeled CartPole episode survival steps based on Q-learning progress
  let survivalScore = 15;
  if (trainingMode === "cartpole_replay") {
    // Mini-batch experience replay stabilizes CartPole balance
    const replayFactor = Math.log2(batchSize) / 6; // 0.16 (batch 2) to 1.0 (batch 64)
    const convergenceFactor = (1 - epsilon) * (gamma > 0.9 ? 1.0 : 0.7);
    survivalScore = Math.min(200, Math.round(15 + 185 * replayFactor * convergenceFactor));
  } else {
    // Tabular updates
    survivalScore = Math.min(120, Math.round(10 + updatedQ * 1.2));
  }

  // Action selection policy diagnostic
  const bestAction = BASE_Q_TABLE[currentState].push_right >= BASE_Q_TABLE[currentState].push_left ? "push_right" : "push_left";
  const isExploiting = action === bestAction;
  const exploreProbability = Number((epsilon * 100).toFixed(1));
  const exploitProbability = Number(((1 - epsilon) * 100).toFixed(1));

  let status = "TD Error Converging";
  let diagnosis = "";

  if (Math.abs(tdError) < 1.0) {
    status = "Bellman Equilibrium";
    diagnosis = `Near-zero TD error (delta=${tdError}). The current Q-value ${currentQ} closely matches the Bellman target (r=${reward} + gamma*maxQ=${futureDiscounted}).`;
  } else if (tdError > 10.0) {
    status = "Large Positive TD Surprise";
    diagnosis = `High positive error (delta=+${tdError}): Target ${tdTarget} greatly exceeds estimate ${currentQ}. Q(s, a) will increase significantly by +${(alpha * tdError).toFixed(2)}.`;
  } else if (tdError < -10.0) {
    status = "Large Negative TD Penalty";
    diagnosis = `High negative error (delta=${tdError}): Negative feedback (r=${reward}) pulls estimate down by ${(alpha * tdError).toFixed(2)}.`;
  } else {
    status = "Standard Bellman Iteration";
    diagnosis = `Bellman step: Q(${currentState}, ${action}) moves from ${currentQ} to ${updatedQ} (alpha=${alpha}, gamma=${gamma}, delta=${tdError}).`;
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `Q-Learning (${currentState}, ${action}, alpha=${alpha}, gamma=${gamma}, eps=${epsilon}): Q_old=${currentQ} -> Target=${tdTarget} -> TD_error=${tdError} -> Q_new=${updatedQ}. Survival: ${survivalScore} steps.`;

  return {
    currentState,
    action,
    alpha,
    gamma,
    epsilon,
    batchSize,
    trainingMode,
    nextState,
    reward,
    isTerminal,
    currentQ,
    maxNextQ,
    futureDiscounted,
    tdTarget,
    tdError,
    updatedQ,
    survivalScore,
    bestAction,
    isExploiting,
    exploreProbability,
    exploitProbability,
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

    // Left Panel: Bellman Equation Decomposition
    const leftX = 20, leftY = 35, leftW = 250, leftH = 145;

    // Right Panel: 4x2 Q-Table Heatmap
    const tableX = 290, tableY = 35, tableW = 250, tableH = 145;

    const statesList = [
      { id: "s0_balanced", label: "s0 (Balanced)" },
      { id: "s1_slight_tilt", label: "s1 (Tilt Right)" },
      { id: "s2_falling", label: "s2 (Severe Fall)" },
      { id: "s3_edge", label: "s3 (Boundary)" }
    ];

    const rows = statesList.map((s, idx) => {
      const rowY = tableY + 36 + idx * 24;
      const isCurrentState = res.currentState === s.id;
      const qLeft = s.id === res.currentState && res.action === "push_left" ? res.updatedQ : BASE_Q_TABLE[s.id].push_left;
      const qRight = s.id === res.currentState && res.action === "push_right" ? res.updatedQ : BASE_Q_TABLE[s.id].push_right;

      const fillLeft = s.id === res.currentState && res.action === "push_left" ? "#ddf4ff" : (qLeft > 50 ? "#dafbe1" : "#fff8c5");
      const fillRight = s.id === res.currentState && res.action === "push_right" ? "#ddf4ff" : (qRight > 50 ? "#dafbe1" : "#fff8c5");

      return `
        <rect x="${tableX + 6}" y="${rowY - 8}" width="78" height="20" rx="2" fill="${isCurrentState ? '#f0f6fc' : '#ffffff'}" stroke="${isCurrentState ? '#0969da' : '#d0d7de'}"/>
        <text x="${tableX + 12}" y="${rowY + 6}" font-size="7.5" font-weight="${isCurrentState ? 'bold' : 'normal'}" fill="${isCurrentState ? '#0969da' : '#24292f'}">${s.label}</text>

        <rect x="${tableX + 88}" y="${rowY - 8}" width="72" height="20" rx="2" fill="${fillLeft}" stroke="${s.id === res.currentState && res.action === 'push_left' ? '#0969da' : '#d0d7de'}"/>
        <text x="${tableX + 124}" y="${rowY + 6}" text-anchor="middle" font-size="8" font-weight="bold" fill="#24292f">${qLeft.toFixed(1)}</text>

        <rect x="${tableX + 164}" y="${rowY - 8}" width="78" height="20" rx="2" fill="${fillRight}" stroke="${s.id === res.currentState && res.action === 'push_right' ? '#0969da' : '#d0d7de'}"/>
        <text x="${tableX + 203}" y="${rowY + 6}" text-anchor="middle" font-size="8" font-weight="bold" fill="#24292f">${qRight.toFixed(1)}</text>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" class="q-learning-svg" role="img" aria-label="Q-Learning Bellman Update and State-Action Table" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Bellman TD Decomposition Cards -->
        <g>
          <rect x="${leftX}" y="${leftY}" width="${leftW}" height="${leftH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${leftX + leftW / 2}" y="${leftY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Bellman Temporal Difference Update</text>
          
          <!-- Card 1: Old Q(s, a) -->
          <rect x="${leftX + 10}" y="${leftY + 12}" width="${leftW - 20}" height="24" rx="3" fill="#f6f8fa" stroke="#d0d7de"/>
          <text x="${leftX + 18}" y="${leftY + 28}" font-size="8" fill="#57606a">Old Q(s, a):</text>
          <text x="${leftX + leftW - 16}" y="${leftY + 28}" text-anchor="end" font-size="8" font-weight="bold" fill="#24292f">${res.currentQ.toFixed(2)}</text>

          <!-- Card 2: TD Target [r + gamma*maxQ'] -->
          <rect x="${leftX + 10}" y="${leftY + 40}" width="${leftW - 20}" height="24" rx="3" fill="#ddf4ff" stroke="#54aeff"/>
          <text x="${leftX + 18}" y="${leftY + 56}" font-size="8" fill="#0969da">Target (r + γ·maxQ'):</text>
          <text x="${leftX + leftW - 16}" y="${leftY + 56}" text-anchor="end" font-size="8" font-weight="bold" fill="#0969da">${res.reward} + ${res.futureDiscounted} = ${res.tdTarget}</text>

          <!-- Card 3: TD Error delta = Target - Old -->
          <rect x="${leftX + 10}" y="${leftY + 68}" width="${leftW - 20}" height="24" rx="3" fill="${res.tdError >= 0 ? '#dafbe1' : '#ffebe9'}" stroke="${res.tdError >= 0 ? '#4ac26b' : '#ff8182'}"/>
          <text x="${leftX + 18}" y="${leftY + 84}" font-size="8" fill="${res.tdError >= 0 ? '#1a7f37' : '#cf222e'}">TD Error (δ):</text>
          <text x="${leftX + leftW - 16}" y="${leftY + 84}" text-anchor="end" font-size="8" font-weight="bold" fill="${res.tdError >= 0 ? '#1a7f37' : '#cf222e'}">${res.tdError > 0 ? '+' : ''}${res.tdError}</text>

          <!-- Card 4: New Q(s, a) = Old + alpha * delta -->
          <rect x="${leftX + 10}" y="${leftY + 96}" width="${leftW - 20}" height="32" rx="3" fill="#fff8c5" stroke="#d4a72c"/>
          <text x="${leftX + 18}" y="${leftY + 110}" font-size="8" font-weight="bold" fill="#9a6700">Updated Q(s, a):</text>
          <text x="${leftX + leftW - 16}" y="${leftY + 110}" text-anchor="end" font-size="9" font-weight="bold" fill="#9a6700">${res.updatedQ}</text>
          <text x="${leftX + 18}" y="${leftY + 122}" font-size="7" fill="#656d76">Learning Rate α=${res.alpha} | Discount γ=${res.gamma}</text>
        </g>

        <!-- Right: State-Action Q-Table Matrix -->
        <g>
          <rect x="${tableX}" y="${tableY}" width="${tableW}" height="${tableH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${tableX + tableW / 2}" y="${tableY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Q-Table Values Q(s, a)</text>
          
          <!-- Column Headers -->
          <text x="${tableX + 45}" y="${tableY + 18}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#57606a">State (s)</text>
          <text x="${tableX + 124}" y="${tableY + 18}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#57606a">a: Push Left</text>
          <text x="${tableX + 203}" y="${tableY + 18}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#57606a">a: Push Right</text>

          ${rows}

          <text x="${tableX + tableW / 2}" y="${tableY + 138}" text-anchor="middle" font-size="7" fill="#57606a">Policy: ε=${res.epsilon} (${res.exploreProbability}% explore, ${res.exploitProbability}% exploit)</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateQLearning(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const targetElem = root.querySelector("[data-metric='td-target']");
    if (targetElem) targetElem.textContent = res.tdTarget.toFixed(2);

    const errorElem = root.querySelector("[data-metric='td-error']");
    if (errorElem) errorElem.textContent = (res.tdError > 0 ? "+" : "") + res.tdError.toFixed(2);

    const qElem = root.querySelector("[data-metric='updated-q']");
    if (qElem) qElem.textContent = res.updatedQ.toFixed(2);

    const survivalElem = root.querySelector("[data-metric='survival-score']");
    if (survivalElem) survivalElem.textContent = `${res.survivalScore} steps`;

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
        <div data-q-learning-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Bellman Target:</span> <strong data-metric="td-target">56.48</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">TD Error (δ):</span> <strong data-metric="td-error">-1.92</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Updated Q(s, a):</span> <strong data-metric="updated-q">58.21</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">CartPole Survival:</span> <strong data-metric="survival-score">145 steps</strong></div>
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
            <strong>Temporal Difference Diagnosis:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Q-Learning Simulator.";
      const res = evaluateQLearning(state, spec?.challenge?.success);
      return `Q-Learning simulation: State ${res.currentState}, Action ${res.action}, Alpha ${res.alpha}, Gamma ${res.gamma}. TD Target: ${res.tdTarget}, TD Error: ${res.tdError}, Updated Q: ${res.updatedQ}. CartPole survival: ${res.survivalScore} steps. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
