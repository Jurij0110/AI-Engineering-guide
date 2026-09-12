export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-1-intro-to-dl-and-neural-nets/artificial-neural-networks-txt",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-1-intro-to-dl-and-neural-nets",
  title: "Artificial Neural Networks",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-1-Intro_to_DL_and_Neural_Nets/Artificial_Neural_Networks.txt",
  sourceFormat: "txt",
  engine: "NeuralNetworkLab",
  learningObjectives: [
    "Understand the biological inspiration and mathematical formulation of artificial neurons (Perceptrons): z = w^T x + b, a = f(z).",
    "Trace forward propagation from input features through stacked hidden layers to output predictions."
  ],
  prerequisites: [
    "Vector dot products",
    "Linear combination concepts"
  ],
  scenario: {
    description: "Explore the fundamental architecture of Artificial Neural Networks. Adjust hidden layer depth and width to observe how weighted sums and activations propagate signals.",
    seed: 4545
  },
  controls: [
    {
      id: "depth",
      label: "Network Depth (Layers)",
      type: "range",
      min: 1,
      max: 3,
      step: 1,
      default: 1
    },
    {
      id: "hidden_width",
      label: "Neuron Width",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "activation",
      label: "Activation Function",
      type: "select",
      options: [
        { value: "relu", label: "ReLU" },
        { value: "sigmoid", label: "Sigmoid" },
        { value: "tanh", label: "Tanh" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "network-graph",
      title: "Perceptron to Multilayer Network",
      bindings: ["depth", "hidden_width", "activation"]
    },
    {
      type: "metric-cards",
      title: "Model Topology Metrics",
      bindings: ["params", "confidence", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "depth === 1",
      summary: "Single Hidden Layer Perceptron Network",
      detail: "A single hidden layer acts as a universal approximator given sufficient neuron width."
    }
  ],
  presets: [
    {
      id: "shallow-perceptron",
      label: "Single Hidden Layer (1x3)",
      values: { depth: 1, hidden_width: 3, activation: "relu" },
      teachingPoint: "Individual perceptrons compute linear combinations z = w*x + b before non-linear activation."
    }
  ],
  challenge: {
    prompt: "Configure a 1-layer hidden network with 3 neurons to achieve Balanced status.",
    success: { depth: 1, hidden_width: 3, diagnosis: "Balanced" },
    hints: [
      "Set Network Depth (Layers) to 1.",
      "Set Neuron Width to 3."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical operation does an individual artificial neuron (perceptron) perform on its inputs x_1, x_2, ..., x_n?",
      choices: [
        "Computes a weighted sum z = sum(w_i * x_i) + b and passes z through an activation function a = f(z).",
        "Calculates the geometric mean of inputs.",
        "Sorts the input values from lowest to highest.",
        "Computes the discrete Fourier transform."
      ],
      answer: 0,
      explanation: "A neuron performs a linear combination (dot product plus bias) followed by a non-linear activation."
    },
    {
      prompt: "What would happen if all activation functions in a 100-layer neural network were purely linear: f(z) = z?",
      choices: [
        "The entire 100-layer network would mathematically collapse to a simple single-layer linear regression model.",
        "The network would achieve 100% classification accuracy.",
        "The network weights would explode to infinity.",
        "The network would convert into a convolutional filter."
      ],
      answer: 0,
      explanation: "Composing linear functions W_2 * (W_1 * x) = (W_2 * W_1) * x = W_eff * x, which is strictly equivalent to a single linear transformation."
    }
  ],
  accessibility: {
    canvasSummary: "Artificial neural network graph illustrating inputs flowing through weighted edges to hidden and output neurons.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
