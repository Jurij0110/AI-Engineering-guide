export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/evaluating-clustering",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Evaluating Clustering",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/06-Evaluating_Clustering.ipynb",
  sourceFormat: "ipynb",
  engine: "MetricWorkbench",
  learningObjectives: [
    "Compute silhouette_score, silhouette_samples, and Davies-Bouldin scores in scikit-learn.",
    "Plot silhouette diagrams to detect sub-optimal cluster counts and uneven cluster sizes."
  ],
  prerequisites: [
    "K-Means and DBSCAN",
    "Silhouette analysis concepts"
  ],
  scenario: {
    description: "Follow the clustering evaluation notebook lab. Profile cluster cohesion and separation across varying k values on customer purchase records.",
    seed: 3333
  },
  controls: [
    {
      id: "noise",
      label: "Inter-cluster Spread",
      type: "range",
      min: 0.1,
      max: 0.5,
      step: 0.05,
      default: 0.15
    },
    {
      id: "k",
      label: "k Partition Parameter",
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
      title: "Lab Clustering Profile",
      bindings: ["primary", "secondary", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "k === 3",
      summary: "Lab 3-Cluster Benchmark",
      detail: "k=3 yields the highest average silhouette score across synthetic customer purchase features."
    }
  ],
  presets: [
    {
      id: "lab-k3",
      label: "Lab Benchmark (k=3)",
      values: { noise: 0.15, k: 3 },
      teachingPoint: "Evaluating silhouette scores across candidate k values confirms the optimal cluster partition."
    }
  ],
  challenge: {
    prompt: "Set k Partition Parameter to 3 with Spread 0.15 to achieve Balanced status.",
    success: { k: 3, diagnosis: "Balanced" },
    hints: [
      "Set k Partition Parameter to 3."
    ]
  },
  quiz: [
    {
      prompt: "In a Silhouette plot, what does a negative silhouette coefficient for a sample indicate?",
      choices: [
        "The sample is closer to the centroid of a neighboring cluster than to its own assigned cluster (likely misclustered).",
        "The sample is exactly on the centroid.",
        "The sample has zero variance.",
        "The sample was ignored during computation."
      ],
      answer: 0,
      explanation: "A negative silhouette score s(i) < 0 indicates intra-cluster distance a(i) is larger than nearest cluster distance b(i)."
    },
    {
      prompt: "In scikit-learn, what function calculates the mean Silhouette Coefficient over all samples?",
      choices: [
        "sklearn.metrics.silhouette_score(X, labels)",
        "sklearn.metrics.silhouette_samples(X, labels)",
        "sklearn.metrics.accuracy_score(X, labels)",
        "sklearn.cluster.k_means(X)"
      ],
      answer: 0,
      explanation: "silhouette_score computes the mean silhouette coefficient of all samples in the dataset."
    }
  ],
  accessibility: {
    canvasSummary: "Clustering evaluation cards showing Silhouette score and Davies-Bouldin metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

