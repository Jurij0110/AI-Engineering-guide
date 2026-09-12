export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/simple-linear-regression-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Simple Linear Regression Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/3-Simple_Linear_Regression_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "RegressionLab",
  learningObjectives: [
    "Trace the end-to-end simple linear regression notebook workflow: data ingestion, feature selection, train/test split, model fitting, and evaluation.",
    "Evaluate model generalization using train vs test Mean Squared Error (MSE) and R-squared (R²)."
  ],
  prerequisites: [
    "Simple linear regression formula",
    "Train/test split concepts"
  ],
  scenario: {
    description: "Interactive lab trace following FuelConsumptionCo2.csv. Select engine size to predict CO2 emissions, execute train/test partition splits, fit scikit-learn LinearRegression, and evaluate out-of-sample metrics.",
    seed: 202
  },
  controls: [
    {
      id: "pattern",
      label: "Dataset Feature",
      type: "select",
      options: [
        { value: "linear", label: "ENGINESIZE vs CO2EMISSIONS" },
        { value: "quadratic", label: "FUELCONSUMPTION_CITY vs CO2" }
      ],
      default: "linear"
    },
    {
      id: "degree",
      label: "Regression Degree",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 1
    },
    {
      id: "noise",
      label: "Test Set Variance",
      type: "range",
      min: 0.1,
      max: 0.5,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Notebook Train/Test Records",
      type: "range",
      min: 20,
      max: 80,
      step: 10,
      default: 40
    },
    {
      id: "seed",
      label: "Split Random State",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 202
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Notebook Train vs Test Split & Fit",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Out-of-Sample Test Evaluation",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1 && pattern === 'linear'",
      summary: "Optimal Out-of-Sample Fit",
      detail: "The 80/20 train/test split confirms strong out-of-sample generalization with test MSE matching training error closely."
    },
    {
      when: "degree > 2",
      summary: "Overfitting Lab Baseline",
      detail: "Adding unnecessary polynomial degrees creates gap between train and test MSE, reducing true out-of-sample performance."
    }
  ],
  presets: [
    {
      id: "lab-standard",
      label: "Lab Standard (80/20 Split)",
      values: { pattern: "linear", degree: 1, noise: 0.2, samples: 40, seed: 202 },
      teachingPoint: "Standard scikit-learn LinearRegression fit on vehicle emission data yields ~0.85+ R²."
    },
    {
      id: "lab-overfit",
      label: "High Degree Overfit",
      values: { pattern: "linear", degree: 4, noise: 0.35, samples: 25, seed: 202 },
      teachingPoint: "Overfitting on small sample partitions harms test-set evaluation."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: achieve a test R² >= 0.85 and Balanced status with degree = 1 on ENGINESIZE.",
    success: { pattern: "linear", degree: 1, diagnosis: "Balanced" },
    hints: [
      "Select ENGINESIZE vs CO2EMISSIONS.",
      "Keep Degree at 1.",
      "Keep sample size >= 30."
    ]
  },
  quiz: [
    {
      prompt: "Why does the lab split data into separate training (80%) and testing (20%) subsets?",
      choices: [
        "To evaluate out-of-sample generalization and ensure the model does not merely memorize training points.",
        "Because scikit-learn algorithms throw an error if all data is used for training.",
        "To reduce computational cost during model training by 20%.",
        "To remove duplicate records and outliers automatically."
      ],
      answer: 0,
      explanation: "Train/test splitting provides an accurate assessment of out-of-sample generalization on unseen records."
    },
    {
      prompt: "In scikit-learn, which method computes model predictions on the testing feature matrix X_test?",
      choices: [
        "model.predict(X_test)",
        "model.fit(X_test)",
        "model.evaluate(X_test)",
        "model.transform(X_test)"
      ],
      answer: 0,
      explanation: "model.predict(X) generates continuous predictions y_hat using the learned parameters."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive lab scatter plot depicting vehicle training/testing points and OLS regression line.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

