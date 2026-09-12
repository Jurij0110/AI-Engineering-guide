export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/intro-to-unsupervised-learning-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Intro to Unsupervised Learning in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/1-Intro_to_Unsupervised_Learning_in_Keras.txt",
  sourceFormat: "txt",
  engine: "AutoencoderLab",
  learningObjectives: [
    "Differentiate unsupervised learning paradigms: clustering, association rules, and dimensionality reduction without target labels.",
    "Understand the Keras autoencoder architecture: encoding 784-dimensional inputs into a compact bottleneck and decoding back to reconstruct original data."
  ],
  prerequisites: [
    "Basic neural network concepts in Keras",
    "Understanding of unsupervised vs supervised learning"
  ],
  scenario: {
    description: "Explore unsupervised representation learning and feature compression with an autoencoder bottleneck. Vary latent dimensions and noise to observe how compact latent representations capture essential manifold patterns.",
    seed: 3401
  },
  controls: [
    {
      id: "latent_dim",
      label: "Bottleneck Latent Dimension (K)",
      type: "range",
      min: 8,
      max: 64,
      step: 8,
      default: 64
    },
    {
      id: "noise",
      label: "Noise Corruption Level",
      type: "range",
      min: 0.0,
      max: 0.3,
      step: 0.05,
      default: 0.05
    }
  ],
  views: [
    {
      type: "bottleneck-diagram",
      title: "Encoder-Decoder Architecture Flow",
      bindings: ["latent_dim", "noise"]
    },
    {
      type: "metric-cards",
      title: "Reconstruction & Compression Metrics",
      bindings: ["compression", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "latent_dim === 64",
      summary: "64D Intermediate Compression",
      detail: "The 64-dimensional latent layer compresses 784-dimensional MNIST inputs by 12.3x while preserving fine stroke structures with low reconstruction loss."
    },
    {
      when: "latent_dim === 8",
      summary: "High Dimensionality Reduction",
      detail: "Compressing 784 inputs down to 8 dimensions achieves a 98x compression ratio, which strips away noise but may blur subtle digit details."
    }
  ],
  presets: [
    {
      id: "textbook-64",
      label: "Textbook Spec (64D)",
      values: { latent_dim: 64, noise: 0.05 },
      teachingPoint: "The lesson's Keras model uses Dense(64, 'relu') to capture rich latent representations of 784-pixel inputs."
    },
    {
      id: "aggressive-16",
      label: "Aggressive Compression (16D)",
      values: { latent_dim: 16, noise: 0.1 },
      teachingPoint: "Compressing to 16 dimensions tests the limits of reconstruction capacity on high-dimensional data."
    }
  ],
  challenge: {
    prompt: "Configure a 64-dimensional latent bottleneck with 0.05 noise to achieve Balanced reconstruction status.",
    success: { latent_dim: 64, diagnosis: "Balanced" },
    hints: [
      "Set Bottleneck Latent Dimension (K) to 64.",
      "Keep Noise Corruption Level at 0.05."
    ]
  },
  quiz: [
    {
      prompt: "What is the primary characteristic that distinguishes unsupervised learning from supervised learning?",
      choices: [
        "Unsupervised learning finds underlying patterns and structures without target labels or predefined outcomes.",
        "Unsupervised learning requires twice as many training labels.",
        "Unsupervised models can only run on CPU hardware.",
        "Unsupervised learning cannot use neural networks."
      ],
      answer: 0,
      explanation: "Unsupervised learning discovers latent structure, clusters, or representations in unlabelled data without ground truth target variables."
    },
    {
      prompt: "In a Keras autoencoder, what role does the encoder component play?",
      choices: [
        "It compresses the high-dimensional input vector into a lower-dimensional latent bottleneck representation.",
        "It generates fake images to deceive a discriminator network.",
        "It evaluates cluster purity scores using silhouette analysis.",
        "It discards half of the dataset randomly."
      ],
      answer: 0,
      explanation: "The encoder maps the input vector (e.g. 784 pixels) to a compressed latent code vector in the bottleneck."
    }
  ],
  accessibility: {
    canvasSummary: "Bottleneck architecture SVG diagram showing 784-dimensional input feeding into an encoder, a compressed latent bottleneck, and a decoder restoring the 784-dimensional output.",
    keyboardHelp: "Use Tab to focus controls. Use Arrow keys to adjust the latent dimension and noise sliders."
  }
};
