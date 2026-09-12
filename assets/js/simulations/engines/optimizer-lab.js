// OptimizerLab Engine: 2D Loss Surface, Gradient Descent Trajectories & Momentum

export function evaluateLossSurface(w1, w2) {
  const loss = w1 * w1 + 3.0 * w2 * w2;
  const gradW1 = 2.0 * w1;
  const gradW2 = 6.0 * w2;
  return { loss, gradW1, gradW2 };
}

export function computeGradientDescentTrajectory({ lr = 0.1, steps = 20, algorithm = "sgd", start = [3.0, 2.5] } = {}) {
  const points = [[start[0], start[1]]];
  let [w1, w2] = start;
  let v1 = 0, v2 = 0;
  const momentum = 0.8;

  for (let i = 0; i < steps; i++) {
    const { gradW1, gradW2 } = evaluateLossSurface(w1, w2);

    if (algorithm === "momentum") {
      v1 = momentum * v1 + lr * gradW1;
      v2 = momentum * v2 + lr * gradW2;
      w1 -= v1;
      w2 -= v2;
    } else {
      w1 -= lr * gradW1;
      w2 -= lr * gradW2;
    }
    points.push([w1, w2]);
  }

  const finalLoss = evaluateLossSurface(w1, w2).loss;
  const status = isNaN(finalLoss) || finalLoss > 100 ? "Diverged" : (finalLoss < 0.05 ? "Converged" : "Iterating");
  return { points, finalLoss, status };
}

export function createEngine() {
  let root = null;
  let currentSpec = null;
  let currentControls = {};

  function renderLossSurfaceSVG(points) {
    const width = 480, height = 240, cx = width / 2, cy = height / 2;
    const scale = 50;

    let contoursSvg = "";
    [0.5, 1.5, 3.0, 5.0, 8.0].forEach(r => {
      contoursSvg += `<ellipse cx="${cx}" cy="${cy}" rx="${r * scale}" ry="${(r / Math.sqrt(3)) * scale}" fill="none" stroke="#ccc" stroke-dasharray="2,2"/>`;
    });

    let pathD = "";
    points.forEach(([w1, w2], i) => {
      const px = cx + w1 * scale;
      const py = cy - w2 * scale;
      if (i === 0) pathD += `M ${px} ${py}`;
      else pathD += ` L ${px} ${py}`;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" class="loss-surface-chart" role="img" aria-label="Gradient Descent Loss Surface Contour">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f4f4f4)" rx="4"/>
        <line x1="${cx}" y1="10" x2="${cx}" y2="${height-10}" stroke="#ddd"/>
        <line x1="10" y1="${cy}" x2="${width-10}" y2="${cy}" stroke="#ddd"/>
        ${contoursSvg}
        <path d="${pathD}" fill="none" stroke="#0f62fe" stroke-width="2.5"/>
        <circle cx="${cx + points[0][0] * scale}" cy="${cy - points[0][1] * scale}" r="5" fill="#ff832b"/>
        <circle cx="${cx + points[points.length-1][0] * scale}" cy="${cy - points[points.length-1][1] * scale}" r="6" fill="#24a148"/>
      </svg>
    `;
  }

  function update() {
    if (!root || !currentSpec) return;
    const lr = parseFloat(currentControls.lr ?? currentSpec.controls.find(c => c.id === "lr")?.default ?? 0.1);
    const algorithm = currentControls.algorithm || currentSpec.controls.find(c => c.id === "algorithm")?.default || "sgd";
    const steps = parseInt(currentControls.steps ?? 20, 10);

    const traj = computeGradientDescentTrajectory({ lr, steps, algorithm, start: [2.5, 2.0] });

    const chartContainer = root.querySelector("[data-chart-container]");
    if (chartContainer) chartContainer.innerHTML = renderLossSurfaceSVG(traj.points);

    const diagElem = root.querySelector("[data-testid='diagnosis']");
    if (diagElem) diagElem.textContent = traj.status === "Converged" ? "Balanced" : (traj.status === "Diverged" ? "Divergent" : "Suboptimal");

    const lossElem = root.querySelector("[data-metric='loss']");
    if (lossElem) lossElem.textContent = traj.finalLoss.toFixed(4);

    const statusElem = root.querySelector("[data-metric='status']");
    if (statusElem) statusElem.textContent = traj.status;
  }

  return {
    mount(container, spec) {
      root = container;
      currentSpec = spec;
      currentControls = {};
      for (const ctrl of spec.controls) currentControls[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-optimizer-lab class="lab-container">
          <div class="metrics-row">
            <div class="metric-card"><span class="label">Diagnosis:</span> <strong data-testid="diagnosis">Balanced</strong></div>
            <div class="metric-card"><span class="label">Final Loss:</span> <strong data-metric="loss">0.0120</strong></div>
            <div class="metric-card"><span class="label">Trajectory Status:</span> <strong data-metric="status">Converged</strong></div>
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
      return "Interactive 2D gradient descent loss surface and optimizer trajectory simulator.";
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
    }
  };
}

