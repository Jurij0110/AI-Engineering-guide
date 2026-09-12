export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/regression",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Regression",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/1-Regression.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Understand regression as a supervised learning approach that models continuous relationships between explanatory features and dependent targets.",
    "Distinguish between simple linear regression and non-linear regression models while evaluating error metrics."
  ],
  prerequisites: [
    "Supervised learning concepts",
    "Continuous vs categorical variables"
  ],
  scenario: {
    description: "Explore the core concepts of regression modeling. Fit continuous relationships across varying sample sizes and noise levels, observing how model capacity and data variance impact residual errors.",
    seed: 42
  },
  controls: [
    {
      id: "pattern",
      label: "Data Trend",
      type: "select",
      options: [
        { value: "linear", label: "Linear Trend (y = 0.8x - 0.2)" },
        { value: "quadratic", label: "Nonlinear Curved Trend" },
        { value: "exponential", label: "Exponential Growth Trend" }
      ],
      default: "linear"
    },
    {
      id: "degree",
      label: "Model Order (Degree)",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 1
    },
    {
      id: "noise",
      label: "Observation Noise",
      type: "range",
      min: 0,
      max: 0.8,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Sample Count",
      type: "range",
      min: 15,
      max: 60,
      step: 5,
      default: 30
    },
    {
      id: "seed",
      label: "Random Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 42
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Regression Fit and Residuals",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Regression Metrics",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1 && pattern === 'linear'",
      summary: "Appropriate Linear Model",
      detail: "A simple 1st-degree linear model captures the linear trend effectively with minimal variance error."
    },
    {
      when: "degree === 1 && pattern !== 'linear'",
      summary: "Underfitting Nonlinear Trend",
      detail: "A 1st-degree linear model cannot capture the curvature of nonlinear trends, causing high systematic bias."
    },
    {
      when: "degree > 3 && noise > 0.4",
      summary: "High Variance / Overfitting Risk",
      detail: "Higher polynomial degrees attempt to chase noisy fluctuations in the data rather than the underlying pattern."
    }
  ],
  presets: [
    {
      id: "linear-baseline",
      label: "Linear Baseline",
      values: { pattern: "linear", degree: 1, noise: 0.15, samples: 30, seed: 42 },
      teachingPoint: "Simple linear regression fits straight-line relationships with minimal parameters."
    },
    {
      id: "underfit-curve",
      label: "Underfitting Curve",
      values: { pattern: "quadratic", degree: 1, noise: 0.1, samples: 35, seed: 42 },
      teachingPoint: "A straight line produces high residual error when the ground truth relationship is curved."
    },
    {
      id: "overfit-noise",
      label: "Overfitting Noise",
      values: { pattern: "linear", degree: 5, noise: 0.5, samples: 20, seed: 42 },
      teachingPoint: "Excess model degrees fit random noise fluctuations instead of the true underlying line."
    }
  ],
  challenge: {
    prompt: "Configure a 1st-degree linear model on the linear trend with moderate noise (<= 0.25) to achieve an R² of at least 0.85 and a Balanced diagnosis.",
    success: { pattern: "linear", degree: 1, maxNoise: 0.25, minR2: 0.85, diagnosis: "Balanced" },
    hints: [
      "Select the Linear Trend option from the Data Trend control.",
      "Keep Model Order set to 1.",
      "Ensure observation noise is at or below 0.25."
    ]
  },
  quiz: [
    {
      prompt: "What distinguishes regression from classification in supervised learning?",
      choices: [
        "Regression predicts continuous numerical values, whereas classification predicts discrete categorical labels.",
        "Regression does not require labeled training data, whereas classification does.",
        "Regression only works with single input features, whereas classification supports multiple features.",
        "Regression minimizes cross-entropy loss, whereas classification minimizes sum of squared residuals."
      ],
      answer: 0,
      explanation: "Regression models predict continuous numerical outcomes (e.g. prices, emissions), while classification models predict discrete categories."
    },
    {
      prompt: "Which of the following is a classic application of regression modeling?",
      choices: [
        "Forecasting continuous monthly sales revenue for an enterprise.",
        "Categorizing incoming customer emails as spam or not spam.",
        "Clustering unlabelled customer purchase histories into buyer personas.",
        "Compressing high-dimensional image tensors into compact latent embeddings."
      ],
      answer: 0,
      explanation: "Predicting continuous values such as sales revenue, housing prices, or machine maintenance hours is a canonical regression problem."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive regression plot showing data points, fitted regression curve, and training versus validation metric cards.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
