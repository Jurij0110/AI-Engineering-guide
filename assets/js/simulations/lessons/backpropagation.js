export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/backpropagation",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Backpropagation",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/2-Backpropagation.txt",
  sourceFormat: "txt",
  engine: "AutogradGraph",
  learningObjectives: [
    "Derive the chain rule for backpropagation: dL/dw = (dL/da) * (da/dz) * (dz/dw) = (a - y) * a(1-a) * x.",
    "Understand backward error propagation and parameter updating: w_new = w_old - eta * dL/dw."
  ],
  prerequisites: [
    "Multivariate calculus chain rule",
    "Perceptron forward pass"
  ],
  scenario: {
    description: "Explore the backpropagation algorithm. Step through local partial derivatives and observe how the chain rule propagates error signals backward to compute exact weight updates.",
    seed: 4747
  },
  controls: [
    {
      id: "w",
      label: "Initial Weight (w)",
      type: "range",
      min: -2.0,
      max: 2.0,
      step: 0.1,
      default: 0.5
    },
    {
      id: "lr",
      label: "Step Size (eta)",
      type: "range",
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.2
    }
  ],
  views: [
    {
      type: "computation-graph",
      title: "Forward-Backward Computation Graph",
      bindings: ["w", "lr"]
    },
    {
      type: "metric-cards",
      title: "Chain Rule Derivatives",
      bindings: ["grad-w", "new-w", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "w === 0.5",
      summary: "Exact Chain Rule Derivation",
      detail: "dL/dw multiplies error (a - y) by activation derivative a(1-a) and incoming feature x to yield the exact analytical gradient."
    }
  ],
  presets: [
    {
      id: "backprop-baseline",
      label: "Standard Chain Rule (w=0.5)",
      values: { w: 0.5, lr: 0.2 },
      teachingPoint: "Backpropagation efficiently evaluates gradients across arbitrary depth via cached local derivatives."
    }
  ],
  challenge: {
    prompt: "Set Initial Weight to 0.5 with Step Size 0.2 to compute the exact chain rule gradient and reach Balanced status.",
    success: { w: 0.5, lr: 0.2, diagnosis: "Balanced" },
    hints: [
      "Set Initial Weight to 0.5.",
      "Set Step Size to 0.2."
    ]
  },
  quiz: [
    {
      prompt: "For squared error loss E = 1/2*(a - y)^2 and Sigmoid activation a = sigma(z), what is the derivative da/dz?",
      choices: [
        "da/dz = a * (1 - a)",
        "da/dz = a^2",
        "da/dz = 1 / a",
        "da/dz = exp(z)"
      ],
      answer: 0,
      explanation: "The derivative of sigmoid sigma(z) is analytically sigma(z) * (1 - sigma(z)) = a(1-a)."
    },
    {
      prompt: "Why is the backpropagation algorithm computationally efficient (O(N) operations)?",
      choices: [
        "It caches forward activations and computes local gradients in a single backward sweep using dynamic programming / reverse-mode autodiff.",
        "It evaluates numerical differences for each weight separately.",
        "It skips computing derivatives for hidden layers.",
        "It uses quantum matrix inversion."
      ],
      answer: 0,
      explanation: "Reverse-mode autodiff (backprop) computes all parameter gradients in one reverse pass sharing intermediate node gradients."
    }
  ],
  accessibility: {
    canvasSummary: "Computation graph diagram showing node activations and backward chain rule partial derivatives.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

