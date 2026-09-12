export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/advanced-data-aug-with-keras-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Advanced Data Aug with Keras Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/3-Advanced_Data_Aug_with Keras_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "ImageAugmentationLab",
  learningObjectives: [
    "Implement ImageDataGenerator with feature-wise normalization by fitting it to a dataset (`datagen.fit(x_train)`).",
    "Construct and inject a custom preprocessing function (e.g. Gaussian noise injection) into the Keras data pipeline."
  ],
  prerequisites: [
    "Basic data augmentation transforms",
    "NumPy arrays and Keras ImageDataGenerator flow API"
  ],
  scenario: {
    description: "Lab notebook checkpoint: Combine geometric transformations, custom Gaussian noise injection, and feature-wise normalization to simulate the notebook lab exercises.",
    seed: 3203
  },
  controls: [
    {
      id: "rotation",
      label: "Rotation Range (Degrees)",
      type: "range",
      min: 0,
      max: 90,
      step: 5,
      default: 30
    },
    {
      id: "flip",
      label: "Horizontal Flip",
      type: "select",
      options: [
        { value: "yes", label: "Enabled" },
        { value: "no", label: "Disabled" }
      ],
      default: "yes"
    },
    {
      id: "zoom",
      label: "Zoom Range",
      type: "range",
      min: 0,
      max: 0.5,
      step: 0.05,
      default: 0.25
    },
    {
      id: "shift",
      label: "Shift Range",
      type: "range",
      min: 0,
      max: 0.3,
      step: 0.05,
      default: 0.2
    },
    {
      id: "normalization",
      label: "Normalization Mode",
      type: "select",
      options: [
        { value: "featurewise", label: "Feature-wise (Dataset fitted)" },
        { value: "samplewise", label: "Sample-wise" },
        { value: "rescale", label: "Rescale [0, 1]" }
      ],
      default: "featurewise"
    },
    {
      id: "noise",
      label: "Custom Gaussian Noise (Sigma)",
      type: "range",
      min: 0,
      max: 0.2,
      step: 0.02,
      default: 0.06
    }
  ],
  views: [
    {
      type: "sample-preview",
      title: "Lab Augmented Batch Output",
      bindings: ["rotation", "flip", "zoom", "shift", "noise"]
    },
    {
      type: "distribution-metrics",
      title: "Batch Quality & Normalization",
      bindings: ["diversity", "pixelMean", "pixelStd", "semanticSafe"]
    }
  ],
  explanationRules: [
    {
      when: "normalization === 'featurewise'",
      summary: "Dataset-Level Standard Normalization",
      detail: "datagen.fit(x_train) computes global dataset mean and std deviation, ensuring consistent zero-mean inputs across all batches."
    },
    {
      when: "noise > 0.0",
      summary: "Custom Noise Regularization",
      detail: "Injecting subtle Gaussian noise acts as a regularizer, preventing conv filters from relying on brittle single-pixel high-frequency artifacts."
    }
  ],
  presets: [
    {
      id: "exercise-target",
      label: "Lab Exercise 3: Noise + Feature-wise Normalization",
      values: { rotation: 30, flip: "yes", zoom: 0.25, shift: 0.2, normalization: "featurewise", noise: 0.06 },
      teachingPoint: "Complete lab pipeline: rotation 30°, zoom 0.25, shift 0.2, noise 0.06, and feature-wise centering."
    },
    {
      id: "no-noise-baseline",
      label: "Baseline without Noise",
      values: { rotation: 10, flip: "no", zoom: 0.0, shift: 0.0, normalization: "rescale", noise: 0.0 },
      teachingPoint: "Basic baseline with minimal variability."
    }
  ],
  challenge: {
    prompt: "Configure the lab pipeline with rotation 30, horizontal flip enabled, zoom 0.25, shift 0.2, feature-wise normalization, and noise 0.06.",
    success: { rotation: "30", flip: "yes", zoom: "0.25", shift: "0.2", normalization: "featurewise", noise: "0.06" },
    hints: [
      "Set Rotation to 30.",
      "Enable Flip.",
      "Set Zoom to 0.25 and Shift to 0.2.",
      "Select Feature-wise Normalization.",
      "Set Noise to 0.06."
    ]
  },
  quiz: [
    {
      prompt: "What must be called before using featurewise_center=True with ImageDataGenerator?",
      choices: [
        "datagen.fit(x_train)",
        "model.compile()",
        "model.save()",
        "tf.keras.backend.clear_session()"
      ],
      answer: 0,
      explanation: "datagen.fit(dataset) is required to calculate the global empirical mean and standard deviation across training images."
    },
    {
      prompt: "How can a custom noise injection function be passed to ImageDataGenerator?",
      choices: [
        "Via the preprocessing_function argument",
        "Via the loss argument",
        "Inside the optimizer class",
        "By modifying the GPU driver"
      ],
      answer: 0,
      explanation: "The preprocessing_function parameter takes a callable that receives an image array and returns an augmented image array."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive lab simulation for advanced Keras data augmentation including custom preprocessing and feature-wise statistics.",
    keyboardHelp: "Use Tab and Arrow keys to adjust rotation, flip, zoom, shift, normalization, and noise sliders."
  }
};

