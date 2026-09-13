// RLOverviewLab: Interactive simulation of Reinforcement Learning & MDP fundamentals
// Models the Markov Decision Process (S, A, P, R, gamma), agent-environment feedback loop,
// discounted return calculation, and policy selection.

export function evaluateRLOverview(state = {}, challenge = {}) {
  const env = state.environment || "cartpole";
  const policy = state.policy_type || "epsilon_soft";
  const gamma = Math.max(0.1, Math.min(0.99, parseFloat(state.discount_factor ?? 0.9)));
  const rewardScheme = state.reward_scheme || "shaped_dense";
  const horizon = Math.max(5, Math.min(50, parseInt(state.horizon_steps ?? 20, 10)));

  // Simulated episode trajectory generation
  let immediateRewards = [];
  let discountedRewards = [];
  let cumulativeDiscountedReturn = 0;
  let undiscountedReturn = 0;
  let survivalSteps = horizon;

  for (let t = 0; t < horizon; t++) {
    let r = 0;
    if (rewardScheme === "sparse_goal") {
      r = t === horizon - 1 ? 100.0 : 0.0;
    } else if (rewardScheme === "step_penalty") {
      r = t === horizon - 1 ? 50.0 : -1.0;
    } else {
      // shaped_dense
      r = 1.0;
      if (t === horizon - 1 && policy === "random") {
        r = -10.0; // Early failure on random policy
        survivalSteps = Math.min(survivalSteps, t + 1);
      }
    }

    const discountFactor = Math.pow(gamma, t);
    const discountedR = Number((r * discountFactor).toFixed(2));

    immediateRewards.push(r);
    discountedRewards.push(discountedR);
    undiscountedReturn += r;
    cumulativeDiscountedReturn += discountedR;

    if (r === -10.0) break;
  }

  cumulativeDiscountedReturn = Number(cumulativeDiscountedReturn.toFixed(2));
  undiscountedReturn = Number(undiscountedReturn.toFixed(1));

  // Horizon discount weight factor at final step
  const horizonWeight = Number(Math.pow(gamma, horizon - 1).toFixed(3));

  let status = "Balanced MDP Horizon";
  let diagnosis = "";

  if (gamma < 0.5) {
    status = "Myopic Policy (Short-Sighted)";
    diagnosis = `Low discount gamma=${gamma} heavily discounts future feedback (step ${horizon} weight=${horizonWeight}). The agent prioritizes immediate survival over long-term stability.`;
  } else if (gamma >= 0.95 && rewardScheme === "sparse_goal") {
    status = "Far-Sighted with Sparse Reward";
    diagnosis = `Far-sighted discount gamma=${gamma} maintains strong goal backpropagation (final reward discounted to ${discountedRewards[discountedRewards.length - 1]}), but requires extensive exploration to discover the goal.`;
  } else if (policy === "random") {
    status = "Stochastic Exploration (High Variance)";
    diagnosis = "Uniform random policy selects actions without utility estimation, inducing unstable trajectories and premature episode termination.";
  } else {
    status = "Optimal Policy Formulation";
    diagnosis = `Policy '${policy}' under ${rewardScheme} reward and gamma=${gamma} achieves sustained cumulative return G_0=${cumulativeDiscountedReturn} over ${survivalSteps} steps.`;
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `MDP (${env}, ${policy}, gamma=${gamma}, ${rewardScheme}, T=${horizon}): Return G_0=${cumulativeDiscountedReturn}, Undiscounted sum=${undiscountedReturn}, Survival=${survivalSteps} steps. Status: ${status}.`;

  return {
    environment: env,
    policy,
    gamma,
    rewardScheme,
    horizon,
    survivalSteps,
    cumulativeDiscountedReturn,
    undiscountedReturn,
    horizonWeight,
    immediateRewards,
    discountedRewards,
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

    // Left Panel: Agent-Environment Interaction Cycle
    const cycleX = 20, cycleY = 35, cycleW = 240, cycleH = 145;

    // Right Panel: Trajectory Rollout & Return Curve
    const chartX = 280, chartY = 35, chartW = 260, chartH = 145;

    // Compute trajectory bar coordinates
    const numBars = Math.min(res.immediateRewards.length, 12);
    const barW = Math.max(8, Math.floor((chartW - 30) / numBars) - 4);

    const maxR = Math.max(1, ...res.immediateRewards.map(Math.abs));
    const bars = res.immediateRewards.slice(0, numBars).map((r, i) => {
      const discR = res.discountedRewards[i];
      const bx = chartX + 15 + i * (barW + 4);
      const hImm = Math.max(3, Math.min(45, (Math.abs(r) / maxR) * 45));
      const hDisc = Math.max(2, Math.min(45, (Math.abs(discR) / maxR) * 45));
      const byImm = r >= 0 ? chartY + 65 - hImm : chartY + 65;
      const byDisc = discR >= 0 ? chartY + 125 - hDisc : chartY + 125;

      return `
        <g>
          <rect x="${bx}" y="${byImm}" width="${barW}" height="${hImm}" rx="1.5" fill="${r >= 0 ? '#1a7f37' : '#cf222e'}" opacity="0.85"/>
          <rect x="${bx}" y="${byDisc}" width="${barW}" height="${hDisc}" rx="1.5" fill="#0969da" opacity="0.85"/>
          <text x="${bx + barW / 2}" y="${chartY + 138}" text-anchor="middle" font-size="6.5" fill="#57606a">${i + 1}</text>
        </g>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" class="rl-overview-svg" role="img" aria-label="Reinforcement Learning MDP Agent Environment Loop" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Agent-Environment MDP Loop -->
        <g>
          <rect x="${cycleX}" y="${cycleY}" width="${cycleW}" height="${cycleH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${cycleX + cycleW / 2}" y="${cycleY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">MDP Feedback Loop (S, A, P, R, γ)</text>
          
          <!-- Agent Box -->
          <rect x="${cycleX + 15}" y="${cycleY + 16}" width="95" height="48" rx="4" fill="#ddf4ff" stroke="#54aeff"/>
          <text x="${cycleX + 62}" y="${cycleY + 34}" text-anchor="middle" font-size="9" font-weight="bold" fill="#0969da">AGENT</text>
          <text x="${cycleX + 62}" y="${cycleY + 48}" text-anchor="middle" font-size="7.5" fill="#57606a">Policy: ${res.policy}</text>

          <!-- Environment Box -->
          <rect x="${cycleX + cycleW - 110}" y="${cycleY + 16}" width="95" height="48" rx="4" fill="#dafbe1" stroke="#4ac26b"/>
          <text x="${cycleX + cycleW - 62}" y="${cycleY + 34}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1a7f37">ENVIRONMENT</text>
          <text x="${cycleX + cycleW - 62}" y="${cycleY + 48}" text-anchor="middle" font-size="7.5" fill="#57606a">${res.environment.toUpperCase()}</text>

          <!-- Action Arrow (Top: Agent -> Env) -->
          <path d="M ${cycleX + 110} ${cycleY + 28} L ${cycleX + cycleW - 112} ${cycleY + 28}" stroke="#0969da" stroke-width="2" marker-end="url(#arrow-blue)"/>
          <text x="${cycleX + cycleW / 2}" y="${cycleY + 24}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#0969da">Action a_t</text>

          <!-- Feedback Arrow (Bottom: Env -> Agent) -->
          <path d="M ${cycleX + cycleW - 62} ${cycleY + 64} L ${cycleX + cycleW - 62} ${cycleY + 95} L ${cycleX + 62} ${cycleY + 95} L ${cycleX + 62} ${cycleY + 64}" fill="none" stroke="#cf222e" stroke-width="1.5" stroke-dasharray="3,2"/>
          <text x="${cycleX + cycleW / 2}" y="${cycleY + 90}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#cf222e">Reward r_{t+1} & State s_{t+1}</text>

          <!-- Horizon & Discount Indicator -->
          <rect x="${cycleX + 15}" y="${cycleY + 108}" width="${cycleW - 30}" height="25" rx="3" fill="#f6f8fa" stroke="var(--line, #d0d7de)"/>
          <text x="${cycleX + cycleW / 2}" y="${cycleY + 124}" text-anchor="middle" font-size="7.5" fill="#24292f">Return G_0 = Σ γᵗ r_{t+1} | γ=${res.gamma} (T=${res.horizon})</text>
        </g>

        <!-- Right: Trajectory & Discounted Return Profile -->
        <g>
          <rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${chartX + chartW / 2}" y="${chartY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Step Rewards vs Discounted Returns</text>
          
          <text x="${chartX + 15}" y="${chartY + 16}" font-size="7" fill="#1a7f37" font-weight="bold">Immediate r_t</text>
          <text x="${chartX + 85}" y="${chartY + 16}" font-size="7" fill="#0969da" font-weight="bold">Discounted γᵗ r_t</text>
          <text x="${chartX + chartW - 12}" y="${chartY + 16}" text-anchor="end" font-size="7" fill="#57606a">G_0: ${res.cumulativeDiscountedReturn}</text>
          
          <!-- Baseline Dividers -->
          <line x1="${chartX + 10}" y1="${chartY + 65}" x2="${chartX + chartW - 10}" y2="${chartY + 65}" stroke="#d0d7de" stroke-width="1"/>
          <line x1="${chartX + 10}" y1="${chartY + 125}" x2="${chartX + chartW - 10}" y2="${chartY + 125}" stroke="#d0d7de" stroke-width="1"/>

          ${bars}
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateRLOverview(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const returnElem = root.querySelector("[data-metric='discounted-return']");
    if (returnElem) returnElem.textContent = res.cumulativeDiscountedReturn.toFixed(2);

    const undiscountedElem = root.querySelector("[data-metric='raw-return']");
    if (undiscountedElem) undiscountedElem.textContent = res.undiscountedReturn.toFixed(1);

    const survivalElem = root.querySelector("[data-metric='survival-steps']");
    if (survivalElem) survivalElem.textContent = `${res.survivalSteps} / ${res.horizon}`;

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
        <div data-rl-overview-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Discounted G_0:</span> <strong data-metric="discounted-return">17.8</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Undiscounted Return:</span> <strong data-metric="raw-return">20.0</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Survival Steps:</span> <strong data-metric="survival-steps">20 / 20</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">MDP Status:</span> <strong data-metric="status">Optimal Policy</strong></div>
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
            <strong>MDP Insight:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Reinforcement Learning MDP Simulator.";
      const res = evaluateRLOverview(state, spec?.challenge?.success);
      return `RL MDP simulation: Environment ${res.environment}, Policy ${res.policy}, Discount gamma=${res.gamma}. Discounted Return G_0: ${res.cumulativeDiscountedReturn}, Undiscounted Return: ${res.undiscountedReturn}, Survival: ${res.survivalSteps}/${res.horizon} steps. Status: ${res.status}.`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
