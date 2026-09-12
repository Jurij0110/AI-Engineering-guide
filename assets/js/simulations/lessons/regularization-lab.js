export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/09-regularization",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Regularization Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/09-Regularization.ipynb",
  sourceFormat: "ipynb",
  engine: "RegularizationLab",
  learningObjectives: [
    "Train Ridge, Lasso, and ElasticNet models in Python using scikit-learn on housing / medical regression data.",
    "Tune regularization hyperparameter alpha using RidgeCV and LassoCV to minimize cross-validation mean squared error."
  ],
  prerequisites: [
    "Ridge and Lasso theory",
    "scikit-learn linear_model module"
  ],
  scenario: {
    description: "Follow the regularization notebook lab. Benchmark Ordinary Least Squares against Ridge and Lasso regression, analyzing coefficient shrinkage and validation MSE on collinear features.",
    seed: 3636
  },
  controls: [
    {
      id: "type",
      label: "Regression Estimator",
      type: "select",
      options: [
        { value: "ridge", label: "Ridge (sklearn.linear_model.Ridge)" },
        { value: "lasso", label: "Lasso (sklearn.linear_model.Lasso)" }
      ],
      default: "ridge"
    },
    {
      id: "lambda",
      label: "Regularization Alpha",
      type: "range",
      min: 0.1,
      max: 5.0,
      step: 0.2,
      default: 1.0
    }
  ],
  views: [
    {
      type: "coeff-chart",
      title: "Lab Model Weight Profile",
      bindings: ["weights"]
    },
    {
      type: "metric-cards",
      title: "Lab Error Evaluation",
      bindings: ["valMse", "sparse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "lambda >= 0.8 && lambda <= 1.5",
      summary: "Lab Optimal Alpha",
      detail: "Alpha ~ 1.0 achieves minimum validation MSE by dampening multi-collinear weight variance."
    }
  ],
  presets: [
    {
      id: "lab-ridge-alpha",
      label: "Lab Optimal Ridge (Alpha=1.0)",
      values: { type: "ridge", lambda: 1.0 },
      teachingPoint: "Cross-validation tuning of alpha minimizes out-of-sample prediction error."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: set Regularization Alpha to 1.0 to achieve Validation MSE <= 0.16 and Balanced status.",
    success: { lambda: 1.0, diagnosis: "Balanced" },
    hints: [
      "Set Regularization Alpha to 1.0."
    ]
  },
  quiz: [
    {
      prompt: "In scikit-learn linear_model classes (Ridge, Lasso), what parameter name corresponds to the regularization penalty lambda?",
      choices: [
        "alpha",
        "C",
        "lambda_",
        "penalty_rate"
      ],
      answer: 0,
      explanation: "Scikit-learn uses the parameter 'alpha' to specify regularization strength in Ridge, Lasso, and ElasticNet."
    },
    {
      prompt: "What does the ElasticNet estimator in scikit-learn combine?",
      choices: [
        "A linear combination of both L1 (Lasso) and L2 (Ridge) penalties, tuned via parameter l1_ratio.",
        "Decision trees and neural networks.",
        "Unsupervised clustering with PCA.",
        "Gradient descent with genetic algorithms."
      ],
      answer: 0,
      explanation: "ElasticNet combines L1 and L2 penalties: alpha * (l1_ratio * L1 + 0.5 * (1 - l1_ratio) * L2)."
    }
  ],
  accessibility: {
    canvasSummary: "Housing feature coefficient bar chart showing regularization shrinkage.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
