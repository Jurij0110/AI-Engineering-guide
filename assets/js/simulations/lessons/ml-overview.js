export default {
  id: "01-machine-learning-with-python/module-1-intro-to-machine-learning/ml-overview",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-1-intro-to-machine-learning",
  title: "ML Overview",
  sourcePath: "01-Machine_Learning_with_Python/Module-1-Intro_to_Machine_Learning/ML_Overview.txt",
  sourceFormat: "txt",
  engine: "MLOverviewWorkbench",
  learningObjectives: [
    "Distinguish AI, machine learning, and deep learning, and recognize supervised, unsupervised, semi-supervised, and reinforcement learning tasks.",
    "Choose a suitable ML technique from the data labels and target, then place model evaluation in the ML lifecycle."
  ],
  prerequisites: ["No prior model training is required."],
  scenario: {
    description: "Match practical tasks to the learning paradigms and techniques described in the IBM ML overview.",
    seed: 101
  },
  controls: [
    {
      id: "scenario", label: "Problem", type: "select", default: "sales",
      options: [
        { value: "sales", label: "Forecast monthly sales" },
        { value: "churn", label: "Predict customer churn" },
        { value: "segments", label: "Discover customer segments" },
        { value: "sparse", label: "Learn with few labelled records" },
        { value: "agent", label: "Learn from environment rewards" }
      ]
    },
    {
      id: "technique", label: "Learning technique", type: "select", default: "clustering",
      options: [
        { value: "regression", label: "Regression — continuous target" },
        { value: "classification", label: "Classification — category target" },
        { value: "clustering", label: "Clustering — unlabelled groups" },
        { value: "semi-supervised", label: "Semi-supervised — few labels" },
        { value: "reinforcement", label: "Reinforcement — action rewards" }
      ]
    },
    {
      id: "stage", label: "ML lifecycle step", type: "select", default: "problem",
      options: [
        { value: "problem", label: "Problem definition" },
        { value: "collect", label: "Data collection" },
        { value: "prepare", label: "Data preparation and ETL" },
        { value: "evaluate", label: "Model development and evaluation" },
        { value: "deploy", label: "Model deployment" }
      ]
    }
  ],
  views: [
    { type: "concept-hierarchy", title: "AI → ML → DL", bindings: ["ai", "ml", "dl"] },
    { type: "case-feedback", title: "Method and lifecycle decision", bindings: ["scenario", "technique", "stage"] }
  ],
  explanationRules: [
    { when: "scenario === 'sales' && technique === 'regression'", summary: "Continuous target", detail: "Revenue is numerical; supervised regression predicts its value from labelled history." },
    { when: "scenario === 'segments' && technique === 'clustering'", summary: "Unlabelled patterns", detail: "Clustering groups similar records without predefined segment labels." },
    { when: "scenario === 'agent' && technique === 'reinforcement'", summary: "Reward feedback", detail: "A policy improves by acting and observing rewards in an environment." }
  ],
  presets: [
    { id: "sales-fit", label: "Sales: correct method", values: { scenario: "sales", technique: "regression", stage: "evaluate" }, teachingPoint: "Labelled continuous targets call for regression and evaluation before deployment." },
    { id: "segments-fit", label: "Unlabelled customers", values: { scenario: "segments", technique: "clustering", stage: "prepare" }, teachingPoint: "Explore and prepare unlabelled data before discovering clusters." },
    { id: "agent-fit", label: "Reward-driven agent", values: { scenario: "agent", technique: "reinforcement", stage: "evaluate" }, teachingPoint: "Agents learn from actions and feedback rather than a fixed table of target labels." }
  ],
  challenge: {
    prompt: "For labelled monthly sales, choose the technique that predicts a continuous value and the lifecycle step where models are developed and evaluated.",
    success: { scenario: "sales", technique: "regression", stage: "evaluate" },
    hints: ["Sales revenue is a number, not a category.", "Evaluation follows data preparation and precedes deployment."]
  },
  quiz: [
    {
      prompt: "A dataset has no predefined customer segment labels. Which technique discovers natural groups?",
      choices: ["Clustering", "Regression", "Classification", "Reinforcement learning"],
      answer: 0,
      explanation: "Clustering is an unsupervised technique for finding groups in unlabelled data."
    },
    {
      prompt: "What distinguishes deep learning within the ML hierarchy?",
      choices: ["Multi-layer neural networks can learn feature representations", "It never uses data", "It is broader than AI", "It only performs ETL"],
      answer: 0,
      explanation: "The overview describes deep learning as a subset of ML using multi-layer neural networks that automatically extract features."
    }
  ],
  accessibility: {
    canvasSummary: "Text-based AI, ML, and deep-learning hierarchy with a task-to-technique decision workbench.",
    keyboardHelp: "Use Tab to reach each dropdown; use Arrow keys to change the problem, technique, and lifecycle stage."
  }
};
