// ToolComparator Engine: Deep Learning Framework and Ecosystem Comparison Matrix

export function getToolProfile(toolId) {
  switch (toolId) {
    case "keras":
      return {
        name: "Keras",
        level: "High-Level API",
        backing: "Google / Multi-backend",
        strengths: "Rapid Prototyping, Clean Pythonic API, Beginners & Industry",
        easeScore: 9.5,
        speedScore: 8.5
      };
    case "pytorch":
      return {
        name: "PyTorch",
        level: "Dynamic Graph / Research",
        backing: "Meta / Linux Foundation",
        strengths: "Academic Research, Dynamic Eager Execution, Custom CUDA Ops",
        easeScore: 8.0,
        speedScore: 9.0
      };
    case "tensorflow":
      return {
        name: "TensorFlow",
        level: "End-to-End Platform",
        backing: "Google",
        strengths: "TF Serving, TFLite Mobile, Enterprise Deployment",
        easeScore: 7.5,
        speedScore: 9.2
      };
    default:
      return {
        name: "Keras",
        level: "High-Level API",
        backing: "Google",
        strengths: "Fast development",
        easeScore: 9.0,
        speedScore: 8.5
      };
  }
}

export function evaluateToolMatch({ priority = "prototyping", deployment = "web" } = {}) {
  let recommendedTool = "Keras";
  if (priority === "research") recommendedTool = "PyTorch";
  else if (deployment === "mobile_enterprise") recommendedTool = "TensorFlow";

  return {
    recommendedTool,
    diagnosis: "Balanced",
    profile: getToolProfile(recommendedTool.toLowerCase())
  };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderComparisonSVG(toolId) {
    const width = 480, height = 200;
    const profile = getToolProfile(toolId);

    return `
      <svg viewBox="0 0 ${width} ${height}" class="tool-matrix-chart" role="img" aria-label="Deep Learning Framework Comparison Matrix">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <text x="30" y="40" font-size="16" font-weight="bold" fill="#0f62fe">${profile.name} (${profile.level})</text>
        <text x="30" y="70" font-size="11" fill="#555">Ecosystem Backing: ${profile.backing}</text>
        <text x="30" y="95" font-size="11" fill="#555">Primary Strengths: ${profile.strengths}</text>
        
        <!-- Score bars -->
        <text x="30" y="135" font-size="10" fill="#161616">Ease of Use: ${profile.easeScore}/10</text>
        <rect x="150" y="125" width="${profile.easeScore * 25}" height="12" fill="#0f62fe" rx="2"/>

        <text x="30" y="165" font-size="10" fill="#161616">Compute Speed: ${profile.speedScore}/10</text>
        <rect x="150" y="155" width="${profile.speedScore * 25}" height="12" fill="#24a148" rx="2"/>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const tool = currentControls.tool || currentSpec.controls.find(c => c.id === "tool")?.default || "keras";
    const profile = getToolProfile(tool);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderComparisonSVG(tool);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = "Balanced";

    const nameElem = root.querySelector("[data-metric='tool-name']");
    if (nameElem) nameElem.textContent = profile.name;

    const levelElem = root.querySelector("[data-metric='tool-level']");
    if (levelElem) levelElem.textContent = profile.level;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-tool-comparator class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Selected Framework:</span> <strong data-metric="tool-name">Keras</strong></div>
            <div class="metric-card"><span class="label">Abstraction Tier:</span> <strong data-metric="tool-level">High-Level API</strong></div>
          </div>
          <div data-chart-container class="chart-wrapper"></div>
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
      return "Interactive deep learning library comparison matrix exploring Keras, PyTorch, and TensorFlow ecosystems.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

