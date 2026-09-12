export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/mulitple-linear-regression-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Mulitple Linear Regression Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/5-Mulitple_Linear_Regression_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "RegressionLab",
  learningObjectives: [
    "Implement multiple linear regression in Python using scikit-learn with multiple predictors (ENGINESIZE, CYLINDERS, FUELCONSUMPTION_COMB).",
    "Interpret regression coefficient arrays and evaluate variance score (R²) and residual sum of squares."
  ],
  prerequisites: [
    "Multiple linear regression theory",
    "scikit-learn LinearRegression API"
  ],
  scenario: {
    description: "Follow the FuelConsumptionCo2 notebook lab using multivariate inputs (Engine Size, Cylinders, Combined Fuel Consumption). Train OLS model, extract parameter coefficients, and evaluate test set residual variance.",
    seed: 404
  },
  controls: [
    {
      id: "pattern",
      label: "Feature Combination",
      type: "select",
      options: [
        { value: "linear", label: "ENGINESIZE + CYLINDERS + FUELCOMB (Linear OLS)" },
        { value: "quadratic", label: "Nonlinear Fuel Curve Combination" }
      ],
      default: "linear"
    },
    {
      id: "degree",
      label: "Model Order",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 1
    },
    {
      id: "noise",
      label: "Test Fleet Noise",
      type: "range",
      min: 0.1,
      max: 0.5,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Dataset Rows",
      type: "range",
      min: 25,
      max: 80,
      step: 5,
      default: 45
    },
    {
      id: "seed",
      label: "Random Split Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 404
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Multivariate Emission Model Fit",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Lab Variance Score (R²) & Residuals",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1 && pattern === 'linear'",
      summary: "Multivariate OLS Fit",
      detail: "Combining multiple features (ENGINESIZE, CYLINDERS, FUELCOMB) improves R² compared to any single feature alone."
    },
    {
      when: "degree > 2",
      summary: "Excessive Complexity",
      detail: "Adding higher polynomial powers to multiple features risks overfitting on limited vehicle test sets."
    }
  ],
  presets: [
    {
      id: "multivariate-lab",
      label: "Lab Benchmark (3 Features)",
      values: { pattern: "linear", degree: 1, noise: 0.2, samples: 45, seed: 404 },
      teachingPoint: "Multiple predictors account for combined mechanical factors influencing emission rates."
    },
    {
      id: "multivariate-noisy",
      label: "Noisy Outliers",
      values: { pattern: "linear", degree: 1, noise: 0.45, samples: 60, seed: 404 },
      teachingPoint: "Even with measurement variance, multivariate OLS maintains consistent slope orientations."
    }
  ],
  challenge: {
    prompt: "Replicate the multivariate lab performance: reach test R² >= 0.85 with degree = 1 on the linear feature combination.",
    success: { pattern: "linear", degree: 1, diagnosis: "Balanced" },
    hints: [
      "Select ENGINESIZE + CYLINDERS + FUELCOMB.",
      "Keep Model Order at 1.",
      "Ensure test noise is <= 0.25."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn, what attribute stores the learned feature weights for each input feature after calling model.fit(X, y)?",
      choices: [
        "model.coef_",
        "model.intercept_",
        "model.weights_",
        "model.params_"
      ],
      answer: 0,
      explanation: "model.coef_ stores the array of estimated coefficients (slopes) for each explanatory feature in X."
    },
    {
      prompt: "Why does adding relevant explanatory features generally improve regression R²?",
      choices: [
        "Additional relevant features explain previously unexplained residual variance in the target variable.",
        "It forces the model to ignore noisy observations.",
        "It converts linear regression into an unsupervised clustering algorithm.",
        "It automatically reduces the number of parameters to zero."
      ],
      answer: 0,
      explanation: "Relevant features capture additional variance in the dependent variable, reducing unexplained sum of squared errors."
    }
  ],
  accessibility: {
    canvasSummary: "Scatter plot and multi-feature regression surface fit with test set evaluation metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

