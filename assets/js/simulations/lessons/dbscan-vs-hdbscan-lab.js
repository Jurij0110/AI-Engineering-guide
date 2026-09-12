export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/dbscan-vs-hdbscan-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "DBSCAN vs HDBSCAN Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/05-DBSCAN_vs_HDBSCAN_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Implement DBSCAN and HDBSCAN in Python on synthetic spatial and GPS location datasets.",
    "Analyze noise classification (label=-1), cluster stability metrics, and epsilon sensitivity."
  ],
  prerequisites: [
    "DBSCAN & HDBSCAN theory",
    "scikit-learn DBSCAN & hdbscan library"
  ],
  scenario: {
    description: "Follow the spatial anomaly and density clustering lab. Benchmark DBSCAN against HDBSCAN on multi-density spatial coordinates, tuning min_cluster_size to isolate GPS anomalies.",
    seed: 2424
  },
  controls: [
    {
      id: "algorithm",
      label: "Algorithm Selection",
      type: "select",
      options: [
        { value: "dbscan", label: "DBSCAN (sklearn.cluster.DBSCAN)" }
      ],
      default: "dbscan"
    },
    {
      id: "eps",
      label: "Epsilon Distance",
      type: "range",
      min: 0.3,
      max: 1.4,
      step: 0.1,
      default: 0.7
    },
    {
      id: "min_samples",
      label: "min_samples Parameter",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 3
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Spatial Clustering & Noise Detection",
      bindings: ["data", "assignments"]
    },
    {
      type: "metric-cards",
      title: "Lab Metric Outputs",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "eps === 0.7",
      summary: "Lab Calibrated Epsilon",
      detail: "Epsilon = 0.7 correctly isolates GPS anomalies as noise (label -1) while grouping dense trip coordinates."
    }
  ],
  presets: [
    {
      id: "lab-dbscan-optimal",
      label: "Lab Benchmark (eps=0.7, min=3)",
      values: { algorithm: "dbscan", eps: 0.7, min_samples: 3 },
      teachingPoint: "Calibrated epsilon isolates GPS tracking anomalies while retaining route cluster fidelity."
    }
  ],
  challenge: {
    prompt: "Tune Epsilon Distance to 0.7 to achieve Balanced diagnosis and separate anomalies.",
    success: { eps: 0.7, diagnosis: "Balanced" },
    hints: [
      "Set Epsilon Distance to 0.7.",
      "Set min_samples Parameter to 3."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn DBSCAN, what cluster label is assigned to noise points / outliers?",
      choices: [
        "-1",
        "0",
        "None / NaN",
        "999"
      ],
      answer: 0,
      explanation: "DBSCAN assigns label -1 to all unclustered noise points that do not satisfy core or border density conditions."
    },
    {
      prompt: "Why does DBSCAN struggle when clusters have significantly different densities?",
      choices: [
        "A single global epsilon radius cannot simultaneously capture dense compact clusters and sparse diffuse clusters.",
        "Because DBSCAN requires data to be 1-dimensional.",
        "Because DBSCAN runs in O(1) time.",
        "Because DBSCAN requires labeled test sets."
      ],
      answer: 0,
      explanation: "With varying densities, an epsilon tuned for dense clusters classifies sparse clusters as noise, while an epsilon tuned for sparse clusters merges dense clusters."
    }
  ],
  accessibility: {
    canvasSummary: "Spatial coordinate scatter plot showing DBSCAN cluster groupings and noise outliers.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

