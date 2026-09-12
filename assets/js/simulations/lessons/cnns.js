export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/cnns",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "CNNs",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/2-CNNs.txt",
  sourceFormat: "txt",
  engine: "CNNWorkbench",
  learningObjectives: [
    "Understand Convolutional Neural Network components: 2D convolution kernels, feature map extraction, spatial pooling (MaxPooling), flattening, and dense classification layers.",
    "Calculate output feature map spatial dimensions: Output = floor((W - K + 2P)/S) + 1."
  ],
  prerequisites: [
    "2D image tensor representations (HxWxC)",
    "Dense neural networks"
  ],
  scenario: {
    description: "Explore 2D Convolution and Pooling operations. Apply horizontal, vertical, and edge detection filters to observe spatial feature extraction and dimensionality reduction.",
    seed: 5858
  },
  controls: [
    {
      id: "filter",
      label: "Convolution Kernel",
      type: "select",
      options: [
        { value: "sobel_v", label: "Vertical Sobel (Detects Vertical Edges)" },
        { value: "sobel_h", label: "Horizontal Sobel (Detects Horizontal Edges)" },
        { value: "outline", label: "Outline / Laplacian (Omnidirectional Edges)" }
      ],
      default: "sobel_v"
    },
    {
      id: "stride",
      label: "Convolution Stride",
      type: "range",
      min: 1,
      max: 2,
      step: 1,
      default: 1
    },
    {
      id: "pool",
      label: "MaxPooling Window",
      type: "range",
      min: 2,
      max: 3,
      step: 1,
      default: 2
    }
  ],
  views: [
    {
      type: "conv-pipeline",
      title: "Conv2D & MaxPooling Pipeline",
      bindings: ["filter", "stride", "pool"]
    },
    {
      type: "metric-cards",
      title: "Spatial Layer Metrics",
      bindings: ["conv-dim", "pool-dim", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "filter === 'sobel_v'",
      summary: "Vertical Edge Extraction",
      detail: "Convolution kernel convolving across the image multiplies local 3x3 receptive fields to isolate sharp vertical intensity transitions."
    }
  ],
  presets: [
    {
      id: "edge-detect",
      label: "Vertical Edge Detection",
      values: { filter: "sobel_v", stride: 1, pool: 2 },
      teachingPoint: "Conv2D layers act as learnable spatial filter banks extracting edge and texture primitives."
    }
  ],
  challenge: {
    prompt: "Select Vertical Sobel with Stride 1 and Pool 2 to extract vertical edges and achieve Balanced status.",
    success: { filter: "sobel_v", stride: 1, pool: 2, diagnosis: "Balanced" },
    hints: [
      "Select Vertical Sobel.",
      "Set Convolution Stride to 1.",
      "Set MaxPooling Window to 2."
    ]
  },
  quiz: [
    {
      prompt: "For an input image of 32x32 pixels, applying a 5x5 convolution filter with stride 1 and NO padding (valid) produces an output feature map of what size?",
      choices: [
        "28x28 pixels: (32 - 5)/1 + 1 = 28",
        "32x32 pixels",
        "27x27 pixels",
        "16x16 pixels"
      ],
      answer: 0,
      explanation: "Output spatial dimension formula: floor((W - K + 2P)/S) + 1 = (32 - 5 + 0)/1 + 1 = 28."
    },
    {
      prompt: "What is the primary function of MaxPooling2D(pool_size=(2, 2)) in a CNN?",
      choices: [
        "To reduce spatial dimensions by 50%, providing translation invariance and reducing parameter memory for downstream layers.",
        "To invert the image colors.",
        "To double the number of channels.",
        "To delete negative weights."
      ],
      answer: 0,
      explanation: "MaxPooling downsamples spatial height and width while retaining the most prominent feature activations."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive CNN pipeline diagram showing input grid, convolved feature map, and max-pooled output.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

