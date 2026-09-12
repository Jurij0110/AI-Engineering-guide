export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/k-nearest-neighbours",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "K Nearest Neighbours",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/09-K_Nearest_Neighbours.txt",
  sourceFormat: "txt",
  engine: "NeighborExplorer",
  learningObjectives: [
    "Understand k-NN as an instance-based lazy learning algorithm that classifies samples by majority vote among k closest neighbors.",
    "Analyze the impact of hyperparameter k, distance metrics (Euclidean, Manhattan, Chebyshev), and feature scaling."
  ],
  prerequisites: [
    "Distance metrics in n-dimensional space",
    "Feature standardization / scaling"
  ],
  scenario: {
    description: "Explore the k-Nearest Neighbors classification geometry. Adjust k, distance metrics, and voting weights to observe how neighbor count balances noise sensitivity against oversmoothing.",
    seed: 1515
  },
  controls: [
    {
      id: "k",
      label: "Number of Neighbors (k)",
      type: "range",
      min: 1,
      max: 15,
      step: 2,
      default: 5
    },
    {
      id: "metric",
      label: "Distance Metric",
      type: "select",
      options: [
        { value: "euclidean", label: "Euclidean (L2 Norm)" },
        { value: "manhattan", label: "Manhattan (L1 Norm / Cityblock)" },
        { value: "chebyshev", label: "Chebyshev (L-infinity Norm)" }
      ],
      default: "euclidean"
    },
    {
      id: "weights",
      label: "Voting Weighting",
      type: "select",
      options: [
        { value: "uniform", label: "Uniform (Equal Votes)" },
        { value: "distance", label: "Distance-Weighted (1 / d)" }
      ],
      default: "uniform"
    },
    {
      id: "samples",
      label: "Customer Data Points",
      type: "range",
      min: 20,
      max: 70,
      step: 5,
      default: 40
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "k-NN Neighborhood & Decision Radius",
      bindings: ["data", "neighbors", "query"]
    },
    {
      type: "metric-cards",
      title: "Neighborhood Metrics",
      bindings: ["accuracy", "diagnosis", "k"]
    }
  ],
  explanationRules: [
    {
      when: "k === 1",
      summary: "k=1 (High Variance / Overfitting)",
      detail: "At k=1, the model is overly sensitive to isolated noisy outliers in the training set."
    },
    {
      when: "k >= 3 && k <= 7",
      summary: "Balanced Neighborhood",
      detail: "Moderate odd k values smooth out local observation noise while maintaining sharp regional decision boundaries."
    },
    {
      when: "k >= 13",
      summary: "Large k (Oversmoothing / Underfit)",
      detail: "Large k dilutes local neighborhood structure, causing majority class prevalence to dominate all predictions."
    }
  ],
  presets: [
    {
      id: "knn-balanced",
      label: "Optimal k (k=5)",
      values: { k: 5, metric: "euclidean", weights: "uniform", samples: 40 },
      teachingPoint: "k=5 provides an optimal balance between variance reduction and boundary fidelity."
    },
    {
      id: "knn-overfit",
      label: "Overfit (k=1)",
      values: { k: 1, metric: "euclidean", weights: "uniform", samples: 40 },
      teachingPoint: "k=1 memorizes individual noisy training points, resulting in complex ragged boundaries."
    }
  ],
  challenge: {
    prompt: "Select an optimal k (k=5) with Euclidean metric to achieve Accuracy >= 85% and Balanced status.",
    success: { k: 5, diagnosis: "Balanced" },
    hints: [
      "Set Number of Neighbors (k) to 5.",
      "Ensure Distance Metric is set to Euclidean."
    ]
  },
  quiz: [
    {
      prompt: "Why is feature standardization (e.g. StandardScaler) crucial before running k-Nearest Neighbors?",
      choices: [
        "Because features with large numerical ranges (e.g. income in $1000s) will dominate distance calculations over smaller features (e.g. age).",
        "Because k-NN only accepts features between 0 and 1.",
        "To speed up matrix inversion in OLS.",
        "To remove all outliers from the training dataset."
      ],
      answer: 0,
      explanation: "Distance metrics compute differences across all dimensions; unscaled features with large magnitudes dominate the Euclidean distance."
    },
    {
      prompt: "Why is k-NN termed a 'lazy learner' (instance-based learning)?",
      choices: [
        "It does not learn explicit mathematical model parameters during training; it stores data and computes neighbors at query time.",
        "It only evaluates every second training sample.",
        "It runs slower than neural networks.",
        "It cannot perform classification tasks."
      ],
      answer: 0,
      explanation: "Lazy learners perform no explicit parameterized training phase; all computation occurs during prediction by querying stored data."
    }
  ],
  accessibility: {
    canvasSummary: "2D scatter plot showing training points, query location, distance radius circle, and k nearest neighbor links.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

