export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-5-advanced-keras-techniques/hyperparameter-tuning-with-keras-tuner-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-5-advanced-keras-techniques",
  title: "Hyperparameter Tuning with Keras Tuner Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/6-Hyperparameter_Tuning_with_Keras_Tuner_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "KerasTunerLab",
  learningObjectives: [
    "Execute an end-to-end hyperparameter tuning pipeline on the MNIST dataset using Keras Tuner RandomSearch.",
    "Implement a model-building function build_model(hp) defining searchable dense units (32-512) and learning rates (1e-4 - 1e-2).",
    "Analyze tuner.results_summary() to identify the winning configuration (Trial 04: 128 units, lr=1.73e-4) achieving 92.55% validation accuracy."
  ],
  prerequisites: [
    "MNIST normalization and train/validation partitioning",
    "Understanding of Keras Tuner objective metrics (val_accuracy)"
  ],
  scenario: {
    description: "Replicate the 10-trial MNIST tuning search conducted in the notebook lab. Compare all 10 trials, evaluate search execution duration (~19m 03s), and extract the best hyperparameters using tuner.get_best_hyperparameters().",
    seed: 505
  },
  controls: [
    {
      id: "algorithm",
      label: "Search Algorithm (Lab: RandomSearch)",
      type: "select",
      default: "random_search",
      options: [
        { value: "random_search", label: "kt.RandomSearch (Lab Setting)" },
        { value: "hyperband", label: "kt.Hyperband" },
        { value: "bayesian", label: "kt.BayesianOptimization" }
      ]
    },
    {
      id: "max_trials",
      label: "Number of Trials",
      type: "select",
      default: "10",
      options: [
        { value: "5", label: "5 Trials" },
        { value: "10", label: "10 Trials (Full Lab Run)" }
      ]
    },
    {
      id: "executions_per_trial",
      label: "Executions Per Trial",
      type: "select",
      default: "2",
      options: [
        { value: "1", label: "1 Execution" },
        { value: "2", label: "2 Executions (Lab Setting)" }
      ]
    },
    {
      id: "selected_trial",
      label: "Inspected Lab Trial",
      type: "select",
      default: "trial_04",
      options: [
        { value: "best", label: "Best Overall (Top Rank)" },
        { value: "trial_04", label: "Trial 04 (Winning: 128u, lr=1.73e-4, 92.55%)" },
        { value: "trial_03", label: "Trial 03 (Runner-up: 128u, lr=1.35e-4, 92.39%)" },
        { value: "trial_00", label: "Trial 00 (Rank 3: 256u, lr=3.47e-4, 92.33%)" },
        { value: "trial_05", label: "Trial 05 (Suboptimal: 288u, lr=2.26e-3, 88.26%)" }
      ]
    }
  ],
  views: [
    {
      type: "keras-tuner-lab-view",
      title: "Lab Hyperparameter Landscape & Results Summary",
      bindings: ["algorithm", "max_trials", "executions_per_trial", "selected_trial"]
    },
    {
      type: "metric-cards",
      title: "Winning Hyperparameters",
      bindings: ["best-score", "best-units", "best-lr", "elapsed-time"]
    }
  ],
  explanationRules: [
    {
      when: "algorithm === 'random_search' && max_trials === '10' && executions_per_trial === '2' && selected_trial === 'trial_04'",
      summary: "Lab Target Configuration Replicated",
      detail: "In the notebook, Trial 04 achieved the top validation score of 92.545% after 19m 03s of total search. Moderately sized hidden layer (128 units) combined with a conservative learning rate (0.000173) prevented overfitting while facilitating smooth Adam convergence."
    },
    {
      when: "selected_trial === 'trial_05'",
      summary: "High Learning Rate Degradation",
      detail: "Trial 05 selected a high learning rate (0.00226) with 288 units, leading to parameter oscillation and a lower validation accuracy of 88.26%."
    }
  ],
  presets: [
    {
      id: "lab-winning-trial",
      label: "Lab Winning Configuration (Trial 04)",
      values: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2", selected_trial: "trial_04" },
      teachingPoint: "Inspects the exact top trial found in the lab: 128 units, lr=1.73e-4, score=92.55%."
    },
    {
      id: "lab-runner-up",
      label: "Lab Runner-Up (Trial 03)",
      values: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2", selected_trial: "trial_03" },
      teachingPoint: "Demonstrates consistent performance around 128 units with lr=1.35e-4 achieving 92.39%."
    },
    {
      id: "suboptimal-trial",
      label: "Suboptimal High LR (Trial 05)",
      values: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2", selected_trial: "trial_05" },
      teachingPoint: "Shows how excessive learning rate impairs validation accuracy."
    }
  ],
  challenge: {
    prompt: "Replicate the lab results by configuring RandomSearch with 10 trials, 2 executions per trial, and inspect Trial 04 to verify the winning validation accuracy exceeds 92.5%.",
    success: { algorithm: "random_search", max_trials: "10", executions_per_trial: "2", selected_trial: "trial_04" },
    hints: [
      "Select kt.RandomSearch for the search algorithm.",
      "Set Number of Trials to 10 and Executions Per Trial to 2.",
      "Choose Trial 04 under Inspected Lab Trial."
    ]
  },
  quiz: [
    {
      prompt: "After completing the tuner search, how does the notebook instantiate the final optimized model?",
      choices: [
        "best_hps = tuner.get_best_hyperparameters(num_trials=1)[0]; model = tuner.hypermodel.build(best_hps)",
        "model = tf.keras.models.load_best_checkpoint()",
        "model = build_model(hp=None)",
        "model = tuner.export_tflite_weights()"
      ],
      answer: 0,
      explanation: "tuner.get_best_hyperparameters()[0] retrieves the optimal HyperParameters container, and tuner.hypermodel.build(best_hps) instantiates the compiled architecture ready for final training."
    },
    {
      prompt: "In Exercise 3 of the lab, what directory structure does Keras Tuner create to persist trial logs and checkpoints?",
      choices: [
        "A directory hierarchy matching directory/project_name (e.g. my_dir/intro_to_kt/trial_XX).",
        "A single SQLite database file in /tmp.",
        "A hidden Git branch.",
        "It stores all data exclusively in browser cookies."
      ],
      answer: 0,
      explanation: "Keras Tuner structures results on disk under directory/project_name, creating subfolders for each trial with json logs and model weight checkpoints."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive scatter plot representing all 10 trials from the MNIST Keras Tuner lab alongside a leaderboard highlighting Trial 04 as the top performer.",
    keyboardHelp: "Use Tab to navigate controls and Arrow keys to switch between trials."
  }
};
