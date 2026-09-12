const TARGETS = Object.freeze({
  training: { title: "Build and debug a model", tool: "tensorflow", reason: "TensorFlow 2 supports eager execution and integrates high-level Keras APIs for model development." },
  mobile: { title: "Deploy to a mobile or edge device", tool: "lite", reason: "TensorFlow Lite targets low-latency inference on mobile and edge devices." },
  web: { title: "Run inference in a web app", tool: "js", reason: "TensorFlow.js brings models and tensor operations to JavaScript environments." },
  pipeline: { title: "Manage a production ML pipeline", tool: "tfx", reason: "TensorFlow Extended (TFX) provides production pipeline components." },
  reusable: { title: "Find reusable model components", tool: "hub", reason: "TensorFlow Hub hosts reusable trained model modules." },
  monitoring: { title: "Visualize training behaviour", tool: "tensorboard", reason: "TensorBoard visualizes metrics and graphs during development." },
  clustering: { title: "Cluster unlabelled data & extract representations", tool: "tensorflow", reason: "TensorFlow and Keras preprocess high-dimensional tensors and train autoencoder representations, interoperating with scikit-learn for KMeans clustering and t-SNE projection." }
});

export function evaluateTensorFlowChoice({ target, tool, execution }, challenge = null) {
  const task = TARGETS[target];
  if (!task || !["tensorflow", "lite", "js", "tfx", "hub", "tensorboard"].includes(tool) || !["eager", "graph"].includes(execution)) {
    throw new RangeError("Unknown TensorFlow ecosystem choice.");
  }
  const isMatch = task.tool === tool;
  const challengeComplete = challenge && typeof challenge === "object"
    ? Object.entries(challenge).every(([k, v]) => ({ target, tool, execution }[k] === v))
    : (target === "mobile" && tool === "lite" && execution === "eager");

  return {
    task,
    match: isMatch,
    challengeComplete,
    feedback: isMatch ? task.reason : `For this goal, choose ${task.tool}: ${task.reason}`,
    executionNote: execution === "eager"
      ? "TensorFlow 2 eager execution evaluates operations immediately, which helps ordinary Python debugging."
      : "Static graph execution represents a compiled computation path; it is not the default interactive style described in the source overview."
  };
}

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

export function createEngine() {
  let root = null, spec = null, state = null, selects = null, output = null, summary = "";
  function render() {
    const result = evaluateTensorFlowChoice(state, spec?.challenge?.success);
    output.task.textContent = result.task.title;
    output.status.textContent = result.match ? "Suitable ecosystem component" : "Choose a different component";
    output.status.dataset.match = String(result.match);
    output.feedback.textContent = result.feedback;
    output.execution.textContent = result.executionNote;
    output.challenge.textContent = result.challengeComplete
      ? `Challenge complete: ${spec?.challenge?.prompt || "Selected component matches target."}`
      : `Challenge in progress: ${spec?.challenge?.prompt || "Choose matching components."}`;
    summary = `${result.task.title}. ${output.status.textContent}. ${result.feedback} ${result.executionNote} ${output.challenge.textContent}`;
  }
  function updateState(candidate = {}) {
    for (const control of spec.controls) {
      const value = candidate[control.id] ?? state[control.id];
      if (control.options.some((option) => option.value === value)) state[control.id] = value;
      selects[control.id].value = state[control.id];
    }
    render();
  }
  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("A DOM container and LessonSpec are required.");
      if (root) this.destroy();
      const doc = container.ownerDocument;
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((control) => [control.id, control.default]));
      selects = {};
      root = make(doc, "div", "tensorflow-ecosystem-lab");
      root.setAttribute("data-tensorflow-ecosystem-lab", "");
      const controls = make(doc, "div", "tensorflow-ecosystem-controls");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const select = make(doc, "select");
        select.id = `tensorflow-ecosystem-${control.id}`;
        label.htmlFor = select.id;
        for (const option of control.options) {
          const item = make(doc, "option", "", option.label);
          item.value = option.value;
          select.append(item);
        }
        select.value = state[control.id];
        select.addEventListener("change", () => updateState({ [control.id]: select.value }));
        selects[control.id] = select;
        group.append(label, select);
        controls.append(group);
      }
      root.append(controls);
      const presets = make(doc, "div", "tensorflow-ecosystem-presets");
      for (const preset of spec.presets) {
        const button = make(doc, "button", "", preset.label);
        button.type = "button";
        button.addEventListener("click", () => updateState(preset.values));
        presets.append(button);
      }
      root.append(presets);
      output = {
        task: make(doc, "h3"), status: make(doc, "strong", "tensorflow-ecosystem-status"),
        feedback: make(doc, "p"), execution: make(doc, "p"), challenge: make(doc, "p", "tensorflow-ecosystem-challenge")
      };
      const result = make(doc, "section", "tensorflow-ecosystem-result");
      result.append(output.task, output.status, output.feedback, output.execution);
      root.append(result, output.challenge);
      container.append(root);
      render();
    },
    update(candidate = {}) { if (root) updateState(candidate); },
    reset() { if (root) updateState(Object.fromEntries(spec.controls.map((control) => [control.id, control.default]))); },
    getAccessibleSummary() { return summary; },
    destroy() { root?.remove(); root = null; spec = null; state = null; selects = null; output = null; summary = ""; }
  };
}
