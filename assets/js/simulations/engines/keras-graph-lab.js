// A graph-design workbench, not a Keras runtime or a claim of trained accuracy.
const APIS = new Set(["sequential", "functional", "subclass"]);

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateKerasGraph(state, challenge = {}) {
  const api = String(state.api);
  const branches = Number(state.branches);
  const hidden = Number(state.hidden);
  const classes = Number(state.classes);
  const shared = state.shared === "yes";
  const custom = state.custom === "yes";
  const dynamic = state.dynamic === "yes";
  if (!APIS.has(api) || ![1, 2].includes(branches) || !Number.isInteger(hidden) || hidden < 1 || hidden > 256 || ![1, 3].includes(classes)) {
    throw new RangeError("Invalid architecture controls.");
  }
  const problems = [];
  if (api === "sequential" && branches > 1) problems.push("Sequential cannot express this two-input merge; use Functional or subclassing.");
  if (api === "sequential" && shared) problems.push("Shared branches require an explicit graph, not a simple Sequential stack.");
  if (dynamic && api !== "subclass") problems.push("Dynamic Python control flow in call() requires a subclassed Model in this exercise.");
  if (shared && branches === 1) problems.push("Weight sharing needs at least two input paths here.");
  const valid = problems.length === 0;
  const branchParams = (20 + 1) * hidden * (shared ? 1 : branches);
  const mergeWidth = branches * hidden;
  const customParams = custom ? (mergeWidth + 1) * hidden : 0;
  const outputWidth = custom ? hidden : mergeWidth;
  const outputParams = (outputWidth + 1) * classes;
  const parameters = branchParams + customParams + outputParams;
  const activation = classes === 1 ? "sigmoid" : "softmax";
  const challengeComplete = valid && Object.entries(challenge).every(([key, value]) => state[key] === value);
  return {
    valid, problems, parameters, activation, challengeComplete,
    explanation: valid
      ? `${api === "sequential" ? "Sequential" : api === "functional" ? "Functional API" : "Subclassed Model"} can represent these choices. ${shared ? "The same Dense weights are reused on both input paths. " : "Each input path has its own Dense weights. "}${custom ? "A custom Dense-like layer adds trainable weights through build() and transforms inputs in call()." : "Standard Dense layers provide the transformations."}`
      : problems.join(" ")
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
    const result = evaluateKerasGraph(state, spec.challenge.success);
    output.graph.replaceChildren();
    const doc = root.ownerDocument;
    for (let index = 1; index <= Number(state.branches); index += 1) {
      output.graph.append(make(doc, "div", "keras-graph-node", `Input ${index}: 20 features → Dense(${state.hidden})`));
    }
    if (state.branches === "2") output.graph.append(make(doc, "div", "keras-graph-node", state.shared === "yes" ? "Shared Dense weights → concatenate" : "Independent Dense paths → concatenate"));
    if (state.custom === "yes") output.graph.append(make(doc, "div", "keras-graph-node", `Custom Layer(${state.hidden}): build() + call()`));
    output.graph.append(make(doc, "div", "keras-graph-node", `Output: Dense(${state.classes}, ${result.activation})`));
    output.status.textContent = result.valid ? "Valid conceptual graph" : "Graph needs revision";
    output.status.dataset.valid = String(result.valid);
    output.parameters.textContent = result.valid ? `${result.parameters.toLocaleString()} trainable parameters` : "Parameter count shown for the requested graph only";
    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: the architecture matches the requested design."
      : "Challenge in progress: align the controls with the lesson challenge.";
    summary = `${output.status.textContent}. ${result.explanation} ${result.valid ? output.parameters.textContent + ". " : ""}${output.challenge.textContent} This diagram is conceptual; it does not train a Keras model.`;
  }

  function updateState(candidate = {}) {
    for (const control of spec.controls) {
      const value = String(candidate[control.id] ?? state[control.id]);
      const valid = control.type === "select"
        ? control.options.some((option) => option.value === value)
        : Number(value) >= control.min && Number(value) <= control.max && (Number(value) - control.min) % control.step === 0;
      if (valid) state[control.id] = value;
      inputs[control.id].value = state[control.id];
    }
    render();
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("A DOM container and LessonSpec are required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((control) => [control.id, String(control.default)]));
      inputs = {};
      const doc = container.ownerDocument;
      root = make(doc, "div", "keras-graph-lab");
      root.setAttribute("data-keras-graph-lab", "");
      root.append(make(doc, "p", "keras-graph-note", "Architecture design only — this simulation does not execute Python or train a model."));
      const controls = make(doc, "div", "keras-graph-controls");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `keras-graph-${control.id}`;
        label.htmlFor = id;
        const input = make(doc, control.type === "select" ? "select" : "input");
        input.id = id;
        input.dataset.control = control.id;
        if (control.type === "select") {
          for (const option of control.options) {
            const child = make(doc, "option", "", option.label);
            child.value = option.value;
            input.append(child);
          }
        } else {
          input.type = "range";
          input.min = control.min;
          input.max = control.max;
          input.step = control.step;
        }
        input.value = state[control.id];
        input.addEventListener(control.type === "select" ? "change" : "input", () => updateState({ [control.id]: input.value }));
        inputs[control.id] = input;
        group.append(label, input);
        controls.append(group);
      }
      root.append(controls);
      const presets = make(doc, "div", "keras-graph-presets");
      for (const preset of spec.presets) {
        const button = make(doc, "button", "", preset.label);
        button.type = "button";
        button.addEventListener("click", () => updateState(preset.values));
        presets.append(button);
      }
      root.append(presets);
      output = {
        graph: make(doc, "div", "keras-graph-flow"),
        status: make(doc, "strong", "keras-graph-status"),
        parameters: make(doc, "p"),
        explanation: make(doc, "p"),
        challenge: make(doc, "p", "keras-graph-challenge")
      };
      const result = make(doc, "section", "keras-graph-result");
      result.append(output.status, output.parameters, output.explanation);
      root.append(output.graph, result, output.challenge);
      container.append(root);
      render();
    },
    update(candidate = {}) { if (root) updateState(candidate); },
    reset() { if (root) updateState(Object.fromEntries(spec.controls.map((control) => [control.id, control.default]))); },
    getAccessibleSummary() { return summary; },
    destroy() {
      root?.remove();
      root = null; spec = null; state = null; inputs = null; output = null; summary = "";
    }
  };
}
