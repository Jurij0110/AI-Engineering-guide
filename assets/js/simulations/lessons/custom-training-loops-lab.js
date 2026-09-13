export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/custom-training-loops-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Custom Training Loops Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/3-Custom_Training_Loops_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "CustomTrainingLoopLab",
  learningObjectives: [
    "Construct an end-to-end custom training loop for MNIST classification using tf.GradientTape, Adam optimizer, and SparseCategoricalCrossentropy.",
    "Incorporate stateful metric tracking using tf.keras.metrics.SparseCategoricalAccuracy to compute running accuracy and reset states per epoch.",
    "Implement a CustomCallback subclass overriding on_epoch_end() to log training telemetry across training epochs."
  ],
  prerequisites: [
    "MNIST dataset normalization and batching with tf.data",
    "Understanding of stateful metrics and callback lifecycles"
  ],
  scenario: {
    description: "Replicate the 3 lab exercises: Exercise 1 (basic GradientTape loop logging loss every 200 steps), Exercise 2 (accumulating SparseCategoricalAccuracy across batches), and Exercise 3 (dispatching CustomCallback at on_epoch_end).",
    seed: 503
  },
  controls: [
    {
      id: "epoch",
      label: "Training Epoch (1 - 5)",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 2
    },
    {
      id: "step",
      label: "Batch Step (0 - 1800)",
      type: "range",
      min: 0,
      max: 1800,
      step: 200,
      default: 1800
    },
    {
      id: "metric_tracking",
      label: "Accuracy Metric (Exercise 2)",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (tf.keras.metrics.SparseCategoricalAccuracy)" },
        { value: "disabled", label: "Disabled (Loss-only tracking from Exercise 1)" }
      ]
    },
    {
      id: "callback_hook",
      label: "Custom Callback (Exercise 3)",
      type: "select",
      default: "on_epoch_end",
      options: [
        { value: "on_epoch_end", label: "Enabled (CustomCallback.on_epoch_end)" },
        { value: "none", label: "Disabled" }
      ]
    },
    {
      id: "optimizer",
      label: "Optimizer",
      type: "select",
      default: "adam",
      options: [
        { value: "adam", label: "Adam" },
        { value: "sgd", label: "SGD" }
      ]
    }
  ],
  views: [
    {
      type: "custom-loop-lab-view",
      title: "Lab Metric Curves & Callback Output",
      bindings: ["epoch", "step", "metric_tracking", "callback_hook", "optimizer"]
    },
    {
      type: "metric-cards",
      title: "Lab Convergence Status",
      bindings: ["epoch-step", "loss", "accuracy", "callback-log"]
    }
  ],
  explanationRules: [
    {
      when: "metric_tracking === 'enabled' && epoch === 2 && step === 1800",
      summary: "Exercise 2 & 3 Target Convergence",
      detail: "By the end of Epoch 2 (step 1800), the model attains over 96.4% accuracy with batch loss falling to ~0.09. The custom callback dispatches on_epoch_end reporting final epoch statistics."
    },
    {
      when: "metric_tracking === 'disabled'",
      summary: "Exercise 1 Mode",
      detail: "Only the raw batch loss is logged every 200 steps; without metric accumulators, running classification accuracy is omitted."
    }
  ],
  presets: [
    {
      id: "exercise-1-basic",
      label: "Exercise 1: Basic Loop",
      values: { epoch: 1, step: 200, metric_tracking: "disabled", callback_hook: "none", optimizer: "adam" },
      teachingPoint: "Tracks raw batch loss every 200 steps without accuracy accumulators or custom callbacks."
    },
    {
      id: "exercise-2-accuracy",
      label: "Exercise 2: Adding Accuracy Metric",
      values: { epoch: 1, step: 1800, metric_tracking: "enabled", callback_hook: "none", optimizer: "adam" },
      teachingPoint: "Integrates SparseCategoricalAccuracy to track running accuracy alongside loss."
    },
    {
      id: "exercise-3-callback",
      label: "Exercise 3: Full Loop with Custom Callback",
      values: { epoch: 2, step: 1800, metric_tracking: "enabled", callback_hook: "on_epoch_end", optimizer: "adam" },
      teachingPoint: "Complete lab pipeline achieving >96% accuracy and triggering custom callback logging at epoch conclusion."
    }
  ],
  challenge: {
    prompt: "Complete Exercise 3 by running the custom loop to Epoch 2, Step 1800 with Metric Tracking enabled and Callback Hook set to on_epoch_end using the Adam optimizer.",
    success: { epoch: 2, step: 1800, metric_tracking: "enabled", callback_hook: "on_epoch_end", optimizer: "adam" },
    hints: [
      "Set Training Epoch to 2 and Batch Step to 1800.",
      "Select Enabled for Accuracy Metric.",
      "Select Enabled for Custom Callback.",
      "Ensure Optimizer is Adam."
    ]
  },
  quiz: [
    {
      prompt: "Why must accuracy_metric.reset_state() be called at the end of each epoch in Exercise 2?",
      choices: [
        "Because stateful metrics accumulate total correct counts across all batches; without resetting, the reported accuracy would average across past epochs instead of reflecting the current epoch.",
        "To clear Python memory and garbage-collect GPU tensors.",
        "Because TensorFlow throws an error if an accuracy metric exceeds 1.0.",
        "To reset the model weights back to random initialization."
      ],
      answer: 0,
      explanation: "Keras metrics maintain internal accumulation variables (total correct and total samples). Calling reset_state() clears accumulators so subsequent epochs measure fresh performance."
    },
    {
      prompt: "In Exercise 3, which lifecycle method did the CustomCallback class override to print logs?",
      choices: [
        "on_epoch_end(self, epoch, logs=None)",
        "on_gradient_calculated()",
        "on_model_instantiated()",
        "on_gpu_allocated()"
      ],
      answer: 0,
      explanation: "Keras callbacks inherit from Callback and can override on_epoch_end(epoch, logs) to inspect metrics after every complete pass over the dataset."
    }
  ],
  accessibility: {
    canvasSummary: "Simulation panel showing loss and accuracy curves for MNIST custom training loop alongside active console logs from CustomCallback.on_epoch_end().",
    keyboardHelp: "Use Arrow keys to change epoch and step values, and Tab to switch between metric tracking and callback toggles."
  }
};
