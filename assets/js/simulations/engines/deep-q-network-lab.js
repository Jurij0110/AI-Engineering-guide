// DeepQNetworkLab: Interactive simulation of Deep Q-Networks (DQN)
// Models neural Q-value approximation, Experience Replay buffer sampling (breaking temporal correlation),
// and periodic Target Network weight synchronization (preventing moving-target oscillations) on CartPole-v1.

export function evaluateDeepQNetwork(state = {}, challenge = {}) {
  const targetNetwork = state.target_network || "enabled";
  const replayMode = state.replay_buffer || "uniform_random";
  const targetSyncFreq = Math.max(1, Math.min(25, parseInt(state.target_sync_freq ?? 10, 10)));
  const epsilonDecay = state.epsilon_decay || "standard_0.995";
  const episodes = Math.max(10, Math.min(500, parseInt(state.episodes_trained ?? 100, 10)));

  // Model parameters (CartPole: 4 inputs -> 24 relu -> 24 relu -> 2 linear)
  const inputDim = 4;
  const hiddenUnits = 24;
  const actionDim = 2;
  const primaryParams = (inputDim * hiddenUnits + hiddenUnits) + (hiddenUnits * hiddenUnits + hiddenUnits) + (hiddenUnits * actionDim + actionDim);
  const targetParams = targetNetwork === "enabled" ? primaryParams : 0;
  const totalModelParams = primaryParams + targetParams;

  // Epsilon calculation after decay over episodes
  let decayRate = 0.995;
  if (epsilonDecay === "fast_0.95") decayRate = 0.95;
  else if (epsilonDecay === "slow_0.999") decayRate = 0.999;

  const currentEpsilon = Math.max(0.01, Number((Math.pow(decayRate, episodes)).toFixed(3)));

  // Stability & Score Modeling
  let stabilityScore = 1.0;
  let status = "Stable DQN Convergence";
  let diagnosis = "";

  const isTargetEnabled = targetNetwork === "enabled";
  const isReplayRandom = replayMode === "uniform_random";

  if (!isTargetEnabled && !isReplayRandom) {
    // Both disabled: Catastrophic divergence
    stabilityScore = 0.12;
    status = "Catastrophic Divergence";
    diagnosis = "Severe: Without experience replay (correlated sequential data) and without a target network (moving target instability), Q-values diverge and the cartpole falls almost immediately.";
  } else if (!isTargetEnabled) {
    // Moving target oscillation ("dog chasing tail")
    stabilityScore = 0.38;
    status = "Moving-Target Oscillations";
    diagnosis = "Instability: The primary network updates the target it is simultaneously chasing. Q-value estimates oscillate wildly, preventing consistent policy improvement.";
  } else if (!isReplayRandom) {
    // Sequential correlated buffer
    stabilityScore = 0.45;
    status = "Temporal Correlation Drift";
    diagnosis = "Suboptimal: Consecutive sequential transitions breach the IID (independent and identically distributed) assumption, leading to localized policy overfitting and poor generalization.";
  } else {
    // Optimal: Both enabled
    stabilityScore = 0.98;
    status = "Stable DQN Convergence";
  }

  // CartPole survival score out of 200
  const progressRatio = Math.min(1.0, episodes / 250);
  let baseScore = 12 + (200 - 12) * progressRatio * stabilityScore;
  if (targetSyncFreq > 20 && isTargetEnabled) baseScore *= 0.88; // Stale targets slow down learning
  const meanScore = Math.min(200, Math.max(8, Math.round(baseScore)));

  if (isTargetEnabled && isReplayRandom) {
    if (meanScore >= 180) {
      diagnosis = `Optimal DQN pipeline: Replay buffer decorrelates samples, and target network frozen for C=${targetSyncFreq} episodes stabilizes Bellman targets. CartPole policy approaches the 200-step reference target (mean score: ${meanScore}/200).`;
    } else {
      diagnosis = `Stable DQN pipeline: Replay buffer decorrelates samples and target network (C=${targetSyncFreq}) stabilizes targets. Training is progressing (${episodes} episodes, mean score: ${meanScore}/200) toward the 200-step visual reference target.`;
    }
  }

  // Simulated MSE loss
  let baseLoss = isTargetEnabled ? 0.045 : 0.85;
  if (!isReplayRandom) baseLoss *= 2.2;
  const mseLoss = Number((baseLoss * Math.exp(-progressRatio * 1.5) + (1 - stabilityScore) * 0.4).toFixed(4));

  // Replay buffer utilization out of 2,000
  const bufferOccupancy = Math.min(2000, episodes * 22);

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  const explanation = `DQN (TargetNet=${targetNetwork}, Replay=${replayMode}, C=${targetSyncFreq}, EpsDecay=${epsilonDecay}, Ep=${episodes}): Mean Score=${meanScore}/200, MSE Loss=${mseLoss}, Epsilon=${currentEpsilon}, Status=${status}.`;

  return {
    targetNetwork,
    replayMode,
    targetSyncFreq,
    epsilonDecay,
    episodes,
    primaryParams,
    targetParams,
    totalModelParams,
    currentEpsilon,
    meanScore,
    mseLoss,
    bufferOccupancy,
    isTargetEnabled,
    isReplayRandom,
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

    // Left Panel: Primary Network vs Target Network Architecture
    const archX = 20, archY = 35, archW = 250, archH = 145;

    // Right Panel: Learning Curve (CartPole Score 0 to 200)
    const curveX = 290, curveY = 35, curveW = 250, curveH = 145;

    // Curve rendering
    const scoreY = curveY + curveH - 20 - (res.meanScore / 200) * (curveH - 45);
    const progressW = (res.episodes / 500) * (curveW - 40);

    return `
      <svg viewBox="0 0 ${width} ${height}" class="deep-q-network-svg" role="img" aria-label="Deep Q Network Architecture and CartPole Performance" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        
        <!-- Left: Dual-Network Architecture & Replay Buffer -->
        <g>
          <rect x="${archX}" y="${archY}" width="${archW}" height="${archH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${archX + archW / 2}" y="${archY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">Dual-Network DQN Architecture</text>
          
          <!-- Primary Network -->
          <rect x="${archX + 10}" y="${archY + 12}" width="105" height="42" rx="3" fill="#ddf4ff" stroke="#54aeff"/>
          <text x="${archX + 62}" y="${archY + 28}" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#0969da">Primary Q(s, a; θ)</text>
          <text x="${archX + 62}" y="${archY + 44}" text-anchor="middle" font-size="7.5" fill="#57606a">${res.primaryParams} params [Trainable]</text>

          <!-- Target Network -->
          <rect x="${archX + archW - 115}" y="${archY + 12}" width="105" height="42" rx="3" fill="${res.isTargetEnabled ? '#dafbe1' : '#f6f8fa'}" stroke="${res.isTargetEnabled ? '#4ac26b' : '#d0d7de'}"/>
          <text x="${archX + archW - 62}" y="${archY + 28}" text-anchor="middle" font-size="8.5" font-weight="bold" fill="${res.isTargetEnabled ? '#1a7f37' : '#57606a'}">Target Q(s, a; θ⁻)</text>
          <text x="${archX + archW - 62}" y="${archY + 44}" text-anchor="middle" font-size="7.5" fill="#57606a">${res.isTargetEnabled ? `Frozen (Sync C=${res.targetSyncFreq})` : 'DISABLED (Self)'}</text>

          <!-- Sync Arrow -->
          <line x1="${archX + 115}" y1="${archY + 33}" x2="${archX + archW - 118}" y2="${archY + 33}" stroke="#1a7f37" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="${archX + archW / 2}" y="${archY + 29}" text-anchor="middle" font-size="7" font-weight="bold" fill="#1a7f37">θ⁻ ← θ</text>

          <!-- Experience Replay Box -->
          <rect x="${archX + 10}" y="${archY + 65}" width="${archW - 20}" height="42" rx="3" fill="#fff8c5" stroke="#d4a72c"/>
          <text x="${archX + 18}" y="${archY + 80}" font-size="8.5" font-weight="bold" fill="#9a6700">Experience Replay Buffer (D)</text>
          <text x="${archX + 18}" y="${archY + 95}" font-size="7.5" fill="#57606a">Capacity: 2,000 transitions (${res.bufferOccupancy} stored) | Sampling: ${res.replayMode}</text>

          <!-- Bottom Metric Bar -->
          <rect x="${archX + 10}" y="${archY + 114}" width="${archW - 20}" height="22" rx="2" fill="#f6f8fa" stroke="var(--line, #d0d7de)"/>
          <text x="${archX + 16}" y="${archY + 128}" font-size="7.5" fill="#24292f">MSE Loss: ${res.mseLoss} | Exploration ε: ${res.currentEpsilon}</text>
        </g>

        <!-- Right: CartPole Episode Balance Curve -->
        <g>
          <rect x="${curveX}" y="${curveY}" width="${curveW}" height="${curveH}" fill="#ffffff" stroke="var(--line, #d0d7de)" rx="4"/>
          <text x="${curveX + curveW / 2}" y="${curveY - 10}" text-anchor="middle" fill="var(--ink, #1f2328)" font-size="10" font-weight="bold">CartPole Episode Score Curve</text>
          
          <!-- 200-step Visual Reference Line -->
          <line x1="${curveX + 25}" y1="${curveY + 30}" x2="${curveX + curveW - 15}" y2="${curveY + 30}" stroke="#cf222e" stroke-dasharray="3,3" stroke-width="1.5"/>
          <text x="${curveX + curveW - 18}" y="${curveY + 26}" text-anchor="end" font-size="7" fill="#cf222e" font-weight="bold">200-Step Reference Target</text>

          <!-- Grid axes -->
          <line x1="${curveX + 25}" y1="${curveY + 15}" x2="${curveX + 25}" y2="${curveY + curveH - 20}" stroke="#d0d7de" stroke-width="1"/>
          <line x1="${curveX + 25}" y1="${curveY + curveH - 20}" x2="${curveX + curveW - 15}" y2="${curveY + curveH - 20}" stroke="#d0d7de" stroke-width="1"/>
          <text x="${curveX + 20}" y="${curveY + curveH - 18}" text-anchor="end" font-size="7" fill="#656d76">0</text>
          <text x="${curveX + 20}" y="${curveY + 33}" text-anchor="end" font-size="7" fill="#656d76">200</text>

          <!-- Performance Trajectory Curve -->
          <path d="M ${curveX + 25} ${curveY + curveH - 25} Q ${curveX + 25 + progressW * 0.4} ${curveY + curveH - 25} ${curveX + 25 + progressW} ${scoreY}" fill="none" stroke="${res.meanScore > 150 ? '#1a7f37' : (res.meanScore > 80 ? '#0969da' : '#cf222e')}" stroke-width="2.5"/>
          <circle cx="${curveX + 25 + progressW}" cy="${scoreY}" r="4" fill="${res.meanScore > 150 ? '#1a7f37' : '#0969da'}"/>

          <text x="${curveX + 25 + progressW}" y="${Math.max(curveY + 45, scoreY - 8)}" text-anchor="middle" font-size="8" font-weight="bold" fill="#24292f">${res.meanScore} pts</text>
          <text x="${curveX + curveW / 2}" y="${curveY + curveH - 6}" text-anchor="middle" font-size="7" fill="#57606a">Training Progress: ${res.episodes} episodes</text>
        </g>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateDeepQNetwork(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const scoreElem = root.querySelector("[data-metric='cartpole-score']");
    if (scoreElem) scoreElem.textContent = `${res.meanScore} / 200`;

    const lossElem = root.querySelector("[data-metric='mse-loss']");
    if (lossElem) lossElem.textContent = res.mseLoss.toFixed(4);

    const epsElem = root.querySelector("[data-metric='current-epsilon']");
    if (epsElem) epsElem.textContent = res.currentEpsilon.toFixed(3);

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
        <div data-deep-q-network-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Mean Balance Score:</span> <strong data-metric="cartpole-score">182 / 200</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Bellman MSE Loss:</span> <strong data-metric="mse-loss">0.0382</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Exploration Rate (ε):</span> <strong data-metric="current-epsilon">0.082</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">DQN Stability:</span> <strong data-metric="status">Stable DQN Convergence</strong></div>
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
            <strong>DQN Optimization Diagnostic:</strong> <span data-metric="diagnosis"></span>
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
      if (!spec) return "Interactive Deep Q-Network Simulator.";
      const res = evaluateDeepQNetwork(state, spec?.challenge?.success);
      return `Deep Q-Network simulation: Target network ${res.targetNetwork}, Replay buffer ${res.replayMode}, Sync frequency ${res.targetSyncFreq} eps, Trained ${res.episodes} episodes. Mean score: ${res.meanScore}/200, MSE loss: ${res.mseLoss}, Exploration rate: ${res.currentEpsilon}. Status: ${res.status}. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
