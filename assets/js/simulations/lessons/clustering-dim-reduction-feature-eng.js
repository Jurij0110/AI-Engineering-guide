export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/clustering-dim-reduction-feature-eng",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "Clustering Dim Reduction Feature Eng",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/06-Clustering_Dim_Reduction_Feature_Eng.txt",
  sourceFormat: "txt",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Use unsupervised clustering (cluster distances/labels) and dimensionality reduction (PCA components) as feature engineering inputs for supervised models.",
    "Understand the synergy between unsupervised representation learning and downstream predictive performance."
  ],
  prerequisites: [
    "Clustering fundamentals",
    "Feature engineering concepts"
  ],
  scenario: {
    description: "Explore clustering features in downstream ML pipelines. Generate cluster distance features and observe how non-linear spatial partitions augment linear model capabilities.",
    seed: 2525
  },
  controls: [
    {
      id: "algorithm",
      label: "Feature Clusterer",
      type: "select",
      options: [
        { value: "kmeans", label: "K-Means Cluster Distance Features" }
      ],
      default: "kmeans"
    },
    {
      id: "k",
      label: "Engineered Cluster Features (k)",
      type: "range",
      min: 2,
      max: 5,
      step: 1,
      default: 3
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Cluster Feature Space",
      bindings: ["data", "assignments", "centroids"]
    },
    {
      type: "metric-cards",
      title: "Representation Quality",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "k === 3",
      summary: "3-Prototype Distance Representation",
      detail: "Representing each sample by its distance to 3 cluster centroids creates a rich non-linear feature space for downstream classifiers."
    }
  ],
  presets: [
    {
      id: "fe-3-prototypes",
      label: "3-Prototype Features",
      values: { algorithm: "kmeans", k: 3 },
      teachingPoint: "Cluster prototype distances transform non-linear boundaries into linearly separable spaces."
    }
  ],
  challenge: {
    prompt: "Set Engineered Cluster Features to 3 to achieve Balanced diagnosis and Silhouette >= 0.60.",
    success: { k: 3, diagnosis: "Balanced" },
    hints: [
      "Set Engineered Cluster Features (k) to 3."
    ]
  },
  quiz: [
    {
      prompt: "How can K-Means clustering be used as a feature engineering step for a linear classification model?",
      choices: [
        "By replacing or augmenting raw features with the Euclidean distances from each sample to all k learned cluster centroids.",
        "By deleting all training samples that do not touch a centroid.",
        "By converting the classification task into a sorting task.",
        "By running PCA on the target variable."
      ],
      answer: 0,
      explanation: "Using distance-to-centroids (RBF kernel approximation) maps non-linear feature relationships into a space where linear models thrive."
    },
    {
      prompt: "Why can combining PCA and clustering improve clustering results in high dimensions?",
      choices: [
        "PCA removes noisy, uncorrelated dimensions and mitigates the curse of dimensionality where Euclidean distances become uniform.",
        "PCA guarantees 100% silhouette score.",
        "PCA converts unsupervised data into labeled data.",
        "PCA eliminates all outliers."
      ],
      answer: 0,
      explanation: "In high dimensions, distance concentration degrades clustering; PCA focuses distance metrics on axes of maximum variance."
    }
  ],
  accessibility: {
    canvasSummary: "Engineered cluster feature scatter plot showing prototype centers and sample assignments.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

