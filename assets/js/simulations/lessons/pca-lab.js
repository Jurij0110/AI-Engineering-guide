export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/pca-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "PCA Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/08-PCA_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "ProjectionLab",
  learningObjectives: [
    "Perform Principal Component Analysis using scikit-learn PCA on high-dimensional cancer / image data.",
    "Plot scree plots (explained variance ratio) and visualize 2D/3D projections of separated classes."
  ],
  prerequisites: [
    "PCA mathematical theory",
    "StandardScaler & PCA APIs"
  ],
  scenario: {
    description: "Follow the PCA notebook lab trace. Standardize high-dimensional features, compute covariance eigenvectors, and project 30+ medical attributes onto 2 principal components for 2D visual diagnosis.",
    seed: 2727
  },
  controls: [
    {
      id: "n_components",
      label: "PCA Components",
      type: "range",
      min: 1,
      max: 2,
      step: 1,
      default: 2
    },
    {
      id: "correlation",
      label: "Feature Co-dependence",
      type: "range",
      min: 0.5,
      max: 0.95,
      step: 0.05,
      default: 0.85
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "2D Principal Projection Space",
      bindings: ["data", "pca"]
    },
    {
      type: "metric-cards",
      title: "PCA Information Retention",
      bindings: ["variance", "diagnosis", "components"]
    }
  ],
  explanationRules: [
    {
      when: "n_components === 2",
      summary: "Lab 2D Projection Space",
      detail: "Projecting 30 dimensions down to 2 principal components preserves the majority of class-separating variance."
    }
  ],
  presets: [
    {
      id: "lab-pca-benchmark",
      label: "Lab Benchmark (2 Components)",
      values: { n_components: 2, correlation: 0.85 },
      teachingPoint: "Standardizing features ensures principal components reflect correlation structure rather than measurement unit scales."
    }
  ],
  challenge: {
    prompt: "Set PCA Components to 2 with Feature Co-dependence 0.85 to reach Explained Variance >= 80%.",
    success: { n_components: 2 },
    hints: [
      "Keep PCA Components set to 2.",
      "Set Feature Co-dependence to 0.85."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn, what attribute of a fitted PCA object contains the percentage of variance explained by each component?",
      choices: [
        "pca.explained_variance_ratio_",
        "pca.components_",
        "pca.singular_values_",
        "pca.score_"
      ],
      answer: 0,
      explanation: "pca.explained_variance_ratio_ returns an array of proportions summing to <= 1 representing variance captured per component."
    },
    {
      prompt: "Why must data be mean-centered and standardized before running PCA?",
      choices: [
        "To prevent features with large arbitrary numerical ranges from dominating covariance eigenvectors regardless of informational value.",
        "Because PCA cannot process positive numbers.",
        "To reduce the number of observations to zero.",
        "Because eigenvalues must be negative."
      ],
      answer: 0,
      explanation: "PCA calculates maximum variance directions; unscaled large-magnitude features artificially claim all principal variance."
    }
  ],
  accessibility: {
    canvasSummary: "PCA projection plot showing medical feature vectors mapped onto principal components.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

