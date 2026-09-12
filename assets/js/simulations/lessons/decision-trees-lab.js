export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/decision-trees-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Decision Trees Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/04-Decision_Trees_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "TreeExplorer",
  learningObjectives: [
    "Train a DecisionTreeClassifier on categorical patient drug data (drug200.csv) with preprocessing (One-Hot / Label encoding).",
    "Visualize the learned tree graph using tree.plot_tree() and evaluate accuracy using metrics.accuracy_score."
  ],
  prerequisites: [
    "Decision tree fundamentals",
    "Categorical feature encoding"
  ],
  scenario: {
    description: "Follow the drug prescription notebook lab. Predict optimal medication (DrugA, DrugB, DrugC, DrugX, DrugY) based on patient Age, Sex, BP, Cholesterol, and Na_to_K ratio using DecisionTreeClassifier.",
    seed: 1313
  },
  controls: [
    {
      id: "criterion",
      label: "Impurity Metric",
      type: "select",
      options: [
        { value: "entropy", label: "Entropy (Information Gain)" },
        { value: "gini", label: "Gini Impurity" }
      ],
      default: "entropy"
    },
    {
      id: "max_depth",
      label: "max_depth Constraint",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 4
    },
    {
      id: "samples",
      label: "Patient Records",
      type: "range",
      min: 30,
      max: 80,
      step: 5,
      default: 50
    }
  ],
  views: [
    {
      type: "tree-diagram",
      title: "Prescription Decision Tree",
      bindings: ["tree"]
    },
    {
      type: "metric-cards",
      title: "Lab Model Evaluation",
      bindings: ["accuracy", "diagnosis", "depth"]
    }
  ],
  explanationRules: [
    {
      when: "max_depth === 4",
      summary: "Optimal Prescription Tree",
      detail: "Depth 4 accurately captures the dominant Na_to_K ratio split (>14.8 for DrugY) and subsequent BP/Age branches."
    }
  ],
  presets: [
    {
      id: "lab-drug-tree",
      label: "Lab Benchmark (Depth 4)",
      values: { criterion: "entropy", max_depth: 4, samples: 50 },
      teachingPoint: "The lab demonstrates near 98% accuracy when Na_to_K ratio is prioritized as root split."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: achieve Accuracy >= 90% with Balanced diagnosis using Entropy at max_depth=4.",
    success: { criterion: "entropy", max_depth: 4, diagnosis: "Balanced" },
    hints: [
      "Select Entropy as Impurity Metric.",
      "Set max_depth Constraint to 4."
    ]
  },
  quiz: [
    {
      prompt: "In the drug dataset lab, which patient feature serves as the most decisive root split separating DrugY from others?",
      choices: [
        "Sodium to Potassium ratio (Na_to_K > 14.8)",
        "Patient Gender (Sex)",
        "Cholesterol Level",
        "Patient Age"
      ],
      answer: 0,
      explanation: "Patients with Na_to_K ratio > 14.8 are consistently prescribed DrugY, providing the highest information gain at the root node."
    },
    {
      prompt: "Why must categorical text features (e.g. 'HIGH', 'NORMAL', 'LOW' BP) be encoded before training DecisionTreeClassifier in scikit-learn?",
      choices: [
        "Scikit-learn algorithms require numeric feature arrays and cannot process raw strings directly.",
        "Because categorical data is illegal in supervised learning.",
        "To reduce the number of patient records.",
        "To automatically normalize variance to 1.0."
      ],
      answer: 0,
      explanation: "Scikit-learn tree estimators require numerical NumPy arrays / float matrices for computing split thresholds."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive patient medication decision tree showing root and branch criteria.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

