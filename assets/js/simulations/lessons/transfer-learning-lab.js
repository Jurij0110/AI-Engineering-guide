export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/transfer-learning-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Transfer Learning Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/5-Transfer_Learning_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "TransferLearningLab",
  learningObjectives: [
    "Execute two-stage transfer learning: first train the top classification head with a frozen backbone, then unfreeze top conv layers with a low learning rate for fine-tuning.",
    "Evaluate training dynamics across optimizers (Adam, SGD, RMSprop) and avoid catastrophic forgetting during fine-tuning."
  ],
  prerequisites: [
    "Transfer learning concepts with VGG16",
    "Learning rate tuning and optimizer selection in Keras"
  ],
  scenario: {
    description: "Lab notebook checkpoint: Fine-tune the upper convolutional blocks of VGG16 with a gentle learning rate to boost classification accuracy without destroying learned features.",
    seed: 3205
  },
  controls: [
    {
      id: "backbone",
      label: "Model Backbone",
      type: "select",
      options: [
        { value: "vgg16", label: "VGG-16 Pre-trained" },
        { value: "resnet50", label: "ResNet-50 Pre-trained" }
      ],
      default: "vgg16"
    },
    {
      id: "strategy",
      label: "Fine-Tuning Scope",
      type: "select",
      options: [
        { value: "fine_tuning", label: "Fine-Tune Top-4 Layers (base_model.layers[-4:])" },
        { value: "feature_extractor", label: "Freeze All Base Layers" },
        { value: "scratch", label: "Unfreeze All" }
      ],
      default: "fine_tuning"
    },
    {
      id: "dataSize",
      label: "Dataset Volume",
      type: "select",
      options: [
        { value: "medium", label: "Medium (~1,000 images per class)" },
        { value: "small", label: "Small (~100 images per class)" }
      ],
      default: "medium"
    },
    {
      id: "optimizer",
      label: "Fine-Tuning Optimizer",
      type: "select",
      options: [
        { value: "adam", label: "Adam" },
        { value: "rmsprop", label: "RMSprop" },
        { value: "sgd", label: "SGD with Momentum" }
      ],
      default: "adam"
    },
    {
      id: "learningRate",
      label: "Learning Rate",
      type: "select",
      options: [
        { value: "0.0001", label: "1e-4 (Gentle - Safe Fine-Tuning)" },
        { value: "0.00001", label: "1e-5 (Very Small)" },
        { value: "0.001", label: "1e-3 (Standard)" },
        { value: "0.01", label: "1e-2 (Excessive - Catastrophic Forgetting)" }
      ],
      default: "0.0001"
    }
  ],
  views: [
    {
      type: "loss-accuracy-curves",
      title: "Simulated Training vs Validation Curves",
      bindings: ["strategy", "optimizer", "learningRate"]
    },
    {
      type: "tuning-metrics",
      title: "Fine-Tuning Performance & Overfit Risk",
      bindings: ["trainAcc", "valAcc", "overfitRisk", "trainableParams"]
    }
  ],
  explanationRules: [
    {
      when: "strategy === 'fine_tuning' && learningRate <= 0.0001",
      summary: "Optimal Fine-Tuning Convergence",
      detail: "Using a very small learning rate (1e-4 or 1e-5) makes gentle adjustments to higher-level feature maps without destroying lower-level generic representations."
    },
    {
      when: "learningRate >= 0.005",
      summary: "Catastrophic Forgetting Danger",
      detail: "High learning rates wreck pre-trained weights, causing the model to forget generic ImageNet feature representations."
    }
  ],
  presets: [
    {
      id: "lab-exercise-optimal",
      label: "Lab Target: VGG16 Top-4 Fine-Tuning (LR 1e-4)",
      values: { backbone: "vgg16", strategy: "fine_tuning", dataSize: "medium", optimizer: "adam", learningRate: "0.0001" },
      teachingPoint: "Achieves peak validation accuracy (~94%) with low risk of forgetting."
    },
    {
      id: "too-aggressive-lr",
      label: "Aggressive LR (Catastrophic Forgetting)",
      values: { backbone: "vgg16", strategy: "fine_tuning", dataSize: "medium", optimizer: "adam", learningRate: "0.01" },
      teachingPoint: "Demonstrates performance collapse when learning rate is set too high during fine-tuning."
    }
  ],
  challenge: {
    prompt: "Configure VGG16 fine-tuning on top-4 layers with a medium dataset, Adam optimizer, and a gentle learning rate of 0.0001.",
    success: { backbone: "vgg16", strategy: "fine_tuning", dataSize: "medium", optimizer: "adam", learningRate: "0.0001" },
    hints: [
      "Select VGG-16 backbone.",
      "Select Fine-Tune Top-4 Layers.",
      "Set Dataset to Medium.",
      "Choose Adam optimizer.",
      "Set Learning Rate to 0.0001 (1e-4)."
    ]
  },
  quiz: [
    {
      prompt: "Why should fine-tuning be performed with a significantly lower learning rate than training from scratch?",
      choices: [
        "To avoid wrecking pre-trained weights and prevent catastrophic forgetting of general features",
        "Because GPUs overheat at normal learning rates",
        "To force the model to output integer predictions",
        "Because convolutional layers cannot process floats"
      ],
      answer: 0,
      explanation: "A small learning rate (e.g. 1e-4 or 1e-5) applies subtle nudges to pre-trained weights without obliterating their feature detectors."
    },
    {
      prompt: "In a standard transfer learning workflow, which stage should precede fine-tuning?",
      choices: [
        "Training the new top classifier head while keeping the pre-trained base frozen",
        "Randomly shuffling all backbone filter weights",
        "Deleting all pooling layers",
        "Decreasing image resolution to 8x8"
      ],
      answer: 0,
      explanation: "Training the top dense layers first allows the randomly initialized head to converge before unfreezing base layers, preventing large gradients from corrupting the base."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive fine-tuning lab showing training and validation learning curves under different learning rates and layer unfreezing scopes.",
    keyboardHelp: "Use Tab and Arrow keys to adjust fine-tuning scope, optimizer, and learning rate."
  }
};

