export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/logistic-regression",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Logistic Regression",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/7-Logistic_Regression.txt",
  sourceFormat: "txt",
  engine: "DecisionBoundary",
  learningObjectives: [
    "Understand logistic regression as both a continuous probability estimator via sigmoid(z) = 1/(1+e^-z) and a binary classifier.",
    "Formulate log-loss (cross-entropy) cost optimization and evaluate decision threshold trade-offs."
  ],
  prerequisites: [
    "Linear combination z = w1*x1 + w2*x2 + b",
    "Gradient Descent basics"
  ],
  scenario: {
    description: "Explore logistic regression decision boundaries. Adjust class separation, observation noise, classification threshold, and sample sizes to observe how log-loss penalizes confident incorrect predictions.",
    seed: 707
  },
  controls: [
    {
      id: "pattern",
      label: "Class Distribution",
      type: "select",
      options: [
        { value: "separable", label: "Linearly Separable Classes" },
        { value: "overlapping", label: "Overlapping Customer Segments" }
      ],
      default: "separable"
    },
    {
      id: "threshold",
      label: "Decision Threshold (Prob)",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.05,
      default: 0.5
    },
    {
      id: "noise",
      label: "Cluster Variance",
      type: "range",
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: 0.15
    },
    {
      id: "samples",
      label: "Observation Count",
      type: "range",
      min: 20,
      max: 80,
      step: 5,
      default: 40
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "2D Feature Space & Decision Boundary",
      bindings: ["data", "model"]
    },
    {
      type: "metric-cards",
      title: "Classification Metrics",
      bindings: ["accuracy", "logLoss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "threshold === 0.5 && pattern === 'separable'",
      summary: "Standard 0.5 Boundary",
      detail: "At threshold 0.5, the decision boundary lies exactly along the line where sigmoid(w^T x + b) = 0.5 (i.e. w^T x + b = 0)."
    },
    {
      when: "threshold > 0.7",
      summary: "Conservative Class 1 Prediction",
      detail: "Raising the decision threshold requires stronger probability confidence to classify an observation as Class 1, decreasing False Positives."
    }
  ],
  presets: [
    {
      id: "balanced-logistic",
      label: "Standard Balanced Boundary",
      values: { pattern: "separable", threshold: 0.5, noise: 0.15, samples: 40 },
      teachingPoint: "Standard 0.5 probability cutoff balances precision and recall on symmetric class distributions."
    },
    {
      id: "conservative-cutoff",
      label: "High Confidence (0.75 Threshold)",
      values: { pattern: "separable", threshold: 0.75, noise: 0.2, samples: 50 },
      teachingPoint: "Higher thresholds decrease false alarms at the cost of missing true positive cases."
    }
  ],
  challenge: {
    prompt: "Tune the logistic regression model on Linearly Separable data with threshold 0.5 to reach Accuracy >= 90% and Log-Loss < 0.30.",
    success: { pattern: "separable", threshold: 0.5, diagnosis: "Balanced" },
    hints: [
      "Select Linearly Separable Classes.",
      "Keep threshold at 0.5.",
      "Keep Cluster Variance <= 0.20."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical function compresses linear regression outputs (-inf, +inf) into valid probability scores (0, 1)?",
      choices: [
        "Sigmoid / Logistic function: 1 / (1 + e^-z)",
        "Rectified Linear Unit (ReLU): max(0, z)",
        "Ordinary Least Squares (OLS)",
        "Softplus function: log(1 + e^z)"
      ],
      answer: 0,
      explanation: "The sigmoid function compresses any real input z into a smooth probability value between 0 and 1."
    },
    {
      prompt: "Why does log-loss heavily penalize confident incorrect predictions (e.g. predicting p=0.001 when true y=1)?",
      choices: [
        "Because -log(p) approaches positive infinity as predicted probability p approaches 0 for a true positive label.",
        "Because log-loss converts the error into negative numbers.",
        "Because scikit-learn discards misclassified samples.",
        "Because gradient descent stops updating weights when loss increases."
      ],
      answer: 0,
      explanation: "For true label y=1, the loss term is -log(p). As p -> 0, -log(p) -> +inf, severely penalizing overconfident false predictions."
    }
  ],
  accessibility: {
    canvasSummary: "2D scatter plot showing Class 0 and Class 1 clusters with logistic regression decision hyperplane.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

