export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/multiclass-classification-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Multiclass Classification Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/02-Multiclass_Classification_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "DecisionBoundary",
  learningObjectives: [
    "Train multiclass classification models using scikit-learn One-vs-Rest (OvR) and Softmax / Multinomial Logistic Regression.",
    "Evaluate multiclass decision regions, cross-entropy loss, and multi-category confusion matrices."
  ],
  prerequisites: [
    "Binary logistic regression",
    "Softmax / One-vs-Rest concepts"
  ],
  scenario: {
    description: "Follow the multiclass notebook lab. Train classifiers to partition 3 distinct data clusters in 2D space, observing how One-vs-Rest and Softmax construct piece-wise linear partition boundaries.",
    seed: 1010
  },
  controls: [
    {
      id: "pattern",
      label: "Multiclass Target Layout",
      type: "select",
      options: [
        { value: "multiclass", label: "3-Class Clustered Geometry" },
        { value: "separable", label: "2-Class Separable Benchmark" }
      ],
      default: "multiclass"
    },
    {
      id: "noise",
      label: "Inter-cluster Overlap",
      type: "range",
      min: 0.1,
      max: 0.6,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Dataset Samples",
      type: "range",
      min: 30,
      max: 90,
      step: 6,
      default: 45
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "3-Class Partition Surface",
      bindings: ["data", "model"]
    },
    {
      type: "metric-cards",
      title: "Multiclass Metrics",
      bindings: ["accuracy", "logLoss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "pattern === 'multiclass'",
      summary: "3-Class Decision Regions",
      detail: "Multiclass logistic regression assigns each point to the class region whose score argmax(w_k^T x + b_k) is highest."
    }
  ],
  presets: [
    {
      id: "multiclass-standard",
      label: "3-Class Standard Layout",
      values: { pattern: "multiclass", noise: 0.2, samples: 45 },
      teachingPoint: "Three distinct centroids yield three contiguous convex decision regions."
    }
  ],
  challenge: {
    prompt: "Achieve Accuracy >= 85% with Balanced diagnosis on the 3-Class Clustered Geometry.",
    success: { pattern: "multiclass", diagnosis: "Balanced" },
    hints: [
      "Select 3-Class Clustered Geometry.",
      "Keep Inter-cluster Overlap <= 0.25."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical function generalizes the binary sigmoid to produce normalized probabilities across K > 2 classes?",
      choices: [
        "Softmax function: exp(z_i) / sum(exp(z_j))",
        "Sigmoid function: 1 / (1 + e^-z)",
        "Hyperbolic tangent: tanh(z)",
        "Mean Squared Error"
      ],
      answer: 0,
      explanation: "Softmax exponentiates logits and normalizes by their sum, yielding valid multi-category probabilities that sum to 1."
    },
    {
      prompt: "How many binary classifiers are trained in One-vs-One (OvO) strategy for a 4-class problem?",
      choices: [
        "6 classifiers: 4*(4-1)/2 = 6",
        "4 classifiers: K = 4",
        "16 classifiers: 4^2 = 16",
        "1 single multi-output classifier"
      ],
      answer: 0,
      explanation: "OvO trains a separate binary classifier for every pair of classes: K*(K-1)/2 = 4*3/2 = 6 classifiers."
    }
  ],
  accessibility: {
    canvasSummary: "Scatter plot of 3 distinct class clusters in 2D space with multi-class decision boundary partitions.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

