export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/activation-functions",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Activation Functions",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/5-Activation_Functions.txt",
  sourceFormat: "txt",
  engine: "ActivationLab",
  learningObjectives: [
    "Compare non-linear activation functions: Binary Step, Linear, Sigmoid, Tanh, ReLU, LeakyReLU, and Softmax.",
    "Select appropriate activations for hidden layers (ReLU/LeakyReLU) versus output layers (Sigmoid for binary, Softmax for multiclass, Linear for regression)."
  ],
  prerequisites: [
    "Non-linear representation concepts",
    "Classification vs Regression outputs"
  ],
  scenario: {
    description: "Explore the comprehensive taxonomy of neural activation functions. Compare function curves, derivative bounds, and sparsity characteristics.",
    seed: 5050
  },
  controls: [
    {
      id: "activation",
      label: "Activation Family",
      type: "select",
      options: [
        { value: "relu", label: "ReLU: max(0, z) — Sparse & Fast" },
        { value: "leaky_relu", label: "LeakyReLU: max(0.1z, z) — Prevents Dead Neurons" },
        { value: "tanh", label: "Tanh: Zero-Centered [-1, 1]" },
        { value: "sigmoid", label: "Sigmoid: Probability [0, 1]" }
      ],
      default: "relu"
    },
    {
      id: "depth",
      label: "Layer Propagation Depth",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4
    }
  ],
  views: [
    {
      type: "activation-curves",
      title: "Activation Function & Derivative Comparison",
      bindings: ["activation", "depth"]
    },
    {
      type: "metric-cards",
      title: "Activation Diagnostics",
      bindings: ["act-name", "grad-scale", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "activation === 'relu'",
      summary: "ReLU Industry Standard",
      detail: "ReLU provides non-linearity, computational simplicity, sparse activation representations, and gradient scale preservation."
    },
    {
      when: "activation === 'leaky_relu'",
      summary: "LeakyReLU Non-Zero Gradient",
      detail: "LeakyReLU retains a small positive slope (alpha=0.1) for negative inputs, preventing 'dying ReLU' dead neuron traps."
    }
  ],
  presets: [
    {
      id: "relu-standard",
      label: "Standard ReLU",
      values: { activation: "relu", depth: 4 },
      teachingPoint: "ReLU is the default recommended activation for dense and convolutional hidden layers."
    },
    {
      id: "leaky-standard",
      label: "LeakyReLU Anti-Dying",
      values: { activation: "leaky_relu", depth: 4 },
      teachingPoint: "LeakyReLU maintains gradient recovery for negative pre-activations."
    }
  ],
  challenge: {
    prompt: "Select ReLU or LeakyReLU to achieve Balanced status and Gradient Scale >= 0.01.",
    success: { diagnosis: "Balanced" },
    hints: [
      "Select ReLU or LeakyReLU."
    ]
  },
  quiz: [
    {
      prompt: "What is the 'Dying ReLU' problem and how does LeakyReLU solve it?",
      choices: [
        "If a neuron's weights update such that it always outputs negative values, its gradient becomes permanently 0; LeakyReLU keeps a small slope (e.g. 0.01) so it can recover.",
        "The computer running out of RAM.",
        "ReLU changing into a sigmoid function.",
        "Loss becoming negative."
      ],
      answer: 0,
      explanation: "Standard ReLU has zero gradient for z < 0, which can permanently deactivate neurons; LeakyReLU provides a small recovery gradient."
    },
    {
      prompt: "Why is Tanh preferred over Sigmoid in zero-centered hidden layer activations?",
      choices: [
        "Tanh outputs range from -1 to 1 with zero mean, preventing systematic positive bias drift during gradient descent updates.",
        "Tanh is purely linear.",
        "Tanh has no derivatives.",
        "Tanh only works on integers."
      ],
      answer: 0,
      explanation: "Zero-centered activations (mean ~0) facilitate faster and more symmetric gradient descent updates compared to always-positive Sigmoid outputs."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive activation function and derivative comparison charts.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

