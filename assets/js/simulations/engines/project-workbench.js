// ProjectWorkbench Engine: End-to-End Capstone Project Milestone and Leaderboard Dashboard

export function getProjectLeaderboard(projectId = "titanic") {
  if (projectId === "titanic") {
    return [
      { name: "RandomForestClassifier", accuracy: 0.835, f1: 0.821, roc: 0.874 },
      { name: "LogisticRegression", accuracy: 0.804, f1: 0.789, roc: 0.852 },
      { name: "KNeighborsClassifier", accuracy: 0.782, f1: 0.765, roc: 0.820 },
      { name: "DecisionTreeClassifier", accuracy: 0.765, f1: 0.751, roc: 0.795 }
    ];
  }
  return [
    { name: "RandomForestClassifier", accuracy: 0.858, f1: 0.842, roc: 0.891 },
    { name: "LogisticRegression", accuracy: 0.832, f1: 0.819, roc: 0.865 },
    { name: "LinearRegression (Rainfall)", accuracy: 0.810, f1: 0.795, roc: 0.840 },
    { name: "KNeighborsClassifier", accuracy: 0.794, f1: 0.778, roc: 0.825 }
  ];
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function update() {
    if (!root || !currentSpec) return;
    const model = currentControls.model || "rf";
    const projectId = currentSpec.id.includes("weather") ? "weather" : "titanic";
    const board = getProjectLeaderboard(projectId);

    const selected = board.find(m => m.name.toLowerCase().includes(model.toLowerCase())) || board[0];

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const accElem = root.querySelector("[data-metric='accuracy']");
    if (accElem) accElem.textContent = (selected.accuracy * 100).toFixed(1) + "%";

    const f1Elem = root.querySelector("[data-metric='f1']");
    if (f1Elem) f1Elem.textContent = selected.f1.toFixed(3);

    const rocElem = root.querySelector("[data-metric='roc']");
    if (rocElem) rocElem.textContent = selected.roc.toFixed(3);
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-project-workbench class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Accuracy:</span> <strong data-metric="accuracy">83.5%</strong></div>
            <div class="metric-card"><span class="label">F1-Score:</span> <strong data-metric="f1">0.821</strong></div>
            <div class="metric-card"><span class="label">ROC-AUC:</span> <strong data-metric="roc">0.874</strong></div>
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
      return "Capstone project multi-model evaluation leaderboard and milestone progress.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

