export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/gans",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "GANs",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/6-GANs.txt",
  sourceFormat: "txt",
  engine: "GANLab",
  learningObjectives: [
    "Explain the adversarial minimax game: Generator creates synthetic data to fool the Discriminator, while the Discriminator evaluates real vs fake instances.",
    "Understand why LeakyReLU activation prevents dying neuron gradients and why discriminator weights are frozen when training the combined GAN model."
  ],
  prerequisites: [
    "Minimax game theory basics",
    "Keras custom training loops with train_on_batch"
  ],
  scenario: {
    description: "Explore the adversarial training loop of a Keras GAN. Adjust training epochs, latent noise dimensionality, activation type, and Batch Normalization to reach Nash equilibrium.",
    seed: 3406
  },
  controls: [
    {
      id: "epoch",
      label: "Training Epoch (0 - 400)",
      type: "range",
      min: 0,
      max: 400,
      step: 50,
      default: 200
    },
    {
      id: "activation",
      label: "Hidden Activation Function",
      type: "select",
      default: "leaky_relu",
      options: [
        { value: "leaky_relu", label: "LeakyReLU (alpha=0.01) [Stable]" },
        { value: "standard_relu", label: "Standard ReLU [Dying Gradients Risk]" }
      ]
    },
    {
      id: "batch_norm",
      label: "Batch Normalization",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled [Prevents Covariate Shift]" },
        { value: "disabled", label: "Disabled [Risk of Mode Collapse]" }
      ]
    },
    {
      id: "latent_dim",
      label: "Generator Latent Noise Dimension (z)",
      type: "range",
      min: 50,
      max: 128,
      step: 25,
      default: 100
    }
  ],
  views: [
    {
      type: "gan-loss-samples",
      title: "Minimax Loss Dynamics & Generator Samples",
      bindings: ["epoch", "activation", "batch_norm", "latent_dim"]
    },
    {
      type: "metric-cards",
      title: "Adversarial Metrics",
      bindings: ["dloss", "gloss", "accuracy", "fid", "status"]
    }
  ],
  explanationRules: [
    {
      when: "activation === 'standard_relu'",
      summary: "Dying ReLU Failure Mode",
      detail: "Standard ReLU zeroes out all negative activations, causing permanent gradient starvation in the generator and letting the discriminator completely dominate."
    },
    {
      when: "batch_norm === 'disabled' && epoch >= 200",
      summary: "Mode Collapse Danger",
      detail: "Without Batch Normalization to stabilize internal layer representations, the generator collapses into producing a single repetitive blurry digit."
    },
    {
      when: "epoch >= 200 && activation === 'leaky_relu'",
      summary: "Nash Equilibrium Convergence",
      detail: "With LeakyReLU and BatchNorm, the generator produces sharp digits that fool the discriminator ~50% of the time, achieving balanced minimax equilibrium."
    }
  ],
  presets: [
    {
      id: "lesson-standard",
      label: "Lesson Spec (200 Epochs, LeakyReLU)",
      values: { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", latent_dim: 100 },
      teachingPoint: "The lesson uses generator_input_dim=100 with LeakyReLU(0.01) and tanh output for stable adversarial training."
    },
    {
      id: "dying-relu",
      label: "Dying ReLU Failure Test",
      values: { epoch: 200, activation: "standard_relu", batch_norm: "enabled", latent_dim: 100 },
      teachingPoint: "Standard ReLU cuts off negative gradients, halting generator learning."
    },
    {
      id: "fully-trained",
      label: "Fully Converged (400 Epochs)",
      values: { epoch: 400, activation: "leaky_relu", batch_norm: "enabled", latent_dim: 100 },
      teachingPoint: "At 400 epochs, the generator produces realistic, diverse digits with FID < 20."
    }
  ],
  challenge: {
    prompt: "Configure the GAN with LeakyReLU activation, Batch Normalization enabled, and 100 latent dimensions at epoch 200 to reach Nash equilibrium.",
    success: { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", latent_dim: 100 },
    hints: [
      "Set Training Epoch to 200.",
      "Select LeakyReLU (alpha=0.01).",
      "Ensure Batch Normalization is Enabled.",
      "Keep Latent Noise Dimension at 100."
    ]
  },
  quiz: [
    {
      prompt: "Why is LeakyReLU specifically preferred over standard ReLU in GAN architectures?",
      choices: [
        "LeakyReLU provides a non-zero slope (alpha) for negative inputs, preventing neurons from dying and maintaining gradient flow back to the generator.",
        "LeakyReLU makes the model train on CPUs without a graphics card.",
        "LeakyReLU converts negative pixel values into color channels.",
        "LeakyReLU removes the need for a discriminator network."
      ],
      answer: 0,
      explanation: "Standard ReLU produces a zero gradient whenever x < 0. In GANs, this easily kills generator neurons permanently; LeakyReLU maintains a small gradient to ensure continuous learning."
    },
    {
      prompt: "Why is discriminator.trainable set to False when compiling the combined GAN model?",
      choices: [
        "So that backpropagation updates only generator weights during generator training batches, keeping discriminator weights frozen.",
        "Because the discriminator is permanently deleted after 1 epoch.",
        "To save memory on the hard drive.",
        "Because Keras does not allow both networks to exist simultaneously."
      ],
      answer: 0,
      explanation: "When training the generator to deceive the discriminator, only the generator's parameters must be adjusted. The discriminator is trained separately on its own batches."
    }
  ],
  accessibility: {
    canvasSummary: "SVG chart displaying generator and discriminator minimax loss curves alongside real vs synthetic generated digit samples.",
    keyboardHelp: "Use Tab to focus controls. Use Arrow keys to modify epoch and latent dimensions; select dropdowns for activation and batch normalization."
  }
};
