export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/rf-xgboost-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "RF XGBoost Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/12-RF_XGBoost_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "EnsembleLab",
  learningObjectives: [
    "Train and tune RandomForestClassifier and XGBClassifier on credit risk / classification benchmarks in Python.",
    "Evaluate hyperparameter interactions: n_estimators, max_depth, learning_rate (eta), subsample, and colsample_bytree."
  ],
  prerequisites: [
    "Ensemble learning theory",
    "scikit-learn and XGBoost APIs"
  ],
  scenario: {
    description: "Follow the Random Forest vs XGBoost credit scoring notebook lab. Benchmark parallel bagging against gradient boosted decision trees, tuning tree counts and learning rates for optimal ROC-AUC.",
    seed: 1818
  },
  controls: [
    {
      id: "method",
      label: "Model Algorithm",
      type: "select",
      options: [
        { value: "boosting", label: "XGBoost (Extreme Gradient Boosting)" },
        { value: "bagging", label: "Random Forest (scikit-learn)" }
      ],
      default: "boosting"
    },
    {
      id: "n_estimators",
      label: "n_estimators (Trees)",
      type: "range",
      min: 5,
      max: 60,
      step: 5,
      default: 30
    },
    {
      id: "max_depth",
      label: "max_depth Constraint",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "learning_rate",
      label: "XGBoost Learning Rate (eta)",
      type: "range",
      min: 0.02,
      max: 0.4,
      step: 0.02,
      default: 0.1
    }
  ],
  views: [
    {
      type: "bias-variance-chart",
      title: "Model Error & Loss Decomposition",
      bindings: ["biasSq", "variance", "totalError"]
    },
    {
      type: "metric-cards",
      title: "Credit Risk Model Evaluation",
      bindings: ["accuracy", "diagnosis", "totalError"]
    }
  ],
  explanationRules: [
    {
      when: "method === 'boosting' && n_estimators >= 30",
      summary: "Tuned XGBoost Performance",
      detail: "XGBoost with moderate depth (3) and learning rate 0.1 achieves superior test-set loss by regularizing leaf weights."
    }
  ],
  presets: [
    {
      id: "xgboost-tuned",
      label: "Tuned XGBoost (30 Trees, eta=0.1)",
      values: { method: "boosting", n_estimators: 30, max_depth: 3, learningRate: 0.1 },
      teachingPoint: "XGBoost combines second-order Taylor expansion gradients with L1/L2 leaf regularization."
    }
  ],
  challenge: {
    prompt: "Configure XGBoost with 30 estimators and depth=3 to achieve Accuracy >= 88% and Balanced status.",
    success: { method: "boosting", diagnosis: "Balanced" },
    hints: [
      "Select XGBoost as Model Algorithm.",
      "Set n_estimators to 30.",
      "Set max_depth to 3."
    ]
  },
  quiz: [
    {
      prompt: "In gradient boosting algorithms like XGBoost, what does the learning rate (eta) control?",
      choices: [
        "It scales the contribution of each newly added tree to prevent overfitting and ensure conservative step sizes.",
        "It sets the number of CPU cores used during training.",
        "It controls the minimum number of samples required to split a node.",
        "It sets the train/test split proportion."
      ],
      answer: 0,
      explanation: "The learning rate (shrinkage) scales tree updates: F_m(x) = F_{m-1}(x) + eta * f_m(x), reducing variance."
    },
    {
      prompt: "Why is XGBoost often preferred over standard GradientBoostingClassifier in competitive ML?",
      choices: [
        "It incorporates second-order gradients, column subsampling, built-in L1/L2 regularization, and efficient tree pruning.",
        "It does not require any training data.",
        "It only works with linear models.",
        "It replaces all decision trees with single neurons."
      ],
      answer: 0,
      explanation: "XGBoost offers advanced regularization, exact/approximate quantile greedy splits, and hardware parallelization."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive ensemble comparison chart showing bias, variance, and test error curves.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

