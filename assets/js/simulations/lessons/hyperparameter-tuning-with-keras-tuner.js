export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/hyperparameter-tuning-with-keras-tuner",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Hyperparameter Tuning with Keras Tuner",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/4-Hyperparameter_Tuning_with_Keras_Tuner.txt",
  sourceFormat: "txt",
  engine: "KerasTunerLab",
  learningObjectives: [
    "Distinguish model parameters learned via backpropagation from hyperparameters configured prior to training.",
    "Formulate search spaces in Keras Tuner using hp.Int (integer ranges and step sizes) and hp.Float (logarithmic continuous sampling).",
    "Configure kt.RandomSearch tuners with max_trials, executions_per_trial, and validation objective targets."
  ],
  prerequisites: [
    "Keras Sequential modeling and model compilation",
    "Understanding of validation metrics and overfitting"
  ],
  scenario: {
    description: "Explore hyperparameter optimization using Keras Tuner. Evaluate how search algorithms (RandomSearch, Hyperband, Bayesian) discover optimal neuron counts and learning rates over the validation accuracy objective.",
    seed: 504
  },
  controls: [
    {
      id: "algorithm",
      label: "Tuning Search Algorithm",
      type: "select",
      default: "random_search",
      options: [
        { value: "random_search", label: "Random Search (kt.RandomSearch)" },
        { value: "hyperband", label: "Hyperband (kt.Hyperband)" },
        { value: "bayesian", label: "Bayesian Optimization (kt.BayesianOptimization)" }
      ]
    },
    {
      id: "max_trials",
      label: "Maximum Search Trials",
      type: "select",
      default: "10",
      options: [
        { value: "5", label: "5 Trials (Quick Exploratory Search)" },
        { value: "10", label: "10 Trials (Lesson Standard)" }
      ]
    },
    {
      id: "executions_per_trial",
      label: "Executions Per Trial",
      type: "select",
      default: "2",
      options: [
        { value: "1", label: "1 Execution (Faster, noisy)" },
        { value: "2", label: "2 Executions (Reduces stochastic variance)" }
      ]
    }
  ],
  views: [
    {
      type: "keras-tuner-space",
      title: "Hyperparameter Search Space & Leaderboard",
      bindings: ["algorithm", "max_trials", "executions_per_trial"]
    },
    {
      type: "metric-cards",
      title: "Search Results Summary",
      bindings: ["best-score", "best-units", "best-lr", "elapsed-time"]
    }
  ],
  explanationRules: [
    {
      when: "algorithm === 'random_search' && max_trials === '10' && executions_per_trial === '2'",
      summary: "Lesson Standard Search Configuration",
      detail: "Testing 10 configurations with 2 executions each evaluates a diverse cross-section of the search space, isolating Trial 04 (128 units, lr=1.73e-4) as the top performer at 92.55% validation accuracy."
    },
    {
      when: "executions_per_trial === '1'",
      summary: "Single Execution Noise Risk",
      detail: "Running only 1 execution per trial halves search duration, but makes trial scores vulnerable to random weight initialization variance."
    }
  ],
  presets: [
    {
      id: "course-standard-search",
      label: "Course Standard (10 Trials, 2 Executions)",
      values: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2" },
      teachingPoint: "Standard 10-trial setup balancing coverage with stochastic noise reduction."
    },
    {
      id: "quick-exploratory",
      label: "Exploratory (5 Trials, 1 Execution)",
      values: { algorithm: "random_search", max_trials: "5", executions_per_trial: "1" },
      teachingPoint: "Rapid initial sweep with minimal computational budget."
    },
    {
      id: "bayesian-optimization",
      label: "Bayesian Optimization",
      values: { algorithm: "bayesian", max_trials: "10", executions_per_trial: "2" },
      teachingPoint: "Builds a probabilistic surrogate model to direct trial sampling toward high-accuracy regions."
    }
  ],
  challenge: {
    prompt: "Configure Keras Tuner with Random Search, 10 trials, and 2 executions per trial to discover the optimal validation accuracy configuration.",
    success: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2" },
    hints: [
      "Set Tuning Search Algorithm to Random Search.",
      "Select 10 Trials for Maximum Search Trials.",
      "Set Executions Per Trial to 2."
    ]
  },
  quiz: [
    {
      prompt: "Why is hp.Float('learning_rate', min_value=1e-4, max_value=1e-2, sampling='LOG') sampled logarithmically?",
      choices: [
        "Because orders of magnitude (e.g. 0.0001 vs 0.001 vs 0.01) matter far more for gradient descent stability than linear increments like 0.005 vs 0.006.",
        "Because logarithms prevent memory leaks in TensorFlow.",
        "Because Python floats cannot be sampled linearly.",
        "Because logarithmic sampling forces all weights to be integers."
      ],
      answer: 0,
      explanation: "Learning rates operate multiplicatively on weight updates; logarithmic sampling ensures equal exploration across each decade/order of magnitude."
    },
    {
      prompt: "What is the key purpose of setting executions_per_trial=2 in kt.RandomSearch?",
      choices: [
        "It trains the exact same hyperparameter configuration multiple times and averages the results to reduce the bias and variance introduced by random initialization.",
        "It doubles the number of epochs automatically.",
        "It converts the model into an ensemble of two distinct architectures.",
        "It runs one execution on CPU and the second on TPU."
      ],
      answer: 0,
      explanation: "Deep learning training contains stochasticity (random weight initialization, mini-batch shuffling). Averaging across executions ensures high scores reflect superior hyperparameters rather than fortunate random seeds."
    }
  ],
  accessibility: {
    canvasSummary: "Hyperparameter search space visualization showing units versus learning rate scatter points alongside a leaderboard of top-performing trials.",
    keyboardHelp: "Use Tab to navigate options and Enter or Space to toggle search algorithm and trial count."
  }
};
