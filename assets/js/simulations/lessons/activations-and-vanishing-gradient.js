export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-2-basics-of-dl/activations-and-vanishing-gradient",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-2-basics-of-dl",
  title: "Activations and Vanishing Gradient",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-2-Basics_of_DL/6-Activations_and_Vanishing_Gradient.ipynb",
  sourceFormat: "ipynb",
  engine: "ActivationLab",
  learningObjectives: [
    "Profile empirical gradient norms across deep neural network layers using TensorFlow / Keras.",
    "Benchmark training loss convergence curves between Sigmoid, Tanh, and ReLU deep networks."
  ],
  prerequisites: [
    "Vanishing gradient mathematics",
    "Keras training profiling"
  ],
  scenario: {
    description: "Follow the Activations and Vanishing Gradient notebook lab. Profile layer-by-layer gradient magnitudes and training loss curves across deep multilayer networks.",
    seed: 5151
  },
  controls: [
    {
      id: "activation",
      label: "Lab Activation Function",
      type: "select",
      options: [
        { value: "relu", label: "ReLU (Lab Recommended)" },
        { value: "sigmoid", label: "Sigmoid (Vanishing Benchmark)" },
        { value: "tanh", label: "Tanh" }
      ],
      default: "relu"
    },
    {
      id: "depth",
      label: "Lab Architecture Depth",
      type: "range",
      min: 2,
      max: 8,
      step: 1,
      default: 5
    }
  ],
  views: [
    {
      type: "activation-curves",
      title: "Lab Activation Profile",
      bindings: ["activation", "depth"]
    },
    {
      type: "metric-cards",
      title: "Lab Gradient Propagation",
      bindings: ["act-name", "grad-scale", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "activation === 'relu' && depth === 5",
      summary: "Lab Optimal Configuration",
      detail: "ReLU maintains robust non-vanishing gradient flow across 5 dense hidden layers in the lab benchmark."
    }
  ],
  presets: [
    {
      id: "lab-relu-5",
      label: "Lab Benchmark (5-Layer ReLU)",
      values: { activation: "relu", depth: 5 },
      teachingPoint: "ReLU enables deep networks to converge reliably without gradient attenuation."
    }
  ],
  challenge: {
    prompt: "Replicate the lab benchmark: configure a 5-layer ReLU network to achieve Balanced status.",
    success: { activation: "relu", depth: 5, diagnosis: "Balanced" },
    hints: [
      "Select ReLU (Lab Recommended).",
      "Set Lab Architecture Depth to 5."
    ]
  },
  quiz: [
    {
      prompt: "In the notebook lab, what happened to the training loss when training a 10-layer deep network with Sigmoid activation versus ReLU?",
      choices: [
        "The Sigmoid network plateaued with virtually no loss decrease due to vanishing gradients, while the ReLU network converged rapidly.",
        "The Sigmoid network was 100x faster.",
        "Both networks reached identical accuracy in 1 epoch.",
        "The ReLU network diverged to infinity."
      ],
      answer: 0,
      explanation: "Empirical training traces show deep Sigmoid networks failing to train early layers, whereas ReLU trains all layers effectively."
    },
    {
      prompt: "Besides ReLU, what architectural technique in deep learning directly mitigates vanishing gradients in very deep networks (e.g. ResNet 50+ layers)?",
      choices: [
        "Residual skip connections (identity shortcuts) that add previous layer activations directly to downstream layers: x + F(x).",
        "Deleting 50% of the dataset.",
        "Using 1-bit integer quantization.",
        "Running without an optimizer."
      ],
      answer: 0,
      explanation: "Residual skip connections allow gradients to flow directly backward through identity paths without multiplicative shrinkage."
    }
  ],
  accessibility: {
    canvasSummary: "Activation lab profile dashboard showing derivative magnitude and gradient scale across layers.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

