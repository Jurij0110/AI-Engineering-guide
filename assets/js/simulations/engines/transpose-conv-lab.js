// TransposeConvLab: Transposed Convolution (Conv2DTranspose) vs UpSampling2D + Conv2D
// Demonstrating spatial upsampling mathematics and Checkerboard Artifact mitigation.

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateTransposeConv(state, challenge = {}) {
  const inputDim = Number(state.inputDim || 4);
  const kernelSize = Number(state.kernelSize || 3);
  const stride = Number(state.stride || 2);
  const padding = state.padding || "same";
  const method = state.method || "conv2d_transpose"; // "conv2d_transpose" | "upsample_conv"

  let outputDim = 8;
  if (method === "upsample_conv") {
    outputDim = inputDim * stride;
  } else {
    // conv2d_transpose
    if (padding === "same") {
      outputDim = inputDim * stride;
    } else {
      // valid
      outputDim = (inputDim - 1) * stride + kernelSize;
    }
  }

  // Checkerboard artifact occurs in Conv2DTranspose when kernel size is not divisible by stride
  const isDivisible = (kernelSize % stride) === 0;
  let hasCheckerboard = false;
  let artifactScore = 0; // 0 to 100

  if (method === "conv2d_transpose") {
    if (!isDivisible) {
      hasCheckerboard = true;
      artifactScore = 85;
    } else {
      hasCheckerboard = false;
      artifactScore = 10;
    }
  } else {
    // upsample_conv (Bilinear / Nearest UpSampling + Conv2D) is smooth and artifact-free
    hasCheckerboard = false;
    artifactScore = 5;
  }

  const quality = hasCheckerboard ? "Degraded (Checkerboard Artifacts)" : "Smooth / Clean Reconstruction";
  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  let explanation = "";
  if (method === "conv2d_transpose") {
    if (hasCheckerboard) {
      explanation = `Conv2DTranspose with Kernel ${kernelSize} and Stride ${stride} causes uneven receptive field overlap because ${kernelSize} is NOT divisible by ${stride} (${kernelSize} % ${stride} = ${kernelSize % stride}). This creates high-frequency checkerboard artifacts in reconstructed images.`;
    } else {
      explanation = `Conv2DTranspose with Kernel ${kernelSize} and Stride ${stride} produces uniform receptive field overlap because ${kernelSize} is divisible by ${stride}. Checkerboard artifacts are eliminated!`;
    }
  } else {
    explanation = `UpSampling2D (bilinear interpolation) followed by Conv2D decouples the spatial magnification from feature extraction, completely avoiding transposed convolution checkerboard artifacts.`;
  }

  return {
    valid: true,
    inputDim,
    outputDim,
    kernelSize,
    stride,
    padding,
    method,
    hasCheckerboard,
    artifactScore,
    quality,
    challengeComplete,
    explanation
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = null;
  let inputs = null;
  let output = null;
  let summary = "";

  function render() {
    if (!root) return;
    const result = evaluateTransposeConv(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.status.textContent = result.challengeComplete ? "Challenge complete!" : !result.hasCheckerboard ? "Artifact-Free Configuration" : "Checkerboard Artifact Detected";
    output.status.dataset.valid = String(result.challengeComplete);

    output.metrics.innerHTML = `
      <div class="metric-card"><span class="label">Input Tensor:</span> <strong>${result.inputDim}x${result.inputDim}</strong></div>
      <div class="metric-card"><span class="label">Output Tensor:</span> <strong>${result.outputDim}x${result.outputDim}</strong></div>
      <div class="metric-card"><span class="label">Artifact Severity:</span> <strong style="color: ${result.hasCheckerboard ? '#da1e28' : '#24a148'}">${result.hasCheckerboard ? "High (Uneven Overlap)" : "None (Uniform)"}</strong></div>
      <div class="metric-card"><span class="label">Visual Quality:</span> <strong>${result.quality.split(' ')[0]}</strong></div>
    `;

    // Overlap visualization SVG
    output.diagram.replaceChildren();
    const vizContainer = make(doc, "div", "tc-viz-container");

    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 280 140");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "140");
    svg.style.background = "#fafafa";
    svg.style.borderRadius = "4px";
    svg.style.border = "1px solid #e0e0e0";

    // Draw input grid (small 4x4)
    let inCells = "";
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        inCells += `<rect x="${20 + c * 14}" y="${40 + r * 14}" width="12" height="12" fill="#8a3ffc" rx="1"/>`;
      }
    }

    // Draw output grid (8x8)
    let outCells = "";
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        let fill = "#0f62fe";
        let opacity = 0.7;
        if (result.hasCheckerboard) {
          // Alternating checkerboard color
          const isEven = (r + c) % 2 === 0;
          fill = isEven ? "#da1e28" : "#f1c21b";
          opacity = isEven ? 0.9 : 0.4;
        }
        outCells += `<rect x="${140 + c * 14}" y="${15 + r * 14}" width="12" height="12" fill="${fill}" fill-opacity="${opacity}" rx="1"/>`;
      }
    }

    svg.innerHTML = `
      <text x="35" y="30" font-size="10" font-weight="bold" fill="#525252">Input (${result.inputDim}x${result.inputDim})</text>
      ${inCells}
      
      <!-- Arrow -->
      <path d="M 85 68 L 125 68 M 120 63 L 125 68 L 120 73" stroke="#525252" stroke-width="2" fill="none"/>
      <text x="88" y="60" font-size="9" fill="#0f62fe" font-weight="bold">x${result.stride} Upsample</text>

      <text x="155" y="10" font-size="10" font-weight="bold" fill="#525252">Output (${result.outputDim}x${result.outputDim})</text>
      ${outCells}
    `;

    vizContainer.append(svg);
    output.diagram.append(vizContainer);

    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: upsampling eliminates checkerboard distortion."
      : "Challenge in progress: configure parameters to eliminate checkerboard artifacts.";

    summary = `${output.status.textContent}. Input: ${result.inputDim}x${result.inputDim} -> Output: ${result.outputDim}x${result.outputDim}. ${result.explanation} ${output.challenge.textContent}`;
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("DOM container and LessonSpec required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((c) => [c.id, String(c.default)]));
      inputs = {};
      const doc = container.ownerDocument;

      root = make(doc, "div", "transpose-conv-lab lab-container");
      root.setAttribute("data-transpose-conv-lab", "");

      const note = make(doc, "p", "lab-note", "Transposed Convolution & Upsampling Lab — inspect spatial expansion formulas, kernel stride overlap, and the Checkerboard Artifact problem.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `tc-${control.id}`;
        label.setAttribute("for", id);
        let input;

        if (control.type === "select") {
          input = make(doc, "select");
          input.id = id;
          input.setAttribute("data-control", control.id);
          for (const opt of control.options) {
            const optEl = make(doc, "option", "", opt.label);
            optEl.value = opt.value;
            if (String(opt.value) === String(control.default)) optEl.selected = true;
            input.append(optEl);
          }
        } else {
          input = make(doc, "input");
          input.id = id;
          input.type = control.type;
          input.setAttribute("data-control", control.id);
          if (control.min !== undefined) input.min = String(control.min);
          if (control.max !== undefined) input.max = String(control.max);
          if (control.step !== undefined) input.step = String(control.step);
          input.value = String(control.default);
        }

        input.addEventListener("input", (e) => {
          state[control.id] = e.target.value;
          render();
        });

        inputs[control.id] = input;
        group.append(label, input);
        controlsWrapper.append(group);
      }
      root.append(controlsWrapper);

      const display = make(doc, "div", "tc-display");
      const status = make(doc, "div", "tc-status");
      const metrics = make(doc, "div", "tc-metrics metrics-row");
      const diagram = make(doc, "div", "tc-diagram chart-wrapper");
      const explanation = make(doc, "p", "tc-explanation");
      const challenge = make(doc, "div", "tc-challenge");

      display.append(status, metrics, diagram, explanation, challenge);
      root.append(display);

      output = { status, metrics, diagram, explanation, challenge };
      container.append(root);
      render();
    },
    update() {
      render();
    },
    reset() {
      if (!spec) return;
      for (const c of spec.controls) {
        state[c.id] = String(c.default);
        if (inputs[c.id]) inputs[c.id].value = String(c.default);
      }
      render();
    },
    getAccessibleSummary() {
      return summary || "Interactive Transposed Convolution Lab.";
    },
    destroy() {
      if (root) {
        root.replaceChildren();
        root.remove();
      }
      root = null;
      spec = null;
      state = null;
      inputs = null;
      output = null;
    }
  };
}

