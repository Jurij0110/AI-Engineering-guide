export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/cnn-with-keras",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "CNN with Keras",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/3-CNN_with_Keras.ipynb",
  sourceFormat: "ipynb",
  engine: "CNNWorkbench",
  learningObjectives: [
    "Construct a complete Keras CNN: Conv2D(32, (3,3), activation='relu') -> MaxPooling2D((2,2)) -> Flatten() -> Dense(100, activation='relu') -> Dense(10, activation='softmax').",
    "Train and evaluate convolutional image classifiers on MNIST / CIFAR-10 computer vision benchmarks."
  ],
  prerequisites: [
    "CNN architecture fundamentals",
    "Keras Sequential API"
  ],
  scenario: {
    description: "Follow the CNN with Keras notebook lab. Assemble convolutional layers, pooling filters, and dense classifiers to inspect tensor dimensionality transformations across layers.",
    seed: 5959
  },
  controls: [
    {
      id: "filter",
      label: "Lab Kernel Filter",
      type: "select",
      options: [
        { value: "outline", label: "Lab Edge Filter (Outline)" },
        { value: "sobel_v", label: "Vertical Filter" },
        { value: "sobel_h", label: "Horizontal Filter" }
      ],
      default: "outline"
    },
    {
      id: "stride",
      label: "Kernel Stride",
      type: "range",
      min: 1,
      max: 2,
      step: 1,
      default: 1
    },
    {
      id: "pool",
      label: "Pool Window",
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
      title: "Lab CNN Tensor Flow",
      bindings: ["filter", "stride", "pool"]
    },
    {
      type: "metric-cards",
      title: "Lab Dimensions",
      bindings: ["conv-dim", "pool-dim", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "filter === 'outline'",
      summary: "Lab Benchmark Architecture",
      detail: "Stacking Conv2D and MaxPooling2D layers extracts high-level spatial abstractions prior to flattening."
    }
  ],
  presets: [
    {
      id: "lab-cnn",
      label: "Lab CNN Benchmark",
      values: { filter: "outline", stride: 1, pool: 2 },
      teachingPoint: "Flatten() transforms multi-channel 2D feature maps into a 1D vector suitable for Dense classification."
    }
  ],
  challenge: {
    prompt: "Replicate the lab model: select Outline kernel with Stride 1 and Pool 2 to achieve Balanced status.",
    success: { filter: "outline", stride: 1, pool: 2, diagnosis: "Balanced" },
    hints: [
      "Select Lab Edge Filter (Outline).",
      "Set Kernel Stride to 1.",
      "Set Pool Window to 2."
    ]
  },
  quiz: [
    {
      prompt: "In Keras, why is Flatten() required between MaxPooling2D and Dense layers?",
      choices: [
        "Dense layers require 1D vector inputs (batch_size, features), so Flatten unrolls the multi-dimensional (batch_size, H, W, channels) tensor into a flat array.",
        "To delete model weights.",
        "To convert floating point numbers to integers.",
        "To speed up hard drive access."
      ],
      answer: 0,
      explanation: "Flatten reshapes the 3D spatial feature cube into a 1D vector without changing parameter values."
    },
    {
      prompt: "Why do CNNs require far fewer parameters than a fully connected Dense network on 224x224 RGB images?",
      choices: [
        "CNNs share weights (the same small 3x3 kernel slides across the entire image) and utilize local receptive fields instead of connecting every pixel to every neuron.",
        "Because CNNs only process 1 pixel per image.",
        "Because CNNs don't use weights.",
        "Because CNNs run on CPUs only."
      ],
      answer: 0,
      explanation: "Weight sharing and local connectivity dramatically reduce parameter counts while preserving spatial translation invariance."
    }
  ],
  accessibility: {
    canvasSummary: "Keras CNN tensor flow diagram showing convolution, pooling, and dimensionality metrics.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

