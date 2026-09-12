export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/cross-val-and-advanced-techniques",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Cross Val and Advanced Techniques",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/07-Cross_Val_and_Advanced_Techniques.txt",
  sourceFormat: "txt",
  engine: "ValidationLab",
  learningObjectives: [
    "Implement K-Fold Cross-Validation, Stratified K-Fold (for imbalanced classes), and Train/Val/Test partitioning.",
    "Prevent data leakage / snooping by isolating test evaluations and cross-validating hyperparameter tuning."
  ],
  prerequisites: [
    "Train/Test split fundamentals",
    "Hyperparameter tuning"
  ],
  scenario: {
    description: "Explore cross-validation partitioning. Adjust fold count (k=3 to 10) and validation schemes to observe how multi-fold resampling stabilizes validation estimates and error bounds.",
    seed: 3434
  },
  controls: [
    {
      id: "k",
      label: "Number of Folds (k)",
      type: "range",
      min: 3,
      max: 10,
      step: 1,
      default: 5
    },
    {
      id: "method",
      label: "Validation Splitting Scheme",
      type: "select",
      options: [
        { value: "kfold", label: "Standard K-Fold Cross-Validation" },
        { value: "stratified", label: "Stratified K-Fold (Preserves Class Ratios)" }
      ],
      default: "kfold"
    }
  ],
  views: [
    {
      type: "folds-diagram",
      title: "Cross-Validation Partition Timeline",
      bindings: ["k", "method"]
    },
    {
      type: "metric-cards",
      title: "Cross-Validation Performance",
      bindings: ["mean", "stderr", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "k === 5",
      summary: "Standard 5-Fold Cross-Validation",
      detail: "5-fold CV evaluates on 80/20 train/val splits across 5 iterations, providing low-bias generalization estimates."
    },
    {
      when: "k === 10",
      summary: "10-Fold Cross-Validation",
      detail: "10-fold CV utilizes 90% of data per training fold, further reducing validation bias at the cost of higher training compute."
    }
  ],
  presets: [
    {
      id: "cv-5fold",
      label: "Standard 5-Fold",
      values: { k: 5, method: "kfold" },
      teachingPoint: "5-fold CV offers the industry-standard balance between compute speed and low validation variance."
    },
    {
      id: "cv-10fold",
      label: "10-Fold High Precision",
      values: { k: 10, method: "kfold" },
      teachingPoint: "10-fold CV narrows the standard error of the generalization estimate."
    }
  ],
  challenge: {
    prompt: "Configure a 5-fold CV setup to achieve Balanced diagnosis and CV Mean >= 85%.",
    success: { k: 5, diagnosis: "Balanced" },
    hints: [
      "Set Number of Folds (k) to 5."
    ]
  },
  quiz: [
    {
      prompt: "What is 'Data Snooping' (Data Leakage) in model validation?",
      choices: [
        "Tuning hyperparameters or selecting features using the test set before final evaluation, causing overly optimistic biased performance.",
        "Using too many CPU threads.",
        "Printing training logs to the terminal.",
        "Normalizing data using only the training split."
      ],
      answer: 0,
      explanation: "Data snooping occurs when test set information leaks into model selection, invalidating generalization claims."
    },
    {
      prompt: "When should Stratified K-Fold be preferred over standard K-Fold cross-validation?",
      choices: [
        "In imbalanced classification datasets to ensure each fold contains the same proportion of minority class samples as the whole dataset.",
        "In simple linear regression.",
        "When there is only 1 training observation.",
        "When all features are text strings."
      ],
      answer: 0,
      explanation: "Stratified sampling preserves identical target class distribution across all train and validation folds."
    }
  ],
  accessibility: {
    canvasSummary: "Cross-validation fold diagram showing train segments in blue and validation segments in orange.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

