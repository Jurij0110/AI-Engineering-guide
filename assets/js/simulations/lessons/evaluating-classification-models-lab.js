export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/evaluating-classification-models-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Evaluating Classification Models Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/02-Evaluating_Classification_Models_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "MetricWorkbench",
  learningObjectives: [
    "Compute classification_report, confusion_matrix, and ROC-AUC curve using scikit-learn metrics.",
    "Evaluate multi-model classification benchmarks on customer churn datasets."
  ],
  prerequisites: [
    "Confusion matrix metrics",
    "scikit-learn metrics module"
  ],
  scenario: {
    description: "Follow the classification evaluation lab. Compare Logistic Regression, Decision Trees, and SVM models using ROC-AUC curves and F1 scores on test partitions.",
    seed: 3030
  },
  controls: [
    {
      id: "threshold",
      label: "Classifier Threshold",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.05,
      default: 0.5
    },
    {
      id: "noise",
      label: "Test Sample Noise",
      type: "range",
      min: 0.05,
      max: 0.4,
      step: 0.05,
      default: 0.15
    }
  ],
  views: [
    {
      type: "metric-cards",
      title: "Lab Model Evaluation",
      bindings: ["primary", "secondary", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "threshold === 0.5",
      summary: "Lab 0.5 Benchmark",
      detail: "The lab evaluates standard 0.5 probability thresholds across test splits for benchmark comparisons."
    }
  ],
  presets: [
    {
      id: "lab-eval-baseline",
      label: "Lab Benchmark (0.50)",
      values: { threshold: 0.5, noise: 0.15 },
      teachingPoint: "Standardized evaluation metrics allow fair multi-algorithm benchmarking on holdout sets."
    }
  ],
  challenge: {
    prompt: "Set Classifier Threshold to 0.5 to achieve Accuracy >= 85% with Balanced diagnosis.",
    success: { threshold: 0.5, diagnosis: "Balanced" },
    hints: [
      "Set Classifier Threshold to 0.5."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn, what function generates a comprehensive text summary of precision, recall, and F1-score per class?",
      choices: [
        "sklearn.metrics.classification_report(y_true, y_pred)",
        "sklearn.metrics.confusion_matrix(y_true, y_pred)",
        "sklearn.metrics.accuracy_score(y_true, y_pred)",
        "sklearn.metrics.roc_auc_score(y_true, y_pred)"
      ],
      answer: 0,
      explanation: "classification_report builds a text report displaying precision, recall, f1-score, and support per class."
    },
    {
      prompt: "What does the Area Under the ROC Curve (ROC-AUC) measure?",
      choices: [
        "The probability that a classifier ranks a randomly chosen positive instance higher than a randomly chosen negative instance.",
        "The percentage of memory used by the model.",
        "The total execution time in seconds.",
        "The number of trees in a random forest."
      ],
      answer: 0,
      explanation: "ROC-AUC evaluates ranking quality across all possible thresholds, where 1.0 is perfect and 0.5 is random guessing."
    }
  ],
  accessibility: {
    canvasSummary: "Classification evaluation lab metric dashboard showing accuracy and F1 score.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

