export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/tensorflow-overview",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "TensorFlow Overview",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/5-Tensorflow_Overview.txt",
  sourceFormat: "txt",
  engine: "TensorFlowEcosystemLab",
  learningObjectives: [
    "Choose TensorFlow ecosystem components for model development, mobile/edge, JavaScript, production pipelines, reusable models, and visualization.",
    "Explain how eager execution in TensorFlow 2 differs from a prebuilt static graph during interactive debugging."
  ],
  prerequisites: ["Basic model development workflow"],
  scenario: { description: "Match a deployment or development goal to the TensorFlow tool described in the course overview.", seed: 305 },
  controls: [
    { id: "target", label: "Goal", type: "select", default: "mobile", options: [
      { value: "training", label: "Build and debug a model" }, { value: "mobile", label: "Mobile / edge inference" },
      { value: "web", label: "Browser JavaScript inference" }, { value: "pipeline", label: "Production ML pipeline" },
      { value: "reusable", label: "Reusable model modules" }, { value: "monitoring", label: "Training visualization" }
    ] },
    { id: "tool", label: "Ecosystem component", type: "select", default: "tensorflow", options: [
      { value: "tensorflow", label: "TensorFlow + Keras" }, { value: "lite", label: "TensorFlow Lite" },
      { value: "js", label: "TensorFlow.js" }, { value: "tfx", label: "TensorFlow Extended (TFX)" },
      { value: "hub", label: "TensorFlow Hub" }, { value: "tensorboard", label: "TensorBoard" }
    ] },
    { id: "execution", label: "Development execution style", type: "select", default: "eager", options: [
      { value: "eager", label: "Eager operations" }, { value: "graph", label: "Prebuilt graph" }
    ] }
  ],
  views: [{ type: "ecosystem-match", title: "TensorFlow goal-to-component decision", bindings: ["target", "tool", "execution"] }],
  explanationRules: [
    { when: "target === 'mobile' && tool === 'lite'", summary: "Mobile deployment", detail: "TensorFlow Lite is optimized for on-device and edge inference." },
    { when: "target === 'web' && tool === 'js'", summary: "JavaScript runtime", detail: "TensorFlow.js supports model use in JavaScript web applications." }
  ],
  presets: [
    { id: "mobile", label: "Mobile deployment", values: { target: "mobile", tool: "lite", execution: "eager" }, teachingPoint: "Use TensorFlow Lite for edge deployment after developing a model." },
    { id: "web", label: "Web deployment", values: { target: "web", tool: "js", execution: "eager" }, teachingPoint: "TensorFlow.js serves JavaScript environments." },
    { id: "pipeline", label: "Production pipeline", values: { target: "pipeline", tool: "tfx", execution: "eager" }, teachingPoint: "TFX supports production pipeline orchestration." }
  ],
  challenge: {
    prompt: "For mobile/edge inference, select the right TensorFlow ecosystem component and the interactive TensorFlow 2 execution style.",
    success: { target: "mobile", tool: "lite", execution: "eager" },
    hints: ["The lightweight on-device runtime is TensorFlow Lite.", "TensorFlow 2 supports eager execution for interactive development."]
  },
  quiz: [{
    prompt: "Which component is designed for TensorFlow model inference on mobile and edge devices?",
    choices: ["TensorFlow Lite", "TensorBoard", "TensorFlow Hub", "TFX"], answer: 0,
    explanation: "TensorFlow Lite targets mobile and edge deployment; TensorBoard visualizes training, Hub provides modules, and TFX supports pipelines."
  }],
  accessibility: {
    canvasSummary: "Text-based TensorFlow ecosystem selector showing a goal, chosen component, and explanation.",
    keyboardHelp: "Use Tab and Arrow keys to select the goal, TensorFlow component, and execution style."
  }
};
