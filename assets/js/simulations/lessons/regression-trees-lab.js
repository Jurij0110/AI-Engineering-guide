export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/regression-trees-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Regression Trees Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/06-Regression_Trees_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "RegressionLab",
  learningObjectives: [
    "Train and tune DecisionTreeRegressor on real-world housing data (e.g. real estate median value prediction).",
    "Evaluate criterion trade-offs (squared_error vs absolute_error) and hyperparameter limits (max_depth, min_samples_split) to prevent overfitting."
  ],
  prerequisites: [
    "DecisionTreeRegressor API",
    "Hyperparameter tuning (max_depth, min_samples_leaf)"
  ],
  scenario: {
    description: "Follow the Boston real estate housing lab trace. Use DecisionTreeRegressor to predict median house prices, evaluate max_depth tuning, and balance tree complexity against test set generalization.",
    seed: 606
  },
  controls: [
    {
      id: "pattern",
      label: "Housing Market Pattern",
      type: "select",
      options: [
        { value: "piecewise", label: "Neighborhood Zoning Steps (Piecewise)" },
        { value: "quadratic", label: "Distance vs Price Decay (Curved)" }
      ],
      default: "piecewise"
    },
    {
      id: "degree",
      label: "max_depth Constraint",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "noise",
      label: "Market Price Variance",
      type: "range",
      min: 0.1,
      max: 0.6,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Housing Dataset Size",
      type: "range",
      min: 25,
      max: 80,
      step: 5,
      default: 45
    },
    {
      id: "seed",
      label: "Dataset Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 606
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "DecisionTreeRegressor Price Prediction Surface",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Test Set MSE and R²",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 3",
      summary: "Optimal Tree Depth",
      detail: "max_depth = 3 partitions the housing feature space effectively without creating single-sample leaf nodes."
    },
    {
      when: "degree >= 5",
      summary: "Overfitting Unconstrained Tree",
      detail: "Without max_depth pruning, the tree splits until leaves are pure, causing high test-set error."
    }
  ],
  presets: [
    {
      id: "lab-tuned",
      label: "Tuned Tree (Depth 3)",
      values: { pattern: "piecewise", degree: 3, noise: 0.2, samples: 45, seed: 606 },
      teachingPoint: "Constraining max_depth prevents memorization of localized housing price anomalies."
    },
    {
      id: "lab-unpruned",
      label: "Unconstrained Depth (Overfit)",
      values: { pattern: "piecewise", degree: 6, noise: 0.45, samples: 30, seed: 606 },
      teachingPoint: "Unconstrained regression trees overfit noisy outliers in real estate datasets."
    }
  ],
  challenge: {
    prompt: "Tune the DecisionTreeRegressor to achieve a test R² >= 0.85 with max_depth between 3 and 4 on the housing dataset.",
    success: { pattern: "piecewise", diagnosis: "Balanced" },
    hints: [
      "Select Neighborhood Zoning Steps.",
      "Set max_depth Constraint to 3.",
      "Keep Market Price Variance at 0.20 or lower."
    ]
  },
  quiz: [
    {
      prompt: "What happens if a DecisionTreeRegressor is trained with max_depth=None and min_samples_split=2 on noisy data?",
      choices: [
        "The tree will grow until every training sample is isolated in its own leaf, severely overfitting the training data.",
        "The tree will underfit and produce a horizontal flat line.",
        "The model will automatically convert into a linear regression line.",
        "The training time will decrease exponentially."
      ],
      answer: 0,
      explanation: "Unconstrained decision trees grow until all leaves are pure (often 1 sample per leaf), resulting in extreme overfitting on noise."
    },
    {
      prompt: "Which scikit-learn hyperparameter directly limits the maximum number of consecutive binary splits from root to leaf?",
      choices: [
        "max_depth",
        "min_samples_leaf",
        "criterion",
        "splitter"
      ],
      answer: 0,
      explanation: "max_depth controls the maximum depth of the tree, serving as a primary regularization parameter."
    }
  ],
  accessibility: {
    canvasSummary: "DecisionTreeRegressor plot showing step-wise price predictions across housing features.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

