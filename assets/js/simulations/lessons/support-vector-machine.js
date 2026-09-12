export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/support-vector-machine",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Support Vector Machine",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/07-Support_Vector_Machine.txt",
  sourceFormat: "txt",
  engine: "DecisionBoundary",
  learningObjectives: [
    "Explain how Support Vector Machines find the maximum-margin hyperplane that separates classes with optimal generalization.",
    "Evaluate soft-margin slack penalty C, support vectors, and kernel transformations (Linear, RBF, Polynomial) for non-linear separation."
  ],
  prerequisites: [
    "Hyperplane equation w^T x + b = 0",
    "Convex optimization & margin concepts"
  ],
  scenario: {
    description: "Explore Support Vector Machine maximum-margin classification. Adjust slack penalty C, kernel type, and dataset geometry to observe support vector identification, margin width (2/||w||), and non-linear boundaries.",
    seed: 1111
  },
  controls: [
    {
      id: "kernel",
      label: "SVM Kernel Function",
      type: "select",
      options: [
        { value: "linear", label: "Linear Kernel (Flat Hyperplane)" },
        { value: "rbf", label: "Radial Basis Function (RBF Kernel)" },
        { value: "poly", label: "Polynomial Kernel" }
      ],
      default: "linear"
    },
    {
      id: "C",
      label: "Margin Slack Penalty (C)",
      type: "range",
      min: 0.1,
      max: 10.0,
      step: 0.5,
      default: 1.0
    },
    {
      id: "pattern",
      label: "Class Geometry",
      type: "select",
      options: [
        { value: "separable", label: "Linearly Separable Clouds" },
        { value: "circles", label: "Concentric Circles (Non-linear)" },
        { value: "overlapping", label: "Overlapping Noisy Clusters" }
      ],
      default: "separable"
    },
    {
      id: "noise",
      label: "Observation Noise",
      type: "range",
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15
    },
    {
      id: "samples",
      label: "Sample Count",
      type: "range",
      min: 20,
      max: 70,
      step: 5,
      default: 35
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "SVM Decision Boundary & Support Vectors",
      bindings: ["data", "model"]
    },
    {
      type: "metric-cards",
      title: "SVM Margin Metrics",
      bindings: ["accuracy", "logLoss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "kernel === 'linear' && pattern === 'separable'",
      summary: "Maximum Margin Linear Hyperplane",
      detail: "SVM finds the unique hyperplane that maximizes the geometric distance (margin) to the closest points (support vectors)."
    },
    {
      when: "C < 0.5",
      summary: "Soft Margin (High Tolerance)",
      detail: "Small C allows more slack margin violations, producing a wider margin that may tolerate misclassifications to avoid overfitting."
    },
    {
      when: "C > 5.0",
      summary: "Hard Margin (Strict Penalty)",
      detail: "Large C heavily penalizes any margin violation, forcing a narrower margin that strictly separates training points."
    },
    {
      when: "kernel === 'rbf' && pattern === 'circles'",
      summary: "Kernel Trick Separation",
      detail: "The RBF kernel projects 2D concentric circles into infinite-dimensional Hilbert space where a linear hyperplane cleanly separates the classes."
    }
  ],
  presets: [
    {
      id: "max-margin-linear",
      label: "Max Margin Linear (C=1.0)",
      values: { kernel: "linear", C: 1.0, pattern: "separable", noise: 0.1, samples: 35 },
      teachingPoint: "Standard linear SVM maximizes the separation distance between linearly separable classes."
    },
    {
      id: "rbf-concentric",
      label: "RBF Concentric Circles",
      values: { kernel: "rbf", C: 2.0, pattern: "circles", noise: 0.1, samples: 40 },
      teachingPoint: "Non-linear kernels separate complex geometry without explicitly computing high-dimensional coordinates."
    },
    {
      id: "soft-margin-noisy",
      label: "Soft Margin Noisy Data (C=0.5)",
      values: { kernel: "linear", C: 0.5, pattern: "overlapping", noise: 0.35, samples: 45 },
      teachingPoint: "Small C creates a soft margin resilient to noisy outliers."
    }
  ],
  challenge: {
    prompt: "Configure SVM on Linearly Separable Clouds with C=1.0 to achieve Accuracy >= 90% and Balanced status.",
    success: { kernel: "linear", pattern: "separable", diagnosis: "Balanced" },
    hints: [
      "Select Linear Kernel.",
      "Select Linearly Separable Clouds.",
      "Keep Observation Noise <= 0.20."
    ]
  },
  quiz: [
    {
      prompt: "What are 'Support Vectors' in a Support Vector Machine?",
      choices: [
        "The critical training observations closest to the decision hyperplane that uniquely define the position and orientation of the margin.",
        "All misclassified data points in the training set.",
        "The weights of the neural network layer.",
        "The principal eigenvectors computed by PCA."
      ],
      answer: 0,
      explanation: "Support vectors are the critical boundary data points touching or violating the margin boundary; removing other points leaves the boundary unchanged."
    },
    {
      prompt: "What is the 'Kernel Trick' in SVMs?",
      choices: [
        "Computing inner products in a high-dimensional feature space implicitly without explicitly transforming data coordinates into high dimensions.",
        "Converting continuous regression targets into discrete integers.",
        "A heuristic to speed up decision tree pruning.",
        "A gradient descent learning rate decay schedule."
      ],
      answer: 0,
      explanation: "The kernel trick computes K(x, z) = <phi(x), phi(z)> directly, enabling non-linear separation in high dimensions with low computational cost."
    }
  ],
  accessibility: {
    canvasSummary: "SVM scatter plot showing data points, separating decision hyperplane, margin boundaries, and highlighted support vectors.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

