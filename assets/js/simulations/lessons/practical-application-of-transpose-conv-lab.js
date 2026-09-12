export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/practical-application-of-transpose-conv-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Practical Application of Transpose Conv Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/8-Practical_Application_of_Transpose Conv_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "TransposeConvLab",
  learningObjectives: [
    "Construct autoencoder and decoder reconstruction models using Keras Conv2DTranspose layers.",
    "Evaluate reconstruction fidelity and resolve checkerboard degradation by selecting kernel dimensions harmonious with upsampling strides."
  ],
  prerequisites: [
    "Transposed convolution upsampling formulas",
    "Autoencoder architecture: encoder compression and decoder expansion"
  ],
  scenario: {
    description: "Lab notebook checkpoint: Assemble an image reconstruction decoder pipeline. Benchmark kernel sizes (2, 3, 4) and upsampling strategies to achieve artifact-free reconstruction.",
    seed: 3208
  },
  controls: [
    {
      id: "method",
      label: "Decoder Upsampling Layer",
      type: "select",
      options: [
        { value: "conv2d_transpose", label: "Conv2DTranspose" },
        { value: "upsample_conv", label: "UpSampling2D (Bilinear) + Conv2D" }
      ],
      default: "conv2d_transpose"
    },
    {
      id: "inputDim",
      label: "Latent Spatial Dimension",
      type: "select",
      options: [
        { value: "4", label: "4x4 Latent Tensor" },
        { value: "8", label: "8x8 Latent Tensor" }
      ],
      default: "4"
    },
    {
      id: "kernelSize",
      label: "Decoder Kernel Size (K)",
      type: "select",
      options: [
        { value: "2", label: "2x2 Kernel" },
        { value: "3", label: "3x3 Kernel (Artifact Vulnerable)" },
        { value: "4", label: "4x4 Kernel (Optimal Overlap)" }
      ],
      default: "4"
    },
    {
      id: "stride",
      label: "Stride Multiplier",
      type: "select",
      options: [
        { value: "2", label: "Stride 2 (2x Expansion)" }
      ],
      default: "2"
    },
    {
      id: "padding",
      label: "Padding Strategy",
      type: "select",
      options: [
        { value: "same", label: "padding='same'" }
      ],
      default: "same"
    }
  ],
  views: [
    {
      type: "decoder-grid",
      title: "Decoder Reconstructed Tensor Output",
      bindings: ["method", "kernelSize", "stride", "padding"]
    },
    {
      type: "reconstruction-metrics",
      title: "Reconstruction Fidelity & Checkerboard Status",
      bindings: ["outputDim", "hasCheckerboard", "quality"]
    }
  ],
  explanationRules: [
    {
      when: "kernelSize === '4' && stride === '2'",
      summary: "Harmonious Decoder Kernel Overlap",
      detail: "In autoencoder decoders, using 4x4 kernels with stride 2 guarantees that every reconstructed pixel receives equal contribution from the latent feature expansion."
    },
    {
      when: "method === 'upsample_conv'",
      summary: "Interpolation-Based Decoder Alternative",
      detail: "Using UpSampling2D with bilinear interpolation and standard Conv2D completely bypasses kernel division constraints."
    }
  ],
  presets: [
    {
      id: "lab-exercise-target",
      label: "Exercise 1 Solution: K=4, S=2 Clean Decoder",
      values: { method: "conv2d_transpose", inputDim: "4", kernelSize: "4", stride: "2", padding: "same" },
      teachingPoint: "Demonstrates the recommended autoencoder decoder configuration."
    },
    {
      id: "naive-k3-decoder",
      label: "Naive Decoder: K=3, S=2 (Checkerboard Distortion)",
      values: { method: "conv2d_transpose", inputDim: "4", kernelSize: "3", stride: "2", padding: "same" },
      teachingPoint: "Shows the common flaw in beginner autoencoders where 3x3 kernels produce grainy artifacts."
    }
  ],
  challenge: {
    prompt: "Configure the decoder using Conv2DTranspose with 4x4 kernel and stride 2 to generate an 8x8 output with clean reconstruction.",
    success: { method: "conv2d_transpose", inputDim: "4", kernelSize: "4", stride: "2", padding: "same" },
    hints: [
      "Select Conv2DTranspose as the method.",
      "Select 4x4 Kernel Size.",
      "Ensure Stride is set to 2."
    ]
  },
  quiz: [
    {
      prompt: "In a convolutional autoencoder, what role does Conv2DTranspose typically play?",
      choices: [
        "It serves as the decoder, reconstructing high-resolution images from compressed latent feature representations",
        "It compresses images into 1D vectors",
        "It calculates cross-entropy loss",
        "It replaces GPU memory"
      ],
      answer: 0,
      explanation: "Conv2DTranspose expands the spatial resolution of bottleneck feature maps back toward the original input dimensions."
    },
    {
      prompt: "If an autoencoder produces images with an unnatural diamond/checkerboard grid overlay, what is the most likely culprit?",
      choices: [
        "A Conv2DTranspose layer using a kernel size that is not a multiple of the stride",
        "Using Adam optimizer",
        "Too few training epochs",
        "Batch size being an even number"
      ],
      answer: 0,
      explanation: "Non-divisible kernel/stride ratios cause uneven receptive field overlap, visibly corrupting the output with high-frequency checkerboard patterns."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive autoencoder decoder lab evaluating Transposed Convolution kernel configurations, artifact risk, and reconstructed tensor fidelity.",
    keyboardHelp: "Use Tab and Arrow keys to configure decoder layer type, kernel size, and stride."
  }
};

