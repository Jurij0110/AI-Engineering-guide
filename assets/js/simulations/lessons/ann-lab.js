export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-1-intro-to-dl-and-neural-nets/artificial-neural-networks-ipynb",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-1-intro-to-dl-and-neural-nets",
  title: "Artificial Neural Networks Lab",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-1-Intro_to_DL_and_Neural_Nets/Artificial_Neural_Networks.ipynb",
  sourceFormat: "ipynb",
  engine: "NeuralNetworkLab",
  learningObjectives: [
    "Construct forward-propagation computational flows through input, hidden, and output neuron layers.",
    "Compute total network parameters (weights + biases) across custom hidden layer topologies."
  ],
  prerequisites: [
    "Linear algebra dot products",
    "Basic Python & NumPy array operations"
  ],
  scenario: {
    description: "Follow the Artificial Neural Networks notebook lab. Configure hidden layer depth and width to trace forward-pass weighted activations and parameter counts.",
    seed: 4444
  },
  controls: [
    {
      id: "depth",
      label: "Hidden Layers Count",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 2
    },
    {
      id: "hidden_width",
      label: "Neurons Per Hidden Layer",
      type: "range",
      min: 2,
      max: 8,
      step: 1,
      default: 4
    },
    {
      id: "activation",
      label: "Hidden Activation Function",
      type: "select",
      options: [
        { value: "relu", label: "ReLU: max(0, z)" },
        { value: "sigmoid", label: "Sigmoid: 1 / (1 + exp(-z))" },
        { value: "tanh", label: "Tanh: tanh(z)" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "network-graph",
      title: "Forward Propagation Graph",
      bindings: ["depth", "hidden_width", "activation"]
    },
    {
      type: "metric-cards",
      title: "Network Parameters & Confidence",
      bindings: ["params", "confidence", "loss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "depth === 2 && hidden_width === 4",
      summary: "Lab Baseline Architecture",
      detail: "2 hidden layers with 4 neurons each produce 42 trainable parameters, enabling non-linear representation capacity."
    }
  ],
  presets: [
    {
      id: "lab-baseline",
      label: "Lab Default (2x4 ReLU)",
      values: { depth: 2, hidden_width: 4, activation: "relu" },
      teachingPoint: "Standard 2-hidden layer topology balances expressiveness with parameter economy."
    }
  ],
  challenge: {
    prompt: "Configure a 2-layer hidden network with 4 neurons per layer using ReLU activation to achieve Balanced status.",
    success: { depth: 2, hidden_width: 4, activation: "relu", diagnosis: "Balanced" },
    hints: [
      "Set Hidden Layers Count to 2.",
      "Set Neurons Per Hidden Layer to 4.",
      "Select ReLU activation."
    ]
  },
  quiz: [
    {
      prompt: "For a fully connected layer with N inputs and M outputs, how many total trainable parameters (weights + biases) exist?",
      choices: [
        "(N * M) weights + M biases = M * (N + 1) parameters",
        "N * M parameters only",
        "N + M parameters",
        "2 * (N + M) parameters"
      ],
      answer: 0,
      explanation: "Each of the M output neurons has N incoming weight connections plus 1 additive bias term."
    },
    {
      prompt: "What is the primary role of a non-linear activation function in a deep neural network?",
      choices: [
        "To enable the network to learn non-linear decision boundaries and complex feature mappings (without activations, multiple linear layers collapse to a single linear regression).",
        "To speed up GPU clock rates.",
        "To normalize image pixel sizes to 256x256.",
        "To prevent Python memory leaks."
      ],
      answer: 0,
      explanation: "Without non-linear activations, composing linear matrix multiplications yields only another linear transformation."
    }
  ],
  accessibility: {
    canvasSummary: "Multi-layer perceptron neural network diagram showing input, hidden, and output neuron layers with connected weight edges.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
