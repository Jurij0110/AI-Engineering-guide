export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/regression-evaluation",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Regression Evaluation",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/03-Regression_Evaluation.txt",
  sourceFormat: "txt",
  engine: "MetricWorkbench",
  learningObjectives: [
    "Calculate continuous regression error metrics: MAE, MSE, RMSE, and R² (Coefficient of Determination).",
    "Understand how RMSE penalizes large outlier errors more heavily than MAE."
  ],
  prerequisites: [
    "Linear regression theory",
    "Variance and residual sum of squares"
  ],
  scenario: {
    description: "Explore regression evaluation metrics. Adjust prediction error and observation noise to observe the relationship between MAE, MSE, RMSE, and R².",
    seed: 3131
  },
  controls: [
    {
      id: "noise",
      label: "Residual Variance / Noise",
      type: "range",
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: 0.15
    },
    {
      id: "threshold",
      label: "Prediction Bias Offset",
      type: "range",
      min: 0.2,
      max: 0.8,
      step: 0.05,
      default: 0.5
    }
  ],
  views: [
    {
      type: "metric-cards",
      title: "Regression Metrics",
      bindings: ["primary", "secondary", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "noise <= 0.2 && threshold === 0.5",
      summary: "High Coefficient of Determination (R²)",
      detail: "Low residual error relative to total target variance yields R² >= 90%, explaining the majority of target variance."
    }
  ],
  presets: [
    {
      id: "good-fit",
      label: "High Quality Fit (R² >= 90%)",
      values: { noise: 0.15, threshold: 0.5 },
      teachingPoint: "Low unbiased residuals maximize R² and minimize RMSE."
    }
  ],
  challenge: {
    prompt: "Set Residual Variance <= 0.20 with Offset 0.5 to achieve R² >= 85% and Balanced status.",
    success: { threshold: 0.5, diagnosis: "Balanced" },
    hints: [
      "Keep Prediction Bias Offset at 0.5.",
      "Keep Residual Variance <= 0.20."
    ]
  },
  quiz: [
    {
      prompt: "What does an R² (Coefficient of Determination) score of 0.85 mean?",
      choices: [
        "85% of the total variance in the target variable is explained by the features in the regression model.",
        "85% of the predictions are exact integers.",
        "The model is 85% faster than baseline.",
        "The mean squared error is exactly 0.85."
      ],
      answer: 0,
      explanation: "R² = 1 - SS_res / SS_tot, measuring the proportion of target variance explained by model predictions."
    },
    {
      prompt: "Why does RMSE (Root Mean Squared Error) penalize large outlier errors more severely than MAE (Mean Absolute Error)?",
      choices: [
        "Because squaring errors in MSE before taking the root magnifies large errors exponentially compared to simple linear absolute differences.",
        "Because RMSE converts errors into percentages.",
        "Because MAE ignores all negative errors.",
        "Because RMSE only computes on positive numbers."
      ],
      answer: 0,
      explanation: "Squaring terms in (y_pred - y)^2 gives disproportionately heavy weight to large deviations."
    }
  ],
  accessibility: {
    canvasSummary: "Regression evaluation cards displaying R² percentage and RMSE error.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

