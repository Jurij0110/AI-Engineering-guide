export default {
  id: "01-machine-learning-with-python/module-5-evaluating-and-validating-models/08-regularization",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-5-evaluating-and-validating-models",
  title: "Regularization",
  sourcePath: "01-Machine_Learning_with_Python/Module-5-Evaluating_and_Validating_Models/08-Regularization.txt",
  sourceFormat: "txt",
  engine: "RegularizationLab",
  learningObjectives: [
    "Understand regularization: penalizing model complexity to prevent overfitting by adding L1 (Lasso) or L2 (Ridge) penalties to the loss function.",
    "Evaluate feature selection and weight sparsity: Lasso drives uninformative weights strictly to zero, while Ridge shrinks weights smoothly."
  ],
  prerequisites: [
    "Linear regression OLS",
    "Loss function minimization"
  ],
  scenario: {
    description: "Explore Ridge (L2) and Lasso (L1) regularization. Adjust penalty hyperparameter lambda to observe coefficient shrinkage and automated feature selection.",
    seed: 3535
  },
  controls: [
    {
      id: "type",
      label: "Penalty Type",
      type: "select",
      options: [
        { value: "ridge", label: "Ridge (L2: lambda * sum(theta_i^2))" },
        { value: "lasso", label: "Lasso (L1: lambda * sum(|theta_i|))" }
      ],
      default: "ridge"
    },
    {
      id: "lambda",
      label: "Regularization Strength (lambda)",
      type: "range",
      min: 0.05,
      max: 6.0,
      step: 0.25,
      default: 1.0
    }
  ],
  views: [
    {
      type: "coeff-chart",
      title: "Regularized Model Coefficients",
      bindings: ["weights"]
    },
    {
      type: "metric-cards",
      title: "Regularization Outcomes",
      bindings: ["valMse", "sparse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "type === 'lasso' && lambda >= 1.5",
      summary: "Lasso Sparsity & Feature Selection",
      detail: "L1 regularization produces sparse models by driving uninformative feature weights strictly to zero, performing automated feature selection."
    },
    {
      when: "type === 'ridge'",
      summary: "Ridge L2 Weight Shrinkage",
      detail: "L2 regularization shrinks all weights smoothly towards zero to reduce collinear variance without dropping features."
    }
  ],
  presets: [
    {
      id: "ridge-balanced",
      label: "Balanced Ridge (lambda=1.0)",
      values: { type: "ridge", lambda: 1.0 },
      teachingPoint: "Ridge suppresses collinear weight inflation while keeping all features."
    },
    {
      id: "lasso-sparse",
      label: "Sparse Lasso (lambda=2.0)",
      values: { type: "lasso", lambda: 2.0 },
      teachingPoint: "Lasso eliminates noisy features by setting their weights to zero."
    }
  ],
  challenge: {
    prompt: "Configure Lasso with lambda=2.0 to achieve Zeroed Weights >= 1 and Balanced status.",
    success: { type: "lasso", diagnosis: "Balanced" },
    hints: [
      "Select Lasso (L1) as Penalty Type.",
      "Set Regularization Strength (lambda) to 2.0."
    ]
  },
  quiz: [
    {
      prompt: "What is the key geometric difference between Lasso (L1) and Ridge (L2) regularization?",
      choices: [
        "Lasso constraint regions have sharp corners on parameter axes, forcing coefficients to exactly 0 (sparsity), whereas Ridge constraint regions are spherical.",
        "Ridge only works with 1 feature.",
        "Lasso cannot compute loss.",
        "Ridge always sets weights to zero."
      ],
      answer: 0,
      explanation: "The diamond-shaped L1 ball intersects loss contours at coordinate axes, producing sparse solutions where non-essential weights become exactly zero."
    },
    {
      prompt: "What happens when the regularization strength hyperparameter lambda becomes extremely large (lambda -> inf)?",
      choices: [
        "All model weights shrink towards zero, causing high bias and severe underfitting (predicting the mean target).",
        "The model perfectly memorizes all training data points.",
        "The model runs in zero milliseconds.",
        "The variance increases to infinity."
      ],
      answer: 0,
      explanation: "Extreme regularization over-constrains weights, forcing the model into an underfit constant predictor with high bias."
    }
  ],
  accessibility: {
    canvasSummary: "Regularization bar chart showing shrinkage of coefficient weights theta_1 to theta_6.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};
