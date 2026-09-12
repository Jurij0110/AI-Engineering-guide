export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-3-keras-and-dl-libraries/regression-with-keras-lab",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-3-keras-and-dl-libraries",
  title: "Regression with Keras Lab",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-3-Keras_and_DL_Libraries/3-Regression_with_Keras_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "RegressionLab",
  learningObjectives: [
    "Train Keras regression models on concrete compressive strength dataset (predicting concrete strength MPa from cement, water, and age ingredients).",
    "Evaluate baseline unnormalized models versus normalized multi-layer architectures across 50 epochs."
  ],
  prerequisites: [
    "Keras Dense regression layers",
    "Feature normalization (Z-score)"
  ],
  scenario: {
    description: "Follow the Regression with Keras notebook lab. Train and evaluate deep regression models on concrete compressive strength data, analyzing the impact of layer depth and feature scaling on test MSE.",
    seed: 5454
  },
  controls: [
    {
      id: "degree",
      label: "Lab Model Complexity",
      type: "range",
      min: 1,
      max: 3,
      step: 1,
      default: 2
    },
    {
      id: "noise",
      label: "Sample Variance",
      type: "range",
      min: 0.05,
      max: 0.4,
      step: 0.05,
      default: 0.15
    }
  ],
  views: [
    {
      type: "fitted-line",
      title: "Lab Concrete Strength Regression",
      bindings: ["degree", "noise"]
    },
    {
      type: "metric-cards",
      title: "Lab Test Evaluation",
      bindings: ["r2", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 2",
      summary: "Lab Normalized Benchmark",
      detail: "The normalized multi-layer Keras model achieves minimal test MSE (<50 MPa²) on concrete compressive strength."
    }
  ],
  presets: [
    {
      id: "lab-normalized",
      label: "Normalized Model Benchmark",
      values: { degree: 2, noise: 0.15 },
      teachingPoint: "Normalizing predictor features speeds up gradient convergence and prevents high-magnitude features from dominating loss."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: set Lab Model Complexity to 2 to reach Balanced status and R² >= 85%.",
    success: { degree: 2, diagnosis: "Balanced" },
    hints: [
      "Set Lab Model Complexity to 2."
    ]
  },
  quiz: [
    {
      prompt: "In the concrete strength regression lab, why did normalizing input features (subtracting mean and dividing by standard deviation) significantly improve model performance?",
      choices: [
        "It placed all features on a common numerical scale (mean=0, std=1), preventing features with large values (e.g. Cement amount) from creating oblong ravines in the loss surface.",
        "It converted the regression task into classification.",
        "It reduced the number of training samples.",
        "It eliminated the need for backpropagation."
      ],
      answer: 0,
      explanation: "Feature normalization makes loss contours isotropic (spherical), accelerating Adam and gradient descent convergence."
    },
    {
      prompt: "In the lab experiment comparing 1 hidden layer versus 3 hidden layers (both normalized), what occurred when increasing depth?",
      choices: [
        "The deeper 3-layer model achieved lower mean squared error by capturing non-linear interactions between concrete curing age and water-to-cement ratios.",
        "The model crashed.",
        "MSE increased to infinity.",
        "Training time became zero."
      ],
      answer: 0,
      explanation: "Deeper representations model compositional feature interactions (e.g. water-to-cement ratio non-linear curing curves)."
    }
  ],
  accessibility: {
    canvasSummary: "Concrete compressive strength regression chart showing fitted non-linear curve and test MSE metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

