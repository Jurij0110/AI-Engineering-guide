// ImageAugmentationLab: Keras ImageDataGenerator & Preprocessing Simulation

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateImageAugmentation(state, challenge = {}) {
  const rotation = Number(state.rotation || 0);
  const flip = state.flip === "yes" || state.flip === true;
  const zoom = Number(state.zoom || 0);
  const shift = Number(state.shift || 0);
  const normalization = state.normalization || "none";
  const noise = Number(state.noise || 0);

  // Diversity score: 0 to 100%
  let diversity = 0;
  diversity += Math.min(35, rotation * 0.8);
  diversity += flip ? 20 : 0;
  diversity += Math.min(25, zoom * 70);
  diversity += Math.min(20, shift * 80);
  diversity += Math.min(15, noise * 75);
  diversity = Math.min(100, Math.round(diversity));

  // Semantic integrity check
  // Extreme rotation or excessive noise destroys orientation/digit semantics
  let semanticSafe = true;
  const warnings = [];
  if (rotation > 45) {
    semanticSafe = false;
    warnings.push("High rotation (> 45°) risks corrupting orientation-sensitive objects (e.g. 6 vs 9, traffic signs).");
  }
  if (noise > 0.12) {
    semanticSafe = false;
    warnings.push("Noise level too high (> 0.12) obscures critical edge primitives.");
  }
  if (zoom > 0.35) {
    semanticSafe = false;
    warnings.push("Excessive zoom crops away key subject features.");
  }

  // Statistical properties after normalization
  let pixelMean = 127.5;
  let pixelStd = 62.0;
  if (normalization === "rescale") {
    pixelMean = 0.50;
    pixelStd = 0.24;
  } else if (normalization === "featurewise" || normalization === "samplewise") {
    pixelMean = 0.00;
    pixelStd = 1.00;
  }

  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  let explanation = `Augmentation produces ~${diversity}% batch diversity. Normalization (${normalization}) sets pixel mean=${pixelMean.toFixed(2)}, std=${pixelStd.toFixed(2)}.`;
  if (!semanticSafe) {
    explanation += ` WARNING: ${warnings.join(" ")}`;
  } else {
    explanation += ` Semantic class boundaries are preserved safely.`;
  }

  return {
    valid: true,
    diversity,
    semanticSafe,
    warnings,
    pixelMean,
    pixelStd,
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
    const result = evaluateImageAugmentation(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.status.textContent = result.challengeComplete ? "Challenge completed!" : result.semanticSafe ? "Balanced Augmentation" : "Semantic Drift Warning";
    output.status.dataset.valid = String(result.challengeComplete);

    output.metrics.innerHTML = `
      <div class="metric-card"><span class="label">Batch Diversity:</span> <strong>${result.diversity}%</strong></div>
      <div class="metric-card"><span class="label">Semantic Integrity:</span> <strong style="color: ${result.semanticSafe ? '#24a148' : '#da1e28'}">${result.semanticSafe ? "Preserved" : "At Risk"}</strong></div>
      <div class="metric-card"><span class="label">Tensor Mean:</span> <strong>${result.pixelMean.toFixed(2)}</strong></div>
      <div class="metric-card"><span class="label">Tensor Std:</span> <strong>${result.pixelStd.toFixed(2)}</strong></div>
    `;

    // Render sample image variations (SVG grid)
    output.preview.replaceChildren();
    const previewGrid = make(doc, "div", "image-aug-preview-grid");

    const rot = Number(state.rotation || 0);
    const flip = state.flip === "yes";
    const zoom = Number(state.zoom || 0);
    const shift = Number(state.shift || 0);
    const noise = Number(state.noise || 0);

    const samples = [
      { label: "Original Input", r: 0, f: 1, z: 1, sX: 0, sY: 0 },
      { label: "Sample A (Augmented)", r: rot * 0.7, f: flip ? -1 : 1, z: 1 + zoom * 0.5, sX: shift * 15, sY: -shift * 8 },
      { label: "Sample B (Augmented)", r: -rot * 0.5, f: 1, z: 1 - zoom * 0.3, sX: -shift * 10, sY: shift * 12 },
      { label: "Sample C (Augmented)", r: rot, f: flip ? -1 : 1, z: 1 + zoom, sX: shift * 8, sY: shift * 15 }
    ];

    for (const sample of samples) {
      const card = make(doc, "div", "image-aug-sample-card");
      card.append(make(doc, "span", "image-aug-sample-label", sample.label));

      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("width", "90");
      svg.setAttribute("height", "90");
      svg.style.background = state.normalization === "none" ? "#f4f4f4" : state.normalization === "rescale" ? "#e0e7ff" : "#d1fae5";
      svg.style.borderRadius = "4px";
      svg.style.overflow = "hidden";

      const g = doc.createElementNS("http://www.w3.org/2000/svg", "g");
      const transform = `translate(${50 + sample.sX}, ${50 + sample.sY}) rotate(${sample.r}) scale(${sample.f * sample.z}, ${sample.z}) translate(-50, -50)`;
      g.setAttribute("transform", transform);

      // A distinct airplane / bird glyph to show orientation and semantic shape
      g.innerHTML = `
        <polygon points="50,20 60,45 85,50 60,60 65,80 50,70 35,80 40,60 15,50 40,45" fill="#0f62fe" opacity="${1 - noise * 2}"/>
        <circle cx="50" cy="30" r="4" fill="#fa4d56"/>
      `;
      svg.append(g);
      card.append(svg);
      previewGrid.append(card);
    }

    output.preview.append(previewGrid);
    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: augmentation parameters match target specifications."
      : "Challenge in progress: configure parameters to satisfy the challenge.";

    summary = `${output.status.textContent}. Diversity: ${result.diversity}%. ${result.explanation} ${output.challenge.textContent}`;
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("DOM container and LessonSpec required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((c) => [c.id, String(c.default)]));
      inputs = {};
      const doc = container.ownerDocument;

      root = make(doc, "div", "image-augmentation-lab lab-container");
      root.setAttribute("data-image-augmentation-lab", "");

      const note = make(doc, "p", "lab-note", "Keras ImageDataGenerator & Preprocessing Pipeline Simulator — inspect real-time augmentations, batch diversity, and tensor normalization.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `img-aug-${control.id}`;
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

      const display = make(doc, "div", "image-aug-display");
      const status = make(doc, "div", "image-aug-status");
      const metrics = make(doc, "div", "image-aug-metrics metrics-row");
      const preview = make(doc, "div", "image-aug-preview chart-wrapper");
      const explanation = make(doc, "p", "image-aug-explanation");
      const challenge = make(doc, "div", "image-aug-challenge");

      display.append(status, metrics, preview, explanation, challenge);
      root.append(display);

      output = { status, metrics, preview, explanation, challenge };
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
      return summary || "Interactive Image Augmentation and Preprocessing Lab.";
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

