export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/tensorflow-for-model-optimization",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Tensorflow for Model Optimization",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/8-Tensorflow_for_Model_Optimization.txt",
  sourceFormat: "txt",
  engine: "DistillationOptimizationLab",
  learningObjectives: [
    "Synthesize the deployment advantages of optimized deep learning models: reduced latency, minimal memory bandwidth, and power-efficient edge execution.",
    "Formulate the Knowledge Distillation paradigm, constructing compact student models trained to match softened teacher probability distributions.",
    "Tune the softmax temperature parameter T to expose rich inter-class structural dark knowledge, enabling a 4x smaller student to preserve >99% of teacher accuracy."
  ],
  prerequisites: [
    "Keras model definition and custom training loops with GradientTape",
    "Softmax cross-entropy and probability distributions"
  ],
  scenario: {
    description: "Simulate Knowledge Distillation where a lightweight student network (32 units) learns from an overparameterized teacher network (128 units). Adjust temperature T to soften teacher logits and observe how dark knowledge preserves near-teacher performance with 75% fewer weights.",
    seed: 507
  },
  controls: [
    {
      id: "training_mode",
      label: "Student Training Strategy",
      type: "select",
      default: "distillation",
      options: [
        { value: "distillation", label: "Knowledge Distillation (Match Softened Teacher Logits)" },
        { value: "scratch_hard_labels", label: "Train from Scratch (Hard 1-Hot Labels Only)" }
      ]
    },
    {
      id: "temperature",
      label: "Distillation Temperature (T)",
      type: "select",
      default: "3",
      options: [
        { value: "1", label: "T = 1 (Standard Softmax, Near One-Hot)" },
        { value: "2", label: "T = 2 (Moderate Softening)" },
        { value: "3", label: "T = 3 (Optimal MNIST Dark Knowledge)" },
        { value: "5", label: "T = 5 (High Softening)" },
        { value: "8", label: "T = 8 (Diffuse Softmax, Weak Signal)" }
      ]
    },
    {
      id: "student_units",
      label: "Student Hidden Layer Capacity",
      type: "select",
      default: "32",
      options: [
        { value: "16", label: "16 Units (12,730 params, 8.0x compression)" },
        { value: "32", label: "32 Units (25,450 params, 4.0x compression - Lesson)" },
        { value: "64", label: "64 Units (50,890 params, 2.0x compression)" }
      ]
    },
    {
      id: "precision",
      label: "Execution Precision Policy",
      type: "select",
      default: "mixed_float16",
      options: [
        { value: "float32", label: "Standard float32" },
        { value: "mixed_float16", label: "mixed_float16 (16-bit Tensor Core Speedup)" }
      ]
    }
  ],
  views: [
    {
      type: "distill-view",
      title: "Teacher-Student Distillation Flow & Soft Probabilities",
      bindings: ["training_mode", "temperature", "student_units", "precision"]
    },
    {
      type: "metric-cards",
      title: "Distillation Performance",
      bindings: ["student-acc", "retention", "compression", "speedup"]
    }
  ],
  explanationRules: [
    {
      when: "training_mode === 'distillation' && temperature === '3' && student_units === '32' && precision === 'mixed_float16'",
      summary: "Optimal Knowledge Distillation Target",
      detail: "At T=3, the teacher's softened probabilities reveal that digit '7' shares latent geometric features with digits '1' and '9'. The 32-unit student model absorbs this dark knowledge, achieving 97.4% accuracy (retaining 99.2% of teacher performance) while running 3.9x faster in mixed_float16."
    },
    {
      when: "training_mode === 'scratch_hard_labels'",
      summary: "Hard Label Capacity Bottleneck",
      detail: "Without soft teacher targets, the small student network lacks sufficient parameters to infer rich decision boundaries from rigid 1-hot labels alone, plateauing at only 93.8% accuracy."
    }
  ],
  presets: [
    {
      id: "optimal-distillation",
      label: "Optimal Distillation (T=3, 32 Units, FP16)",
      values: { training_mode: "distillation", temperature: "3", student_units: "32", precision: "mixed_float16" },
      teachingPoint: "Demonstrates high accuracy retention (97.4%) with 4x smaller model and FP16 speedup."
    },
    {
      id: "hard-labels-baseline",
      label: "Scratch Training (Hard Labels)",
      values: { training_mode: "scratch_hard_labels", temperature: "1", student_units: "32", precision: "float32" },
      teachingPoint: "Highlights accuracy penalty when a small model trains without dark knowledge guidance."
    },
    {
      id: "diffuse-temperature",
      label: "Over-Softened Temperature (T=8)",
      values: { training_mode: "distillation", temperature: "8", student_units: "32", precision: "mixed_float16" },
      teachingPoint: "Excessive temperature washes out the signal into uniform probabilities, reducing distillation efficacy."
    }
  ],
  challenge: {
    prompt: "Configure Knowledge Distillation with temperature T=3, 32 student units, and mixed_float16 precision to retain over 99% of teacher accuracy with a 4x parameter reduction.",
    success: { training_mode: "distillation", temperature: "3", student_units: "32", precision: "mixed_float16" },
    hints: [
      "Set Student Training Strategy to Knowledge Distillation.",
      "Set Distillation Temperature to 3.",
      "Select 32 Units for Student Hidden Layer Capacity.",
      "Choose mixed_float16 for Execution Precision Policy."
    ]
  },
  quiz: [
    {
      prompt: "In Knowledge Distillation, what is meant by 'dark knowledge' in the teacher's output?",
      choices: [
        "The small non-zero probabilities assigned to incorrect classes (e.g. probability that an image of a 7 resembles a 1 or a 9), which encode geometric and structural relationships discovered by the teacher.",
        "Weights stored in unencrypted memory blocks.",
        "Undocumented hyperparameters inside TensorFlow C++ core.",
        "Negative eigenvalues of the Hessian matrix."
      ],
      answer: 0,
      explanation: "Hard one-hot labels only indicate the ground truth. Softened teacher distributions reveal that certain incorrect classes share strong feature correlations, providing rich guidance for small student models."
    },
    {
      prompt: "Why is the temperature parameter T divided into logits before applying softmax: p_i = exp(z_i / T) / sum(exp(z_j / T))?",
      choices: [
        "Dividing by T > 1 smooths out the probability distribution across all classes, preventing one dominant logit from driving all other class probabilities to zero.",
        "To prevent GPU thermal throttling.",
        "Because temperatures below 1 cause NaN division in Python.",
        "To convert the cross-entropy loss into mean squared error."
      ],
      answer: 0,
      explanation: "Standard softmax exponentiates raw logits, making the highest logit approach 1.0 while squashing secondary classes to 0.0. A temperature T > 1 flattens logits, exposing inter-class relationships."
    }
  ],
  accessibility: {
    canvasSummary: "Diagram illustrating the Teacher-to-Student distillation pipeline with temperature scaling, alongside a class probability distribution chart for sample digit 7.",
    keyboardHelp: "Use Tab to navigate controls and Arrow keys to adjust temperature and student model capacity."
  }
};
