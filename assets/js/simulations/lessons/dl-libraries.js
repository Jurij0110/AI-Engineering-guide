export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-3-keras-and-dl-libraries/dl-libraries",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-3-keras-and-dl-libraries",
  title: "DL Libraries",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-3-Keras_and_DL_Libraries/1-DL_Libraries.txt",
  sourceFormat: "txt",
  engine: "ToolComparator",
  learningObjectives: [
    "Compare major deep learning frameworks: Keras (high-level rapid prototyping), TensorFlow (Google enterprise/serving), and PyTorch (Meta dynamic research).",
    "Choose appropriate software stack tiers based on research vs production deployment requirements."
  ],
  prerequisites: [
    "Deep learning workflow overview",
    "Python API paradigms"
  ],
  scenario: {
    description: "Explore the deep learning library ecosystem. Compare abstraction levels, development speed, and ecosystem support between Keras, PyTorch, and TensorFlow.",
    seed: 5252
  },
  controls: [
    {
      id: "tool",
      label: "Deep Learning Framework",
      type: "select",
      options: [
        { value: "keras", label: "Keras (High-Level Pythonic API)" },
        { value: "pytorch", label: "PyTorch (Dynamic Eager Execution / Research)" },
        { value: "tensorflow", label: "TensorFlow (Production Serving & Mobile)" }
      ],
      default: "keras"
    }
  ],
  views: [
    {
      type: "comparison-matrix",
      title: "Library Capability Matrix",
      bindings: ["tool"]
    },
    {
      type: "metric-cards",
      title: "Selected Ecosystem Profile",
      bindings: ["tool-name", "tool-level", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "tool === 'keras'",
      summary: "Keras High-Level Efficiency",
      detail: "Keras abstracts away low-level tensor plumbing into intuitive Sequential and Functional APIs, running seamlessly atop TensorFlow."
    }
  ],
  presets: [
    {
      id: "keras-default",
      label: "Keras Framework",
      values: { tool: "keras" },
      teachingPoint: "Keras allows building complex deep neural networks with only a few readable lines of Python."
    }
  ],
  challenge: {
    prompt: "Select Keras to review its high-level API tier and achieve Balanced status.",
    success: { tool: "keras", diagnosis: "Balanced" },
    hints: [
      "Select Keras (High-Level Pythonic API)."
    ]
  },
  quiz: [
    {
      prompt: "What is Keras's relationship to low-level computational backends like TensorFlow?",
      choices: [
        "Keras serves as a user-friendly, high-level API that compiles model definitions into efficient low-level execution graphs running on backends like TensorFlow.",
        "Keras is an operating system kernel.",
        "Keras is a hardware GPU driver.",
        "Keras only executes on HTML canvas."
      ],
      answer: 0,
      explanation: "Keras provides high-level abstractions while leveraging backends like TensorFlow for low-level tensor math and CUDA GPU execution."
    },
    {
      prompt: "Why is PyTorch particularly popular in academic machine learning research?",
      choices: [
        "Its dynamic computation graph (imperative eager execution) allows easy Pythonic debugging, custom control flows, and rapid research iteration.",
        "Because it has no math libraries.",
        "Because PyTorch only works on CPU.",
        "Because PyTorch cannot train neural networks."
      ],
      answer: 0,
      explanation: "PyTorch's eager dynamic graph construction makes modifying architectures and debugging gradient flows native and straightforward in Python."
    }
  ],
  accessibility: {
    canvasSummary: "Framework comparison matrix illustrating capability scores and primary strengths of Keras, PyTorch, and TensorFlow.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

