export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/advanced-cnns-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Advanced CNNs in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/1-Advanced_CNNs_in_Keras.txt",
  sourceFormat: "txt",
  engine: "DeepVisionLab",
  learningObjectives: [
    "Differentiate modern deep CNN architectures: VGG (homogenous conv stacks), ResNet (residual skip connections), and Inception (multi-scale receptive fields).",
    "Explain how ResNet shortcut connections F(x) + x resolve vanishing gradients and enable identity mappings in 50+ layer networks."
  ],
  prerequisites: [
    "Standard 2D Convolution and Pooling layers",
    "Gradient backpropagation and vanishing gradient dynamics"
  ],
  scenario: {
    description: "Explore gradient flow and parameter scaling across deep vision networks. Compare deep plain networks against ResNet skip connections.",
    seed: 3201
  },
  controls: [
    {
      id: "architecture",
      label: "CNN Architecture Family",
      type: "select",
      options: [
        { value: "vgg", label: "VGG (Plain Homogenous Conv Stack)" },
        { value: "resnet", label: "ResNet (Residual Highway)" },
        { value: "inception", label: "Inception (Multi-Scale Parallel Branches)" }
      ],
      default: "resnet"
    },
    {
      id: "depth",
      label: "Network Depth (Layers)",
      type: "select",
      options: [
        { value: "18", label: "18 Layers" },
        { value: "34", label: "34 Layers" },
        { value: "50", label: "50 Layers" },
        { value: "101", label: "101 Layers" }
      ],
      default: "50"
    },
    {
      id: "shortcuts",
      label: "Residual Skip Connections",
      type: "select",
      options: [
        { value: "enabled", label: "Enabled: F(x) + x [ResNet]" },
        { value: "disabled", label: "Disabled: Plain Feedforward" }
      ],
      default: "enabled"
    }
  ],
  views: [
    {
      type: "architecture-diagram",
      title: "Vision Network Topology",
      bindings: ["architecture", "depth", "shortcuts"]
    },
    {
      type: "metrics-panel",
      title: "Gradient Flow & Parameters",
      bindings: ["parameters", "gradientFlow", "identityPreserved"]
    }
  ],
  explanationRules: [
    {
      when: "architecture === 'resnet' && shortcuts === 'enabled'",
      summary: "Residual Highway Preserves Gradient Flow",
      detail: "The addition operator Add()([x, shortcut]) allows gradients to propagate directly through the identity pathway during backpropagation."
    },
    {
      when: "shortcuts === 'disabled'",
      summary: "Vanishing Gradient in Deep Plain Networks",
      detail: "Without skip connections, multiplying successive weight matrices degrades early layer gradients exponentially."
    }
  ],
  presets: [
    {
      id: "target-resnet50",
      label: "ResNet-50 Residual Architecture",
      values: { architecture: "resnet", depth: "50", shortcuts: "enabled" },
      teachingPoint: "ResNet-50 maintains healthy gradient flow even with 50 layers."
    },
    {
      id: "plain-deep-failure",
      label: "Plain 50-Layer Network (Vanishing Gradient)",
      values: { architecture: "resnet", depth: "50", shortcuts: "disabled" },
      teachingPoint: "Demonstrates severe gradient attenuation when residual connections are absent."
    }
  ],
  challenge: {
    prompt: "Configure a 50-layer ResNet with enabled residual skip connections to eliminate vanishing gradient.",
    success: { architecture: "resnet", depth: "50", shortcuts: "enabled" },
    hints: [
      "Select ResNet as the architecture.",
      "Set Depth to 50 Layers.",
      "Enable Residual Skip Connections."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical property ensures that adding residual blocks never hurts network representation capacity?",
      choices: [
        "If F(x) weights decay to 0, the block outputs x (identity mapping)",
        "Residual blocks divide gradients by 2",
        "It eliminates all convolutional kernels",
        "It doubles the spatial image resolution"
      ],
      answer: 0,
      explanation: "With the shortcut F(x) + x, if all weights in F(x) are driven toward zero, the layer trivially behaves as an identity function."
    },
    {
      prompt: "Which Keras layer is used to merge the shortcut tensor with the transformed conv block in a residual block?",
      choices: [
        "keras.layers.Add()",
        "keras.layers.Multiply()",
        "keras.layers.Dense()",
        "keras.layers.Dropout()"
      ],
      answer: 0,
      explanation: "ResNet uses element-wise tensor addition: Add()([x, shortcut])."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive CNN architecture diagram demonstrating VGG stacks, ResNet skip connections, gradient flow magnitude, and parameter counts.",
    keyboardHelp: "Use Tab to navigate controls, select architecture, depth, and skip connection status to observe gradient propagation."
  }
};

