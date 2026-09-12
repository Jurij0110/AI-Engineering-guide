export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/ml-pipelines-and-grid-search-cv",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "ML Pipelines and GridSearchCV",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/11-ML_Pipelines_and_GridSearchCV.ipynb",
  sourceFormat: "ipynb",
  engine: "PipelineBuilder",
  learningObjectives: [
    "Encapsulate preprocessing (SimpleImputer, StandardScaler) and estimators into sklearn.pipeline.Pipeline.",
    "Execute hyperparameter optimization across cross-validation folds using sklearn.model_selection.GridSearchCV."
  ],
  prerequisites: [
    "Data leakage prevention",
    "scikit-learn Pipeline and GridSearchCV APIs"
  ],
  scenario: {
    description: "Follow the Pipeline and GridSearchCV notebook lab. Chain feature imputers, scalers, and logistic/tree estimators into an atomic pipeline, tuning regularization grids across 5 cross-validation folds.",
    seed: 3838
  },
  controls: [
    {
      id: "scaler",
      label: "Pipeline Preprocessor",
      type: "select",
      options: [
        { value: "standard", label: "StandardScaler (Zero Mean, Unit Var)" },
        { value: "minmax", label: "MinMaxScaler ([0, 1] Bounds)" }
      ],
      default: "standard"
    },
    {
      id: "model",
      label: "Pipeline Estimator",
      type: "select",
      options: [
        { value: "logistic", label: "LogisticRegression (Tuning C, Solver)" },
        { value: "rf", label: "RandomForestClassifier (Tuning Trees, Depth)" }
      ],
      default: "logistic"
    },
    {
      id: "cv_folds",
      label: "GridSearch CV Folds",
      type: "range",
      min: 3,
      max: 10,
      step: 1,
      default: 5
    }
  ],
  views: [
    {
      type: "pipeline-diagram",
      title: "Scikit-Learn Pipeline Architecture",
      bindings: ["scaler", "model"]
    },
    {
      type: "metric-cards",
      title: "GridSearch Outcomes",
      bindings: ["best-cv", "test-score", "total-fits", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "scaler === 'standard' && model === 'logistic'",
      summary: "Optimal Scaled Logistic Pipeline",
      detail: "StandardScaler chained into LogisticRegression ensures gradient descent convergence and fair L2 regularization across features."
    }
  ],
  presets: [
    {
      id: "lab-grid-pipeline",
      label: "Lab Pipeline (StandardScaler + Logistic)",
      values: { scaler: "standard", model: "logistic", cv_folds: 5 },
      teachingPoint: "Chaining transforms inside Pipeline ensures GridSearchCV never leaks validation fold data."
    }
  ],
  challenge: {
    prompt: "Configure the Pipeline with StandardScaler and 5 CV Folds to reach Best CV Score >= 88% and Balanced status.",
    success: { scaler: "standard", cv_folds: 5, diagnosis: "Balanced" },
    hints: [
      "Select StandardScaler.",
      "Set GridSearch CV Folds to 5."
    ]
  },
  quiz: [
    {
      prompt: "Why does wrapping transformers and an estimator in sklearn.pipeline.Pipeline prevent data leakage during GridSearchCV?",
      choices: [
        "The Pipeline automatically refits all transformer steps only on the training indices of each cross-validation fold.",
        "Because Pipeline removes all missing values automatically.",
        "Because Pipeline compiles code into C++.",
        "Pipeline converts all classification tasks into regression."
      ],
      answer: 0,
      explanation: "Pipeline guarantees that fit_transform is called only on the training portion of each fold, and transform on the validation portion."
    },
    {
      prompt: "In GridSearchCV(pipeline, param_grid=...), how are hyperparameters of nested pipeline steps specified?",
      choices: [
        "Using double underscore syntax: stepname__parametername (e.g. 'classifier__C': [0.1, 1, 10]).",
        "Using dots: stepname.parametername.",
        "Using hyphens: stepname-parametername.",
        "Using brackets: stepname['parametername']."
      ],
      answer: 0,
      explanation: "Scikit-learn uses the stepname__paramname convention to pass candidate grids to specific pipeline components."
    }
  ],
  accessibility: {
    canvasSummary: "Pipeline architecture diagram showing connected Preprocessor and Estimator stages along with GridSearchCV fit metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
