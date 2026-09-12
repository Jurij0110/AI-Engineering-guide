export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/unsupervised-learning-evaluation",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Unsupervised Learning Evaluation",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/05-Unsupervised_Learning_Evaluation.txt",
  sourceFormat: "txt",
  engine: "MetricWorkbench",
  learningObjectives: [
    "Evaluate unsupervised models using internal metrics (Silhouette, Davies-Bouldin, Inertia) and external metrics (ARI, NMI).",
    "Assess dimensionality reduction quality via Explained Variance Ratio and Reconstruction Error."
  ],
  prerequisites: [
    "Clustering fundamentals",
    "PCA dimensionality reduction"
  ],
  scenario: {
    description: "Explore unsupervised evaluation methods. Adjust cluster noise and cluster counts to observe how Silhouette score and Davies-Bouldin index identify well-partitioned clusters.",
    seed: 3232
  },
  controls: [
    {
      id: "noise",
      label: "Cluster Dispersion",
      type: "range",
      min: 0.1,
      max: 0.6,
      step: 0.05,
      default: 0.15
    },
    {
      id: "k",
      label: "Number of Clusters (k)",
      type: "range",
      min: 2,
      max: 5,
      step: 1,
      default: 3
    }
  ],
  views: [
    {
      type: "metric-cards",
      title: "Unsupervised Quality Metrics",
      bindings: ["primary", "secondary", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "noise <= 0.2",
      summary: "High Cluster Cohesion & Separation",
      detail: "Compact, well-separated clusters maximize Silhouette score and minimize Davies-Bouldin index."
    }
  ],
  presets: [
    {
      id: "optimal-clusters",
      label: "High Cohesion Clusters",
      values: { noise: 0.15, k: 3 },
      teachingPoint: "Low cluster dispersion yields high silhouette and low Davies-Bouldin scores."
    }
  ],
  challenge: {
    prompt: "Set Cluster Dispersion <= 0.20 to achieve Silhouette >= 0.60 and Balanced status.",
    success: { diagnosis: "Balanced" },
    hints: [
      "Keep Cluster Dispersion <= 0.20."
    ]
  },
  quiz: [
    {
      prompt: "In the Davies-Bouldin Index for cluster evaluation, do lower or higher values indicate better clustering quality?",
      choices: [
        "Lower values: lower scores indicate that clusters are compact and well separated from each other.",
        "Higher values: scores above 10 are ideal.",
        "Values closest to 0.5.",
        "Davies-Bouldin only computes boolean true/false."
      ],
      answer: 0,
      explanation: "Davies-Bouldin measures the ratio of within-cluster scatter to between-cluster separation; lower values mean tighter, better-separated clusters."
    },
    {
      prompt: "What is an 'External' clustering evaluation metric?",
      choices: [
        "A metric (like Adjusted Rand Index) that compares cluster assignments against known ground truth labels.",
        "A metric that connects to external cloud servers.",
        "A metric computed only on test sets of supervised models.",
        "A metric measuring CPU temperature."
      ],
      answer: 0,
      explanation: "External metrics evaluate how closely unsupervised cluster partitions match known external gold-standard ground truth classes."
    }
  ],
  accessibility: {
    canvasSummary: "Unsupervised evaluation cards showing Silhouette score and Davies-Bouldin index.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

