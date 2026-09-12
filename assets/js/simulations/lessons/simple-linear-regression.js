export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/simple-linear-regression",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Simple Linear Regression",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/2-Simple_Linear_Regression.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Formulate simple linear regression models with one explanatory feature (x) and continuous target (y).",
    "Calculate Ordinary Least Squares (OLS) slope (b) and intercept (a) by minimizing Mean Squared Error (MSE)."
  ],
  prerequisites: [
    "Basic algebra and slope-intercept equation (y = a + bx)",
    "Mean calculation (xbar, ybar)"
  ],
  scenario: {
    description: "Model vehicle CO2 emissions as a function of engine displacement using Ordinary Least Squares (OLS). Adjust sample noise and observation size to observe how OLS minimizes the vertical residual distances.",
    seed: 101
  },
  controls: [
    {
      id: "pattern",
      label: "Engine vs Emission Profile",
      type: "select",
      options: [
        { value: "linear", label: "Engine Size vs CO2 (Direct Linear)" },
        { value: "quadratic", label: "High RPM Fuel Inefficiency (Curved)" }
      ],
      default: "linear"
    },
    {
      id: "degree",
      label: "Polynomial Degree",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 1
    },
    {
      id: "noise",
      label: "Measurement Variance",
      type: "range",
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Vehicle Test Fleet Size",
      type: "range",
      min: 20,
      max: 70,
      step: 5,
      default: 35
    },
    {
      id: "seed",
      label: "Dataset Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 101
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Engine Displacement vs CO2 Emissions",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "OLS Evaluation Metrics",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1",
      summary: "OLS Line of Best Fit",
      detail: "OLS analytically finds intercept 'a' and slope 'b' that minimize the sum of squared vertical residuals: sum((y - y_hat)²)."
    },
    {
      when: "degree > 1 && pattern === 'linear'",
      summary: "Overparameterized Linear System",
      detail: "Adding polynomial degrees to truly linear emission data introduces unnecessary variance without improving prediction accuracy."
    }
  ],
  presets: [
    {
      id: "ols-clean",
      label: "Clean OLS Fit",
      values: { pattern: "linear", degree: 1, noise: 0.1, samples: 35, seed: 101 },
      teachingPoint: "With low measurement noise, OLS recovers the true linear relationship with high R²."
    },
    {
      id: "ols-noisy",
      label: "Noisy Fleet Data",
      values: { pattern: "linear", degree: 1, noise: 0.45, samples: 50, seed: 101 },
      teachingPoint: "OLS remains an unbiased estimator in noisy data, but residual variance increases."
    }
  ],
  challenge: {
    prompt: "Fit a clean simple linear model (degree = 1) on the linear engine profile with noise <= 0.20 to achieve R² >= 0.90 and Balanced diagnosis.",
    success: { pattern: "linear", degree: 1, diagnosis: "Balanced" },
    hints: [
      "Set Pattern to Direct Linear.",
      "Keep Degree at 1 for simple linear regression.",
      "Reduce Measurement Variance to 0.20 or lower."
    ]
  },
  quiz: [
    {
      prompt: "How does Ordinary Least Squares (OLS) determine the optimal regression parameters (a, b)?",
      choices: [
        "By minimizing the average sum of squared vertical distances between predicted y_hat and actual y values.",
        "By maximizing the number of data points that touch the regression line exactly.",
        "By minimizing the horizontal distance between explanatory features.",
        "By randomly guessing parameters until gradient descent stops."
      ],
      answer: 0,
      explanation: "OLS minimizes the sum of squared vertical residual errors: sum((y - y_hat)²)."
    },
    {
      prompt: "Given sample means xbar and ybar, how is the OLS intercept 'a' calculated from slope 'b'?",
      choices: [
        "a = ybar - b * xbar",
        "a = xbar - b * ybar",
        "a = ybar / (b * xbar)",
        "a = sum(y) - sum(x)"
      ],
      answer: 0,
      explanation: "The OLS regression line always passes through the centroid (xbar, ybar), so a = ybar - b * xbar."
    }
  ],
  accessibility: {
    canvasSummary: "Scatter plot of vehicle engine displacement versus CO2 emissions with fitted OLS linear trendline.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

