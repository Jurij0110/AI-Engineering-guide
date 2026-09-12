export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/gradient-descent",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Gradient Descent",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/1-Gradient_Descent.txt",
  sourceFormat: "txt",
  engine: "OptimizerLab",
  learningObjectives: [
    "Formulate gradient descent parameter update rules: w_new = w_old - eta * d(Cost)/dw.",
    "Tune learning rate (eta) to balance fast convergence against overshoot and divergence."
  ],
  prerequisites: [
    "Cost functions and MSE",
    "Partial derivatives"
  ],
  scenario: {
    description: "Explore gradient descent optimization on a 2D loss surface. Adjust learning rate and momentum to observe convergence speed and stability trajectories.",
    seed: 4646
  },
  controls: [
    {
      id: "lr",
      label: "Learning Rate (eta)",
      type: "range",
      min: 0.01,
      max: 0.4,
      step: 0.01,
      default: 0.1
    },
    {
      id: "algorithm",
      label: "Optimizer Algorithm",
      type: "select",
      options: [
        { value: "sgd", label: "Standard SGD (w = w - eta * grad)" },
        { value: "momentum", label: "SGD + Momentum (Accelerates down valleys)" }
      ],
      default: "sgd"
    },
    {
      id: "steps",
      label: "Optimization Steps",
      type: "range",
      min: 5,
      max: 40,
      step: 5,
      default: 20
    }
  ],
  views: [
    {
      type: "loss-contour",
      title: "Loss Surface Optimization Path",
      bindings: ["lr", "algorithm", "steps"]
    },
    {
      type: "metric-cards",
      title: "Convergence Metrics",
      bindings: ["loss", "status", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "lr >= 0.05 && lr <= 0.2",
      summary: "Stable Convergence",
      detail: "Moderate learning rates allow steady steps along the negative gradient vector towards the global minimum."
    },
    {
      when: "lr > 0.3",
      summary: "Overshooting Risk",
      detail: "Excessive learning rates step across narrow ravines, risking oscillation or catastrophic divergence."
    }
  ],
  presets: [
    {
      id: "sgd-stable",
      label: "Stable SGD (eta=0.10)",
      values: { lr: 0.1, algorithm: "sgd", steps: 20 },
      teachingPoint: "Moderate eta guarantees smooth convergence on convex quadratic bowls."
    },
    {
      id: "momentum-boost",
      label: "Momentum Accelerated",
      values: { lr: 0.1, algorithm: "momentum", steps: 20 },
      teachingPoint: "Momentum dampens oscillations across high-curvature dimensions."
    }
  ],
  challenge: {
    prompt: "Set Learning Rate to 0.10 with 20 steps to achieve Converged status and Loss < 0.05.",
    success: { lr: 0.1, diagnosis: "Balanced" },
    hints: [
      "Set Learning Rate to 0.10.",
      "Keep Optimization Steps at 20."
    ]
  },
  quiz: [
    {
      prompt: "In the gradient descent update equation w = w - eta * d(Cost)/dw, why is the gradient subtracted rather than added?",
      choices: [
        "Because the gradient points in the direction of steepest ASCENT; subtracting it moves in the direction of steepest DESCENT towards the minimum.",
        "Because weights must always be negative.",
        "Because subtraction is faster to calculate than addition.",
        "To prevent gradient clipping."
      ],
      answer: 0,
      explanation: "The gradient vector nabla L points uphill; moving in -nabla L minimizes the loss function."
    },
    {
      prompt: "What happens when the learning rate eta is set too large?",
      choices: [
        "Parameter updates overshoot the valley floor, causing loss oscillations and numerical divergence (exploding loss to infinity/NaN).",
        "The model trains in 1 microsecond.",
        "The loss becomes zero instantly.",
        "The dataset size doubles."
      ],
      answer: 0,
      explanation: "Large learning rates take steps larger than the curvature radius, propelling parameters away from minima."
    }
  ],
  accessibility: {
    canvasSummary: "Loss surface contour map showing gradient descent trajectory path converging to minimum.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

