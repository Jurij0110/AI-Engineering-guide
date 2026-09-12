export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/multiple-linear-regression",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Multiple Linear Regression",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/4-Multiple_Linear_Regression.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Understand multiple linear regression as an extension modeling dependent y from multiple features: y_hat = theta_0 + theta_1*x_1 + theta_2*x_2 + ...",
    "Identify multicollinearity, overfitting risks, and trade-offs between Ordinary Least Squares matrix inversion and Gradient Descent."
  ],
  prerequisites: [
    "Simple linear regression",
    "Vector dot product and matrix notation"
  ],
  scenario: {
    description: "Explore multiple feature dimensions in regression modeling. Observe how combining multiple explanatory variables constructs a planar/hyperplanar response surface and how parameter weights minimize overall Mean Squared Error.",
    seed: 303
  },
  controls: [
    {
      id: "pattern",
      label: "Feature Space Structure",
      type: "select",
      options: [
        { value: "linear", label: "Multi-Feature Planar Response" },
        { value: "quadratic", label: "Nonlinear Interaction Surface" }
      ],
      default: "linear"
    },
    {
      id: "degree",
      label: "Model Order (Degrees)",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 1
    },
    {
      id: "noise",
      label: "Multi-Sensor Noise",
      type: "range",
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: 0.2
    },
    {
      id: "samples",
      label: "Observation Count",
      type: "range",
      min: 25,
      max: 80,
      step: 5,
      default: 40
    },
    {
      id: "seed",
      label: "Feature Seed",
      type: "number",
      min: 1,
      max: 9999,
      step: 1,
      default: 303
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Multi-Feature Regression Projection",
      bindings: ["data", "model", "residuals"]
    },
    {
      type: "metric-cards",
      title: "Multiple Regression Metrics",
      bindings: ["r2", "mse", "rmse", "mae", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1 && pattern === 'linear'",
      summary: "Planar Linear Best Fit",
      detail: "The weight vector Theta = (X^T X)^(-1) X^T y minimizes total squared error across all feature dimensions simultaneously."
    },
    {
      when: "degree > 3",
      summary: "Multivariate Overfitting",
      detail: "Including high-degree terms across multiple features multiplies parameter count rapidly, increasing risk of overfitting on small sample sizes."
    }
  ],
  presets: [
    {
      id: "multi-planar",
      label: "Planar Baseline",
      values: { pattern: "linear", degree: 1, noise: 0.15, samples: 40, seed: 303 },
      teachingPoint: "Multiple linear regression fits an optimal hyperplane through the multi-dimensional feature space."
    },
    {
      id: "multi-noise",
      label: "High Measurement Noise",
      values: { pattern: "linear", degree: 1, noise: 0.45, samples: 60, seed: 303 },
      teachingPoint: "Increasing sample count helps stabilize multi-parameter estimation under high noise."
    }
  ],
  challenge: {
    prompt: "Fit a multi-feature planar model (degree = 1) with noise <= 0.25 to obtain R² >= 0.85 and a Balanced diagnosis.",
    success: { pattern: "linear", degree: 1, diagnosis: "Balanced" },
    hints: [
      "Ensure Feature Space Structure is set to Planar.",
      "Keep Model Order at 1.",
      "Keep sample count above 30."
    ]
  },
  quiz: [
    {
      prompt: "In multiple linear regression, what geometric surface is formed when fitting 2 input features?",
      choices: [
        "A 2-dimensional flat plane in 3D space.",
        "A 1-dimensional line in 2D space.",
        "A non-linear hypersphere.",
        "A discrete decision tree boundary."
      ],
      answer: 0,
      explanation: "With 2 input features (x1, x2) and target y, the equation y = theta0 + theta1*x1 + theta2*x2 defines a 2D plane in 3D space."
    },
    {
      prompt: "Why should highly correlated (collinear) explanatory features be pruned from a multiple regression model?",
      choices: [
        "They introduce redundancy, inflate coefficient variance, and make individual feature contributions hard to interpret.",
        "They cause the target variable to become categorical.",
        "They force the model to switch from OLS to classification.",
        "They prevent scikit-learn from computing residual errors."
      ],
      answer: 0,
      explanation: "Multicollinearity inflates the variance of coefficient estimates, making weights sensitive to small data shifts and obscuring feature importance."
    }
  ],
  accessibility: {
    canvasSummary: "Multi-feature regression projection plot showing data points, fitted response surface, and model error metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

