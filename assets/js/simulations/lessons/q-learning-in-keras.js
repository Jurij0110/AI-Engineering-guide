export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-6-intro-to-reinforcement-learning-with-keras/q-learning-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-6-intro-to-reinforcement-learning-with-keras",
  title: "Q-Learning in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/2-Q_Learning_in_Keras.txt",
  sourceFormat: "txt",
  engine: "QLearningLab",
  learningObjectives: [
    "Define the Q-value function Q(s, a) as the expected cumulative utility of selecting action a in state s.",
    "Formulate and compute the Bellman temporal difference update: Q(s, a) += alpha * [r + gamma * max(Q(s', a')) - Q(s, a)].",
    "Analyze the balance between exploration and exploitation via the epsilon-greedy policy and observe Q-table convergence."
  ],
  prerequisites: [
    "Markov Decision Process fundamentals",
    "Basics of gradient optimization and array indexing"
  ],
  scenario: {
    description: "Simulate the fundamental Q-learning algorithm by decomposing the Bellman equation step-by-step. Track how immediate rewards and discounted future expectations update state-action utilities in an interactive Q-table.",
    seed: 602
  },
  controls: [
    {
      id: "current_state",
      label: "Current Environment State (s)",
      type: "select",
      default: "s1_slight_tilt",
      options: [
        { value: "s0_balanced", label: "s0: Centered & Balanced" },
        { value: "s1_slight_tilt", label: "s1: Slight Right Tilt (Needs Right Push)" },
        { value: "s2_falling", label: "s2: Severe Right Fall (High Risk)" },
        { value: "s3_edge", label: "s3: Boundary Edge (Terminal Danger)" }
      ]
    },
    {
      id: "selected_action",
      label: "Selected Action (a)",
      type: "select",
      default: "push_right",
      options: [
        { value: "push_right", label: "Action 1: Push Cart Right" },
        { value: "push_left", label: "Action 0: Push Cart Left" }
      ]
    },
    {
      id: "learning_rate",
      label: "Learning Rate (α)",
      type: "select",
      default: "0.1",
      options: [
        { value: "0.01", label: "α = 0.01 (Very Slow Incremental Update)" },
        { value: "0.1", label: "α = 0.1 (Standard Stable Learning Rate)" },
        { value: "0.25", label: "α = 0.25 (Aggressive Value Adaptation)" },
        { value: "0.5", label: "α = 0.5 (Fast but Volatile Updates)" }
      ]
    },
    {
      id: "discount_factor",
      label: "Discount Factor (γ)",
      type: "select",
      default: "0.95",
      options: [
        { value: "0.5", label: "γ = 0.5 (Short-Term Utility Focus)" },
        { value: "0.8", label: "γ = 0.8 (Moderate Horizon)" },
        { value: "0.95", label: "γ = 0.95 (Standard Long-Horizon Value)" },
        { value: "0.99", label: "γ = 0.99 (High Future Weighting)" }
      ]
    },
    {
      id: "exploration_epsilon",
      label: "Exploration Rate (ε)",
      type: "select",
      default: "0.2",
      options: [
        { value: "0.01", label: "ε = 0.01 (Exploitation: 99% Greedy)" },
        { value: "0.2", label: "ε = 0.2 (Balanced: 20% Random / 80% Greedy)" },
        { value: "0.5", label: "ε = 0.5 (High Exploration: 50% Random)" },
        { value: "1.0", label: "ε = 1.0 (Initial Pure Random Exploration)" }
      ]
    },
    {
      id: "training_mode",
      label: "Update Mechanism",
      type: "select",
      default: "tabular_bellman",
      options: [
        { value: "tabular_bellman", label: "Direct Tabular Bellman Update" },
        { value: "cartpole_replay", label: "CartPole Experience Replay" }
      ]
    }
  ],
  views: [
    {
      type: "q-learning-decomposition",
      title: "Bellman TD Error & Q-Table Heatmap",
      bindings: ["current_state", "selected_action", "learning_rate", "discount_factor", "exploration_epsilon", "training_mode"]
    },
    {
      type: "metric-cards",
      title: "Bellman Update Metrics",
      bindings: ["td-target", "td-error", "updated-q", "survival-score"]
    }
  ],
  explanationRules: [
    {
      when: "current_state === 's1_slight_tilt' && selected_action === 'push_right'",
      summary: "Optimal Counter-Balancing Action",
      detail: "Pushing right when tilted right exerts an opposing force that stabilizes the pole back to state s0, yielding a positive reward and high discounted future utility."
    }
  ],
  presets: [
    {
      id: "corrective-balance",
      label: "Corrective Action Update",
      values: { current_state: "s1_slight_tilt", selected_action: "push_right", learning_rate: "0.1", discount_factor: "0.95", exploration_epsilon: "0.2", training_mode: "tabular_bellman" },
      teachingPoint: "Demonstrates positive TD target when taking the stabilizing action to return to balanced state s0."
    },
    {
      id: "suboptimal-action-penalty",
      label: "Suboptimal Action Penalty",
      values: { current_state: "s1_slight_tilt", selected_action: "push_left", learning_rate: "0.1", discount_factor: "0.95", exploration_epsilon: "0.2", training_mode: "tabular_bellman" },
      teachingPoint: "Shows a severe negative TD error when taking the wrong action, dragging the Q-value downwards."
    },
    {
      id: "high-learning-rate",
      label: "High Learning Rate Adaptation",
      values: { current_state: "s2_falling", selected_action: "push_right", learning_rate: "0.5", discount_factor: "0.95", exploration_epsilon: "0.01", training_mode: "tabular_bellman" },
      teachingPoint: "Demonstrates large immediate swings in Q-values when alpha=0.5 overrides old estimates aggressively."
    }
  ],
  challenge: {
    prompt: "Evaluate the Bellman update for state s1 (Slight Right Tilt) taking action 'Push Cart Right' with learning rate α=0.1 and discount factor γ=0.95.",
    success: { current_state: "s1_slight_tilt", selected_action: "push_right", learning_rate: "0.1", discount_factor: "0.95" },
    hints: [
      "Select s1: Slight Right Tilt as the current environment state.",
      "Choose Action 1: Push Cart Right.",
      "Set Learning Rate to α = 0.1 and Discount Factor to γ = 0.95."
    ]
  },
  quiz: [
    {
      prompt: "In the Bellman equation Q(s, a) += α * [r + γ * max(Q(s', a')) - Q(s, a)], what does the term in square brackets represent?",
      choices: [
        "The Temporal Difference (TD) error: the gap between the target estimate and the prior estimate.",
        "The loss gradient with respect to policy entropy.",
        "The probability of choosing an exploratory action.",
        "The total parameter count of the Q-network."
      ],
      answer: 0,
      explanation: "The term [r + gamma * max Q(s', a') - Q(s, a)] is the Temporal Difference error delta. When delta is positive, the actual reward plus expected future return exceeded prior expectation, nudging Q(s, a) higher."
    },
    {
      prompt: "Why is epsilon typically decayed from 1.0 down to a small minimum (e.g. 0.01) during training?",
      choices: [
        "To allow the agent to initially discover state transitions via exploration, then shift toward exploiting learned high-value actions as policies solidify.",
        "To speed up GPU memory allocation in Keras.",
        "Because the Bellman equation only works when epsilon equals zero.",
        "To prevent gradient explosions in dense neural layers."
      ],
      answer: 0,
      explanation: "Starting with high epsilon ensures broad state coverage. Decaying epsilon shifts the agent from exploratory trial-and-error to maximizing returns through greedy exploitation."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive Q-Learning diagram showing 4-step Bellman decomposition cards and a 4-by-2 color-coded state-action Q-table matrix.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to adjust states, actions, learning rates, and exploration parameters."
  }
};
