export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/logistic-regression-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Logistic Regression Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/8-Logistic_Regression_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "DecisionBoundary",
  learningObjectives: [
    "Execute customer churn prediction in Python with scikit-learn LogisticRegression.",
    "Tune regularization solver (liblinear, saga) and parameter C, inspecting probability arrays from model.predict_proba()."
  ],
  prerequisites: [
    "Logistic regression sigmoid formula",
    "scikit-learn LogisticRegression API"
  ],
  scenario: {
    description: "Follow the telecommunications customer churn notebook lab. Map customer tenure and charges to churn probability, train LogisticRegression, inspect log-loss, and evaluate the decision threshold.",
    seed: 808
  },
  controls: [
    {
      id: "pattern",
      label: "Churn Feature Space",
      type: "select",
      options: [
        { value: "churn", label: "Tenure vs Monthly Charges (Churn Clusters)" },
        { value: "separable", label: "High Separation Benchmark" }
      ],
      default: "churn"
    },
    {
      id: "threshold",
      label: "Churn Alert Threshold",
      type: "range",
      min: 0.2,
      max: 0.8,
      step: 0.05,
      default: 0.5
    },
    {
      id: "noise",
      label: "Customer Noise",
      type: "range",
      min: 0.1,
      max: 0.6,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Customer Sample Count",
      type: "range",
      min: 25,
      max: 80,
      step: 5,
      default: 50
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Customer Churn Decision Region",
      bindings: ["data", "model"]
    },
    {
      type: "metric-cards",
      title: "Churn Model Evaluation",
      bindings: ["accuracy", "logLoss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "pattern === 'churn'",
      summary: "Customer Churn Separation",
      detail: "Logistic regression separates churners from loyal customers based on contract tenure and usage rates."
    },
    {
      when: "threshold < 0.4",
      summary: "Aggressive Churn Detection",
      detail: "Lowering the threshold catches more potential churners (higher Recall) for proactive customer retention campaigns."
    }
  ],
  presets: [
    {
      id: "lab-churn-baseline",
      label: "Lab Default (0.5 Cutoff)",
      values: { pattern: "churn", threshold: 0.5, noise: 0.2, samples: 50 },
      teachingPoint: "Standard 0.5 cutoff on churn probability balances retention costs against customer loss."
    },
    {
      id: "proactive-retention",
      label: "Proactive Retention (0.35 Cutoff)",
      values: { pattern: "churn", threshold: 0.35, noise: 0.2, samples: 50 },
      teachingPoint: "Proactive retention prioritizes identifying all potential churn risks early."
    }
  ],
  challenge: {
    prompt: "Configure the churn model to achieve an Accuracy >= 85% with Balanced diagnosis on the High Separation Benchmark.",
    success: { pattern: "separable", diagnosis: "Balanced" },
    hints: [
      "Select High Separation Benchmark.",
      "Set Churn Alert Threshold to 0.5.",
      "Keep customer noise at or below 0.20."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn, what method returns the continuous probabilities for each class instead of discrete 0/1 labels?",
      choices: [
        "model.predict_proba(X)",
        "model.predict(X)",
        "model.decision_function(X)",
        "model.score(X, y)"
      ],
      answer: 0,
      explanation: "model.predict_proba(X) returns a 2D array of shape (n_samples, n_classes) containing probabilities that sum to 1 per sample."
    },
    {
      prompt: "In logistic regression, what does the inverse regularization parameter C control?",
      choices: [
        "Smaller C values increase regularization strength (penalizing large weights to prevent overfitting).",
        "Smaller C values turn off regularization entirely.",
        "C controls the learning rate in gradient descent.",
        "C sets the maximum number of decision trees in the ensemble."
      ],
      answer: 0,
      explanation: "Like SVMs, scikit-learn's LogisticRegression uses C = 1/lambda: smaller C specifies stronger regularization."
    }
  ],
  accessibility: {
    canvasSummary: "Customer churn 2D scatter plot with fitted logistic decision boundary and metric outputs.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

