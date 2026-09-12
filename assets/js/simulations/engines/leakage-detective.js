// LeakageDetective Engine: Interactive Pipeline Leakage Audit and Gap Analyzer

export function evaluateLeakageScenario(scenarioId) {
  if (scenarioId === "prescale") {
    return {
      hasLeakage: true,
      leakType: "Pre-split Global Feature Standardization",
      apparentScore: 0.965,
      trueScore: 0.742,
      gap: 0.223,
      diagnosis: "Critical Data Leakage"
    };
  } else if (scenarioId === "temporal") {
    return {
      hasLeakage: true,
      leakType: "Future Lookahead in Time-Series Data",
      apparentScore: 0.982,
      trueScore: 0.615,
      gap: 0.367,
      diagnosis: "Critical Data Leakage"
    };
  } else if (scenarioId === "target_encode") {
    return {
      hasLeakage: true,
      leakType: "Target Mean Encoding on Full Dataset",
      apparentScore: 0.991,
      trueScore: 0.680,
      gap: 0.311,
      diagnosis: "Critical Data Leakage"
    };
  }
  return {
    hasLeakage: false,
    leakType: "Strictly Isolated Pipeline within Cross-Validation Folds",
    apparentScore: 0.865,
    trueScore: 0.858,
    gap: 0.007,
    diagnosis: "Balanced"
  };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function update() {
    if (!root || !currentSpec) return;
    const scenario = currentControls.scenario || currentSpec.controls.find(c => c.id === "scenario")?.default || "prescale";
    const res = evaluateLeakageScenario(scenario);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = res.diagnosis;

    const valElem = root.querySelector("[data-metric='apparent']");
    if (valElem) valElem.textContent = (res.apparentScore * 100).toFixed(1) + "%";

    const prodElem = root.querySelector("[data-metric='true']");
    if (prodElem) prodElem.textContent = (res.trueScore * 100).toFixed(1) + "%";

    const leakDesc = root.querySelector("[data-leak-description]");
    if (leakDesc) leakDesc.textContent = res.leakType;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-leakage-detective class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Critical Data Leakage</strong></div>
            <div class="metric-card"><span class="label">Apparent Validation:</span> <strong data-metric="apparent">96.5%</strong></div>
            <div class="metric-card"><span class="label">True Production:</span> <strong data-metric="true">74.2%</strong></div>
          </div>
          <div class="leak-audit-panel">
            <p><strong>Pipeline Audit:</strong> <span data-leak-description>Pre-split Global Feature Standardization</span></p>
          </div>
          <div class="controls-panel">
            ${spec.controls.map(c => `
              <div class="control-group">
                <label for="ctrl-${c.id}">${c.label}</label>
                ${c.type === "select" ? `
                  <select id="ctrl-${c.id}" data-control="${c.id}">
                    ${c.options.map(o => `<option value="${o.value}" ${o.value === c.default ? "selected" : ""}>${o.label}</option>`).join("")}
                  </select>
                ` : `
                  <input type="${c.type}" id="ctrl-${c.id}" data-control="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.default}">
                `}
              </div>
            `).join("")}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-control]").forEach(input => {
        input.addEventListener("input", (e) => {
          currentControls[e.target.dataset.control] = e.target.value;
          update();
        });
      });

      update();
    },
    update,
    reset() {
      if (!currentSpec) return;
      for (const ctrl of currentSpec.controls) currentControls[ctrl.id] = ctrl.default;
      update();
    },
    getAccessibleSummary() {
      return "Interactive data leakage detective comparing apparent validation scores against true production generalization.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

