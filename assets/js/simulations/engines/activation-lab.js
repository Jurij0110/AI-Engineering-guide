// ActivationLab Engine: Activation Functions, Derivatives, and Deep Vanishing Gradient Propagation

export function evaluateActivationAndDerivative(z, activation = "relu") {
  switch (activation) {
    case "sigmoid": {
      const sig = 1 / (1 + Math.exp(-z));
      return { value: sig, derivative: sig * (1 - sig) };
    }
    case "tanh": {
      const t = Math.tanh(z);
      return { value: t, derivative: 1 - t * t };
    }
    case "leaky_relu": {
      const alpha = 0.1;
      return { value: z >= 0 ? z : alpha * z, derivative: z >= 0 ? 1.0 : alpha };
    }
    case "relu":
    default: {
      return { value: Math.max(0, z), derivative: z > 0 ? 1.0 : 0.0 };
    }
  }
}

export function calculateDeepGradientScale(activation = "sigmoid", depth = 8) {
  const maxDeriv = activation === "sigmoid" ? 0.25 : (activation === "tanh" ? 1.0 : (activation === "relu" ? 1.0 : 0.1));
  return Math.pow(maxDeriv, depth);
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderActivationCurvesSVG(activation, depth) {
    const width = 480, height = 200, cx = width / 2, cy = height / 2;
    const scaleX = 35, scaleY = 40;

    let fnPath = "", derivPath = "";
    for (let x = -5.0; x <= 5.0; x += 0.2) {
      const { value, derivative } = evaluateActivationAndDerivative(x, activation);
      const px = cx + x * scaleX;
      const pyFn = cy - value * scaleY;
      const pyDeriv = cy - derivative * scaleY;

      if (fnPath === "") fnPath += `M ${px} ${pyFn}`;
      else fnPath += ` L ${px} ${pyFn}`;

      if (derivPath === "") derivPath += `M ${px} ${pyDeriv}`;
      else derivPath += ` L ${px} ${pyDeriv}`;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" class="activation-curves-chart" role="img" aria-label="Activation Function and Derivative Curves">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="${cx}" y1="10" x2="${cx}" y2="${height-10}" stroke="#ddd"/>
        <line x1="10" y1="${cy}" x2="${width-10}" y2="${cy}" stroke="#ddd"/>
        <path d="${fnPath}" fill="none" stroke="#0f62fe" stroke-width="2.5"/>
        <path d="${derivPath}" fill="none" stroke="#ff832b" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="20" y="25" fill="#0f62fe" font-size="11" font-weight="bold">f(z)</text>
        <text x="60" y="25" fill="#ff832b" font-size="11" font-weight="bold">f'(z)</text>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const activation = currentControls.activation || currentSpec.controls.find(c => c.id === "activation")?.default || "relu";
    const depth = parseInt(currentControls.depth ?? currentSpec.controls.find(c => c.id === "depth")?.default ?? 6, 10);

    const gradScale = calculateDeepGradientScale(activation, depth);

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderActivationCurvesSVG(activation, depth);

    const isVanishing = (activation === "sigmoid" && depth >= 4) || (activation === "tanh" && depth >= 8);
    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = isVanishing ? "Vanishing Gradient" : "Balanced";

    const scaleElem = root.querySelector("[data-metric='grad-scale']");
    if (scaleElem) scaleElem.textContent = gradScale < 1e-4 ? gradScale.toExponential(2) : gradScale.toFixed(3);

    const actNameElem = root.querySelector("[data-metric='act-name']");
    if (actNameElem) actNameElem.textContent = activation.toUpperCase();
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-activation-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Activation:</span> <strong data-metric="act-name">RELU</strong></div>
            <div class="metric-card"><span class="label">Deep Gradient Scale:</span> <strong data-metric="grad-scale">1.000</strong></div>
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
      return "Interactive activation functions and deep vanishing gradient simulator.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

