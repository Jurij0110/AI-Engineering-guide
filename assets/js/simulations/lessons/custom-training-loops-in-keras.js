export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/custom-training-loops-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Custom Training Loops in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/2-Custom_Training_Loops_in_Keras.txt",
  sourceFormat: "txt",
  engine: "CustomTrainingLoopLab",
  learningObjectives: [
    "Identify the 4 fundamental building blocks of a custom training loop: batched dataset, neural network model, loss function, and optimizer.",
    "Trace automatic differentiation through tf.GradientTape, from forward-pass logits to tape.gradient and optimizer.apply_gradients.",
    "Evaluate the benefits of custom training loops for researching bespoke loss formulations, gradient clipping, and advanced logging."
  ],
  prerequisites: [
    "Keras Sequential API and Dense layers",
    "Conceptual understanding of backpropagation and loss functions"
  ],
  scenario: {
    description: "Simulate the inner execution mechanics of a custom training loop over MNIST. Watch tf.GradientTape capture operations during the forward pass, calculate exact weight derivatives, and update parameters using Adam.",
    seed: 502
  },
  controls: [
    {
      id: "epoch",
      label: "Training Epoch (1 - 5)",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 1
    },
    {
      id: "step",
      label: "Batch Step (0 - 1800)",
      type: "range",
      min: 0,
      max: 1800,
      step: 200,
      default: 200
    },
    {
      id: "optimizer",
      label: "Optimization Algorithm",
      type: "select",
      default: "adam",
      options: [
        { value: "adam", label: "Adam (Adaptive Moment Estimation)" },
        { value: "sgd", label: "SGD (Standard Gradient Descent)" }
      ]
    },
    {
      id: "batch_size",
      label: "Mini-Batch Size",
      type: "select",
      default: "32",
      options: [
        { value: "16", label: "16 Samples per Batch" },
        { value: "32", label: "32 Samples per Batch (Course Standard)" },
        { value: "64", label: "64 Samples per Batch" }
      ]
    }
  ],
  views: [
    {
      type: "custom-loop-flow",
      title: "GradientTape Execution and Loss Curve",
      bindings: ["epoch", "step", "optimizer", "batch_size"]
    },
    {
      type: "metric-cards",
      title: "Step Metrics",
      bindings: ["epoch-step", "loss", "grad-norm", "tapeStatus"]
    }
  ],
  explanationRules: [
    {
      when: "epoch === 1 && step === 0",
      summary: "Untrained Forward Pass",
      detail: "At Step 0 of Epoch 1, weights are randomly initialized. Logits produce near-uniform class probabilities, resulting in an initial cross-entropy loss of ~2.35."
    },
    {
      when: "epoch >= 2 && step >= 1000",
      summary: "Converged Representation",
      detail: "By Epoch 2, Adam has performed thousands of gradient updates, stabilizing batch loss below 0.15 with gradient magnitudes attenuating towards zero."
    }
  ],
  presets: [
    {
      id: "step-zero",
      label: "Initial Step (Epoch 1, Step 0)",
      values: { epoch: 1, step: 0, optimizer: "adam", batch_size: "32" },
      teachingPoint: "Demonstrates high initial loss before gradient updates take effect."
    },
    {
      id: "early-convergence",
      label: "Epoch 1 Mid-Point (Step 600)",
      values: { epoch: 1, step: 600, optimizer: "adam", batch_size: "32" },
      teachingPoint: "Loss drops dramatically from ~2.35 to ~0.18 within the first 600 batches."
    },
    {
      id: "epoch-two-end",
      label: "Epoch 2 Converged (Step 1800)",
      values: { epoch: 2, step: 1800, optimizer: "adam", batch_size: "32" },
      teachingPoint: "Model parameters reach stable convergence with low gradient norm."
    }
  ],
  challenge: {
    prompt: "Advance training to Epoch 2, Step 1000 with the Adam optimizer and batch size 32 to verify gradient decay and loss stabilization.",
    success: { epoch: 2, step: 1000, optimizer: "adam", batch_size: "32" },
    hints: [
      "Set Training Epoch to 2.",
      "Move the Batch Step slider to 1000.",
      "Ensure Optimization Algorithm is Adam and Mini-Batch Size is 32."
    ]
  },
  quiz: [
    {
      prompt: "What is the primary role of tf.GradientTape in a Keras custom training loop?",
      choices: [
        "It acts as a context manager that records tensor operations during the forward pass so reverse-mode automatic differentiation can compute exact parameter gradients.",
        "It caches training images in memory to prevent hard drive bottleneck.",
        "It automatically adjusts learning rate when loss plateaus.",
        "It converts Python dictionaries into JSON format."
      ],
      answer: 0,
      explanation: "Operations executed inside the 'with tf.GradientTape() as tape:' block are traced so tape.gradient(loss, weights) can apply the chain rule in reverse order."
    },
    {
      prompt: "Why is 'logits = model(x_batch_train, training=True)' called with training=True?",
      choices: [
        "To ensure regularization layers like Dropout and BatchNormalization execute in training mode rather than inference mode.",
        "To compile C++ extensions in the background.",
        "To prevent the model from updating its weights.",
        "To enforce integer-only arithmetic."
      ],
      answer: 0,
      explanation: "In Keras, layers such as Dropout and BatchNormalization behave differently during training vs inference; passing training=True activates active dropping and batch statistics updates."
    }
  ],
  accessibility: {
    canvasSummary: "Diagram illustrating the 4-step GradientTape training loop: mini-batch sampling, forward pass logits, loss calculation, backward automatic differentiation, and optimizer weight update.",
    keyboardHelp: "Use Arrow keys to adjust Epoch and Step sliders, and Tab to switch between controls."
  }
};
