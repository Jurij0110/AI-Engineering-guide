export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/evaluating-rf-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Evaluating RF Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/04-Evaluating_RF_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "EnsembleLab",
  learningObjectives: [
    "Evaluate Random Forest ensembles using Out-of-Bag (OOB) error estimates and Mean Decrease in Impurity (MDI) feature importances.",
    "Tune hyperparameter grids using scikit-learn cross-validation to maximize classification accuracy and F1 score."
  ],
  prerequisites: [
    "Random Forest principles",
    "Cross-validation & OOB scoring"
  ],
  scenario: {
    description: "Follow the Random Forest evaluation notebook lab. Inspect Out-of-Bag (OOB) score convergence as tree count increases, analyze feature importance rankings, and balance ensemble computational efficiency.",
    seed: 1919
  },
  controls: [
    {
      id: "method",
      label: "Ensemble Type",
      type: "select",
      options: [
        { value: "bagging", label: "Random Forest (oob_score=True)" },
        { value: "boosting", label: "Gradient Boosting Comparison" }
      ],
      default: "bagging"
    },
    {
      id: "n_estimators",
      label: "n_estimators (Forest Size)",
      type: "range",
      min: 5,
      max: 60,
      step: 5,
      default: 35
    },
    {
      id: "max_depth",
      label: "max_depth Tree Limit",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 4
    }
  ],
  views: [
    {
      type: "bias-variance-chart",
      title: "OOB Error & Bias-Variance Profile",
      bindings: ["biasSq", "variance", "totalError"]
    },
    {
      type: "metric-cards",
      title: "Forest Evaluation Metrics",
      bindings: ["accuracy", "diagnosis", "totalError"]
    }
  ],
  explanationRules: [
    {
      when: "n_estimators >= 30",
      summary: "Stable OOB Convergence",
      detail: "With 30+ trees, Out-of-Bag error estimates stabilize, matching independent test set cross-validation scores."
    }
  ],
  presets: [
    {
      id: "oob-converged",
      label: "OOB Converged Forest (35 Trees)",
      values: { method: "bagging", n_estimators: 35, max_depth: 4 },
      teachingPoint: "Random Forest OOB score provides a built-in validation estimate without needing a separate validation split."
    }
  ],
  challenge: {
    prompt: "Set Random Forest size to 35 estimators with depth=4 to reach Accuracy >= 88% and Balanced status.",
    success: { method: "bagging", diagnosis: "Balanced" },
    hints: [
      "Select Random Forest (oob_score=True).",
      "Set n_estimators to 35.",
      "Set max_depth to 4."
    ]
  },
  quiz: [
    {
      prompt: "What is the 'Out-of-Bag' (OOB) score in Random Forest evaluation?",
      choices: [
        "An evaluation metric computed by evaluating each tree on the ~36.8% of training samples omitted from its bootstrap sample.",
        "The validation error on a completely external dataset.",
        "The error rate when all hyperparameters are set to zero.",
        "A metric that only applies to neural networks."
      ],
      answer: 0,
      explanation: "Each bootstrap sample leaves out ~1/e (36.8%) of samples; evaluating trees on these out-of-bag samples yields an unbiased generalization score."
    },
    {
      prompt: "How does Random Forest calculate feature importance (feature_importances_)?",
      choices: [
        "By calculating the total normalized reduction of impurity (Gini/Entropy) brought by splits on that feature across all trees.",
        "By sorting features alphabetically.",
        "By measuring the execution time of each feature column.",
        "By running PCA before training."
      ],
      answer: 0,
      explanation: "Mean Decrease in Impurity (MDI) sums the impurity decrease across all tree splits on a given feature, normalized by total splits."
    }
  ],
  accessibility: {
    canvasSummary: "Random forest error decomposition and OOB convergence chart showing bias and variance reduction.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

