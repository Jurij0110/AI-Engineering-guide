export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/t-sne-umap-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "tSNE UMAP Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/09-tSNE_UMAP_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "ProjectionLab",
  learningObjectives: [
    "Apply t-SNE and UMAP in Python for non-linear high-dimensional manifold visualization.",
    "Analyze hyperparameters: perplexity in t-SNE vs n_neighbors and min_dist in UMAP, evaluating execution speed and cluster preservation."
  ],
  prerequisites: [
    "PCA dimensionality reduction",
    "Manifold learning & graph embeddings"
  ],
  scenario: {
    description: "Follow the non-linear manifold learning lab. Compare linear PCA projections with t-SNE and UMAP embeddings on complex high-dimensional datasets (digits/fashion MNIST), tuning perplexity for clean cluster separation.",
    seed: 2828
  },
  controls: [
    {
      id: "n_components",
      label: "Embedding Dimensions",
      type: "range",
      min: 1,
      max: 2,
      step: 1,
      default: 2
    },
    {
      id: "correlation",
      label: "Manifold Curvature / Non-linearity",
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
      title: "Non-linear Manifold Embedding",
      bindings: ["data", "pca"]
    },
    {
      type: "metric-cards",
      title: "Manifold Preservation",
      bindings: ["variance", "diagnosis", "components"]
    }
  ],
  explanationRules: [
    {
      when: "n_components === 2",
      summary: "2D Manifold Visual Embedding",
      detail: "UMAP and t-SNE unroll complex non-linear high-dimensional manifolds into distinct 2D island clusters."
    }
  ],
  presets: [
    {
      id: "umap-benchmark",
      label: "UMAP Benchmark (2D)",
      values: { n_components: 2, correlation: 0.85 },
      teachingPoint: "UMAP preserves both local neighborhood clusters and global inter-cluster relationships with faster computation than t-SNE."
    }
  ],
  challenge: {
    prompt: "Set Embedding Dimensions to 2 to reach High Dimensional Compression status.",
    success: { n_components: 2 },
    hints: [
      "Keep Embedding Dimensions set to 2."
    ]
  },
  quiz: [
    {
      prompt: "What key advantage does UMAP offer over classic t-SNE in production data science?",
      choices: [
        "UMAP is significantly faster computationally, scales better to large datasets, and preserves more global topological structure.",
        "UMAP only works on 1-dimensional data.",
        "UMAP requires ground truth labels.",
        "UMAP does not have any hyperparameters."
      ],
      answer: 0,
      explanation: "UMAP leverages fuzzy simplicial sets to optimize embeddings faster than t-SNE while better preserving global inter-cluster distances."
    },
    {
      prompt: "Why should t-SNE embeddings NOT be used directly as input features for training distance-based models (e.g. k-NN) on new data?",
      choices: [
        "t-SNE is a non-parametric visualization technique without a straightforward out-of-sample transform method (cannot transform new test points).",
        "Because t-SNE produces complex imaginary numbers.",
        "Because t-SNE only accepts 10 rows.",
        "Because t-SNE destroys all variance."
      ],
      answer: 0,
      explanation: "Standard t-SNE does not learn an explicit parametric projection matrix, making projecting unseen test points difficult."
    }
  ],
  accessibility: {
    canvasSummary: "Manifold projection plot showing non-linear high-dimensional clusters unrolled into 2D space.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
