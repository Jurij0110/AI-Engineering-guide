export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/knn-labn",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "KNN Labn",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/10-KNN_Labn.ipynb",
  sourceFormat: "ipynb",
  engine: "NeighborExplorer",
  learningObjectives: [
    "Implement k-NN classification in Python using scikit-learn KNeighborsClassifier on telecommunications customer data (teleCust1000t.csv).",
    "Iterate through k values (k=1 to 10) to plot accuracy curves and find the optimal hyperparameter k."
  ],
  prerequisites: [
    "k-NN distance theory",
    "StandardScaler & KNeighborsClassifier APIs"
  ],
  scenario: {
    description: "Follow the telecommunications customer segmentation lab trace. Classify customers into 4 service categories (Basic, E-Service, Plus, Total Service) using demographic features, tuning k for maximum test accuracy.",
    seed: 1616
  },
  controls: [
    {
      id: "k",
      label: "k Tuning Parameter",
      type: "range",
      min: 1,
      max: 11,
      step: 2,
      default: 5
    },
    {
      id: "metric",
      label: "Distance Function",
      type: "select",
      options: [
        { value: "euclidean", label: "Euclidean (p=2)" },
        { value: "manhattan", label: "Manhattan (p=1)" }
      ],
      default: "euclidean"
    },
    {
      id: "weights",
      label: "Vote Weighting Strategy",
      type: "select",
      options: [
        { value: "uniform", label: "Uniform Votes" },
        { value: "distance", label: "Distance-Weighted (1/distance)" }
      ],
      default: "uniform"
    },
    {
      id: "samples",
      label: "Customer Records",
      type: "range",
      min: 30,
      max: 80,
      step: 10,
      default: 50
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Customer Segment Neighborhood",
      bindings: ["data", "neighbors", "query"]
    },
    {
      type: "metric-cards",
      title: "Lab Accuracy Evaluation",
      bindings: ["accuracy", "diagnosis", "k"]
    }
  ],
  explanationRules: [
    {
      when: "k === 5",
      summary: "Lab Optimal k=5",
      detail: "In the notebook, testing k from 1 to 10 reveals k=5 (or k=6) achieves highest validation accuracy."
    }
  ],
  presets: [
    {
      id: "lab-best-k",
      label: "Lab Optimal (k=5)",
      values: { k: 5, metric: "euclidean", weights: "uniform", samples: 50 },
      teachingPoint: "Evaluating accuracy across multiple k values reveals the optimal bias-variance tradeoff."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: set k=5 with Euclidean distance to achieve Accuracy >= 85% and Balanced status.",
    success: { k: 5, diagnosis: "Balanced" },
    hints: [
      "Set k Tuning Parameter to 5.",
      "Select Euclidean distance function."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn, what parameter specifies the distance metric power in KNeighborsClassifier(p=...)?",
      choices: [
        "p=2 corresponds to Euclidean distance, while p=1 corresponds to Manhattan distance.",
        "p specifies the polynomial degree.",
        "p sets the number of parallel CPU threads.",
        "p specifies the maximum depth of the neighbor graph."
      ],
      answer: 0,
      explanation: "The parameter p in Minkowski distance sets p=1 for Manhattan distance and p=2 for standard Euclidean distance."
    },
    {
      prompt: "How did the lab determine the best value for hyperparameter k?",
      choices: [
        "By training models for k in range(1, 11) and selecting the k that maximized test set accuracy.",
        "By setting k equal to the number of features in the dataset.",
        "By using Ordinary Least Squares regression.",
        "By running a K-Means clustering algorithm."
      ],
      answer: 0,
      explanation: "Hyperparameters like k are tuned by evaluating out-of-sample accuracy across an iterative range of candidates."
    }
  ],
  accessibility: {
    canvasSummary: "Customer segmentation k-NN scatter plot showing query location, neighborhood ring, and accuracy score.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
