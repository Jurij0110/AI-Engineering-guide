export default {
  id: "01-machine-learning-with-python/module-6-final-project-and-exam/final-project-ausweather",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-6-final-project-and-exam",
  title: "FinalProject AUSWeather",
  sourcePath: "01-Machine_Learning_with_Python/Module-6-Final_Project_and_Exam/2-FinalProject_AUSWeather.ipynb",
  sourceFormat: "ipynb",
  engine: "ProjectWorkbench",
  learningObjectives: [
    "Build full binary classification and continuous regression pipelines on the Australian Weather dataset (WeatherAUS.csv).",
    "Train Linear Regression, KNN, Decision Trees, Logistic Regression, and SVMs to predict RainTomorrow and Rainfall, evaluating with MAE, MSE, R², Accuracy, Jaccard, F1-Score, and Log-Loss."
  ],
  prerequisites: [
    "Course 01 Classical ML Algorithms",
    "Comprehensive evaluation metrics"
  ],
  scenario: {
    description: "Follow the Course 01 capstone final exam project. Predict next-day precipitation (RainTomorrow) in Australia using atmospheric features (MinTemp, MaxTemp, Rainfall, Evaporation, Sunshine, WindSpeed, Humidity, Pressure).",
    seed: 4040
  },
  controls: [
    {
      id: "model",
      label: "Capstone Estimator",
      type: "select",
      options: [
        { value: "rf", label: "Random Forest Ensemble (Top Performance)" },
        { value: "logistic", label: "Logistic Regression (Binary RainTomorrow)" },
        { value: "linear", label: "Linear Regression (Rainfall Amount)" },
        { value: "knn", label: "K-Nearest Neighbors Classifier" }
      ],
      default: "rf"
    }
  ],
  views: [
    {
      type: "project-leaderboard",
      title: "Final Project Model Leaderboard",
      bindings: ["accuracy", "f1", "roc", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "model === 'rf'",
      summary: "Capstone Champion Model",
      detail: "Random Forest achieves 85.8% accuracy and 0.891 ROC-AUC on the Australian Weather benchmark."
    }
  ],
  presets: [
    {
      id: "aus-rf",
      label: "Champion Model (Random Forest)",
      values: { model: "rf" },
      teachingPoint: "Evaluating multiple distinct algorithms on standardized splits identifies the optimal production model."
    }
  ],
  challenge: {
    prompt: "Select Random Forest Ensemble to reach Accuracy >= 85% and Balanced status on the final exam capstone.",
    success: { model: "rf", diagnosis: "Balanced" },
    hints: [
      "Select Random Forest Ensemble."
    ]
  },
  quiz: [
    {
      prompt: "In the FinalProject AUSWeather notebook, what evaluation metrics were specifically required to compare classification algorithms?",
      choices: [
        "Accuracy, Jaccard Index, F1-Score, and Log-Loss (for Logistic Regression).",
        "Mean Squared Error only.",
        "Silhouette Score and Davies-Bouldin index.",
        "CPU execution clock ticks."
      ],
      answer: 0,
      explanation: "The capstone rubric explicitly benchmarks classifiers using Accuracy, Jaccard similarity, F1-score, and Log-Loss."
    },
    {
      prompt: "Why was One-Hot Encoding applied to categorical wind direction features (WindGustDir, WindDir9am, WindDir3pm)?",
      choices: [
        "Compass directions (N, NNE, NE, etc.) are nominal categories with no linear numerical ordering, requiring one-hot binary indicator columns.",
        "To make wind directions positive numbers.",
        "Because scikit-learn models cannot process weather.",
        "To reduce the number of weather stations."
      ],
      answer: 0,
      explanation: "One-hot encoding nominal categorical features prevents models from assuming artificial numerical rank orders."
    }
  ],
  accessibility: {
    canvasSummary: "Australian Weather capstone project model comparison dashboard showing Accuracy, F1, and ROC-AUC.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
