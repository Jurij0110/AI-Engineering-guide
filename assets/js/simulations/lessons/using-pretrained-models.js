export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/using-pretrained-models",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "Using Pretrained Models",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/9-Using_Pretrained_Models.txt",
  sourceFormat: "txt",
  engine: "EmbeddingSpace",
  learningObjectives: [
    "Implement Transfer Learning in Keras using pre-trained vision backbones (VGG16, ResNet50) with include_top=False.",
    "Freeze backbone feature extraction layers (layer.trainable = False) and selectively fine-tune top convolutional layers."
  ],
  prerequisites: [
    "CNN feature representations",
    "Keras Model fine-tuning"
  ],
  scenario: {
    description: "Explore Transfer Learning workflows. Connect pretrained ImageNet backbones to new task heads and compare frozen feature extraction against selective layer fine-tuning.",
    seed: 6464
  },
  controls: [
    {
      id: "backbone",
      label: "Pretrained Vision Backbone",
      type: "select",
      options: [
        { value: "vgg16", label: "VGG16 (ImageNet Pretrained — 14.7M Params)" },
        { value: "resnet50", label: "ResNet50 (Residual Architecture — 23.6M Params)" }
      ],
      default: "vgg16"
    },
    {
      id: "fine_tune_layers",
      label: "Unfrozen Top Layers for Fine-Tuning",
      type: "range",
      min: 0,
      max: 4,
      step: 1,
      default: 0
    }
  ],
  views: [
    {
      type: "transfer-diagram",
      title: "Transfer Learning Architecture",
      bindings: ["backbone", "fine_tune_layers"]
    },
    {
      type: "metric-cards",
      title: "Adaptation Metrics",
      bindings: ["trainable-params", "speed", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "fine_tune_layers === 0",
      summary: "Frozen Feature Extractor",
      detail: "Freezing all 14.7M base parameters trains only the small 514-parameter top classification head in seconds."
    },
    {
      when: "fine_tune_layers > 0",
      summary: "Selective Fine-Tuning",
      detail: "Unfreezing top backbone layers enables domain-specific feature adaptation with small learning rates."
    }
  ],
  presets: [
    {
      id: "frozen-feature-extractor",
      label: "Frozen Extractor (Fastest)",
      values: { backbone: "vgg16", fine_tune_layers: 0 },
      teachingPoint: "Frozen transfer learning prevents overfitting on small custom datasets."
    },
    {
      id: "fine-tuned-vgg",
      label: "Fine-Tuned Top 4 Layers",
      values: { backbone: "vgg16", fine_tune_layers: 4 },
      teachingPoint: "Fine-tuning allows high-level visual features to adapt to specialized target classes."
    }
  ],
  challenge: {
    prompt: "Configure VGG16 with 0 unfrozen layers (Frozen Extractor) to achieve Balanced status and Very Fast speed.",
    success: { backbone: "vgg16", fine_tune_layers: 0, diagnosis: "Balanced" },
    hints: [
      "Select VGG16 as Pretrained Vision Backbone.",
      "Set Unfrozen Top Layers for Fine-Tuning to 0."
    ]
  },
  quiz: [
    {
      prompt: "In Keras, what is the effect of setting base_model.trainable = False?",
      choices: [
        "It freezes the pre-trained weights so they will not be updated during gradient descent / backpropagation, preserving existing ImageNet feature representations.",
        "It deletes the base model from memory.",
        "It disables GPU acceleration.",
        "It changes all activation functions to linear."
      ],
      answer: 0,
      explanation: "Freezing layers locks their weights, allowing the optimizer to update only the freshly initialized task-specific classification head."
    },
    {
      prompt: "Why should fine-tuning unfrozen base layers be performed with a very small learning rate (e.g. 1e-5)?",
      choices: [
        "To avoid 'catastrophic forgetting' or destroying the rich general-purpose features learned during pre-training on millions of images.",
        "Because large learning rates are illegal in Python.",
        "To make the weights negative.",
        "Because GPUs only support small numbers."
      ],
      answer: 0,
      explanation: "Small learning rates gently calibrate high-level features for the new domain without overwriting foundational visual representations."
    }
  ],
  accessibility: {
    canvasSummary: "Transfer learning architecture diagram showing frozen ImageNet backbone feeding into trainable dense classification head.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

