export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/shallow-vs-deep-nns",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "Shallow vs Deep NNs",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/1-Shallow_vs_Deep_NNs.txt",
  sourceFormat: "txt",
  engine: "NeuralNetworkLab",
  learningObjectives: [
    "Differentiate shallow networks (1-2 layers, vector inputs) from deep networks (>3 layers, hierarchical representation learning).",
    "Understand the 3 catalysts for deep learning success: algorithmic breakthroughs (ReLU), massive dataset availability, and GPU computational scaling."
  ],
  prerequisites: [
    "Neural network architecture basics",
    "Representation learning concepts"
  ],
  scenario: {
    description: "Explore the transition from shallow to deep neural networks. Adjust network depth from 1 to 4 layers and observe hierarchical feature composition and exponential parameter capacity.",
    seed: 5757
  },
  controls: [
    {
      id: "depth",
      label: "Network Architecture Depth",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 3
    },
    {
      id: "hidden_width",
      label: "Layer Capacity (Units)",
      type: "range",
      min: 4,
      max: 12,
      step: 2,
      default: 6
    },
    {
      id: "activation",
      label: "Non-Linearity",
      type: "select",
      options: [
        { value: "relu", label: "ReLU (Deep Learning Standard)" },
        { value: "sigmoid", label: "Sigmoid (Shallow Baseline)" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "network-graph",
      title: "Shallow vs Deep Representation",
      bindings: ["depth", "hidden_width", "activation"]
    },
    {
      type: "metric-cards",
      title: "Architectural Complexity",
      bindings: ["params", "confidence", "loss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "depth >= 3",
      summary: "Deep Representation Learning",
      detail: "Deep architectures compose hierarchical abstractions (edges -> textures -> parts -> objects) that shallow models cannot learn efficiently without exponential width."
    },
    {
      when: "depth <= 2",
      summary: "Shallow Network Baseline",
      detail: "Shallow networks excel on flat tabular data but struggle with high-dimensional unstructured images and text."
    }
  ],
  presets: [
    {
      id: "deep-hierarchical",
      label: "Deep Network (3 Layers)",
      values: { depth: 3, hidden_width: 6, activation: "relu" },
      teachingPoint: "Deep architectures learn compositional feature hierarchies efficiently."
    },
    {
      id: "shallow-baseline",
      label: "Shallow Network (1 Layer)",
      values: { depth: 1, hidden_width: 6, activation: "relu" },
      teachingPoint: "Shallow networks require exponentially more neurons to approximate complex functions."
    }
  ],
  challenge: {
    prompt: "Configure a Deep Network (Depth >= 3 with ReLU activation) to achieve Balanced status.",
    success: { depth: 3, activation: "relu", diagnosis: "Balanced" },
    hints: [
      "Set Network Architecture Depth to 3 or 4.",
      "Select ReLU as Non-Linearity."
    ]
  },
  quiz: [
    {
      prompt: "Why can deep neural networks learn complex hierarchical patterns much more efficiently than shallow networks?",
      choices: [
        "Each layer composes features from previous layers (e.g. pixels -> edges -> contours -> objects), requiring exponentially fewer neurons than a single flat layer.",
        "Because deep networks don't need training data.",
        "Because deep networks run without floating-point math.",
        "Because shallow networks cannot use GPUs."
      ],
      answer: 0,
      explanation: "Hierarchical composition allows deep networks to reuse sub-features, yielding exponential representational efficiency over wide shallow networks."
    },
    {
      prompt: "What were the three key drivers that fueled the deep learning revolution in the 2010s?",
      choices: [
        "1. Algorithmic innovations (e.g. ReLU, Dropout), 2. Big Data availability (e.g. ImageNet), and 3. GPU parallel computing power.",
        "1. Quantum computers, 2. Floppy disks, and 3. Web browsers.",
        "1. Linear regression, 2. Decision trees, and 3. SQLite.",
        "1. Faster internet modems only."
      ],
      answer: 0,
      explanation: "Algorithmic breakthroughs (ReLU preventing vanishing gradients), massive labeled datasets, and GPU acceleration enabled deep models to surpass classical ML."
    }
  ],
  accessibility: {
    canvasSummary: "Hierarchical neural network graph illustrating multi-layer feature abstraction.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

