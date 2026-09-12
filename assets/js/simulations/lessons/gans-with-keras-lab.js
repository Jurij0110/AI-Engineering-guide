export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/gans-with-keras-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "GANs with Keras Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/8-GANs_with_Keras_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "GANLab",
  learningObjectives: [
    "Preprocess MNIST dataset pixel intensities to [-1, 1] matching generator tanh activation outputs.",
    "Construct deep Generator (Dense, LeakyReLU, BatchNormalization, Reshape) and Discriminator networks, compiling a combined GAN model with frozen discriminator weights.",
    "Execute an alternating mini-batch adversarial training loop, evaluating generator and discriminator loss dynamics toward Nash equilibrium."
  ],
  prerequisites: [
    "Keras Sequential API with BatchNormalization and LeakyReLU",
    "Model training with train_on_batch and minimax balance"
  ],
  scenario: {
    description: "Simulate the notebook's end-to-end Keras GAN implementation. Adjust training epochs, evaluate the stabilizing effects of Batch Normalization, and monitor discriminator accuracy approaching 50% at convergence.",
    seed: 3408
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
        { value: "leaky_relu", label: "LeakyReLU (alpha=0.2) [Lab Standard]" },
        { value: "standard_relu", label: "Standard ReLU [Dying Neurons Risk]" }
      ]
    },
    {
      id: "batch_norm",
      label: "Batch Normalization",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled [Generator Stability]" },
        { value: "disabled", label: "Disabled [Risk of Mode Collapse]" }
      ]
    },
    {
      id: "balance",
      label: "Adversarial Update Balance",
      type: "select",
      default: "balanced",
      options: [
        { value: "balanced", label: "1:1 Alternating Mini-Batches (Lab)" },
        { value: "d_overpowered", label: "5:1 Discriminator Dominated" },
        { value: "g_overpowered", label: "Generator Overpowered" }
      ]
    }
  ],
  views: [
    {
      type: "gan-lab-dashboard",
      title: "Keras GAN Minimax Curves & Synthetic Output",
      bindings: ["epoch", "activation", "batch_norm", "balance"]
    },
    {
      type: "metric-cards",
      title: "Adversarial Metrics",
      bindings: ["dloss", "gloss", "accuracy", "fid", "status"]
    }
  ],
  explanationRules: [
    {
      when: "epoch === 200 && activation === 'leaky_relu' && batch_norm === 'enabled'",
      summary: "Lab Target Convergence",
      detail: "At 200 epochs, the alternating training loop reaches Nash equilibrium: D-loss stabilizes near 0.60, G-loss near 1.20, and D-accuracy hovers near 52%, producing distinct synthetic digits."
    },
    {
      when: "balance === 'd_overpowered'",
      summary: "Overpowered Discriminator",
      detail: "When the discriminator trains too frequently, D-accuracy hits ~99% and D-loss approaches zero, starving the generator of useful gradient signals."
    }
  ],
  presets: [
    {
      id: "lab-standard",
      label: "Lab Equilibrium (200 Epochs)",
      values: { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "balanced" },
      teachingPoint: "The lab's default architecture with Batch Normalization and 1:1 alternating batches reaches stable minimax convergence."
    },
    {
      id: "overpowered-d",
      label: "Overpowered Discriminator",
      values: { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "d_overpowered" },
      teachingPoint: "Training the discriminator excessively fast leads to vanishing generator gradients."
    },
    {
      id: "converged-400",
      label: "Extended Training (400 Epochs)",
      values: { epoch: 400, activation: "leaky_relu", batch_norm: "enabled", balance: "balanced" },
      teachingPoint: "At 400 epochs, synthetic digits achieve high realism with FID ~18."
    }
  ],
  challenge: {
    prompt: "Train the Keras GAN to 200 epochs with LeakyReLU, Batch Normalization enabled, and balanced updates to achieve optimal Nash equilibrium.",
    success: { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "balanced" },
    hints: [
      "Set Training Epoch to 200.",
      "Select LeakyReLU (alpha=0.2).",
      "Ensure Batch Normalization is Enabled.",
      "Keep Adversarial Update Balance set to 1:1 Alternating Mini-Batches."
    ]
  },
  quiz: [
    {
      prompt: "In Step 1 of the GAN notebook, why are pixel values normalized using x_train.astype('float32') / 127.5 - 1.?",
      choices: [
        "To scale pixel intensities to the range [-1, 1], matching the generator's tanh activation output range.",
        "To invert the color palette from dark mode to light mode.",
        "To convert grayscale images into 3-channel RGB images.",
        "To make all pixel values strictly positive integers."
      ],
      answer: 0,
      explanation: "Because the generator's final layer uses tanh activation with an output range of [-1, 1], the real training data must be scaled to [-1, 1] so both distributions match."
    },
    {
      prompt: "Why are BatchNormalization layers included after the Dense and LeakyReLU layers in the generator?",
      choices: [
        "To stabilize deep representations, prevent internal covariate shift, and mitigate mode collapse during adversarial training.",
        "To reduce image resolution to 14x14.",
        "To automatically save model checkpoints to Google Drive.",
        "BatchNormalization is required for Python 3 compatibility."
      ],
      answer: 0,
      explanation: "Batch normalization normalizes layer activations to have zero mean and unit variance across mini-batches, which dramatically stabilizes deep generator optimization."
    }
  ],
  accessibility: {
    canvasSummary: "SVG chart of discriminator and generator loss progression across 400 epochs alongside preview grids of real and generated handwritten digits.",
    keyboardHelp: "Use Tab to focus controls and Arrow keys to adjust the epoch slider and select options from dropdown menus."
  }
};
