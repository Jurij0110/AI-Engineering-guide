export default {
  id: "01-machine-learning-with-python/module-6-final-project-and-exam/titanic-practice-project",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-6-final-project-and-exam",
  title: "Titanic Practice Project",
  sourcePath: "01-Machine_Learning_with_Python/Module-6-Final_Project_and_Exam/1-Titanic_Practice_Project.ipynb",
  sourceFormat: "ipynb",
  engine: "ProjectWorkbench",
  learningObjectives: [
    "Execute an end-to-end machine learning project workflow on the Titanic disaster dataset: EDA, missing value imputation, and feature extraction.",
    "Benchmark Logistic Regression, Decision Tree, k-NN, SVM, and Random Forest models on passenger survival prediction."
  ],
  prerequisites: [
    "Course 01 Classical ML Algorithms",
    "Model evaluation & tuning"
  ],
  scenario: {
    description: "Follow the Titanic passenger survival capstone project. Clean demographic and ticket attributes (Pclass, Sex, Age, Fare, Embarked), engineer family size features, and benchmark multiple ML classifiers.",
    seed: 3939
  },
  controls: [
    {
      id: "model",
      label: "Selected Classifier",
      type: "select",
      options: [
        { value: "rf", label: "RandomForestClassifier (Top Benchmark)" },
        { value: "logistic", label: "LogisticRegression Baseline" },
        { value: "knn", label: "KNeighborsClassifier" },
        { value: "tree", label: "DecisionTreeClassifier" }
      ],
      default: "rf"
    }
  ],
  views: [
    {
      type: "project-leaderboard",
      title: "Model Comparison Leaderboard",
      bindings: ["accuracy", "f1", "roc", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "model === 'rf'",
      summary: "Random Forest Top Performer",
      detail: "RandomForestClassifier achieves top survival prediction accuracy (83.5%) by capturing non-linear interactions between Pclass, Sex, and Age."
    }
  ],
  presets: [
    {
      id: "titanic-rf",
      label: "Champion Model (Random Forest)",
      values: { model: "rf" },
      teachingPoint: "Ensemble trees handle mixed categorical-continuous feature spaces with minimal overfitting."
    }
  ],
  challenge: {
    prompt: "Select RandomForestClassifier to achieve Accuracy >= 83% with Balanced status.",
    success: { model: "rf", diagnosis: "Balanced" },
    hints: [
      "Select RandomForestClassifier (Top Benchmark)."
    ]
  },
  quiz: [
    {
      prompt: "In the Titanic project, why was the 'Sex' feature one of the strongest predictive signals for passenger survival?",
      choices: [
        "The historical maritime evacuation protocol prioritised women and children first ('women and children first' policy).",
        "Because female passengers paid higher fares.",
        "Because male passengers did not receive tickets.",
        "Because the dataset only included male survivors."
      ],
      answer: 0,
      explanation: "Over 74% of female passengers survived compared to ~19% of male passengers due to evacuation protocols."
    },
    {
      prompt: "What is an effective strategy for imputing missing values in the 'Age' column in the Titanic dataset?",
      choices: [
        "Imputing median Age grouped by passenger class (Pclass) and title (Mr, Mrs, Miss, Master).",
        "Replacing missing ages with 0.",
        "Dropping all rows with missing ages (losing 20% of data).",
        "Setting all missing ages to 100."
      ],
      answer: 0,
      explanation: "Grouped median imputation preserves age distribution nuances across demographic sub-populations without data loss."
    }
  ],
  accessibility: {
    canvasSummary: "Titanic project leaderboard displaying comparative Accuracy, F1-Score, and ROC-AUC metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

