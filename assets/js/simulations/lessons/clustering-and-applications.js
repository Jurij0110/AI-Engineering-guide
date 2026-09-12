export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/clustering-and-applications",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "Clustering and Applications",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/01-Clustering_and_Applications.txt",
  sourceFormat: "txt",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Understand unsupervised clustering as discovering inherent natural groupings in unlabelled multi-attribute datasets.",
    "Evaluate cluster cohesion, separation, silhouette coefficients, and application domains (customer segmentation, anomaly detection)."
  ],
  prerequisites: [
    "Supervised vs Unsupervised ML",
    "Euclidean distance metrics"
  ],
  scenario: {
    description: "Explore the clustering landscape across unlabelled customer data. Adjust cluster algorithms (K-Means vs DBSCAN) and cluster counts to observe how silhouette scores measure cluster quality.",
    seed: 2020
  },
  controls: [
    {
      id: "algorithm",
      label: "Clustering Algorithm",
      type: "select",
      options: [
        { value: "kmeans", label: "K-Means (Partitioning Centroids)" },
        { value: "dbscan", label: "DBSCAN (Density Neighborhoods)" }
      ],
      default: "kmeans"
    },
    {
      id: "k",
      label: "Cluster Count (k)",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "pattern",
      label: "Customer Data Layout",
      type: "select",
      options: [
        { value: "blobs", label: "Spherical Customer Blobs" },
        { value: "moons", label: "Non-convex Behavioral Manifolds" }
      ],
      default: "blobs"
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Cluster Partitions & Centroids",
      bindings: ["data", "assignments", "centroids"]
    },
    {
      type: "metric-cards",
      title: "Clustering Quality",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "algorithm === 'kmeans' && k === 3 && pattern === 'blobs'",
      summary: "Optimal 3-Cluster Partition",
      detail: "K-Means with k=3 achieves maximum silhouette cohesion on 3 spherical clusters."
    }
  ],
  presets: [
    {
      id: "cluster-standard",
      label: "Optimal Customer Segments (k=3)",
      values: { algorithm: "kmeans", k: 3, pattern: "blobs" },
      teachingPoint: "Well-separated clusters maximize between-cluster distance relative to within-cluster variance."
    }
  ],
  challenge: {
    prompt: "Cluster the spherical customer data into 3 groups to achieve Silhouette Score >= 0.60 and Balanced status.",
    success: { k: 3, pattern: "blobs", diagnosis: "Balanced" },
    hints: [
      "Select Spherical Customer Blobs.",
      "Set Cluster Count (k) to 3."
    ]
  },
  quiz: [
    {
      prompt: "What is the primary difference between supervised classification and unsupervised clustering?",
      choices: [
        "Clustering operates on unlabeled data to discover hidden patterns, while classification learns from pre-labeled ground truth targets.",
        "Clustering only works on images.",
        "Classification does not calculate loss.",
        "Clustering requires continuous targets."
      ],
      answer: 0,
      explanation: "Supervised classification uses target labels y; unsupervised clustering finds natural clusters in feature space X without labels."
    },
    {
      prompt: "What range does the Silhouette Score span, and what does a value close to +1 indicate?",
      choices: [
        "[-1, +1]: +1 indicates samples are well matched to their own cluster and distant from neighboring clusters.",
        "[0, 100]: 100 indicates 100% accuracy.",
        "[-inf, +inf]: +inf indicates zero error.",
        "[0, 1]: 1 indicates the data is linearly separable."
      ],
      answer: 0,
      explanation: "Silhouette ranges from -1 to +1; values near +1 indicate dense, well-separated clusters."
    }
  ],
  accessibility: {
    canvasSummary: "2D scatter plot showing unlabelled points grouped by color into clusters with centroid markers.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

