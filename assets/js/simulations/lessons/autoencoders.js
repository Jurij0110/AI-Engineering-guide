export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/autoencoders",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "Autoencoders",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/7-Autoencoders.txt",
  sourceFormat: "txt",
  engine: "AutoencoderLab",
  learningObjectives: [
    "Understand unsupervised autoencoder architectures: Encoder compression -> Latent Bottleneck (code) -> Decoder reconstruction.",
    "Apply autoencoders to data denoising, non-linear dimensionality reduction, and anomaly detection."
  ],
  prerequisites: [
    "Unsupervised representation learning",
    "Mean Squared Error reconstruction loss"
  ],
  scenario: {
    description: "Explore Autoencoder data compression and reconstruction. Adjust bottleneck latent dimensions and noise corruption to observe non-linear feature compression and denoising fidelity.",
    seed: 6363
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
      title: "Encoder-Decoder Architecture",
      bindings: ["latent_dim", "noise"]
    },
    {
      type: "metric-cards",
      title: "Reconstruction Metrics",
      bindings: ["compression", "mse", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "latent_dim === 32",
      summary: "Balanced Latent Bottleneck",
      detail: "32 latent dimensions compress 784-pixel inputs by 24.5x while retaining essential manifold structures for accurate reconstruction."
    }
  ],
  presets: [
    {
      id: "denoising-32",
      label: "Standard Denoising (32D)",
      values: { latent_dim: 32, noise: 0.1 },
      teachingPoint: "Training autoencoders to reconstruct clean images from noisy inputs teaches the network robust semantic representations."
    }
  ],
  challenge: {
    prompt: "Set Bottleneck Latent Dimension to 32 and Noise to 0.10 to achieve Balanced status and Reconstruction MSE < 0.05.",
    success: { latent_dim: 32, diagnosis: "Balanced" },
    hints: [
      "Set Bottleneck Latent Dimension (K) to 32.",
      "Set Noise Corruption Level to 0.10."
    ]
  },
  quiz: [
    {
      prompt: "What is the training objective and target label y in an autoencoder neural network?",
      choices: [
        "The target is the input itself (y = x); the model is trained to minimize reconstruction error L(x, g(f(x))) using MSE or Binary Cross-Entropy.",
        "The target is a human-labeled category name.",
        "The target is always 0.",
        "Autoencoders do not use loss functions."
      ],
      answer: 0,
      explanation: "Autoencoders are self-supervised: they learn to reconstruct their own inputs through a low-dimensional bottleneck."
    },
    {
      prompt: "What is a 'Denoising Autoencoder' (DAE)?",
      choices: [
        "An autoencoder trained by corrupting input x with noise (x_tilde) and optimizing the decoder to reconstruct the original uncorrupted x.",
        "An audio filter that removes microphone hum.",
        "A model that deletes corrupted database entries.",
        "A lossless zip compression program."
      ],
      answer: 0,
      explanation: "Denoising autoencoders learn the underlying data manifold by projecting noise-perturbed points back onto the true surface."
    }
  ],
  accessibility: {
    canvasSummary: "Autoencoder funnel diagram showing input dimensions compressing into latent bottleneck and reconstructing at output.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

