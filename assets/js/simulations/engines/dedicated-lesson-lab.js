const DISCLOSURE = "Illustrative simulation — it models a learning decision and does not run a notebook, train a model, or call an external service.";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function optionLabel(control, value) {
  return control?.options?.find((option) => String(option.value) === String(value))?.label || String(value);
}

function defaultState(spec) {
  return Object.fromEntries((spec.controls || []).map((control) => [control.id, control.default]));
}

export function evaluateDedicatedLesson(state = {}, challenge = {}) {
  const expected = Object.entries(challenge || {});
  const matched = expected.filter(([key, value]) => String(state[key]) === String(value)).length;
  const total = expected.length || 1;
  const alignment = Math.round((matched / total) * 100);
  const evidence = Math.round(30 + alignment * 0.68);
  const risk = Math.max(0, 95 - Math.round(10 + alignment * 0.85));
  return {
    matched,
    total,
    alignment,
    evidence,
    risk,
    challengeComplete: expected.length > 0 && matched === expected.length
  };
}

function renderGlyph(mode, progress) {
  const active = progress >= 50 ? "#0969da" : "#8c959f";
  const good = progress === 100 ? "#1a7f37" : active;
  if (["tensor", "autograd"].includes(mode)) {
    return `<g aria-hidden="true"><rect x="18" y="35" width="82" height="62" rx="7" fill="#f6f8fa" stroke="${active}"/><path d="M45 35V97M73 35V97M18 56H100M18 77H100" stroke="#8c959f"/><circle cx="86" cy="47" r="7" fill="${good}"/><path d="M129 64h54" stroke="${active}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><circle cx="220" cy="64" r="27" fill="#ddf4ff" stroke="${good}"/><text x="220" y="69" text-anchor="middle" font-size="20" font-weight="700" fill="#0550ae">∂</text></g>`;
  }
  if (["regression", "optimizer", "validation"].includes(mode)) {
    return `<g aria-hidden="true"><path d="M20 100 C 55 88, 73 68, 105 73 S 160 112, 216 39" fill="none" stroke="${active}" stroke-width="4"/><path d="M20 110H245M25 22V110" stroke="#8c959f"/><circle cx="216" cy="39" r="8" fill="${good}"/><path d="M143 84l20 -14 18 10 20 -22" fill="none" stroke="${good}" stroke-width="3" stroke-dasharray="5 4"/></g>`;
  }
  if (["classification", "probability", "loss", "reinforcement"].includes(mode)) {
    return `<g aria-hidden="true"><path d="M20 100 L98 25" stroke="${active}" stroke-width="3"/><circle cx="49" cy="42" r="10" fill="#ffebe9" stroke="#cf222e"/><circle cx="70" cy="78" r="10" fill="#dafbe1" stroke="#1a7f37"/><circle cx="113" cy="48" r="10" fill="#dafbe1" stroke="#1a7f37"/><rect x="154" y="75" width="20" height="25" rx="3" fill="#ddf4ff"/><rect x="182" y="57" width="20" height="43" rx="3" fill="#ddf4ff"/><rect x="210" y="35" width="20" height="65" rx="3" fill="${good}"/></g>`;
  }
  if (["network", "activation", "vision", "performance"].includes(mode)) {
    const nodes = [[36, 46], [36, 82], [104, 40], [104, 64], [104, 88], [182, 54], [182, 78]];
    const links = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6]];
    return `<g aria-hidden="true">${links.map(([from, to]) => `<path d="M${nodes[from][0]} ${nodes[from][1]} L${nodes[to][0]} ${nodes[to][1]}" stroke="#8c959f"/>`).join("")}${nodes.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="12" fill="${index > 4 ? good : "#ddf4ff"}" stroke="${active}"/>`).join("")}<rect x="211" y="37" width="42" height="42" rx="5" fill="#f6f8fa" stroke="${good}"/><path d="M225 37V79M239 37V79M211 51H253M211 65H253" stroke="#8c959f"/></g>`;
  }
  if (["nlp", "embedding", "sequence", "transformer"].includes(mode)) {
    const tokens = ["AI", "learns", "from", "context"];
    return `<g aria-hidden="true">${tokens.map((token, index) => `<rect x="${16 + index * 60}" y="43" width="51" height="28" rx="6" fill="${index === 3 ? "#dafbe1" : "#ddf4ff"}" stroke="${active}"/><text x="${41 + index * 60}" y="61" text-anchor="middle" font-size="10" fill="#1f2328">${token}</text>`).join("")}<path d="M42 95 C 72 122, 141 122, 198 83" fill="none" stroke="${good}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><path d="M205 42h42v42h-42zM219 42v42M233 42v42M205 56h42M205 70h42" fill="#f6f8fa" stroke="#8c959f"/></g>`;
  }
  if (["finetune", "alignment", "rag", "chain", "prompt", "agent", "strategy", "ui"].includes(mode)) {
    return `<g aria-hidden="true"><rect x="18" y="40" width="58" height="48" rx="7" fill="#f6f8fa" stroke="#8c959f"/><text x="47" y="68" text-anchor="middle" font-size="11" fill="#1f2328">Source</text><path d="M82 64h35" stroke="${active}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><rect x="125" y="40" width="58" height="48" rx="7" fill="#ddf4ff" stroke="${active}"/><text x="154" y="68" text-anchor="middle" font-size="11" fill="#1f2328">Decision</text><path d="M189 64h35" stroke="${good}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><rect x="232" y="40" width="58" height="48" rx="7" fill="#dafbe1" stroke="${good}"/><text x="261" y="68" text-anchor="middle" font-size="11" fill="#1f2328">Evidence</text></g>`;
  }
  return `<g aria-hidden="true"><circle cx="44" cy="65" r="24" fill="#ddf4ff" stroke="${active}"/><path d="M74 65h48" stroke="${active}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><circle cx="152" cy="65" r="24" fill="#f6f8fa" stroke="${active}"/><path d="M182 65h48" stroke="${good}" stroke-width="3" marker-end="url(#dedicated-arrow)"/><circle cx="260" cy="65" r="24" fill="#dafbe1" stroke="${good}"/></g>`;
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function dispatchChange() {
    if (!root || typeof root.dispatchEvent !== "function") return;
    try {
      root.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (_) {
      root.dispatchEvent({ type: "change", bubbles: true });
    }
  }

  function renderControl(control) {
    const id = escapeHtml(control.id);
    const label = escapeHtml(control.label);
    const value = state[control.id];
    if (control.type === "toggle") {
      return `<div class="control-group"><label><input type="checkbox" data-control="${id}" ${value ? "checked" : ""}> ${label}</label></div>`;
    }
    if (control.type === "select") {
      return `<div class="control-group"><label for="dedicated-${id}">${label}</label><select id="dedicated-${id}" data-control="${id}">${(control.options || []).map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></div>`;
    }
    return `<div class="control-group"><label for="dedicated-${id}">${label}</label><input id="dedicated-${id}" data-control="${id}" type="${escapeHtml(control.type || "text")}" value="${escapeHtml(value)}"></div>`;
  }

  function renderVisual(result) {
    const workflow = spec.simulation?.workflow || ["Inspect", "Practice", "Verify"];
    const mode = spec.activity?.mode || "concept";
    const family = spec.activity?.family || "Dedicated lesson activity";
    const completedSteps = Math.min(workflow.length, Math.max(1, Math.ceil((result.matched / Math.max(result.total, 1)) * workflow.length)));
    const stepWidth = 180;
    const positions = workflow.map((_, index) => 16 + index * 211);
    return `<div class="dedicated-visual" data-visual-mode="${escapeHtml(mode)}" style="min-width:0;max-width:100%;overflow-x:auto;">
      <svg viewBox="0 0 660 260" role="img" aria-label="${escapeHtml(spec.accessibility?.canvasSummary || family)}" style="display:block;width:100%;min-width:520px;max-width:100%;height:auto;">
        <defs><marker id="dedicated-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#57606a"/></marker></defs>
        <rect width="660" height="260" rx="10" fill="#ffffff" stroke="#d0d7de"/>
        <text x="18" y="24" font-size="13" font-weight="700" fill="#1f2328">${escapeHtml(family)} · ${escapeHtml(spec.activity?.simulation || spec.title)}</text>
        <text x="18" y="44" font-size="11" fill="#57606a">${escapeHtml(spec.activity?.interaction || "Configure the lesson activity and inspect the modeled evidence.")}</text>
        ${renderGlyph(mode, result.alignment)}
        ${workflow.map((step, index) => {
          const isActive = index < completedSteps;
          const fill = isActive ? "#ddf4ff" : "#f6f8fa";
          const stroke = isActive ? "#0969da" : "#8c959f";
          const lines = String(step).match(/.{1,25}(?:\s|$)/g) || [String(step)];
          return `<g><rect x="${positions[index]}" y="158" width="180" height="71" rx="8" fill="${fill}" stroke="${stroke}"/><circle cx="${positions[index] + 17}" cy="178" r="9" fill="${stroke}"/><text x="${positions[index] + 17}" y="182" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${index + 1}</text>${lines.slice(0, 2).map((line, lineIndex) => `<text x="${positions[index] + 33}" y="181" font-size="10.5" fill="#1f2328">${escapeHtml(line.trim())}</text>`).join("")}${index < workflow.length - 1 ? `<path d="M${positions[index] + 185} 193H${positions[index + 1] - 8}" stroke="#8c959f" stroke-width="2" marker-end="url(#dedicated-arrow)"/>` : ""}</g>`;
        }).join("")}
      </svg>
    </div>`;
  }

  function renderCheckpoint() {
    const quiz = spec.quiz?.[0];
    if (!quiz) return "";
    return `<details class="lesson-studio-checkpoint" style="margin-top:12px;"><summary>Knowledge checkpoint</summary><p>${escapeHtml(quiz.prompt || quiz.question)}</p><ol>${(quiz.choices || quiz.options || []).map((choice) => `<li>${escapeHtml(choice)}</li>`).join("")}</ol><p><strong>Reflect:</strong> ${escapeHtml(quiz.explanation || "Use the source lesson to verify your reasoning.")}</p></details>`;
  }

  function render() {
    if (!root || !spec) return;
    const result = evaluateDedicatedLesson(state, spec.challenge?.success);
    const controls = spec.controls || [];
    const selected = controls.map((control) => `${control.label}: ${optionLabel(control, state[control.id])}`);
    const status = result.challengeComplete ? "Challenge complete" : "Configuration in progress";
    const insight = result.challengeComplete
      ? spec.simulation?.successInsight
      : spec.simulation?.nextInsight;
    root.innerHTML = `<section data-dedicated-lesson-lab data-lesson-activity="${escapeHtml(spec.activity?.id)}" class="lab-container" style="min-width:0;max-width:100%;box-sizing:border-box;">
      <div class="metrics-row" style="min-width:0;max-width:100%;box-sizing:border-box;">
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[0] || "Configuration fit")}:</span> <strong data-metric="alignment">${result.alignment}%</strong></div>
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[1] || "Evidence coverage")}:</span> <strong data-metric="evidence">${result.evidence}%</strong></div>
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[2] || "Modeled risk")}:</span> <strong data-metric="risk">${result.risk}%</strong></div>
      </div>
      <div class="presets-row" style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;min-width:0;">${(spec.presets || []).map((preset) => `<button type="button" class="preset-btn" data-preset-id="${escapeHtml(preset.id)}">${escapeHtml(preset.label)}</button>`).join("")}</div>
      ${renderVisual(result)}
      <div class="controls-panel" style="min-width:0;max-width:100%;box-sizing:border-box;">${controls.map(renderControl).join("")}</div>
      <div data-lesson-insight style="margin-top:12px;padding:12px;border:1px solid #d0d7de;border-radius:8px;background:#f6f8fa;line-height:1.55;overflow-wrap:anywhere;"><strong>${escapeHtml(status)}.</strong> ${escapeHtml(insight || "Adjust the controls and compare the result with the source lesson.")}<div style="margin-top:7px;font-size:.9em;color:#57606a;">${escapeHtml(selected.join(" · "))}</div></div>
      <div class="simulation-disclosure" data-simulation-disclosure style="margin-top:10px;padding:8px 10px;border:1px solid #d4a72c;border-radius:6px;background:#fff8c5;color:#744500;font-size:.9em;line-height:1.45;"><strong>Notice:</strong> ${DISCLOSURE}</div>
      <div class="challenge-status" data-testid="challenge-status" data-success="${String(result.challengeComplete)}" style="margin-top:10px;padding:11px 12px;border-left:3px solid ${result.challengeComplete ? "#1a7f37" : "#0969da"};background:${result.challengeComplete ? "#dafbe1" : "#ddf4ff"};line-height:1.45;">${escapeHtml(status)}: ${escapeHtml(spec.challenge?.prompt || "Explore the lesson controls.")}</div>
      ${renderCheckpoint()}
    </section>`;

    root.querySelectorAll?.("[data-control]").forEach((input) => {
      const onChange = (event) => {
        const control = controls.find((item) => item.id === event.target.dataset.control);
        if (!control) return;
        state[control.id] = control.type === "toggle" ? event.target.checked : event.target.value;
        render();
        dispatchChange();
      };
      input.addEventListener?.("input", onChange);
      input.addEventListener?.("change", onChange);
    });
    root.querySelectorAll?.("[data-preset-id]").forEach((button) => {
      button.addEventListener?.("click", () => {
        const preset = spec.presets?.find((item) => item.id === button.dataset.presetId);
        if (!preset) return;
        state = { ...state, ...preset.values };
        render();
        dispatchChange();
      });
    });
  }

  return {
    mount(container, lessonSpec) {
      root = container;
      spec = lessonSpec;
      state = defaultState(spec);
      render();
    },
    update(values = {}) {
      state = { ...state, ...values };
      render();
      dispatchChange();
    },
    reset() {
      if (!spec) return;
      state = defaultState(spec);
      render();
      dispatchChange();
    },
    getAccessibleSummary() {
      if (!spec) return "Dedicated lesson activity is not active.";
      const result = evaluateDedicatedLesson(state, spec.challenge?.success);
      return `${spec.title}. ${spec.activity?.simulation || "Interactive lesson activity"}. Configuration fit ${result.alignment} percent; modeled risk ${result.risk} percent. ${result.challengeComplete ? "Challenge complete." : "Challenge in progress."}`;
    },
    destroy() {
      root?.replaceChildren?.();
      root = null;
      spec = null;
      state = {};
    }
  };
}
