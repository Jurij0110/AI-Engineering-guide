export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/bias-variance-and-ensembles",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Bias Variance and Ensembles",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/11-Bias_Variance_and_Ensembles.txt",
  sourceFormat: "txt",
  engine: "EnsembleLab",
  learningObjectives: [
    "Analyze the Bias-Variance tradeoff: underfitting (high bias, low variance) vs overfitting (low bias, high variance).",
    "Compare Bagging (parallel bootstrap aggregation reducing variance) with Boosting (sequential error correction reducing bias)."
  ],
  prerequisites: [
    "Decision tree foundations",
    "Variance and expected prediction error"
  ],
  scenario: {
    description: "Explore ensemble learning dynamics. Adjust number of base estimators, tree depth, and ensemble strategy (Bagging vs Boosting) to observe the live decomposition of Total Error into Bias², Variance, and Bayes Noise.",
    seed: 1717
  },
  controls: [
    {
      id: "method",
      label: "Ensemble Paradigm",
      type: "select",
      options: [
        { value: "bagging", label: "Bagging / Random Forest (Parallel Variance Reducer)" },
        { value: "boosting", label: "Boosting / Gradient Boost (Sequential Bias Reducer)" }
      ],
      default: "bagging"
    },
    {
      id: "n_estimators",
      label: "Number of Base Learners",
      type: "range",
      min: 1,
      max: 50,
      step: 5,
      default: 20
    },
    {
      id: "max_depth",
      label: "Base Tree Depth",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 4
    },
    {
      id: "learning_rate",
      label: "Boosting Shrinkage Rate",
      type: "range",
      min: 0.02,
      max: 0.5,
      step: 0.02,
      default: 0.1
    }
  ],
  views: [
    {
      type: "bias-variance-chart",
      title: "Error Decomposition (Bias² vs Variance)",
      bindings: ["biasSq", "variance", "totalError"]
    },
    {
      type: "metric-cards",
      title: "Ensemble Performance",
      bindings: ["accuracy", "diagnosis", "totalError"]
    }
  ],
  explanationRules: [
    {
      when: "method === 'bagging' && n_estimators >= 20 && max_depth >= 4",
      summary: "Effective Bagging Variance Reduction",
      detail: "Aggregating deep, high-variance base trees across bootstrap samples suppresses individual tree variance without inflating bias."
    },
    {
      when: "method === 'boosting' && n_estimators >= 20 && max_depth <= 3",
      summary: "Effective Gradient Boosting",
      detail: "Sequential boosting of shallow weak learners systematically drives down bias with each additive residual stage."
    }
  ],
  presets: [
    {
      id: "rf-preset",
      label: "Random Forest (25 Deep Trees)",
      values: { method: "bagging", n_estimators: 25, max_depth: 4, learningRate: 0.1 },
      teachingPoint: "Bagging aggregates high-variance deep trees in parallel to achieve low overall error."
    },
    {
      id: "boost-preset",
      label: "Gradient Boost (30 Stumps)",
      values: { method: "boosting", n_estimators: 30, max_depth: 2, learningRate: 0.1 },
      teachingPoint: "Boosting combines low-variance shallow trees in series to eliminate bias."
    }
  ],
  challenge: {
    prompt: "Configure a Bagging ensemble with at least 20 estimators and tree depth >= 3 to reach Accuracy >= 85% with Balanced status.",
    success: { method: "bagging", diagnosis: "Balanced" },
    hints: [
      "Select Bagging / Random Forest.",
      "Set Number of Base Learners to 20 or higher.",
      "Set Base Tree Depth to 3 or 4."
    ]
  },
  quiz: [
    {
      prompt: "What is the primary mechanism by which Bagging (Bootstrap Aggregation) reduces prediction error?",
      choices: [
        "By averaging predictions across multiple parallel trees trained on random bootstrap samples, which reduces variance.",
        "By fitting higher-order polynomial features to increase bias.",
        "By training trees sequentially on the residuals of earlier trees.",
        "By pruning all leaf nodes with fewer than 100 samples."
      ],
      answer: 0,
      explanation: "Bagging reduces model variance by averaging the predictions of uncorrelated base learners trained on bootstrap samples."
    },
    {
      prompt: "How does Boosting differ fundamentally from Bagging?",
      choices: [
        "Boosting trains base learners sequentially, where each new learner corrects the residual errors of preceding learners to reduce bias.",
        "Boosting trains all trees in parallel independently.",
        "Boosting can only be used for unsupervised clustering.",
        "Boosting requires no hyperparameter tuning."
      ],
      answer: 0,
      explanation: "Boosting builds an additive model sequentially, prioritizing previously misclassified samples to reduce systematic bias."
    }
  ],
  accessibility: {
    canvasSummary: "Bar chart displaying the decomposition of total generalization error into Bias², Variance, and Irreducible Noise.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

