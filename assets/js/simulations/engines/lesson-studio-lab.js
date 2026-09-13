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

export function evaluateLessonStudio(state = {}, challenge = {}) {
  const expected = Object.entries(challenge || {});
  const matched = expected.filter(([key, value]) => String(state[key]) === String(value)).length;
  const total = expected.length || 1;
  const alignment = Math.round((matched / total) * 100);
  const evidence = Math.round(35 + alignment * 0.6);
  const risk = Math.max(0, 100 - Math.round(20 + alignment * 0.8));

  return {
    matched,
    total,
    alignment,
    evidence,
    risk,
    challengeComplete: expected.length > 0 && matched === expected.length
  };
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

    if (control.type === "select") {
      return `<div class="control-group">
        <label for="lesson-studio-${id}">${label}</label>
        <select id="lesson-studio-${id}" data-control="${id}">
          ${(control.options || []).map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
        </select>
      </div>`;
    }

    if (control.type === "toggle") {
      return `<div class="control-group"><label><input type="checkbox" data-control="${id}" ${value ? "checked" : ""}> ${label}</label></div>`;
    }

    return `<div class="control-group">
      <label for="lesson-studio-${id}">${label}</label>
      <input id="lesson-studio-${id}" type="${escapeHtml(control.type || "text")}" data-control="${id}" min="${escapeHtml(control.min ?? "")}" max="${escapeHtml(control.max ?? "")}" step="${escapeHtml(control.step ?? "")}" value="${escapeHtml(value)}">
    </div>`;
  }

  function renderWorkflow(result) {
    const workflow = spec.simulation?.workflow || ["Frame the task", "Choose an approach", "Check the result"];
    const active = Math.min(workflow.length - 1, Math.floor((result.matched / Math.max(result.total, 1)) * workflow.length));
    const width = 660;
    const height = 132;
    const stepWidth = 175;
    const gap = (width - workflow.length * stepWidth) / Math.max(workflow.length - 1, 1);
    const nodes = workflow.map((step, index) => {
      const x = 15 + index * (stepWidth + gap);
      const enabled = index <= active;
      const fill = enabled ? "#dff3ff" : "#f6f8fa";
      const stroke = enabled ? "#0969da" : "#8c959f";
      const lines = String(step).match(/.{1,24}(?:\s|$)/g) || [String(step)];
      return `<g>
        <rect x="${x}" y="28" width="${stepWidth}" height="66" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${enabled ? 2 : 1}"/>
        <circle cx="${x + 18}" cy="47" r="10" fill="${stroke}"/><text x="${x + 18}" y="51" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${index + 1}</text>
        ${lines.slice(0, 2).map((line, lineIndex) => `<text x="${x + 36}" y="${48 + lineIndex * 15}" font-size="11" fill="#1f2328">${escapeHtml(line.trim())}</text>`).join("")}
        ${index < workflow.length - 1 ? `<path d="M ${x + stepWidth + 5} 61 H ${x + stepWidth + gap - 8}" stroke="#8c959f" stroke-width="2" marker-end="url(#lesson-studio-arrow)"/>` : ""}
      </g>`;
    }).join("");

    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(spec.accessibility?.canvasSummary || "Lesson workflow")}" style="width:100%;max-width:100%;height:auto;display:block;">
      <defs><marker id="lesson-studio-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#8c959f"/></marker></defs>
      <rect width="${width}" height="${height}" rx="10" fill="#ffffff" stroke="#d0d7de"/>
      <text x="16" y="18" font-size="11" font-weight="700" fill="#57606a">${escapeHtml(spec.simulation?.topic || "Interactive lesson workflow")}</text>
      ${nodes}
    </svg>`;
  }

  function renderCheckpoint(result) {
    const quiz = spec.quiz?.[0];
    if (!quiz) return "";
    const choices = quiz.choices || quiz.options || [];
    return `<details class="lesson-studio-checkpoint" style="margin-top:12px;">
      <summary>Knowledge checkpoint</summary>
      <p>${escapeHtml(quiz.prompt || quiz.question)}</p>
      <ol>${choices.map((choice) => `<li>${escapeHtml(choice)}</li>`).join("")}</ol>
      <p><strong>Reflect:</strong> ${escapeHtml(quiz.explanation || "Use the source lesson to verify your reasoning.")}</p>
    </details>`;
  }

  function render() {
    if (!root || !spec) return;
    const result = evaluateLessonStudio(state, spec.challenge?.success);
    const controls = spec.controls || [];
    const selected = controls.map((control) => `${control.label}: ${optionLabel(control, state[control.id])}`);
    const status = result.challengeComplete ? "Challenge complete" : "Configuration in progress";
    const insight = result.challengeComplete
      ? spec.simulation?.successInsight || "This configuration meets the lesson's modeled decision criteria. Compare it with the source before using it in a real project."
      : spec.simulation?.nextInsight || "Adjust the controls to align each decision with the lesson goal, then observe how the modeled evidence and risk change.";

    root.innerHTML = `<section data-lesson-studio class="lab-container" style="min-width:0;max-width:100%;box-sizing:border-box;">
      <div class="metrics-row" style="min-width:0;max-width:100%;box-sizing:border-box;">
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[0] || "Configuration fit")}:</span> <strong data-metric="alignment">${result.alignment}%</strong></div>
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[1] || "Evidence coverage")}:</span> <strong data-metric="evidence">${result.evidence}%</strong></div>
        <div class="metric-card"><span class="label">${escapeHtml(spec.simulation?.metrics?.[2] || "Modeled risk")}:</span> <strong data-metric="risk">${result.risk}%</strong></div>
      </div>
      <div class="presets-row" style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;min-width:0;">
        ${(spec.presets || []).map((preset) => `<button type="button" class="preset-btn" data-preset-id="${escapeHtml(preset.id)}">${escapeHtml(preset.label)}</button>`).join("")}
      </div>
      <div class="chart-wrapper" data-chart-container style="min-width:0;max-width:100%;overflow-x:auto;">${renderWorkflow(result)}</div>
      <div class="controls-panel" style="min-width:0;max-width:100%;box-sizing:border-box;">${controls.map(renderControl).join("")}</div>
      <div class="lesson-studio-insight" data-lesson-insight style="margin-top:12px;padding:12px;border:1px solid #d0d7de;border-radius:8px;background:#f6f8fa;line-height:1.55;overflow-wrap:anywhere;">
        <strong>${escapeHtml(status)}.</strong> ${escapeHtml(insight)}
        <div style="margin-top:7px;font-size:.9em;color:#57606a;">${escapeHtml(selected.join(" · "))}</div>
      </div>
      <div class="simulation-disclosure" data-simulation-disclosure style="margin-top:10px;padding:8px 10px;border:1px solid #d4a72c;border-radius:6px;background:#fff8c5;color:#744500;font-size:.9em;line-height:1.45;"><strong>Notice:</strong> ${DISCLOSURE}</div>
      <div class="challenge-status" data-testid="challenge-status" data-success="${String(result.challengeComplete)}" style="margin-top:10px;padding:11px 12px;border-left:3px solid ${result.challengeComplete ? "#1a7f37" : "#0969da"};background:${result.challengeComplete ? "#dafbe1" : "#ddf4ff"};line-height:1.45;">
        ${escapeHtml(status)}: ${escapeHtml(spec.challenge?.prompt || "Explore the lesson controls.")}
      </div>
      ${renderCheckpoint(result)}
    </section>`;

    root.querySelectorAll("[data-control]").forEach((input) => {
      const onChange = (event) => {
        const control = controls.find((item) => item.id === event.target.dataset.control);
        state[control.id] = control.type === "toggle" ? event.target.checked : event.target.value;
        render();
        dispatchChange();
      };
      input.addEventListener("input", onChange);
      input.addEventListener("change", onChange);
    });

    root.querySelectorAll("[data-preset-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = spec.presets.find((item) => item.id === button.dataset.presetId);
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
      if (!spec) return "Interactive lesson studio is not active.";
      const result = evaluateLessonStudio(state, spec.challenge?.success);
      return `${spec.title}. ${spec.simulation?.topic || "Interactive lesson"}. Configuration fit ${result.alignment} percent; modeled risk ${result.risk} percent. ${result.challengeComplete ? "Challenge complete." : "Challenge in progress."}`;
    },
    destroy() {
      if (root) root.replaceChildren();
      root = null;
      spec = null;
      state = {};
    }
  };
}
