export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/transfer-learning",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Transfer Learning",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/4-Transfer_Learning.txt",
  sourceFormat: "txt",
  engine: "TransferLearningLab",
  learningObjectives: [
    "Leverage pre-trained vision backbones (e.g. VGG16 with weights='imagenet' and include_top=False) to accelerate training and reduce resource consumption.",
    "Formulate safe transfer learning strategies for small custom datasets: freezing base layers vs unfreezing top layers for fine-tuning."
  ],
  prerequisites: [
    "Convolutional feature extraction fundamentals",
    "Dense classification layers and cross-entropy loss"
  ],
  scenario: {
    description: "Build a custom image classifier using a pre-trained VGG16 backbone on a limited dataset. Avoid overfitting by locking the feature extraction layers.",
    seed: 3204
  },
  controls: [
    {
      id: "backbone",
      label: "Pre-trained Backbone",
      type: "select",
      options: [
        { value: "vgg16", label: "VGG-16 (14.7M Base Params)" },
        { value: "resnet50", label: "ResNet-50 (23.6M Base Params)" }
      ],
      default: "vgg16"
    },
    {
      id: "strategy",
      label: "Backbone Layer Freezing",
      type: "select",
      options: [
        { value: "feature_extractor", label: "Freeze All Base Layers (layer.trainable = False)" },
        { value: "fine_tuning", label: "Fine-Tune Top-4 Layers (base_model.layers[-4:])" },
        { value: "scratch", label: "Train All Layers From Scratch" }
      ],
      default: "feature_extractor"
    },
    {
      id: "dataSize",
      label: "Custom Dataset Volume",
      type: "select",
      options: [
        { value: "small", label: "Small (~100 images per class)" },
        { value: "medium", label: "Medium (~1,000 images per class)" },
        { value: "large", label: "Large (~10,000+ images per class)" }
      ],
      default: "small"
    },
    {
      id: "headUnits",
      label: "Classification Dense Units",
      type: "range",
      min: 64,
      max: 512,
      step: 64,
      default: 256
    }
  ],
  views: [
    {
      type: "architecture-stack",
      title: "Model Pipeline & Layer Freezing",
      bindings: ["backbone", "strategy", "headUnits"]
    },
    {
      type: "metrics-dashboard",
      title: "Generalization & Parameter Allocation",
      bindings: ["trainableParams", "frozenParams", "valAcc", "overfitRisk"]
    }
  ],
  explanationRules: [
    {
      when: "strategy === 'feature_extractor' && dataSize === 'small'",
      summary: "Safe Feature Extraction on Small Data",
      detail: "Freezing all pre-trained layers preserves low-level edge and texture detectors while learning only the top classification head, preventing severe overfitting."
    },
    {
      when: "strategy === 'scratch' && dataSize === 'small'",
      summary: "Severe Overfitting Risk",
      detail: "Training millions of unconstrained parameters on 100 images causes the network to memorize training examples and fail on validation data."
    }
  ],
  presets: [
    {
      id: "safe-small-data",
      label: "Frozen Base on Small Dataset (Recommended)",
      values: { backbone: "vgg16", strategy: "feature_extractor", dataSize: "small", headUnits: 256 },
      teachingPoint: "Best practice for small datasets: freeze the entire base and train only the custom dense head."
    },
    {
      id: "scratch-failure",
      label: "Train from Scratch (Overfitting Disaster)",
      values: { backbone: "vgg16", strategy: "scratch", dataSize: "small", headUnits: 256 },
      teachingPoint: "Demonstrates catastrophic overfitting when attempting to train all weights on sparse data."
    }
  ],
  challenge: {
    prompt: "Configure VGG16 with feature extraction (all base layers frozen) on a small dataset with 256 dense units to maximize validation accuracy without overfitting.",
    success: { backbone: "vgg16", strategy: "feature_extractor", dataSize: "small", headUnits: 256 },
    hints: [
      "Select VGG-16 backbone.",
      "Choose Freeze All Base Layers.",
      "Set Dataset Volume to Small.",
      "Set Dense Units to 256."
    ]
  },
  quiz: [
    {
      prompt: "What does setting include_top=False do when loading VGG16 in Keras?",
      choices: [
        "It omits the original 1000-class ImageNet fully connected layers, allowing custom heads to be attached",
        "It disables all convolution operations",
        "It removes batch normalization layers",
        "It deletes the input layer shape restriction"
      ],
      answer: 0,
      explanation: "include_top=False retains only the convolutional base and strips the final 1,000-class dense classification layers."
    },
    {
      prompt: "How do you freeze layers in Keras so their weights are not updated during training?",
      choices: [
        "Set layer.trainable = False",
        "Call layer.freeze()",
        "Remove the optimizer",
        "Pass weights=None"
      ],
      answer: 0,
      explanation: "Setting layer.trainable = False excludes the layer's weights from the optimizer's gradient updates."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive transfer learning simulator displaying frozen versus trainable layer parameter partitions and simulated validation loss curves.",
    keyboardHelp: "Use Tab and Arrow keys to switch backbones, layer freezing strategies, and dataset volume."
  }
};

