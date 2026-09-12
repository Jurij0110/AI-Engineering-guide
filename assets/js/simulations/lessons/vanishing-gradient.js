export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/vanishing-gradient",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Vanishing Gradient",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/4-Vanishing_Gradient.txt",
  sourceFormat: "txt",
  engine: "ActivationLab",
  learningObjectives: [
    "Diagnose the Vanishing Gradient Problem: multiplying Sigmoid derivatives (max 0.25) across deep layers exponentially shrinks early layer gradients to zero.",
    "Understand why Sigmoid is restricted to final output layers and replaced by ReLU in hidden layers."
  ],
  prerequisites: [
    "Chain rule multiplication across layers",
    "Sigmoid derivative properties"
  ],
  scenario: {
    description: "Explore the Vanishing Gradient problem across deep neural networks. Switch between Sigmoid and ReLU activations across increasing network depth to observe gradient preservation vs collapse.",
    seed: 4949
  },
  controls: [
    {
      id: "activation",
      label: "Hidden Layer Activation",
      type: "select",
      options: [
        { value: "relu", label: "ReLU: f'(z) = 1.0 (Gradient Preserved)" },
        { value: "sigmoid", label: "Sigmoid: f'(z) <= 0.25 (Vanishes in Deep Layers)" },
        { value: "tanh", label: "Tanh: f'(z) <= 1.0" }
      ],
      default: "relu"
    },
    {
      id: "depth",
      label: "Network Depth (Layers)",
      type: "range",
      min: 2,
      max: 10,
      step: 1,
      default: 6
    }
  ],
  views: [
    {
      type: "activation-curves",
      title: "Activation & Derivative Profiles",
      bindings: ["activation", "depth"]
    },
    {
      type: "metric-cards",
      title: "Gradient Propagation Metrics",
      bindings: ["act-name", "grad-scale", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "activation === 'sigmoid' && depth >= 4",
      summary: "Vanishing Gradient Detected",
      detail: "Because max d(Sigmoid)/dz = 0.25, chaining across deep layers scales early gradients by 0.25^depth -> 0, halting learning in front layers."
    },
    {
      when: "activation === 'relu'",
      summary: "Unsaturated Gradient Flow",
      detail: "ReLU derivative is constant 1.0 for positive inputs, transmitting intact error signals across arbitrarily deep architectures."
    }
  ],
  presets: [
    {
      id: "relu-deep",
      label: "ReLU Deep Network (Depth=6)",
      values: { activation: "relu", depth: 6 },
      teachingPoint: "ReLU maintains constant unit gradient flow through deep networks."
    },
    {
      id: "sigmoid-vanish",
      label: "Sigmoid Vanishing Demo",
      values: { activation: "sigmoid", depth: 6 },
      teachingPoint: "Sigmoid derivative (<=0.25) causes early layer gradients to collapse to near-zero."
    }
  ],
  challenge: {
    prompt: "Select ReLU activation on a 6-layer network to eliminate vanishing gradients and achieve Balanced status.",
    success: { activation: "relu", depth: 6, diagnosis: "Balanced" },
    hints: [
      "Select ReLU activation.",
      "Set Network Depth to 6."
    ]
  },
  quiz: [
    {
      prompt: "Why does multiplying Sigmoid derivatives cause vanishing gradients in deep networks?",
      choices: [
        "The maximum value of the Sigmoid derivative is 0.25; chaining N layers multiplies (0.25)^N, which approaches zero exponentially.",
        "Because Sigmoid converts weights to text strings.",
        "Because Sigmoid derivative is always negative.",
        "Because GPUs cannot calculate powers of 2."
      ],
      answer: 0,
      explanation: "Multiplying fractions <= 0.25 repeatedly across 10 layers yields < 1e-6, making early layer updates negligible."
    },
    {
      prompt: "Why does ReLU (Rectified Linear Unit) solve the vanishing gradient problem for positive inputs?",
      choices: [
        "Its derivative is exactly 1.0 for all z > 0, so multiplying 1.0 across any number of layers never diminishes the gradient magnitude.",
        "Because ReLU is an unsupervised clustering algorithm.",
        "Because ReLU automatically doubles the learning rate.",
        "Because ReLU only operates on the output layer."
      ],
      answer: 0,
      explanation: "Since d(ReLU)/dz = 1.0 for z > 0, backpropagating through active neurons passes gradients without exponential attenuation."
    }
  ],
  accessibility: {
    canvasSummary: "Activation and derivative curve chart comparing Sigmoid saturation with ReLU constant gradient flow.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

