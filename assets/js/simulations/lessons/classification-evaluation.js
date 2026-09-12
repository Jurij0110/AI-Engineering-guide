export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/classification-evaluation",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Classification Evaluation",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/01-Classification_Evaluation.txt",
  sourceFormat: "txt",
  engine: "MetricWorkbench",
  learningObjectives: [
    "Evaluate classification models using Confusion Matrix, Accuracy, Precision, Recall, F1-Score, and Specificity.",
    "Analyze metric sensitivity across class-imbalanced datasets and error cost asymmetries."
  ],
  prerequisites: [
    "Supervised classification basics",
    "Decision threshold trade-offs"
  ],
  scenario: {
    description: "Explore classification metric trade-offs. Adjust the classification decision threshold and observe live changes in Precision, Recall, and the harmonic F1-Score.",
    seed: 2929
  },
  controls: [
    {
      id: "threshold",
      label: "Decision Cutoff",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.05,
      default: 0.5
    },
    {
      id: "noise",
      label: "Misclassification Noise",
      type: "range",
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15
    }
  ],
  views: [
    {
      type: "metric-cards",
      title: "Classification Performance Metrics",
      bindings: ["primary", "secondary", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "threshold === 0.5",
      summary: "Balanced F1 Cutoff",
      detail: "The default 0.5 threshold provides the optimal harmonic balance between Precision and Recall for symmetric error penalties."
    }
  ],
  presets: [
    {
      id: "balanced-eval",
      label: "Balanced Baseline (0.50)",
      values: { threshold: 0.5, noise: 0.15 },
      teachingPoint: "Standard 0.5 threshold balances false positive and false negative penalties."
    }
  ],
  challenge: {
    prompt: "Set Decision Cutoff to 0.5 to achieve Balanced diagnosis and F1 >= 0.85.",
    success: { threshold: 0.5, diagnosis: "Balanced" },
    hints: [
      "Set Decision Cutoff to 0.5."
    ]
  },
  quiz: [
    {
      prompt: "What is the mathematical definition of F1-Score in binary classification?",
      choices: [
        "The harmonic mean of Precision and Recall: 2 * (Precision * Recall) / (Precision + Recall)",
        "The arithmetic average: (Precision + Recall) / 2",
        "The difference: Precision - Recall",
        "The ratio of True Positives to False Positives"
      ],
      answer: 0,
      explanation: "F1 is the harmonic mean of precision and recall, penalizing extreme trade-offs where one metric collapses."
    },
    {
      prompt: "When is Precision prioritized over Recall in production machine learning?",
      choices: [
        "In spam filtering or fraud flagging where false alarms (False Positives) incur high user disruption or business penalties.",
        "In life-critical medical screening.",
        "When there is zero noise in the training set.",
        "When using linear regression models."
      ],
      answer: 0,
      explanation: "High precision minimizes False Positives (e.g. blocking important user emails as spam)."
    }
  ],
  accessibility: {
    canvasSummary: "Classification evaluation metric cards showing Accuracy, F1-Score, and diagnosis status.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

