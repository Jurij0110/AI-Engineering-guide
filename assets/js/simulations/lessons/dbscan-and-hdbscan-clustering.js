export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/dbscan-and-hdbscan-clustering",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "DBSCAN and HDBSCAN Clustering",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/04-DBSCAN_and_HDBSCAN_Clustering.txt",
  sourceFormat: "txt",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Understand density-based clustering: eps radius, min_samples, core points, border points, and noise classification.",
    "Compare DBSCAN (fixed global density) with HDBSCAN (hierarchical varying density clustering)."
  ],
  prerequisites: [
    "Distance metrics",
    "Density-reachability concepts"
  ],
  scenario: {
    description: "Explore DBSCAN and HDBSCAN on complex geometries. Tune eps radius and min_samples to separate non-convex crescent clusters from noisy background outliers.",
    seed: 2323
  },
  controls: [
    {
      id: "algorithm",
      label: "Density Method",
      type: "select",
      options: [
        { value: "dbscan", label: "DBSCAN (Fixed Epsilon Radius)" }
      ],
      default: "dbscan"
    },
    {
      id: "eps",
      label: "Epsilon Radius (eps)",
      type: "range",
      min: 0.2,
      max: 1.5,
      step: 0.1,
      default: 0.7
    },
    {
      id: "min_samples",
      label: "Min Core Samples",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 3
    },
    {
      id: "pattern",
      label: "Density Geometry",
      type: "select",
      options: [
        { value: "moons", label: "Interleaving Moons (Non-convex)" },
        { value: "blobs", label: "Gaussian Blobs" }
      ],
      default: "moons"
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Density Reachability & Noise Points",
      bindings: ["data", "assignments"]
    },
    {
      type: "metric-cards",
      title: "Density Metrics",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "eps >= 0.6 && eps <= 0.9 && pattern === 'moons'",
      summary: "Optimal Density Separation",
      detail: "DBSCAN cleanly connects density-reachable points along non-linear crescents without forcing spherical shapes."
    },
    {
      when: "eps > 1.2",
      summary: "Epsilon Too Large (Overmerging)",
      detail: "Excessive eps connects distinct clusters through noise bridges into one single giant cluster."
    }
  ],
  presets: [
    {
      id: "dbscan-moons",
      label: "Optimal Moons (eps=0.7)",
      values: { algorithm: "dbscan", eps: 0.7, min_samples: 3, pattern: "moons" },
      teachingPoint: "Density clustering detects complex arbitrary shapes where centroid methods fail."
    }
  ],
  challenge: {
    prompt: "Configure DBSCAN on Interleaving Moons with eps=0.7 to identify exactly 2 clusters and achieve Balanced status.",
    success: { eps: 0.7, pattern: "moons", diagnosis: "Balanced" },
    hints: [
      "Select Interleaving Moons.",
      "Set Epsilon Radius to 0.7.",
      "Set Min Core Samples to 3."
    ]
  },
  quiz: [
    {
      prompt: "What is a 'Core Point' in DBSCAN?",
      choices: [
        "A point that contains at least min_samples within its epsilon distance neighborhood.",
        "The mathematical mean centroid of all points.",
        "A point that has been marked as noise.",
        "The highest eigenvalue vector."
      ],
      answer: 0,
      explanation: "A point is a core point if |N_eps(p)| >= min_samples, anchoring the expansion of a density cluster."
    },
    {
      prompt: "How does HDBSCAN improve upon classic DBSCAN?",
      choices: [
        "It converts DBSCAN into a hierarchical clustering algorithm across all eps scales, extracting clusters of varying densities.",
        "It requires setting k explicitly like K-Means.",
        "It only works on 1D numbers.",
        "It removes all noise points before training."
      ],
      answer: 0,
      explanation: "HDBSCAN builds a cluster tree across continuous epsilon thresholds, successfully detecting clusters with differing local densities."
    }
  ],
  accessibility: {
    canvasSummary: "Density scatter plot highlighting core cluster points in distinct colors and noise points in grey.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

