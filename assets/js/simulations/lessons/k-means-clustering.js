export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/k-means-clustering",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "K Means Clustering",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/02-K_Means_Clustering.txt",
  sourceFormat: "txt",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Explain Lloyd's K-Means algorithm: iterative centroid assignment, centroid update, and convergence to minimum inertia.",
    "Apply the Elbow method and Silhouette analysis to select optimal hyperparameter k."
  ],
  prerequisites: [
    "Unsupervised clustering concept",
    "Voronoi partition geometry"
  ],
  scenario: {
    description: "Explore K-Means centroid optimization. Observe how initial centroid seeds iteratively pull towards cluster means, minimizing within-cluster sum of squares (inertia).",
    seed: 2121
  },
  controls: [
    {
      id: "algorithm",
      label: "Optimizer",
      type: "select",
      options: [
        { value: "kmeans", label: "K-Means (Lloyd / k-means++)" }
      ],
      default: "kmeans"
    },
    {
      id: "k",
      label: "Number of Centroids (k)",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "pattern",
      label: "Data Distribution",
      type: "select",
      options: [
        { value: "blobs", label: "3 Natural Gaussian Clouds" },
        { value: "moons", label: "Non-spherical Geometry (K-Means Limitation)" }
      ],
      default: "blobs"
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Centroid Voronoi Regions",
      bindings: ["data", "assignments", "centroids"]
    },
    {
      type: "metric-cards",
      title: "K-Means Evaluation",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "pattern === 'moons'",
      summary: "K-Means Spherical Assumption Limitation",
      detail: "K-Means assumes isotropic spherical clusters and fails on non-convex or elongated shapes."
    }
  ],
  presets: [
    {
      id: "kmeans-optimal",
      label: "Optimal k (k=3)",
      values: { algorithm: "kmeans", k: 3, pattern: "blobs" },
      teachingPoint: "k=3 matches the true generating distribution of 3 Gaussian centroids."
    }
  ],
  challenge: {
    prompt: "Set k=3 on Gaussian Clouds to achieve Balanced status with Silhouette Score >= 0.65.",
    success: { k: 3, pattern: "blobs", diagnosis: "Balanced" },
    hints: [
      "Select 3 Natural Gaussian Clouds.",
      "Set Number of Centroids (k) to 3."
    ]
  },
  quiz: [
    {
      prompt: "What is the 'Elbow Method' in K-Means clustering?",
      choices: [
        "Plotting inertia (WCSS) against k and selecting the value of k where the rate of decrease sharply bends like an elbow.",
        "Pruning tree branches that have high entropy.",
        "Choosing k equal to the number of rows divided by 2.",
        "A gradient descent stopping condition."
      ],
      answer: 0,
      explanation: "The elbow method identifies the point of diminishing returns where increasing k yields negligible reduction in within-cluster variance."
    },
    {
      prompt: "Why is K-Means sensitive to the initial placement of centroids?",
      choices: [
        "Poor random initialization can trap the algorithm in a suboptimal local minimum (solved via k-means++).",
        "Because K-Means only executes one single step.",
        "Because centroids cannot move during training.",
        "Because K-Means requires supervised labels."
      ],
      answer: 0,
      explanation: "Standard Lloyd initialization can converge to poor local optima; k-means++ seeds centroids far apart to guarantee better bounds."
    }
  ],
  accessibility: {
    canvasSummary: "K-Means scatter chart showing points assigned to nearest centroids with crosshair markers.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

