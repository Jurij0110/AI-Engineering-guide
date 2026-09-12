export default {
  id: "01-machine-learning-with-python/module-2-linear-and-logistic-regression/polynomial-and-nonlinear-regression",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-2-linear-and-logistic-regression",
  title: "Polynomial and Nonlinear Regression",
  sourcePath: "01-Machine_Learning_with_Python/Module-2-Linear_and_Logistic_Regression/6-Polynomial_and_Nonlinear_Regression.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Understand how polynomial feature transformations enable linear regression to fit non-linear curves.",
    "Analyze the trade-off between model capacity (polynomial degree) and generalization (underfitting vs overfitting)."
  ],
  prerequisites: [
    "Linear Regression basics",
    "Mean Squared Error (MSE)"
  ],
  scenario: {
    description: "Explore curve fitting across polynomial and non-linear patterns. Adjust polynomial degree, dataset noise, sample size, and random seed to balance bias and variance.",
    seed: 42
  },
  controls: [
    {
      id: "pattern",
      label: "Underlying Pattern",
      type: "select",
      options: [
        { value: "quadratic", label: "Quadratic (y = 0.5 + 0.8x + 0.9x²)" },
        { value: "cubic", label: "Cubic (y = -0.25 + 0.75x - 0.4x² + 0.55x³)" },
        { value: "exponential", label: "Exponential (y = e^(0.8x) - 1)" },
        { value: "logarithmic", label: "Logarithmic (y = 1.5 ln(x + 3))" },
        { value: "piecewise", label: "Piecewise Linear" }
      ],
      default: "cubic"
    },
    {
      id: "degree",
      label: "Polynomial Degree",
      type: "range",
      min: 1,
      max: 15,
      step: 1,
      default: 3
    },
    {
      id: "noise",
      label: "Noise Level",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.25
    },
    {
      id: "samples",
      label: "Sample Count",
      type: "range",
      min: 10,
      max: 80,
      step: 1,
      default: 30
    },
    {
      id: "seed",
      label: "Random Seed",
      type: "number",
      default: 42
    }
  ],
  views: [
    {
      type: "chart",
      title: "Fitted Curve & Sample Points",
      bindings: ["points", "fittedLine", "metrics"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 1",
      summary: "Underfitting",
      detail: "A straight line cannot represent curved or non-linear patterns, resulting in systematic bias."
    },
    {
      when: "degree >= 10",
      summary: "Overfitting",
      detail: "High-degree polynomials oscillate wildly to chase noisy training samples, degrading validation accuracy."
    },
    {
      when: "degree >= 2 && degree <= 5",
      summary: "Balanced Fit",
      detail: "Moderate degrees capture true pattern curvature without fitting spurious sample noise."
    }
  ],
  presets: [
    {
      id: "underfit",
      label: "Underfit",
      values: {
        pattern: "quadratic",
        degree: 1,
        noise: 0.15,
        samples: 40,
        seed: 42
      },
      teachingPoint: "Degree 1 is too simple to capture quadratic curvature, leading to high training and validation MSE."
    },
    {
      id: "balanced",
      label: "Balanced",
      values: {
        pattern: "cubic",
        degree: 3,
        noise: 0.2,
        samples: 40,
        seed: 42
      },
      teachingPoint: "Degree 3 matches the underlying cubic structure while keeping variance low."
    },
    {
      id: "overfit",
      label: "Overfit",
      values: {
        pattern: "quadratic",
        degree: 15,
        noise: 0.45,
        samples: 20,
        seed: 42
      },
      teachingPoint: "Degree 15 memorizes random noise in small datasets, exploding validation error."
    }
  ],
  challenge: {
    prompt: "Tune the regression controls to achieve a balanced fit on cubic data with validation MSE below 0.35 using degree at most 5.",
    success: {
      diagnosis: "balanced",
      maxDegree: 5,
      maxValidationMse: 0.35
    },
    hints: [
      "Select the cubic pattern and a moderate degree such as 3.",
      "Ensure noise is reasonable and samples are sufficient (e.g. 40).",
      "Check that validation MSE drops below 0.35."
    ]
  },
  quiz: [
    {
      prompt: "Why is polynomial regression considered a linear regression problem in machine learning?",
      choices: [
        "Because the relationship between input x and target y is always a straight line",
        "Because the model is linear with respect to the unknown coefficients even if features are non-linear",
        "Because it can only fit degree-1 equations",
        "Because it does not require computing mean squared error"
      ],
      answer: 1,
      explanation: "Polynomial regression is linear in its parameters (coefficients a, b, c, ...), allowing multiple linear regression techniques to solve for them."
    },
    {
      prompt: "What happens when polynomial degree is increased excessively on a noisy dataset?",
      choices: [
        "Training MSE and validation MSE both drop to zero",
        "The model underfits and fails to learn the pattern",
        "The model overfits by fitting noise, causing validation error to surge",
        "The model automatically simplifies to linear regression"
      ],
      answer: 2,
      explanation: "Excessive capacity lets the polynomial pass through random noise in training samples, leading to severe overfitting and poor generalization."
    }
  ],
  accessibility: {
    canvasSummary: "Scatter plot showing synthetic sample points and a fitted polynomial regression curve with metrics for MSE and R-squared.",
    keyboardHelp: "Use Tab to navigate through pattern selection, degree, noise, and sample sliders. Use arrow keys to adjust numeric control values and trigger real-time re-fitting."
  }
};

