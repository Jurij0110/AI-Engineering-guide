export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-6-intro-to-reinforcement-learning-with-keras/deep-q-networks-with-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-6-intro-to-reinforcement-learning-with-keras",
  title: "Deep Q-Networks with Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/4-Deep_Q_Networks_with_Keras.txt",
  sourceFormat: "txt",
  engine: "DeepQNetworkLab",
  learningObjectives: [
    "Analyze why tabular Q-learning fails in continuous or high-dimensional state spaces and how deep neural networks act as non-linear Q-value function approximators.",
    "Explain the moving-target instability problem in deep Q-learning and how a dedicated, frozen Target Network stabilizes TD target computation.",
    "Evaluate how Experience Replay decorrelates sequential transitions and satisfies the independent and identically distributed (IID) assumption required for stable neural network training."
  ],
  prerequisites: [
    "Q-learning algorithm and Bellman optimality equation",
    "Keras Sequential model architecture (Dense layers, ReLU activation)"
  ],
  scenario: {
    description: "Simulate the training dynamics of a Deep Q-Network (DQN) balancing CartPole-v1. Test how disabling the Target Network causes moving-target oscillations, how sequential replay breaks training stability, and how combining both achieves reliable convergence.",
    seed: 604
  },
  controls: [
    {
      id: "target_network",
      label: "Target Network Mechanism",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (Frozen θ⁻ with Periodic Sync)" },
        { value: "disabled", label: "Disabled (Single Network Chasing Moving Target)" }
      ]
    },
    {
      id: "replay_buffer",
      label: "Experience Replay Sampling",
      type: "select",
      default: "uniform_random",
      options: [
        { value: "uniform_random", label: "Uniform Random Sampling (Decorrelated Mini-Batches)" },
        { value: "sequential", label: "Sequential Recent Sampling (Correlated Transitions)" }
      ]
    },
    {
      id: "target_sync_freq",
      label: "Target Sync Frequency (C Episodes)",
      type: "select",
      default: "10",
      options: [
        { value: "5", label: "C = 5 Episodes (Frequent Target Updates)" },
        { value: "10", label: "C = 10 Episodes (Standard Frozen Target)" },
        { value: "20", label: "C = 20 Episodes (Slow / Stale Sync)" }
      ]
    },
    {
      id: "epsilon_decay",
      label: "Exploration Decay Rate (ε)",
      type: "select",
      default: "standard_0.995",
      options: [
        { value: "fast_0.95", label: "Fast Decay (0.95 — Early Pure Exploitation)" },
        { value: "standard_0.995", label: "Standard Decay (0.995 — Balanced Annealing)" },
        { value: "slow_0.999", label: "Slow Decay (0.999 — Prolonged Exploration)" }
      ]
    },
    {
      id: "episodes_trained",
      label: "Training Progress (Episodes)",
      type: "select",
      default: "100",
      options: [
        { value: "20", label: "20 Episodes (Initial Random Exploration)" },
        { value: "50", label: "50 Episodes (Mid-Early Learning)" },
        { value: "100", label: "100 Episodes (Trained Policy)" },
        { value: "250", label: "250 Episodes (Near 200-Step Reference)" }
      ]
    }
  ],
  views: [
    {
      type: "dual-network-diagram",
      title: "DQN Dual Network Architecture & Replay Buffer",
      bindings: ["target_network", "replay_buffer", "target_sync_freq"]
    },
    {
      type: "metric-cards",
      title: "CartPole Convergence Metrics",
      bindings: ["cartpole-score", "mse-loss", "current-epsilon", "status"]
    }
  ],
  explanationRules: [
    {
      when: "target_network === 'enabled' && replay_buffer === 'uniform_random'",
      summary: "Stable DQN Learning Dynamics",
      detail: "The frozen target network stabilizes Bellman target values while uniform random experience replay decorrelates training samples, allowing gradient descent to converge smoothly."
    },
    {
      when: "target_network === 'disabled'",
      summary: "Moving Target Instability",
      detail: "Updating network weights also alters the target values, creating high oscillation and feedback loops akin to a dog chasing its own tail."
    },
    {
      when: "replay_buffer === 'sequential'",
      summary: "Temporal Correlation Degradation",
      detail: "Sequential transitions violate the independent and identically distributed (IID) assumption, driving the policy toward localized overfitting."
    }
  ],
  presets: [
    {
      id: "stable-dqn",
      label: "Stable Dual-Network DQN",
      values: {
        target_network: "enabled",
        replay_buffer: "uniform_random",
        target_sync_freq: "10",
        epsilon_decay: "standard_0.995",
        episodes_trained: "250"
      }
    },
    {
      id: "moving-target-bug",
      label: "Moving-Target Instability",
      values: {
        target_network: "disabled",
        replay_buffer: "uniform_random",
        target_sync_freq: "10",
        epsilon_decay: "standard_0.995",
        episodes_trained: "100"
      }
    },
    {
      id: "correlated-drift",
      label: "Correlated Replay Drift",
      values: {
        target_network: "enabled",
        replay_buffer: "sequential",
        target_sync_freq: "10",
        epsilon_decay: "standard_0.995",
        episodes_trained: "100"
      }
    }
  ],
  challenge: {
    prompt: "Configure a fully stabilized DQN with both the Target Network and Uniform Random Experience Replay enabled over 250 episodes to achieve CartPole balance stability.",
    success: {
      target_network: "enabled",
      replay_buffer: "uniform_random",
      episodes_trained: "250"
    }
  },
  quiz: [
    {
      question: "Why does standard deep neural network training struggle with direct consecutive reinforcement learning experiences without an experience replay buffer?",
      options: [
        "Consecutive experiences are highly temporally correlated, violating the independent and identically distributed (IID) assumption of gradient descent.",
        "Neural networks cannot compute gradients when experience buffers store more than 10 samples.",
        "Sequential experiences prevent the network from calculating the Bellman discount factor.",
        "CartPole requires tabular state discretization before backpropagation can occur."
      ],
      correctIndex: 0,
      explanation: "RL transitions collected sequentially from consecutive time steps exhibit strong autocorrelation. Experience replay stores transitions in a circular buffer (D) and randomly samples mini-batches, decorrelating inputs to satisfy gradient descent assumptions."
    },
    {
      question: "What problem does having a separate, frozen Target Network solve in DQN?",
      options: [
        "The moving-target problem, where updating network weights simultaneously changes the target values the network is attempting to fit.",
        "It allows the agent to skip epsilon-greedy exploration completely.",
        "It increases the number of trainable parameters by 10x to prevent underfitting.",
        "It replaces the loss function with an analytical closed-form solution."
      ],
      correctIndex: 0,
      explanation: "In vanilla Q-learning with neural networks, the target r + gamma * max Q(s', a'; theta) depends on the same parameter vector theta being updated. This causes unstable feedback loops. A frozen target network theta- holds targets stationary for C steps."
    },
    {
      question: "In the DQN architecture presented in the lesson, what are the dimensions of the input and output layers for CartPole-v1?",
      options: [
        "4 input nodes (cart position, velocity, pole angle, angular velocity) and 2 output nodes (action 0: push left, action 1: push right).",
        "2 input nodes and 4 output nodes.",
        "16 input nodes (discretized state bins) and 1 output scalar value.",
        "100 input nodes representing video frames and 2 output probabilities summing to 1."
      ],
      correctIndex: 0,
      explanation: "CartPole-v1 produces a 4-dimensional continuous state vector [x, x_dot, theta, theta_dot] and takes 2 discrete actions: push left (0) or push right (1). The Q-network outputs predicted Q-values for each action."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive Deep Q-Network simulator showing dual-network architecture with primary and target networks, replay buffer sampling, and CartPole episode balance curve.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to toggle target networks, replay buffers, and sync frequency."
  }
};
