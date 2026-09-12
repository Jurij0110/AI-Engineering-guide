export default {
  id: "01-machine-learning-with-python/module-3-supervised-learning-models/decision-trees",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-3-supervised-learning-models",
  title: "Decision Trees",
  sourcePath: "01-Machine_Learning_with_Python/Module-3-Supervised_Learning_Models/03-Decision_Trees.txt",
  sourceFormat: "txt",
  engine: "TreeExplorer",
  learningObjectives: [
    "Understand how decision trees construct recursive binary tests to partition multi-attribute datasets.",
    "Evaluate splitting criteria (Entropy/Information Gain vs Gini Impurity) and prevent overfitting via tree pruning."
  ],
  prerequisites: [
    "Supervised classification basics",
    "Entropy and probability concepts"
  ],
  scenario: {
    description: "Explore recursive partitioning in decision trees. Adjust tree depth constraints, split criterion (Gini vs Entropy), and minimum split thresholds to observe feature splits and class purity in leaf nodes.",
    seed: 1212
  },
  controls: [
    {
      id: "criterion",
      label: "Splitting Criterion",
      type: "select",
      options: [
        { value: "gini", label: "Gini Impurity (1 - sum(p_i^2))" },
        { value: "entropy", label: "Shannon Entropy / Information Gain" }
      ],
      default: "gini"
    },
    {
      id: "max_depth",
      label: "Tree Max Depth",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3
    },
    {
      id: "samples",
      label: "Patient Observation Count",
      type: "range",
      min: 20,
      max: 70,
      step: 5,
      default: 40
    }
  ],
  views: [
    {
      type: "tree-diagram",
      title: "Decision Tree Architecture",
      bindings: ["tree"]
    },
    {
      type: "metric-cards",
      title: "Tree Accuracy & Depth",
      bindings: ["accuracy", "diagnosis", "depth"]
    }
  ],
  explanationRules: [
    {
      when: "max_depth === 1",
      summary: "Decision Stump (Underfitting)",
      detail: "A depth-1 tree (decision stump) makes only one binary split, which is too simple for multi-attribute interactions."
    },
    {
      when: "max_depth === 3",
      summary: "Balanced Tree Structure",
      detail: "Depth 3 captures key feature interactions while maintaining sufficient samples per leaf to ensure generalization."
    },
    {
      when: "max_depth > 4",
      summary: "Deep Tree (Overfitting Risk)",
      detail: "Unconstrained tree depth creates single-sample leaves that memorize sample noise."
    }
  ],
  presets: [
    {
      id: "tree-standard",
      label: "Pruned Tree (Depth 3)",
      values: { criterion: "gini", max_depth: 3, samples: 40 },
      teachingPoint: "Constraining max_depth provides compact interpretable rules that generalize well."
    },
    {
      id: "tree-stump",
      label: "Decision Stump (Depth 1)",
      values: { criterion: "gini", max_depth: 1, samples: 40 },
      teachingPoint: "Single-split decision stumps have high bias and cannot solve non-linear patterns."
    }
  ],
  challenge: {
    prompt: "Build a decision tree with max_depth between 3 and 4 that achieves Accuracy >= 85% and Balanced status.",
    success: { diagnosis: "Balanced" },
    hints: [
      "Set Tree Max Depth to 3.",
      "Choose Gini or Entropy as Splitting Criterion."
    ]
  },
  quiz: [
    {
      prompt: "What is 'Information Gain' in the context of decision tree construction?",
      choices: [
        "The difference between parent node entropy and the weighted average entropy of the resulting child nodes.",
        "The percentage increase in training speed when adding features.",
        "The total number of correctly classified test instances.",
        "The learning rate decay factor in gradient boosting."
      ],
      answer: 0,
      explanation: "Information Gain = Entropy(parent) - WeightedSum(Entropy(children)), measuring impurity reduction."
    },
    {
      prompt: "Why is tree pruning essential in production machine learning systems?",
      choices: [
        "To prevent deep trees from memorizing training set noise and improve generalization on unseen test data.",
        "To convert continuous target variables into categorical strings.",
        "Because scikit-learn cannot serialize trees with depth greater than 2.",
        "To force the decision tree to become a linear regression line."
      ],
      answer: 0,
      explanation: "Pruning removes noisy, statistically insignificant branches to reduce model variance and avoid overfitting."
    }
  ],
  accessibility: {
    canvasSummary: "Decision tree structure showing root test, intermediate branch splits, and leaf classification predictions.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

