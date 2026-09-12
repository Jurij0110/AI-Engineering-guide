export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/classification",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Classification",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/01-Classification.txt",
  sourceFormat: "txt",
  engine: "ClassifierConceptLab",
  learningObjectives: [
    "Understand classification as a supervised learning task predicting discrete categorical target labels from feature vectors.",
    "Compare binary and multiclass strategies, exploring One-vs-Rest (OvR), One-vs-One (OvO), and confusion matrix metrics."
  ],
  prerequisites: [
    "Supervised learning overview",
    "Discrete vs continuous targets"
  ],
  scenario: {
    description: "Explore the taxonomy of classification models. Adjust classification decision thresholds and inspect the live confusion matrix (True Positives, False Positives, False Negatives, True Negatives) and precision/recall trade-offs.",
    seed: 909
  },
  controls: [
    {
      id: "strategy",
      label: "Classification Strategy",
      type: "select",
      options: [
        { value: "binary", label: "Binary Classification (Class 0 vs 1)" },
        { value: "ovr", label: "One-vs-Rest (OvR) Multiclass" },
        { value: "ovo", label: "One-vs-One (OvO) Multiclass" }
      ],
      default: "binary"
    },
    {
      id: "threshold",
      label: "Decision Cutoff Threshold",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.05,
      default: 0.5
    },
    {
      id: "balance",
      label: "Class Prior Balance",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.1,
      default: 0.5
    }
  ],
  views: [
    {
      type: "confusion-matrix",
      title: "Interactive Confusion Matrix",
      bindings: ["matrix"]
    },
    {
      type: "metric-cards",
      title: "Classification Performance",
      bindings: ["accuracy", "precision", "recall", "f1"]
    }
  ],
  explanationRules: [
    {
      when: "threshold === 0.5",
      summary: "Balanced Decision Threshold",
      detail: "At threshold 0.5, predictions reflect neutral confidence balancing False Positives and False Negatives."
    },
    {
      when: "threshold > 0.7",
      summary: "High Precision Threshold",
      detail: "Increasing threshold reduces False Positives (higher Precision), but increases False Negatives (lower Recall)."
    },
    {
      when: "threshold < 0.3",
      summary: "High Recall Threshold",
      detail: "Lowering threshold captures almost all positives (higher Recall), but permits more False Positives (lower Precision)."
    }
  ],
  presets: [
    {
      id: "balanced-eval",
      label: "Balanced Baseline (0.50)",
      values: { strategy: "binary", threshold: 0.5, balance: 0.5 },
      teachingPoint: "Standard 0.50 threshold with balanced classes provides balanced F1 score."
    },
    {
      id: "spam-filtering",
      label: "Spam Filter (High Precision 0.75)",
      values: { strategy: "binary", threshold: 0.75, balance: 0.5 },
      teachingPoint: "Spam filters require high precision to avoid misclassifying critical user emails as spam."
    },
    {
      id: "medical-screening",
      label: "Medical Screening (High Recall 0.25)",
      values: { strategy: "binary", threshold: 0.25, balance: 0.5 },
      teachingPoint: "Disease screening prioritizes high recall to ensure no positive diagnoses are missed."
    }
  ],
  challenge: {
    prompt: "Configure a high-precision setup (threshold >= 0.70) that achieves Precision >= 80% with Accuracy >= 75%.",
    success: { threshold: 0.7 },
    hints: [
      "Set Decision Cutoff Threshold to 0.70 or higher.",
      "Inspect the live Precision metric card."
    ]
  },
  quiz: [
    {
      prompt: "How does the One-vs-Rest (OvR) multiclass strategy handle a problem with K classes?",
      choices: [
        "It trains K separate binary classifiers, each distinguishing one class from all other K-1 classes combined.",
        "It trains K*(K-1)/2 classifiers comparing every possible pair of classes.",
        "It trains a single decision tree with exactly K leaf nodes.",
        "It converts the multiclass labels into continuous numbers and runs linear regression."
      ],
      answer: 0,
      explanation: "OvR (One-vs-All) trains K binary classifiers: one per class vs the rest, assigning the class with the highest probability score."
    },
    {
      prompt: "In a medical diagnosis test, which error type is most dangerous to minimize (requiring high Recall)?",
      choices: [
        "False Negatives (failing to detect an actual disease).",
        "False Positives (flagging a healthy patient for follow-up testing).",
        "True Negatives.",
        "True Positives."
      ],
      answer: 0,
      explanation: "False Negatives leave sick patients untreated; thus medical screening emphasizes high Recall to minimize False Negatives."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive confusion matrix table displaying counts of TP, FP, TN, FN along with accuracy, precision, recall, and F1-score.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

