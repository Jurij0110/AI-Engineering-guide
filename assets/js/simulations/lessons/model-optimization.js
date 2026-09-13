export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/model-optimization",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Model Optimization",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/7-Model_Optimization.txt",
  sourceFormat: "txt",
  engine: "ModelOptimizationLab",
  learningObjectives: [
    "Analyze deep learning optimization strategies: He/Glorot weight initialization, dynamic learning rate scheduling, and batch normalization.",
    "Implement model weight pruning using tensorflow_model_optimization (tfmot) polynomial decay schedules to introduce controlled weight sparsity.",
    "Convert trained models to 8-bit integer formats using tf.lite.TFLiteConverter to reduce memory footprint by 4x for edge deployment."
  ],
  prerequisites: [
    "Keras model compilation and training",
    "Basic knowledge of floating point arithmetic and edge devices"
  ],
  scenario: {
    description: "Simulate model compression and inference acceleration techniques. Balance weight initialization, learning rate exponential decay, tfmot low-magnitude pruning, and TFLite INT8 quantization to achieve maximum compression with minimal accuracy loss.",
    seed: 506
  },
  controls: [
    {
      id: "init_method",
      label: "Weight Initialization Strategy",
      type: "select",
      default: "he_normal",
      options: [
        { value: "he_normal", label: "He Normal (HeNormal - Variance 2/n_in for ReLU)" },
        { value: "glorot_uniform", label: "Xavier / Glorot Uniform (Variance 2/(n_in+n_out))" },
        { value: "random_normal", label: "Unscaled Random Normal (Risk of Vanishing Variance)" }
      ]
    },
    {
      id: "lr_schedule",
      label: "Learning Rate Scheduling",
      type: "select",
      default: "exponential_decay",
      options: [
        { value: "exponential_decay", label: "Exponential Decay (lr * exp(-0.1) after 10 epochs)" },
        { value: "constant", label: "Constant Learning Rate" }
      ]
    },
    {
      id: "batch_norm",
      label: "Batch Normalization",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (BatchNormalization Layer)" },
        { value: "disabled", label: "Disabled" }
      ]
    },
    {
      id: "pruning_sparsity",
      label: "Model Pruning Target Sparsity",
      type: "select",
      default: "50",
      options: [
        { value: "0", label: "0% Sparsity (Dense Baseline)" },
        { value: "25", label: "25% Sparsity (Mild Pruning)" },
        { value: "50", label: "50% Sparsity (Optimal Sweet Spot)" },
        { value: "75", label: "75% Sparsity (Aggressive Pruning)" }
      ]
    },
    {
      id: "quantization",
      label: "Deployment Quantization",
      type: "select",
      default: "int8_tflite",
      options: [
        { value: "none_fp32", label: "None (Full float32, 4 bytes/weight)" },
        { value: "fp16", label: "FP16 Half-Precision (2 bytes/weight)" },
        { value: "int8_tflite", label: "TFLite INT8 Quantization (1 byte/weight)" }
      ]
    }
  ],
  views: [
    {
      type: "model-opt-view",
      title: "Optimization Trade-offs & Pruned Weights",
      bindings: ["init_method", "lr_schedule", "batch_norm", "pruning_sparsity", "quantization"]
    },
    {
      type: "metric-cards",
      title: "Modeled Deployment Metrics",
      bindings: ["status", "model-size", "latency", "val-acc"]
    }
  ],
  explanationRules: [
    {
      when: "init_method === 'he_normal' && pruning_sparsity === '50' && quantization === 'int8_tflite' && batch_norm === 'enabled'",
      summary: "Optimal Edge Deployment Target",
      detail: "HeNormal preserves signal variance through ReLU layers, 50% pruning zeros out redundant connections without accuracy penalty, and TFLite INT8 quantizes remaining weights to 8-bit integers, yielding ~7x compression and ~4.7x speedup."
    },
    {
      when: "init_method === 'random_normal'",
      summary: "Initialization Failure",
      detail: "Without variance scaling proportional to fan-in, unscaled random normal initialization leads to severe gradient vanishing across deep layers, collapsing accuracy to ~84%."
    }
  ],
  presets: [
    {
      id: "edge-optimized",
      label: "Edge Optimized (He + 50% Prune + INT8)",
      values: { init_method: "he_normal", lr_schedule: "exponential_decay", batch_norm: "enabled", pruning_sparsity: "50", quantization: "int8_tflite" },
      teachingPoint: "Combines HeNormal, batch norm, 50% polynomial pruning, and INT8 quantization for edge deployment."
    },
    {
      id: "unoptimized-baseline",
      label: "Unoptimized Dense Baseline (FP32)",
      values: { init_method: "glorot_uniform", lr_schedule: "constant", batch_norm: "disabled", pruning_sparsity: "0", quantization: "none_fp32" },
      teachingPoint: "Standard dense baseline with 4.1 MB model size and 18.5 ms inference latency."
    },
    {
      id: "poor-initialization",
      label: "Initialization Failure (Random Normal)",
      values: { init_method: "random_normal", lr_schedule: "constant", batch_norm: "disabled", pruning_sparsity: "0", quantization: "none_fp32" },
      teachingPoint: "Demonstrates accuracy collapse caused by improper weight initialization."
    }
  ],
  challenge: {
    prompt: "Configure the optimization pipeline with He Normal initialization, exponential learning rate decay, Batch Normalization enabled, 50% pruning sparsity, and TFLite INT8 quantization to retain >97.5% accuracy while cutting model size below 0.7 MB.",
    success: { init_method: "he_normal", lr_schedule: "exponential_decay", batch_norm: "enabled", pruning_sparsity: "50", quantization: "int8_tflite" },
    hints: [
      "Select He Normal (HeNormal) for Weight Initialization Strategy.",
      "Select Exponential Decay for Learning Rate Scheduling.",
      "Enable Batch Normalization.",
      "Set Model Pruning Target Sparsity to 50%.",
      "Choose TFLite INT8 Quantization."
    ]
  },
  quiz: [
    {
      prompt: "Why is He (Kaiming) initialization preferred over Xavier/Glorot initialization for layers using ReLU activation?",
      choices: [
        "Because ReLU zeroes out negative inputs (halving the active signal variance); He initialization scales weight variance by 2/n_in to counteract this halving effect.",
        "Because He initialization rounds all weights to integer values.",
        "Because Xavier initialization is only compatible with Python 2.",
        "Because He initialization requires less memory to store in RAM."
      ],
      answer: 0,
      explanation: "ReLU sets roughly half of the neuron activations to 0. He initialization compensates by scaling variance by 2/n_in (instead of 1/n_in or 2/(n_in+n_out)), preventing vanishing activations in deep networks."
    },
    {
      prompt: "How does TFLite post-training quantization reduce model size by approximately 4x?",
      choices: [
        "It maps 32-bit floating point weights (4 bytes per parameter) to 8-bit fixed-point integers (1 byte per parameter).",
        "It deletes three out of every four layers in the neural network.",
        "It downsamples input images from 28x28 to 7x7.",
        "It trains the model for four times as many epochs."
      ],
      answer: 0,
      explanation: "32-bit floating point parameters consume 4 bytes each. Quantizing to 8-bit integers consumes only 1 byte per weight, shrinking parameter storage by exactly 4x."
    }
  ],
  accessibility: {
    canvasSummary: "Chart comparing baseline and optimized model size, inference latency, and weight sparsity distributions under various initialization and quantization schemes.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to adjust pruning and quantization settings."
  }
};
