export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/regression-trees",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Regression Trees",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/05-Regression_Trees.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Understand regression trees as recursive partition models that predict continuous outcomes using leaf node averages.",
    "Explain how split quality is evaluated through variance reduction / weighted Mean Squared Error (MSE) minimization."
  ],
  prerequisites: [
    "Decision tree fundamentals",
    "Variance and Mean Squared Error"
  ],
  scenario: {
    description: "Explore how regression trees model continuous non-linear functions by partitioning feature space into distinct regions. Adjust tree depth (model capacity) and observe piecewise constant predictions and variance reduction.",
    seed: 505
  },
  controls: [
    {
      id: "pattern",
      label: "Target Relationship",
      type: "select",
      options: [
        { value: "piecewise", label: "Step / Piecewise Function" },
        { value: "quadratic", label: "Continuous Curved Function" },
        { value: "exponential", label: "Exponential Growth" }
      ],
      default: "piecewise"
    },
    {
      id: "degree",
      label: "Tree Partition Capacity (Depth)",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 2
    },
    {
      id: "noise",
      label: "Target Variance (Noise)",
      type: "range",
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: 0.15
    },
    {
      id: "samples",
      label: "Training Samples",
      type: "range",
      min: 20,
      max: 80,
      step: 5,
      default: 35
    },
    {
      id: "seed",
      label: "Sample Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 505
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Regression Tree Partitions and Predictions",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Partition Error Metrics",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree <= 2 && pattern === 'piecewise'",
      summary: "Coarse Step Partitions",
      detail: "A shallow regression tree creates few splits, resulting in broad regional averages."
    },
    {
      when: "degree >= 3 && degree <= 5",
      summary: "Balanced Region Partitioning",
      detail: "Moderate tree depth isolates regional variance effectively, capturing step shifts with low MSE."
    },
    {
      when: "degree > 5",
      summary: "Over-partitioned Leaves",
      detail: "Deep trees create leaves with very few samples, memorizing noise fluctuations rather than true partition boundaries."
    }
  ],
  presets: [
    {
      id: "step-optimal",
      label: "Optimal Step Split",
      values: { pattern: "piecewise", degree: 3, noise: 0.15, samples: 40, seed: 505 },
      teachingPoint: "Regression trees excel at piecewise constant data by splitting at step thresholds."
    },
    {
      id: "tree-underfit",
      label: "Shallow Tree (Underfit)",
      values: { pattern: "piecewise", degree: 1, noise: 0.15, samples: 40, seed: 505 },
      teachingPoint: "A single split cannot capture multiple regional plateaus."
    },
    {
      id: "tree-overfit",
      label: "Deep Tree (Overfit)",
      values: { pattern: "piecewise", degree: 6, noise: 0.45, samples: 25, seed: 505 },
      teachingPoint: "Excess splits isolate individual noisy data points into separate leaves."
    }
  ],
  challenge: {
    prompt: "Configure a balanced regression tree on the Piecewise function with depth 3-4 and noise <= 0.20 to reach R² >= 0.85 and Balanced status.",
    success: { pattern: "piecewise", diagnosis: "Balanced" },
    hints: [
      "Select Step / Piecewise Function.",
      "Set Tree Partition Capacity between 3 and 4.",
      "Keep sample size >= 30 and noise <= 0.20."
    ]
  },
  quiz: [
    {
      prompt: "How does a regression tree calculate the final continuous prediction for a new test sample landing in a leaf node?",
      choices: [
        "By computing the arithmetic mean (average) of target values of training samples in that leaf node.",
        "By taking a majority vote among discrete class labels.",
        "By performing a high-degree polynomial interpolation across all leaves.",
        "By assigning the target value of the single closest neighbor."
      ],
      answer: 0,
      explanation: "Regression trees predict the mean (or median in robust variants) of all training observations residing within that leaf partition."
    },
    {
      prompt: "What criterion is minimized when selecting split thresholds in a regression tree?",
      choices: [
        "Weighted Mean Squared Error (MSE) / Variance of the child partitions.",
        "Gini impurity index.",
        "Shannon entropy reduction.",
        "Log-loss probability."
      ],
      answer: 0,
      explanation: "Regression trees choose split thresholds that maximize variance reduction (minimizing weighted post-split MSE)."
    }
  ],
  accessibility: {
    canvasSummary: "Regression tree partition plot showing piecewise continuous predictions across feature regions.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

