export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/data-leakage-and-pitfalls",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Data Leakage and Pitfalls",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/10-Data_Leakage_and_Pitfalls.txt",
  sourceFormat: "txt",
  engine: "LeakageDetective",
  learningObjectives: [
    "Identify common data leakage pitfalls: pre-split global scaling, target encoding contamination, and future lookahead in temporal splits.",
    "Structure leakage-safe ML workflows using scikit-learn Pipeline and TimeSeriesSplit."
  ],
  prerequisites: [
    "Cross-validation fundamentals",
    "Feature engineering workflows"
  ],
  scenario: {
    description: "Audit machine learning pipelines for hidden data leakage. Compare apparent validation accuracy with true out-of-sample deployment performance across contaminated vs clean pipeline architectures.",
    seed: 3737
  },
  controls: [
    {
      id: "scenario",
      label: "Pipeline Architecture",
      type: "select",
      options: [
        { value: "clean", label: "Clean Pipeline (Transformations Inside Folds)" },
        { value: "prescale", label: "Contaminated: Global Pre-split Scaling" },
        { value: "temporal", label: "Contaminated: Random Split on Time-Series" },
        { value: "target_encode", label: "Contaminated: Global Target Encoding" }
      ],
      default: "clean"
    }
  ],
  views: [
    {
      type: "audit-panel",
      title: "Data Leakage Audit",
      bindings: ["apparent", "true", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "scenario === 'clean'",
      summary: "Leakage-Free Pipeline",
      detail: "All transformations fit strictly on training splits and transform validation splits without information bleed."
    },
    {
      when: "scenario === 'prescale'",
      summary: "Global Scaling Leakage",
      detail: "Calculating mean and variance across the entire dataset leaks validation distribution statistics into training."
    }
  ],
  presets: [
    {
      id: "clean-pipeline",
      label: "Clean Pipeline",
      values: { scenario: "clean" },
      teachingPoint: "Isolating preprocessing within CV folds prevents deceptive validation score inflation."
    },
    {
      id: "leaky-prescale",
      label: "Global Pre-scale Contamination",
      values: { scenario: "prescale" },
      teachingPoint: "Global pre-scaling creates a false sense of high accuracy that collapses in production."
    }
  ],
  challenge: {
    prompt: "Select Clean Pipeline to eliminate data leakage and achieve Balanced status.",
    success: { scenario: "clean", diagnosis: "Balanced" },
    hints: [
      "Select Clean Pipeline (Transformations Inside Folds)."
    ]
  },
  quiz: [
    {
      prompt: "Why must feature scaling (StandardScaler) be fit strictly on the training fold rather than the full dataset?",
      choices: [
        "Fitting on the full dataset leaks test fold mean and standard deviation statistics into the training pipeline.",
        "Because StandardScaler crashes if given the full dataset.",
        "Because scaling only works on 50% of the data.",
        "To increase the number of outliers."
      ],
      answer: 0,
      explanation: "Computing statistics on the entire dataset contaminates training with future test information, artificially inflating validation metrics."
    },
    {
      prompt: "Why should temporal (time-series) datasets NEVER be split using random shuffling?",
      choices: [
        "Random shuffling allows future time steps to train models predicting past events, causing massive lookahead leakage.",
        "Because time-series data cannot be converted to floats.",
        "Because time-series models only work with 1 row.",
        "Because shuffling deletes timestamps."
      ],
      answer: 0,
      explanation: "Time-series validation must use forward-chaining splits (e.g. TimeSeriesSplit) where past data predicts future periods."
    }
  ],
  accessibility: {
    canvasSummary: "Data leakage audit dashboard showing apparent validation vs true production scores.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

