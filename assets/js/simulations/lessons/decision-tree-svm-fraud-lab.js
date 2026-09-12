export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/decision-tree-svm-fraud-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Decision Tree SVM Fraud Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/08-Decision_Tree_SVM_Fraud_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "TreeExplorer",
  learningObjectives: [
    "Compare Decision Tree and Support Vector Machine performance on highly imbalanced credit card fraud detection data.",
    "Evaluate execution speed, interpretability, and ROC-AUC score across tree vs kernel models."
  ],
  prerequisites: [
    "Decision trees & SVMs",
    "Imbalanced classification & ROC-AUC"
  ],
  scenario: {
    description: "Follow the credit card fraud detection notebook lab. Compare interpretable Decision Trees with Snap ML / Scikit-learn SVMs on high-dimensional transaction data with extreme class imbalance.",
    seed: 1414
  },
  controls: [
    {
      id: "criterion",
      label: "Tree Criterion",
      type: "select",
      options: [
        { value: "gini", label: "Gini Impurity (Fast)" },
        { value: "entropy", label: "Entropy (Information Gain)" }
      ],
      default: "gini"
    },
    {
      id: "max_depth",
      label: "Tree Depth Pruning",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 4
    },
    {
      id: "samples",
      label: "Transaction Batch Size",
      type: "range",
      min: 30,
      max: 90,
      step: 10,
      default: 50
    }
  ],
  views: [
    {
      type: "tree-diagram",
      title: "Fraud Decision Hierarchy",
      bindings: ["tree"]
    },
    {
      type: "metric-cards",
      title: "Fraud Model Comparison",
      bindings: ["accuracy", "diagnosis", "depth"]
    }
  ],
  explanationRules: [
    {
      when: "max_depth <= 4",
      summary: "Transparent Fraud Rules",
      detail: "Shallow decision trees provide regulatory transparency with clear transaction amount and PCA feature thresholds."
    }
  ],
  presets: [
    {
      id: "fraud-balanced-tree",
      label: "Fraud Tree Baseline",
      values: { criterion: "gini", max_depth: 4, samples: 50 },
      teachingPoint: "Trees provide immediate rule explanations for financial compliance auditing."
    }
  ],
  challenge: {
    prompt: "Configure a pruned fraud detection tree with max_depth=4 to achieve Accuracy >= 85% and Balanced status.",
    success: { max_depth: 4, diagnosis: "Balanced" },
    hints: [
      "Keep Tree Depth Pruning set to 4.",
      "Verify that Diagnosis indicates Balanced."
    ]
  },
  quiz: [
    {
      prompt: "In credit card fraud detection with extreme class imbalance (e.g. 0.1% fraud), why is raw Accuracy a misleading metric?",
      choices: [
        "A naive model that predicts 'Legitimate' for every single transaction achieves 99.9% accuracy while catching zero fraud.",
        "Because accuracy cannot be computed on numeric datasets.",
        "Because SVMs cannot compute accuracy.",
        "Because accuracy only applies to linear regression models."
      ],
      answer: 0,
      explanation: "In severe class imbalance, accuracy gives a false sense of success; ROC-AUC, Recall, and Precision-Recall curves must be used instead."
    },
    {
      prompt: "What key operational advantage do Decision Trees offer over SVMs in financial fraud compliance?",
      choices: [
        "Interpretability: decision trees produce explicit if-else threshold rules that auditors can inspect and explain.",
        "Decision trees always achieve 100% test accuracy.",
        "Decision trees do not require any training data.",
        "Decision trees are immune to overfitting."
      ],
      answer: 0,
      explanation: "Decision trees offer full interpretability, allowing compliance teams to trace exactly why a transaction was flagged."
    }
  ],
  accessibility: {
    canvasSummary: "Credit card fraud decision tree diagram showing transaction split rules and accuracy metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

