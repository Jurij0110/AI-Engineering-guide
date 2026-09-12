export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-3-keras-and-dl-libraries/regression-with-keras",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-3-keras-and-dl-libraries",
  title: "Regression with Keras",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-3-Keras_and_DL_Libraries/2-Regression_with_Keras.txt",
  sourceFormat: "txt",
  engine: "RegressionLab",
  learningObjectives: [
    "Build a continuous regression neural network in Keras: Sequential model, Dense hidden layers (ReLU), single linear output unit (Dense(1)), and MSE loss.",
    "Compile with the Adam optimizer: model.compile(optimizer='adam', loss='mean_squared_error')."
  ],
  prerequisites: [
    "Linear regression concepts",
    "Keras Sequential API"
  ],
  scenario: {
    description: "Explore continuous target prediction using Keras neural regression. Adjust network complexity and learning hyperparameters to fit continuous features and minimize MSE.",
    seed: 5353
  },
  controls: [
    {
      id: "degree",
      label: "Approximator Degree / Depth",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 2
    },
    {
      id: "noise",
      label: "Target Noise Level",
      type: "range",
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.15
    }
  ],
  views: [
    {
      type: "fitted-line",
      title: "Keras Continuous Regression Fit",
      bindings: ["degree", "noise"]
    },
    {
      type: "metric-cards",
      title: "Regression Metrics",
      bindings: ["r2", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "degree === 2",
      summary: "Non-Linear Keras Fit",
      detail: "Dense hidden layers with ReLU activations easily approximate non-linear continuous target relationships."
    }
  ],
  presets: [
    {
      id: "keras-reg-fit",
      label: "Optimal Fit (Degree=2)",
      values: { degree: 2, noise: 0.15 },
      teachingPoint: "Dense(1) output layer with no activation outputs continuous unconstrained real values."
    }
  ],
  challenge: {
    prompt: "Set Approximator Degree to 2 with Noise 0.15 to achieve Balanced status and R² >= 85%.",
    success: { degree: 2, diagnosis: "Balanced" },
    hints: [
      "Set Approximator Degree / Depth to 2."
    ]
  },
  quiz: [
    {
      prompt: "Why should the final output layer of a Keras continuous regression model (Dense(1)) NOT have a Sigmoid or Softmax activation function?",
      choices: [
        "Sigmoid/Softmax restrict outputs to [0, 1], whereas continuous regression targets can take any unconstrained real number in (-inf, +inf).",
        "Because Dense(1) crashes with activations.",
        "Because regression cannot predict numbers.",
        "Because MSE requires all numbers to be integers."
      ],
      answer: 0,
      explanation: "Regression output units require linear activation (f(z) = z) to predict continuous targets across all scales without bounded saturation."
    },
    {
      prompt: "In Keras, what does the Adam optimizer offer over standard basic stochastic gradient descent (SGD)?",
      choices: [
        "Adam computes adaptive individual learning rates for each parameter by maintaining running exponential averages of gradients and squared gradients (momentum + RMSProp).",
        "Adam uses genetic mutation.",
        "Adam avoids computing backprop derivatives.",
        "Adam only trains on the first batch."
      ],
      answer: 0,
      explanation: "Adam combines momentum and adaptive second-moment scaling, allowing fast, self-tuning convergence across heterogeneous parameter scales."
    }
  ],
  accessibility: {
    canvasSummary: "Continuous regression chart showing Keras fitted curve through scatter points.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

