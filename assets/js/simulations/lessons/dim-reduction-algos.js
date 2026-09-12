export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/dim-reduction-algos",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "Dim Reduction Algos",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/07-Dim_Reduction_Algos.txt",
  sourceFormat: "txt",
  engine: "ProjectionLab",
  learningObjectives: [
    "Compare linear dimensionality reduction (PCA) with non-linear manifold techniques (t-SNE, UMAP).",
    "Analyze eigenvalue decomposition, explained variance ratios, and local vs global topology preservation."
  ],
  prerequisites: [
    "Covariance matrices & eigenvalues",
    "Curse of dimensionality"
  ],
  scenario: {
    description: "Explore dimensionality reduction dynamics. Adjust feature correlation and target components to inspect principal component vectors and cumulative explained variance ratios.",
    seed: 2626
  },
  controls: [
    {
      id: "n_components",
      label: "Projected Dimensions",
      type: "range",
      min: 1,
      max: 2,
      step: 1,
      default: 2
    },
    {
      id: "correlation",
      label: "Feature Correlation (r)",
      type: "range",
      min: 0.1,
      max: 0.95,
      step: 0.05,
      default: 0.85
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Principal Component Orientation",
      bindings: ["data", "pca"]
    },
    {
      type: "metric-cards",
      title: "Variance Metrics",
      bindings: ["variance", "diagnosis", "components"]
    }
  ],
  explanationRules: [
    {
      when: "correlation >= 0.8",
      summary: "High Variance Compression",
      detail: "With high feature correlation (r >= 0.8), PC1 captures over 85% of total dataset variance, allowing 1D compression without major information loss."
    }
  ],
  presets: [
    {
      id: "high-compression",
      label: "Strong Correlation (r=0.85)",
      values: { n_components: 2, correlation: 0.85 },
      teachingPoint: "Strong multi-collinearity enables severe dimensionality compression with minimal information loss."
    }
  ],
  challenge: {
    prompt: "Set Feature Correlation >= 0.80 to achieve PC1 Explained Variance >= 80%.",
    success: { correlation: 0.85 },
    hints: [
      "Set Feature Correlation to 0.85 or higher."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical property defines the first Principal Component (PC1) in PCA?",
      choices: [
        "The direction in feature space along which the variance of the projected data points is maximized.",
        "The line connecting the first and last data points in the file.",
        "The average of all feature columns.",
        "The decision boundary that minimizes training loss."
      ],
      answer: 0,
      explanation: "PC1 is the eigenvector of the covariance matrix corresponding to the largest eigenvalue, maximizing projected data variance."
    },
    {
      prompt: "How does t-SNE differ fundamentally from PCA in dimensionality reduction?",
      choices: [
        "t-SNE is a non-linear technique designed to preserve local neighborhood similarities, whereas PCA is a linear technique maximizing global variance.",
        "t-SNE only works for supervised regression.",
        "PCA cannot be computed on numeric datasets.",
        "t-SNE always produces straight line projections."
      ],
      answer: 0,
      explanation: "PCA preserves global linear variance; t-SNE converts Euclidean distances into conditional probabilities to preserve local cluster topology."
    }
  ],
  accessibility: {
    canvasSummary: "PCA scatter plot showing data points and principal eigenvector axis line.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

