export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/advanced-keras-techniques",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Advanced Keras Techniques",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/1-Advanced_Keras_Techniques.txt",
  sourceFormat: "txt",
  engine: "AdvancedKerasLab",
  learningObjectives: [
    "Differentiate the four architectural pillars of advanced Keras: custom training loops, specialized layer subclassing, lifecycle callbacks, and mixed precision.",
    "Implement specialized layers by overriding build(input_shape) to allocate trainable weights and call(inputs) for the forward transformation.",
    "Configure mixed precision training policies (mixed_float16) to accelerate computation while retaining numerical stability with float32 weight updates."
  ],
  prerequisites: [
    "Keras Sequential and Functional APIs",
    "Basic knowledge of forward propagation and gradient descent"
  ],
  scenario: {
    description: "Explore the core techniques used to customize and optimize deep learning workflows in Keras beyond model.fit(), including low-level GradientTape loops, custom layers with explicit weight allocation, callback lifecycle hooks, and mixed precision policies.",
    seed: 501
  },
  controls: [
    {
      id: "technique",
      label: "Advanced Architectural Pillar",
      type: "select",
      default: "custom_layer",
      options: [
        { value: "custom_layer", label: "Specialized Layer Subclassing (Layer.build & call)" },
        { value: "custom_loop", label: "Custom Training Loop (tf.GradientTape)" },
        { value: "custom_callback", label: "Advanced Callback (Callback.on_epoch_end)" },
        { value: "mixed_precision", label: "Mixed Precision Training (mixed_float16)" }
      ]
    },
    {
      id: "custom_layer_units",
      label: "Custom Layer Hidden Units",
      type: "select",
      default: "64",
      options: [
        { value: "32", label: "32 Units (25,120 parameters)" },
        { value: "64", label: "64 Units (50,240 parameters)" },
        { value: "128", label: "128 Units (100,480 parameters)" }
      ]
    },
    {
      id: "precision_policy",
      label: "Compute Precision Policy",
      type: "select",
      default: "mixed_float16",
      options: [
        { value: "float32", label: "Standard float32 (Full Precision Baseline)" },
        { value: "mixed_float16", label: "mixed_float16 (16-bit Ops + 32-bit Master Weights)" }
      ]
    },
    {
      id: "callback_action",
      label: "Callback Hook Target",
      type: "select",
      default: "log_metrics",
      options: [
        { value: "log_metrics", label: "Log Detailed Epoch Metrics" },
        { value: "early_stopping", label: "Early Stopping on Plateaus" },
        { value: "checkpoint", label: "Serialize Best Checkpoint" }
      ]
    }
  ],
  views: [
    {
      type: "advanced-keras-diagram",
      title: "Advanced Keras Architectural Pillars",
      bindings: ["technique", "custom_layer_units", "precision_policy", "callback_action"]
    },
    {
      type: "metric-cards",
      title: "Modeled Execution Metrics",
      bindings: ["status", "memory", "throughput", "params"]
    }
  ],
  explanationRules: [
    {
      when: "technique === 'custom_layer' && custom_layer_units === '64' && precision_policy === 'mixed_float16'",
      summary: "Optimal Custom Layer Configuration",
      detail: "Subclassing tf.keras.layers.Layer allows explicit weight allocation in build() with self.add_weight(). Combining with mixed_float16 cuts activation memory in half while accelerating matrix multiplications."
    },
    {
      when: "technique === 'custom_loop'",
      summary: "Explicit Automatic Differentiation",
      detail: "Using tf.GradientTape bypasses the rigid abstraction of model.fit(), enabling non-standard loss objectives, multi-optimizer coordination, and granular batch inspection."
    }
  ],
  presets: [
    {
      id: "custom-layer-fp16",
      label: "Custom Layer with Mixed Precision",
      values: { technique: "custom_layer", custom_layer_units: "64", precision_policy: "mixed_float16", callback_action: "log_metrics" },
      teachingPoint: "Demonstrates subclassing Layer with build/call combined with mixed_float16 for high-throughput training."
    },
    {
      id: "gradient-tape-loop",
      label: "Custom GradientTape Loop",
      values: { technique: "custom_loop", custom_layer_units: "64", precision_policy: "float32", callback_action: "log_metrics" },
      teachingPoint: "Switches to manual forward pass and backward differentiation using tf.GradientTape."
    },
    {
      id: "callback-monitoring",
      label: "Epoch Monitoring Callback",
      values: { technique: "custom_callback", custom_layer_units: "64", precision_policy: "float32", callback_action: "log_metrics" },
      teachingPoint: "Inspects how custom callbacks intercept training milestones without altering model logic."
    }
  ],
  challenge: {
    prompt: "Configure the simulation to inspect a Custom Layer with 64 units running under the 'mixed_float16' precision policy.",
    success: { technique: "custom_layer", custom_layer_units: "64", precision_policy: "mixed_float16" },
    hints: [
      "Set Advanced Architectural Pillar to Specialized Layer Subclassing.",
      "Choose 64 Units for the custom layer.",
      "Select mixed_float16 as the Compute Precision Policy."
    ]
  },
  quiz: [
    {
      prompt: "In a custom Keras Layer subclass, why is it best practice to create weights inside build(input_shape) rather than __init__?",
      choices: [
        "Because build(input_shape) is called lazily once the layer knows the shape of its inputs, allowing dynamic parameter sizing without hardcoding input dimensions.",
        "Because __init__ cannot execute Python code.",
        "Because weights created in __init__ are automatically converted to NumPy arrays.",
        "Because Keras disables GPU acceleration if weights are declared in __init__."
      ],
      answer: 0,
      explanation: "Overriding build(input_shape) defers weight creation until the input tensor shape is known at runtime, making layers flexible and reusable across different input dimensions."
    },
    {
      prompt: "How does mixed precision training ('mixed_float16') preserve training stability while achieving speedups?",
      choices: [
        "It executes compute-heavy matrix multiplications in float16 for speed and memory efficiency, while maintaining critical master weights, loss scaling, and gradient accumulation in float32.",
        "It trains the first half of epochs in float16 and the second half in float64.",
        "It converts integer labels into 16-bit complex numbers.",
        "It ignores gradients that are smaller than 1.0."
      ],
      answer: 0,
      explanation: "Mixed precision uses float16 where compute throughput and memory bandwidth dominate, and preserves float32 for sensitive accumulators and master weights to prevent underflow/overflow."
    }
  ],
  accessibility: {
    canvasSummary: "Architectural overview diagram displaying the four pillars of advanced Keras: custom training loop, specialized layer subclassing, callback hooks, and mixed precision policies.",
    keyboardHelp: "Use Tab to navigate between control menus and Enter or Space to select different architectural pillars."
  }
};
