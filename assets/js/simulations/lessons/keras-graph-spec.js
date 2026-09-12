const BASE_DEFAULTS = Object.freeze({
  api: "sequential", branches: "1", hidden: "32", shared: "no", custom: "no", dynamic: "no", classes: "1"
});

export function defineKerasGraphSpec(metadata) {
  const defaults = { ...BASE_DEFAULTS, ...metadata.defaults };
  const controls = [
    { id: "api", label: "Keras model API", type: "select", default: defaults.api, options: [
      { value: "sequential", label: "Sequential stack" },
      { value: "functional", label: "Functional graph" },
      { value: "subclass", label: "Subclassed Model with call()" }
    ] },
    { id: "branches", label: "Input branches", type: "select", default: defaults.branches, options: [
      { value: "1", label: "One input" }, { value: "2", label: "Two inputs, merged" }
    ] },
    { id: "hidden", label: "Units in each hidden branch", type: "range", min: 8, max: 64, step: 8, default: Number(defaults.hidden) },
    { id: "shared", label: "Share branch weights", type: "select", default: defaults.shared, options: [
      { value: "no", label: "Independent weights" }, { value: "yes", label: "Reuse one Dense layer" }
    ] },
    { id: "custom", label: "Custom Dense-like layer", type: "select", default: defaults.custom, options: [
      { value: "no", label: "Standard Dense only" }, { value: "yes", label: "Custom build() and call()" }
    ] },
    { id: "dynamic", label: "Dynamic call() logic", type: "select", default: defaults.dynamic, options: [
      { value: "no", label: "Static graph" }, { value: "yes", label: "Python control flow in call()" }
    ] },
    { id: "classes", label: "Output", type: "select", default: defaults.classes, options: [
      { value: "1", label: "Binary: 1 sigmoid unit" }, { value: "3", label: "Three classes: 3 softmax units" }
    ] }
  ];
  const { defaults: ignoredDefaults, focus, ...fields } = metadata;
  return {
    ...fields,
    scenario: { description: metadata.scenario, seed: metadata.seed },
    controls,
    views: [
      { type: "architecture-graph", title: "Input, hidden, merge and output layers", bindings: ["api", "branches", "shared", "custom", "dynamic", "classes"] },
      { type: "parameter-accounting", title: "Conceptual trainable parameters", bindings: ["hidden", "branches", "shared", "custom", "classes"] }
    ],
    explanationRules: [
      { when: "graph is valid", summary: "Architecture fits the chosen API", detail: focus },
      { when: "graph is invalid", summary: "Choose a more expressive API", detail: "Sequential is limited to a single linear stack; Functional supports explicit branches and shared layers, while subclassing supports dynamic call() logic." }
    ],
    presets: [
      { id: "target-design", label: "Lesson target design", values: { ...defaults, ...metadata.challenge.success }, teachingPoint: focus },
      { id: "simple-stack", label: "Simple Sequential contrast", values: { ...BASE_DEFAULTS }, teachingPoint: "A linear Sequential stack cannot express every advanced Keras graph." }
    ],
    challenge: metadata.challenge,
    quiz: metadata.quiz,
    accessibility: {
      canvasSummary: "Conceptual Keras architecture graph showing inputs, Dense layers, optional sharing and custom layers, output activation, and parameter accounting.",
      keyboardHelp: "Use Tab and Arrow keys to change the architecture controls; presets apply a complete design."
    }
  };
}
