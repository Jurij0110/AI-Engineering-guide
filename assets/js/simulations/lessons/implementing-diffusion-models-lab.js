export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/implementing-diffusion-models-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Implementing Diffusion Models Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/5-Implementing_Diffusion_Models_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "DiffusionLab",
  learningObjectives: [
    "Preprocess 28x28 MNIST images with dimension expansion (28, 28, 1) and Gaussian noise addition clipped to [0, 1].",
    "Construct a Keras convolutional encoder with Conv2DTranspose decoder layers, compile with binary cross-entropy, and evaluate fine-tuning with frozen base layers."
  ],
  prerequisites: [
    "Keras functional API with Conv2D and Conv2DTranspose",
    "EarlyStopping callbacks and model fine-tuning"
  ],
  scenario: {
    description: "Simulate the notebook's end-to-end diffusion lab. Configure noise factor, choose between Conv2DTranspose and dense bottleneck backbones, and evaluate fine-tuning reconstruction MSE.",
    seed: 3405
  },
  controls: [
    {
      id: "step",
      label: "Diffusion Step (t / 50)",
      type: "range",
      min: 0,
      max: 50,
      step: 5,
      default: 20
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
      id: "backbone",
      label: "Model Architecture Backbone",
      type: "select",
      default: "conv_transpose",
      options: [
        { value: "conv_transpose", label: "Conv2D + Conv2DTranspose Decoder (Lab)" },
        { value: "dense_bottleneck", label: "Dense Flatten Bottleneck" },
        { value: "frozen_backbone", label: "Frozen Base + Fine-Tuning Top Layers" }
      ]
    },
    {
      id: "schedule",
      label: "Noise Schedule",
      type: "select",
      default: "cosine",
      options: [
        { value: "cosine", label: "Cosine Schedule" },
        { value: "linear", label: "Linear Schedule" }
      ]
    }
  ],
  views: [
    {
      type: "diffusion-pipeline",
      title: "Lab Model Denoising Output",
      bindings: ["step", "noise_factor", "backbone", "schedule"]
    },
    {
      type: "metric-cards",
      title: "Model Performance Metrics",
      bindings: ["snr", "mse", "psnr", "status"]
    }
  ],
  explanationRules: [
    {
      when: "backbone === 'conv_transpose'",
      summary: "Transpose Convolution Decoder",
      detail: "Conv2DTranspose layers learn spatial upsampling filters, reconstructing 28x28 pixel structures with significantly lower MSE than flat dense layers."
    },
    {
      when: "backbone === 'frozen_backbone'",
      summary: "Transfer & Fine-Tuning Stability",
      detail: "Freezing bottom encoder layers preserves general feature extractors while training top layers allows rapid adaptation to new noise domains."
    }
  ],
  presets: [
    {
      id: "lab-standard",
      label: "Lab Standard (ConvTranspose, sigma=0.5)",
      values: { step: 20, noise_factor: 0.5, backbone: "conv_transpose", schedule: "cosine" },
      teachingPoint: "The lab's baseline uses Conv2DTranspose upsampling with noise factor 0.5."
    },
    {
      id: "finetuned",
      label: "Fine-Tuned Frozen Backbone",
      values: { step: 10, noise_factor: 0.3, backbone: "frozen_backbone", schedule: "cosine" },
      teachingPoint: "Fine-tuning with frozen base layers achieves the lowest MSE and fastest convergence."
    },
    {
      id: "heavy-noise",
      label: "Heavy Noise Stress (sigma=0.8)",
      values: { step: 40, noise_factor: 0.8, backbone: "conv_transpose", schedule: "linear" },
      teachingPoint: "Under severe noise corruption, spatial transpose filters still recover coarse digit topology."
    }
  ],
  challenge: {
    prompt: "Select the lab's Conv2DTranspose architecture with cosine schedule and noise factor 0.5 at step 20.",
    success: { step: 20, noise_factor: 0.5, backbone: "conv_transpose", schedule: "cosine" },
    hints: [
      "Set Diffusion Step to 20.",
      "Set Noise Factor to 0.5.",
      "Select Conv2D + Conv2DTranspose Decoder.",
      "Select Cosine Schedule."
    ]
  },
  quiz: [
    {
      prompt: "In Step 1 of the lab notebook, why are image values clipped to [0, 1] using np.clip(x_noisy, 0., 1.)?",
      choices: [
        "Adding unbounded Gaussian noise can produce pixel values below 0 or above 1; clipping ensures valid image intensity ranges.",
        "Clipping converts floating point tensors into integers.",
        "Clipping rotates images by 90 degrees.",
        "It eliminates all zero-value background pixels."
      ],
      answer: 0,
      explanation: "Since normalized image intensities must strictly lie in [0, 1], clipping bounds the corrupted pixel tensor to valid display ranges."
    },
    {
      prompt: "What is the key advantage of using Conv2DTranspose over Dense layers in the decoder of an image diffusion network?",
      choices: [
        "Conv2DTranspose preserves 2D spatial locality and learns parameterized upsampling filters with fewer parameters than fully connected Dense layers.",
        "Conv2DTranspose only works on 1D audio sequences.",
        "Conv2DTranspose does not require backpropagation.",
        "Conv2DTranspose automatically labels images."
      ],
      answer: 0,
      explanation: "Transpose convolutions take advantage of 2D spatial correlations and translation equivariance, making them well-suited for image reconstruction."
    }
  ],
  accessibility: {
    canvasSummary: "Diffusion model preview showing original MNIST digit, Gaussian corrupted input, and Conv2DTranspose reconstructed output.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders and select dropdown values using Arrow keys."
  }
};
