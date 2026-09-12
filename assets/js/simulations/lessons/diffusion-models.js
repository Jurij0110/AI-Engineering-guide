export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/diffusion-models",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Diffusion Models",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/4-Diffusion_Models.txt",
  sourceFormat: "txt",
  engine: "DiffusionLab",
  learningObjectives: [
    "Understand the forward noising process that gradually destroys data structure into Gaussian noise, akin to physical diffusion.",
    "Explain the reverse denoising process where a neural network iteratively predicts and removes noise steps to synthesize coherent images."
  ],
  prerequisites: [
    "Gaussian noise distribution and variance",
    "Convolutional neural networks in Keras"
  ],
  scenario: {
    description: "Explore the multi-step diffusion pipeline. Adjust diffusion timesteps and noise schedule to observe how forward noise accumulation transforms clean digits into pure noise, and how reverse networks reconstruct coherent samples.",
    seed: 3404
  },
  controls: [
    {
      id: "step",
      label: "Diffusion Step (t / 50)",
      type: "range",
      min: 0,
      max: 50,
      step: 5,
      default: 25
    },
    {
      id: "noise_factor",
      label: "Noise Factor (sigma)",
      type: "range",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      default: 0.5
    },
    {
      id: "schedule",
      label: "Noise Schedule",
      type: "select",
      default: "linear",
      options: [
        { value: "linear", label: "Linear Schedule" },
        { value: "cosine", label: "Cosine Schedule" }
      ]
    },
    {
      id: "mode",
      label: "Diffusion Mode",
      type: "select",
      default: "reverse_denoising",
      options: [
        { value: "reverse_denoising", label: "Reverse Denoising Process" },
        { value: "forward_noising", label: "Forward Noising Process" }
      ]
    }
  ],
  views: [
    {
      type: "diffusion-pipeline",
      title: "Clean vs Noisy vs Denoised Visual Progression",
      bindings: ["step", "noise_factor", "schedule", "mode"]
    },
    {
      type: "metric-cards",
      title: "Diffusion Metrics",
      bindings: ["snr", "mse", "psnr", "status"]
    }
  ],
  explanationRules: [
    {
      when: "step === 0",
      summary: "Clean Ground Truth",
      detail: "At timestep 0, no noise is injected. The data retains 100% of its original structural information with maximum SNR."
    },
    {
      when: "step >= 45",
      summary: "Complete Diffusion Dissipation",
      detail: "After 45+ diffusion steps, the image dissipates completely into isotropic Gaussian noise, matching the thermodynamic diffusion analogy."
    },
    {
      when: "schedule === 'cosine'",
      summary: "Cosine Noise Schedule",
      detail: "The cosine schedule preserves signal information longer in early steps compared to a linear schedule, preventing sudden information loss."
    }
  ],
  presets: [
    {
      id: "mid-diffusion",
      label: "Intermediate Diffusion (t=25)",
      values: { step: 25, noise_factor: 0.5, schedule: "linear", mode: "reverse_denoising" },
      teachingPoint: "At intermediate steps, both structural coarse features and noise perturbations coexist."
    },
    {
      id: "full-noise",
      label: "Complete Dissipation (t=50)",
      values: { step: 50, noise_factor: 0.8, schedule: "cosine", mode: "forward_noising" },
      teachingPoint: "At t=50, the signal-to-noise ratio drops below -5 dB, yielding pure Gaussian noise."
    },
    {
      id: "optimal-restoration",
      label: "High-Fidelity Restoration (t=5)",
      values: { step: 5, noise_factor: 0.2, schedule: "cosine", mode: "reverse_denoising" },
      teachingPoint: "Early denoising stages produce high PSNR (> 25 dB) and crisp digit contours."
    }
  ],
  challenge: {
    prompt: "Configure reverse denoising at step 5 with cosine schedule and noise factor 0.2 to achieve high-fidelity reconstruction.",
    success: { step: 5, noise_factor: 0.2, schedule: "cosine", mode: "reverse_denoising" },
    hints: [
      "Set Diffusion Step to 5.",
      "Select Cosine Schedule.",
      "Adjust Noise Factor to 0.2.",
      "Set mode to Reverse Denoising Process."
    ]
  },
  quiz: [
    {
      prompt: "Why are diffusion models referred to as 'diffusion' models in generative deep learning?",
      choices: [
        "Because the forward process adds Gaussian noise step-by-step until data dissipates into pure noise, analogous to chemical/thermal diffusion.",
        "Because they diffuse gradients across multiple distributed GPU servers.",
        "Because they use diffuse lighting models from 3D ray tracing.",
        "Because they only run on diffuse tensor hardware."
      ],
      answer: 0,
      explanation: "Just as molecules diffuse and disperse in a solvent until equilibrium entropy is reached, data information dissipates into Gaussian noise."
    },
    {
      prompt: "How does the reverse process generate a sample from pure Gaussian noise?",
      choices: [
        "It iteratively predicts and removes small fractions of noise step-by-step from t=T down to t=0.",
        "It inverts all pixel values in a single pass.",
        "It selects a random image from the training dataset and outputs it.",
        "It uses a lookup table of pre-generated pictures."
      ],
      answer: 0,
      explanation: "Reverse diffusion solves an iterative reverse-time stochastic differential equation, transforming random noise into realistic data through progressive small denoising steps."
    }
  ],
  accessibility: {
    canvasSummary: "SVG 3-panel visualization showing clean original digit, corrupted noisy tensor at step t, and reconstructed denoised digit output.",
    keyboardHelp: "Use Tab to navigate controls. Adjust step and noise factor sliders using Arrow keys; choose schedule and mode from select dropdowns."
  }
};
