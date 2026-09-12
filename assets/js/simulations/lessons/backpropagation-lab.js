export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/backpropagation-lab",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Backpropagation Lab",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/3-Backpropagation_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "AutogradGraph",
  learningObjectives: [
    "Implement forward pass and backpropagation from scratch in Python NumPy.",
    "Verify analytical gradient descent parameter updates against empirical loss reduction."
  ],
  prerequisites: [
    "NumPy matrix multiplication",
    "Analytical chain rule"
  ],
  scenario: {
    description: "Follow the Backpropagation notebook lab. Trace manual NumPy gradient calculations and step through weight and bias parameter adjustments across training iterations.",
    seed: 4848
  },
  controls: [
    {
      id: "w",
      label: "Lab Weight Parameter",
      type: "range",
      min: -1.5,
      max: 1.5,
      step: 0.1,
      default: 0.5
    },
    {
      id: "lr",
      label: "Learning Rate",
      type: "range",
      min: 0.1,
      max: 0.5,
      step: 0.1,
      default: 0.2
    }
  ],
  views: [
    {
      type: "computation-graph",
      title: "Lab Graph Execution",
      bindings: ["w", "lr"]
    },
    {
      type: "metric-cards",
      title: "Lab Gradients",
      bindings: ["grad-w", "new-w", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "w === 0.5",
      summary: "Lab Benchmark State",
      detail: "The lab verifies NumPy vectorized gradient calculation matches single-neuron chain rule outputs."
    }
  ],
  presets: [
    {
      id: "lab-bench",
      label: "Lab Benchmark (w=0.5)",
      values: { w: 0.5, lr: 0.2 },
      teachingPoint: "Iterative backprop steps reduce loss exponentially on training pairs."
    }
  ],
  challenge: {
    prompt: "Set Lab Weight Parameter to 0.5 to replicate the lab benchmark and achieve Balanced status.",
    success: { w: 0.5, diagnosis: "Balanced" },
    hints: [
      "Set Lab Weight Parameter to 0.5."
    ]
  },
  quiz: [
    {
      prompt: "In Python NumPy, what vectorized expression computes layer error delta for layer l with weights W and activation derivative d_act?",
      choices: [
        "delta_l = np.dot(delta_next, W.T) * d_act",
        "delta_l = delta_next + W",
        "delta_l = np.sum(W) / delta_next",
        "delta_l = W * 0.0"
      ],
      answer: 0,
      explanation: "Backpropagating delta involves projecting upstream error through the transposed weight matrix W.T and element-wise multiplying by the local derivative."
    },
    {
      prompt: "What is 'Gradient Checking' (Grad Check) in neural network development?",
      choices: [
        "A numerical debugging technique comparing analytical backprop gradients against finite-difference approximations (f(x+eps) - f(x-eps)) / (2*eps).",
        "A tool that checks GPU temperature.",
        "A linter that checks Python syntax.",
        "A test for disk read speed."
      ],
      answer: 0,
      explanation: "Grad checking validates that analytical backward equations are free of bugs by matching finite difference approximations within 1e-7."
    }
  ],
  accessibility: {
    canvasSummary: "Backpropagation lab computation graph showing forward values and backward gradients.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

