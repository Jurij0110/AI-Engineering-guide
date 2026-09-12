export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-3-keras-and-dl-libraries/classification-with-keras",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-3-keras-and-dl-libraries",
  title: "Classification with Keras",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-3-Keras_and_DL_Libraries/4-Classification_with_Keras.txt",
  sourceFormat: "txt",
  engine: "NeuralNetworkLab",
  learningObjectives: [
    "Configure Keras classification architectures: one-hot encoding categorical targets with to_categorical(), softmax final activation, and categorical_crossentropy loss.",
    "Compile Keras models with classification performance metrics: model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])."
  ],
  prerequisites: [
    "Artificial Neural Networks theory",
    "Softmax and Cross-Entropy loss"
  ],
  scenario: {
    description: "Explore Keras classification workflows. Configure network depth, width, and activation functions for multi-class classification and observe parameter scaling and loss outputs.",
    seed: 5555
  },
  controls: [
    {
      id: "depth",
      label: "Keras Dense Layers",
      type: "range",
      min: 1,
      max: 3,
      step: 1,
      default: 2
    },
    {
      id: "hidden_width",
      label: "Dense Units Per Layer",
      type: "range",
      min: 4,
      max: 16,
      step: 2,
      default: 8
    },
    {
      id: "activation",
      label: "Hidden Layer Activation",
      type: "select",
      options: [
        { value: "relu", label: "ReLU (Standard for Dense)" },
        { value: "tanh", label: "Tanh" },
        { value: "sigmoid", label: "Sigmoid" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "network-graph",
      title: "Keras Sequential Classification Model",
      bindings: ["depth", "hidden_width", "activation"]
    },
    {
      type: "metric-cards",
      title: "Compilation & Loss Metrics",
      bindings: ["params", "confidence", "loss", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "activation === 'relu'",
      summary: "Standard Keras Dense Architecture",
      detail: "Dense layers with ReLU activations followed by Softmax and Categorical Cross-Entropy is the standard configuration for multi-class classification."
    }
  ],
  presets: [
    {
      id: "keras-classifier",
      label: "Standard 2-Layer Dense (2x8)",
      values: { depth: 2, hidden_width: 8, activation: "relu" },
      teachingPoint: "Dense(8, activation='relu') layers extract hierarchical features before final Softmax classification."
    }
  ],
  challenge: {
    prompt: "Configure a 2-layer Dense network with 8 units and ReLU activation to achieve Balanced status and Loss <= 0.35.",
    success: { depth: 2, hidden_width: 8, activation: "relu", diagnosis: "Balanced" },
    hints: [
      "Set Keras Dense Layers to 2.",
      "Set Dense Units Per Layer to 8.",
      "Select ReLU activation."
    ]
  },
  quiz: [
    {
      prompt: "Why must target labels be transformed using keras.utils.to_categorical() when training with categorical_crossentropy loss?",
      choices: [
        "To convert integer class indices (e.g. 2) into one-hot binary probability vectors (e.g. [0, 0, 1]) matching the Softmax output layer dimensions.",
        "To compress the file size on disk.",
        "To convert floating point features into integers.",
        "To prevent divide-by-zero in Adam optimizer."
      ],
      answer: 0,
      explanation: "Categorical cross-entropy computes loss between true one-hot probability distributions and predicted softmax probabilities."
    },
    {
      prompt: "In Keras model.compile(), what loss function is used for binary classification versus multi-class classification?",
      choices: [
        "binary_crossentropy for 2 classes (Sigmoid output); categorical_crossentropy for >2 classes (Softmax output).",
        "Mean Squared Error (MSE) for both.",
        "Hinge loss for multiclass and Log-loss for regression.",
        "Keras automatically ignores the loss function."
      ],
      answer: 0,
      explanation: "Binary classification uses binary_crossentropy with 1 sigmoid neuron; multiclass uses categorical_crossentropy with N softmax neurons."
    }
  ],
  accessibility: {
    canvasSummary: "Keras classification network diagram showing Dense layers connecting to Softmax output neurons.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

