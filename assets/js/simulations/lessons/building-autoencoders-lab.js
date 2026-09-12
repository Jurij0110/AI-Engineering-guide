export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/building-autoencoders-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Building Autoencoders Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/3-Building_Autoencoders_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "AutoencoderLab",
  learningObjectives: [
    "Load, normalize to [0, 1], and reshape MNIST data into 784-dimensional flat vectors for autoencoder training.",
    "Implement, compile, and train a symmetric 784 -> 64 -> 32 -> 64 -> 784 autoencoder in Keras to perform image reconstruction and denoising."
  ],
  prerequisites: [
    "Keras Sequential and Functional APIs",
    "Model compilation with Adam optimizer and loss evaluation"
  ],
  scenario: {
    description: "Simulate the lab workflow: preprocess MNIST digits, set up the 32D latent bottleneck, corrupt inputs with Gaussian noise, and observe denoising reconstruction fidelity.",
    seed: 3403
  },
  controls: [
    {
      id: "latent_dim",
      label: "Bottleneck Latent Dimension (K)",
      type: "range",
      min: 8,
      max: 64,
      step: 8,
      default: 32
    },
    {
      id: "noise",
      label: "Noise Corruption Level",
      type: "range",
      min: 0.0,
      max: 0.3,
      step: 0.05,
      default: 0.1
    }
  ],
  views: [
    {
      type: "bottleneck-diagram",
      title: "Lab Autoencoder Pipeline",
      bindings: ["latent_dim", "noise"]
    },
    {
      type: "metric-cards",
      title: "Lab Performance Metrics",
      bindings: ["compression", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "latent_dim === 32",
      summary: "Lab Target Architecture",
      detail: "The lab's 32-unit bottleneck achieves 24.5x compression, balancing fidelity against representation compactness."
    },
    {
      when: "latent_dim === 64",
      summary: "Higher Fidelity Bottleneck",
      detail: "Doubling latent units reduces reconstruction error to near minimum, ideal when fine digit contours must be preserved."
    }
  ],
  presets: [
    {
      id: "lab-standard",
      label: "Lab Standard (32D)",
      values: { latent_dim: 32, noise: 0.1 },
      teachingPoint: "The notebook constructs a 32-dimensional bottleneck (Dense_53: 32 units) compiled with Adam and binary cross-entropy."
    },
    {
      id: "high-fidelity",
      label: "High Fidelity (64D)",
      values: { latent_dim: 64, noise: 0.05 },
      teachingPoint: "Wider latent bottlenecks preserve sharper edges at the cost of lower compression."
    }
  ],
  challenge: {
    prompt: "Configure the lab's 32-dimensional latent bottleneck with 0.10 noise to achieve Reconstruction MSE < 0.05 and Balanced status.",
    success: { latent_dim: 32, diagnosis: "Balanced" },
    hints: [
      "Set the latent bottleneck slider to 32.",
      "Keep noise corruption at 0.10."
    ]
  },
  quiz: [
    {
      prompt: "In Step 1 of the lab notebook, why are the MNIST images reshaped using np.prod(x_train.shape[1:])?",
      choices: [
        "To flatten the 28x28 two-dimensional pixel arrays into 784-dimensional flat vectors required by the input Dense layer.",
        "To transpose the image color channels from RGB to BGR.",
        "To invert the black and white pixel values.",
        "To double the number of training samples."
      ],
      answer: 0,
      explanation: "Each 28x28 image has 784 total pixels; reshaping flattens each image into a 1D vector of shape (784,) matching the input layer."
    },
    {
      prompt: "When training a Denoising Autoencoder in Keras, how is autoencoder.fit() configured?",
      choices: [
        "fit(x_train_noisy, x_train): pass noisy images as input and clean original images as target labels.",
        "fit(x_train, x_train_noisy): pass clean images as input and noisy images as targets.",
        "fit(x_train, y_labels): pass clean images and categorical labels.",
        "fit(x_train_noisy, x_train_noisy): map noise to noise."
      ],
      answer: 0,
      explanation: "The model is provided noisy inputs and trained to output the clean ground-truth images, learning to filter out corruptions."
    }
  ],
  accessibility: {
    canvasSummary: "Funnel diagram showing the 784 -> 64 -> 32 -> 64 -> 784 Keras model architecture from the notebook.",
    keyboardHelp: "Use Tab to select sliders and Arrow keys to modify latent dimension and noise parameters."
  }
};
