export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-3-keras-and-dl-libraries/classification-with-keras-lab",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-3-keras-and-dl-libraries",
  title: "Classification with Keras Lab",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-3-Keras_and_DL_Libraries/5-Classification_with_Keras_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "NeuralNetworkLab",
  learningObjectives: [
    "Train a Keras Sequential neural network classifier on the MNIST handwritten digit or customer classification dataset.",
    "Evaluate classification test accuracy and inspect convergence across training epochs."
  ],
  prerequisites: [
    "Keras Sequential API",
    "One-hot encoding and Softmax"
  ],
  scenario: {
    description: "Follow the Classification with Keras notebook lab. Build and train a multi-layer Keras model for digit classification, monitoring training loss and prediction probabilities.",
    seed: 5656
  },
  controls: [
    {
      id: "depth",
      label: "Hidden Layer Depth",
      type: "range",
      min: 1,
      max: 3,
      step: 1,
      default: 2
    },
    {
      id: "hidden_width",
      label: "Hidden Layer Units",
      type: "range",
      min: 4,
      max: 16,
      step: 2,
      default: 8
    },
    {
      id: "activation",
      label: "Activation",
      type: "select",
      options: [
        { value: "relu", label: "ReLU" },
        { value: "sigmoid", label: "Sigmoid" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "network-graph",
      title: "Lab Model Topology",
      bindings: ["depth", "hidden_width", "activation"]
    },
    {
      type: "metric-cards",
      title: "Lab Evaluation Metrics",
      bindings: ["params", "confidence", "loss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "depth === 2 && hidden_width === 8",
      summary: "Lab 2x8 Benchmark",
      detail: "The lab 2-layer Dense(8) Sequential model achieves high digit classification accuracy with minimal compute."
    }
  ],
  presets: [
    {
      id: "lab-benchmark",
      label: "Lab Benchmark (2x8 ReLU)",
      values: { depth: 2, hidden_width: 8, activation: "relu" },
      teachingPoint: "Training a 2-layer Dense network on one-hot targets achieves rapid convergence."
    }
  ],
  challenge: {
    prompt: "Replicate the lab model: set Hidden Layer Depth to 2 and Units to 8 to achieve Balanced status.",
    success: { depth: 2, hidden_width: 8, diagnosis: "Balanced" },
    hints: [
      "Set Hidden Layer Depth to 2.",
      "Set Hidden Layer Units to 8."
    ]
  },
  quiz: [
    {
      prompt: "In Keras model.fit(X_train, y_train, epochs=10, batch_size=32), what is an 'epoch'?",
      choices: [
        "One complete forward and backward pass through the entire training dataset.",
        "The time it takes to download the dataset.",
        "The number of neurons in the first layer.",
        "The learning rate divided by 10."
      ],
      answer: 0,
      explanation: "An epoch represents one full cycle where every sample in the training set has been seen once by the optimizer."
    },
    {
      prompt: "In the Keras classification lab, what method is called to generate predicted class probabilities on test samples?",
      choices: [
        "model.predict(X_test)",
        "model.compile(X_test)",
        "model.fit(X_test)",
        "model.summary(X_test)"
      ],
      answer: 0,
      explanation: "model.predict(X_test) runs forward propagation on test inputs to output predicted class probability vectors."
    }
  ],
  accessibility: {
    canvasSummary: "Digit classification network topology diagram showing layer activations and loss metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

