export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/data-augmentation",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Data Augmentation",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/2-Data_Augmentation.txt",
  sourceFormat: "txt",
  engine: "ImageAugmentationLab",
  learningObjectives: [
    "Apply Keras ImageDataGenerator transformations (rotation, shifting, shearing, zooming, horizontal flipping) to expand dataset diversity.",
    "Distinguish feature-wise normalization (centering and scaling across the entire dataset) from sample-wise normalization."
  ],
  prerequisites: [
    "Image tensor representations in Keras (height, width, channels)",
    "Supervised image classification overfitting concepts"
  ],
  scenario: {
    description: "Configure an ImageDataGenerator augmentation pipeline. Maximize training batch diversity while preserving semantic validity and ensuring input normalization.",
    seed: 3202
  },
  controls: [
    {
      id: "rotation",
      label: "Rotation Range (Degrees)",
      type: "range",
      min: 0,
      max: 90,
      step: 5,
      default: 20
    },
    {
      id: "flip",
      label: "Horizontal Flip",
      type: "select",
      options: [
        { value: "yes", label: "Enabled (horizontal_flip=True)" },
        { value: "no", label: "Disabled" }
      ],
      default: "yes"
    },
    {
      id: "zoom",
      label: "Zoom Range",
      type: "range",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.2
    },
    {
      id: "shift",
      label: "Width & Height Shift",
      type: "range",
      min: 0,
      max: 0.3,
      step: 0.05,
      default: 0.15
    },
    {
      id: "normalization",
      label: "Input Normalization Mode",
      type: "select",
      options: [
        { value: "none", label: "None [0, 255]" },
        { value: "rescale", label: "Rescale 1/255 [0.0, 1.0]" },
        { value: "featurewise", label: "Feature-wise (Mean 0, Std 1)" },
        { value: "samplewise", label: "Sample-wise (Mean 0, Std 1)" }
      ],
      default: "rescale"
    }
  ],
  views: [
    {
      type: "sample-preview",
      title: "Augmented Batch Preview",
      bindings: ["rotation", "flip", "zoom", "shift"]
    },
    {
      type: "distribution-metrics",
      title: "Diversity & Tensor Statistics",
      bindings: ["diversity", "pixelMean", "pixelStd", "semanticSafe"]
    }
  ],
  explanationRules: [
    {
      when: "normalization === 'rescale'",
      summary: "Pixel Rescaling [0, 1]",
      detail: "Rescaling pixel values from [0, 255] to [0.0, 1.0] stabilizes gradient calculations and speeds up optimizer convergence."
    },
    {
      when: "rotation > 45",
      summary: "Semantic Distortion Danger",
      detail: "Exceeding 45° rotation can invert orientation-sensitive objects and confuse the classifier."
    }
  ],
  presets: [
    {
      id: "standard-augmentation",
      label: "Safe Standard Vision Augmentation",
      values: { rotation: 20, flip: "yes", zoom: 0.2, shift: 0.15, normalization: "rescale" },
      teachingPoint: "Provides high diversity with zero semantic drift."
    },
    {
      id: "excessive-distortion",
      label: "Over-Augmentation (Semantic Drift)",
      values: { rotation: 75, flip: "yes", zoom: 0.45, shift: 0.3, normalization: "none" },
      teachingPoint: "Extreme transforms distort images and leave pixels unnormalized."
    }
  ],
  challenge: {
    prompt: "Configure a safe augmentation pipeline with rotation 20°, horizontal flip enabled, zoom 0.2, shift 0.15, and rescale normalization.",
    success: { rotation: "20", flip: "yes", zoom: "0.2", shift: "0.15", normalization: "rescale" },
    hints: [
      "Set Rotation to 20.",
      "Enable Horizontal Flip.",
      "Set Zoom to 0.2 and Shift to 0.15.",
      "Select Rescale 1/255 normalization."
    ]
  },
  quiz: [
    {
      prompt: "Why is feature-wise normalization (mean 0, std 1) valuable for training convolutional neural networks?",
      choices: [
        "It prevents weight explosion, stabilizes gradient flow, and accelerates convergence",
        "It compresses 3-channel images into grayscale",
        "It removes the need for convolutional layers",
        "It automatically labels unlabelled images"
      ],
      answer: 0,
      explanation: "Normalized inputs center activations around zero, keeping backpropagated gradients in well-conditioned numerical ranges."
    },
    {
      prompt: "Which parameter in ImageDataGenerator handles the border pixels exposed when an image is shifted or rotated?",
      choices: [
        "fill_mode (e.g. 'nearest')",
        "color_mode",
        "class_mode",
        "target_size"
      ],
      answer: 0,
      explanation: "fill_mode dictates how newly created pixels beyond image boundaries are populated (e.g. 'nearest', 'reflect', 'constant')."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive ImageDataGenerator playground showing rotated, shifted, flipped, and normalized sample images with diversity and statistical metrics.",
    keyboardHelp: "Use Tab and Arrow keys to adjust rotation, flip, zoom, shift, and normalization mode."
  }
};

