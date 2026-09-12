// DeepVisionLab: Interactive exploration of Deep CNN architectures (VGG, ResNet, Inception)
// and TensorFlow Image Processing pipelines.

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateDeepVision(state, challenge = {}) {
  const mode = state.mode || "architecture"; // "architecture" | "pipeline"
  
  if (mode === "pipeline") {
    const domain = state.domain || "autonomous_driving";
    const pipeline = state.pipeline || "tf_data";
    const device = state.device || "gpu";
    const precision = state.precision || "fp32";

    let latencyMs = 25;
    let throughputFps = 40;
    let memoryMb = 450;

    if (device === "gpu") {
      latencyMs = precision === "fp16" ? 8 : 14;
      throughputFps = precision === "fp16" ? 125 : 72;
      memoryMb = precision === "fp16" ? 280 : 520;
    } else if (device === "tpu") {
      latencyMs = 4;
      throughputFps = 250;
      memoryMb = 350;
    } else if (device === "edge") {
      latencyMs = precision === "int8" ? 18 : 65;
      throughputFps = precision === "int8" ? 55 : 15;
      memoryMb = precision === "int8" ? 85 : 210;
    }

    if (pipeline === "tf_data") {
      throughputFps = Math.round(throughputFps * 1.3);
    } else if (pipeline === "generator") {
      throughputFps = Math.round(throughputFps * 0.75);
    }

    const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
    const explanation = `Pipeline configured for ${domain.replace("_", " ")} on ${device.toUpperCase()}. Using ${pipeline.replace("_", ".")} achieves ~${throughputFps} FPS at ${latencyMs}ms latency with ${memoryMb}MB RAM footprint.`;

    return {
      mode,
      valid: true,
      domain,
      pipeline,
      device,
      latencyMs,
      throughputFps,
      memoryMb,
      challengeComplete,
      explanation
    };
  }

  // Default mode: architecture (VGG vs ResNet vs Inception)
  const architecture = state.architecture || "resnet";
  const depth = Number(state.depth || 50);
  const shortcuts = state.shortcuts === "enabled";
  const featureExtractor = state.featureExtractor || "conv_blocks";

  let baseParams = 0;
  let gradientFlow = 1.0;
  let identityPreserved = false;
  let bottleneck = false;

  if (architecture === "vgg") {
    // Plain deep network: susceptible to vanishing gradients at depth >= 34
    baseParams = depth === 16 ? 138357544 : 143667240;
    gradientFlow = Math.max(0.01, Math.pow(0.88, depth / 4));
    identityPreserved = false;
  } else if (architecture === "resnet") {
    // Residual network: residual connections allow identity mapping and healthy gradient flow
    bottleneck = depth >= 50;
    if (depth === 18) baseParams = 11689512;
    else if (depth === 34) baseParams = 21797672;
    else if (depth === 50) baseParams = 25557032;
    else baseParams = 44549160; // 101

    if (shortcuts) {
      gradientFlow = 0.92; // Healthy gradient preserved by identity highway
      identityPreserved = true;
    } else {
      // Degraded plain network without skip connections
      gradientFlow = Math.max(0.02, Math.pow(0.85, depth / 5));
      identityPreserved = false;
    }
  } else if (architecture === "inception") {
    // Multi-scale 1x1, 3x3, 5x5 filters
    baseParams = 23851784;
    gradientFlow = 0.85;
    identityPreserved = false;
  }

  const gradientStatus = gradientFlow > 0.7 ? "Healthy Flow" : gradientFlow > 0.3 ? "Moderate Attenuation" : "Vanishing Gradient (< 0.1)";
  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  let explanation = "";
  if (architecture === "resnet" && shortcuts) {
    explanation = `ResNet-${depth} utilizes residual shortcut connections F(x) + x. Even when layers are very deep (${depth} layers), the identity shortcut preserves gradient flow (magnitude ${gradientFlow.toFixed(2)}), solving the vanishing gradient problem.`;
  } else if (architecture === "resnet" && !shortcuts) {
    explanation = `Without skip connections, this deep plain network (${depth} layers) suffers from severe gradient vanishing (flow magnitude ${gradientFlow.toFixed(2)}), degrading training accuracy as depth increases.`;
  } else if (architecture === "vgg") {
    explanation = `VGG-${depth === 16 ? "16" : "19"} uses a homogenous linear stack of 3x3 convolutions with max pooling. Parameter count is large (${(baseParams / 1e6).toFixed(1)}M params) due to dense classification heads.`;
  } else {
    explanation = `Inception v3 processes spatial features across multiple receptive fields (1x1, 3x3, 5x5) simultaneously, concatenating diverse feature maps efficiently.`;
  }

  return {
    mode,
    valid: true,
    architecture,
    depth,
    shortcuts,
    bottleneck,
    parameters: baseParams,
    gradientFlow: Number(gradientFlow.toFixed(2)),
    gradientStatus,
    identityPreserved,
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
    const result = evaluateDeepVision(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.diagram.replaceChildren();

    if (result.mode === "pipeline") {
      const pGroup = make(doc, "div", "deep-vision-pipeline-view");
      pGroup.append(
        make(doc, "div", "deep-vision-card", `Domain: ${result.domain.toUpperCase()}`),
        make(doc, "div", "deep-vision-card", `Ingestion: ${result.pipeline}`),
        make(doc, "div", "deep-vision-card", `Device: ${result.device.toUpperCase()}`),
        make(doc, "div", "deep-vision-card", `Throughput: ${result.throughputFps} FPS`),
        make(doc, "div", "deep-vision-card", `Latency: ${result.latencyMs} ms`),
        make(doc, "div", "deep-vision-card", `Memory: ${result.memoryMb} MB`)
      );
      output.diagram.append(pGroup);
    } else {
      const archContainer = make(doc, "div", "deep-vision-arch-view");
      
      // Architecture blocks
      const inputBlock = make(doc, "div", "deep-vision-block", "Input: (224, 224, 3)");
      archContainer.append(inputBlock);

      if (result.architecture === "resnet") {
        const stage1 = make(doc, "div", "deep-vision-block", "Initial Conv: 7x7, s=2 (112x112, 64)");
        const resBlock = make(doc, "div", "deep-vision-block resnet-block");
        resBlock.innerHTML = `
          <strong>Residual Stage (${result.depth} layers)</strong><br>
          Conv(3x3) &rarr; BN &rarr; ReLU &rarr; Conv(3x3) &rarr; BN<br>
          <span style="color: ${result.shortcuts ? '#24a148' : '#da1e28'}; font-weight: bold;">
            Shortcut Connection: ${result.shortcuts ? "x + F(x) [Identity]" : "None (Plain feedforward)"}
          </span>
        `;
        const head = make(doc, "div", "deep-vision-block", "GlobalAvgPool &rarr; Dense(1000, Softmax)");
        archContainer.append(stage1, resBlock, head);
      } else if (result.architecture === "vgg") {
        const vggStack = make(doc, "div", "deep-vision-block");
        vggStack.innerHTML = `
          <strong>VGG-${result.depth} Stack</strong><br>
          2x Conv(64) &rarr; Pool &rarr; 2x Conv(128) &rarr; Pool &rarr; 3x Conv(256) &rarr; Pool &rarr; 3x Conv(512) &rarr; Pool<br>
          Dense(4096) &rarr; Dense(4096) &rarr; Dense(1000)
        `;
        archContainer.append(vggStack);
      } else {
        const incStack = make(doc, "div", "deep-vision-block");
        incStack.innerHTML = `
          <strong>Inception Modules</strong><br>
          Parallel Branches: [1x1 Conv] | [1x1 &rarr; 3x3 Conv] | [1x1 &rarr; 5x5 Conv] | [MaxPool &rarr; 1x1 Conv]<br>
          Concatenate along Channel Dimension &rarr; GlobalAvgPool
        `;
        archContainer.append(incStack);
      }

      output.diagram.append(archContainer);
    }

    output.status.textContent = result.challengeComplete ? "Challenge requirement satisfied" : "Exploring architecture parameters";
    output.status.dataset.valid = String(result.challengeComplete);
    output.metrics.innerHTML = result.mode === "pipeline"
      ? `<span>Throughput: <strong>${result.throughputFps} FPS</strong></span> | <span>Latency: <strong>${result.latencyMs} ms</strong></span> | <span>Memory: <strong>${result.memoryMb} MB</strong></span>`
      : `<span>Params: <strong>${(result.parameters / 1e6).toFixed(1)}M</strong></span> | <span>Gradient Flow: <strong style="color: ${result.gradientFlow > 0.7 ? '#24a148' : '#da1e28'}">${result.gradientFlow} (${result.gradientStatus})</strong></span> | <span>Identity Mapping: <strong>${result.identityPreserved ? "Yes" : "No"}</strong></span>`;

    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: configuration aligns with the lesson targets."
      : "Challenge in progress: adjust controls to satisfy the challenge.";

    summary = `${output.status.textContent}. ${result.explanation} ${output.challenge.textContent}`;
  }

  function updateState(candidate = {}) {
    for (const control of spec.controls) {
      const value = String(candidate[control.id] ?? state[control.id]);
      state[control.id] = value;
      if (inputs[control.id]) inputs[control.id].value = value;
    }
    render();
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("DOM container and LessonSpec required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((c) => [c.id, String(c.default)]));
      inputs = {};
      const doc = container.ownerDocument;

      root = make(doc, "div", "deep-vision-lab lab-container");
      root.setAttribute("data-deep-vision-lab", "");

      const note = make(doc, "p", "lab-note", "Conceptual Vision Architecture Lab — explores tensor topology, gradient propagation, and pipeline efficiency.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `deep-vision-${control.id}`;
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

      const display = make(doc, "div", "deep-vision-display");
      const status = make(doc, "div", "deep-vision-status");
      const metrics = make(doc, "div", "deep-vision-metrics metrics-row");
      const diagram = make(doc, "div", "deep-vision-diagram chart-wrapper");
      const explanation = make(doc, "p", "deep-vision-explanation");
      const challenge = make(doc, "div", "deep-vision-challenge");

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
      return summary || "Interactive Deep Vision Architecture Workbench.";
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

