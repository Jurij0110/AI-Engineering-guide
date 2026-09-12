export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/build-autoencoder-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Build Autoencoder in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/2-Build_Autoencoder_in_Keras.txt",
  sourceFormat: "txt",
  engine: "AutoencoderLab",
  learningObjectives: [
    "Construct multi-layer autoencoders in Keras with Dense encoder-decoder layers and binary cross-entropy reconstruction loss.",
    "Evaluate autoencoder applications: dimensionality reduction, data denoising, and extracting frozen encoder weights for downstream feature learning."
  ],
  prerequisites: [
    "Keras functional model construction",
    "MNIST image flattening and normalization"
  ],
  scenario: {
    description: "Design a deep autoencoder with an intermediate 64-unit compression layer and a 32-unit central bottleneck. Observe how noise corruption and bottleneck sizing impact reconstruction loss.",
    seed: 3402
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
      title: "Deep Autoencoder Funnel",
      bindings: ["latent_dim", "noise"]
    },
    {
      type: "metric-cards",
      title: "Model Compression & Denoising Loss",
      bindings: ["compression", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "latent_dim === 32",
      summary: "Balanced 24.5x Bottleneck",
      detail: "32 latent dimensions compress 784-pixel inputs by 24.5x. The decoder accurately reconstructs the clean digit while the encoder learns compact semantic features."
    },
    {
      when: "noise >= 0.2",
      summary: "Denoising Stress Test",
      detail: "With high noise corruption, the autoencoder must rely on the learned data manifold rather than trivial identity mapping to reconstruct the clean signal."
    }
  ],
  presets: [
    {
      id: "lesson-32d",
      label: "Lesson Baseline (32D)",
      values: { latent_dim: 32, noise: 0.1 },
      teachingPoint: "The lesson defines a 32-unit bottleneck layer (784 -> 64 -> 32 -> 64 -> 784) achieving a 24.5x compression ratio."
    },
    {
      id: "denoising-stress",
      label: "Denoising Challenge (32D, 0.25 Noise)",
      values: { latent_dim: 32, noise: 0.25 },
      teachingPoint: "Training autoencoders mapping noisy inputs to clean targets forces the network to learn robust feature filters."
    }
  ],
  challenge: {
    prompt: "Set Bottleneck Latent Dimension to 32 and Noise to 0.10 to achieve a 24.5x compression ratio and Balanced status.",
    success: { latent_dim: 32, diagnosis: "Balanced" },
    hints: [
      "Select 32 for the bottleneck latent dimension.",
      "Adjust noise level to 0.10."
    ]
  },
  quiz: [
    {
      prompt: "Why is binary cross-entropy commonly used as the reconstruction loss when training autoencoders on MNIST pixel data?",
      choices: [
        "Normalized pixel values lie in [0, 1] and can be modeled as Bernoulli probabilities per pixel, with cross-entropy summed across all 784 pixels.",
        "Binary cross-entropy can only be calculated on binary classifications with 2 classes.",
        "It forces all decoder weights to become negative numbers.",
        "Keras does not support Mean Squared Error on dense layers."
      ],
      answer: 0,
      explanation: "When pixel intensities are scaled between 0 and 1, binary cross-entropy measures the pixel-by-pixel log-loss, penalizing blurry predictions effectively."
    },
    {
      prompt: "How can a trained autoencoder be repurposed for a downstream image classification task?",
      choices: [
        "Freeze the encoder layers to use as a pre-trained feature extractor, attaching a classification head on top of the latent representation.",
        "Discard the encoder and train the decoder on random noise.",
        "Invert the weights of the input layer.",
        "Convert the autoencoder to an unsupervised clustering tree."
      ],
      answer: 0,
      explanation: "The encoder learns rich low-dimensional representations; by freezing its weights, downstream classifiers can be trained with fewer labeled examples."
    }
  ],
  accessibility: {
    canvasSummary: "SVG diagram of a symmetric autoencoder funnel compressing a 784D input to a 32D bottleneck and reconstructing the 784D output vector.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders using Arrow keys to see live metric updates."
  }
};
