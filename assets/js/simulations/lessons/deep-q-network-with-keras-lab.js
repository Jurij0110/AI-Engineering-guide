export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-6-intro-to-reinforcement-learning-with-keras/deep-q-network-with-keras-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-6-intro-to-reinforcement-learning-with-keras",
  title: "Deep Q-Network with Keras Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/5-Deep_Q_Network_with_Keras_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "DeepQNetworkLab",
  learningObjectives: [
    "Construct a dual-network Deep Q-Network agent in Keras comprising primary and target networks for CartPole-v1.",
    "Implement the experience replay mechanism with collections.deque to store transitions and sample mini-batches of size 64.",
    "Execute epsilon-greedy policy decay from 1.0 to 0.01 and observe the agent explore and approach the 200 consecutive time steps modeled reference target."
  ],
  prerequisites: [
    "Deep Q-Networks architecture and theoretical foundations",
    "Keras Dense layer construction and Mean Squared Error compilation",
    "Gymnasium / Gym CartPole environment dynamics"
  ],
  scenario: {
    description: "Hands-on lab experimentation with the CartPole-v1 DQN training loop. Test the impact of target synchronization intervals, epsilon decay rates, and training duration to stabilize CartPole balancing toward the 200 time steps reference target.",
    seed: 605
  },
  controls: [
    {
      id: "target_network",
      label: "Target Network Architecture",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (Primary + Target Network θ⁻)" },
        { value: "disabled", label: "Disabled (Single Online Network Only)" }
      ]
    },
    {
      id: "replay_buffer",
      label: "Experience Replay Sampling Strategy",
      type: "select",
      default: "uniform_random",
      options: [
        { value: "uniform_random", label: "Uniform Random Mini-batch (Size 64 from deque)" },
        { value: "sequential", label: "Sequential Recent Window (Correlated Stream)" }
      ]
    },
    {
      id: "target_sync_freq",
      label: "Target Network Sync Interval (Episodes)",
      type: "select",
      default: "10",
      options: [
        { value: "5", label: "C = 5 Episodes (Frequent Updates)" },
        { value: "10", label: "C = 10 Episodes (Standard Lab Baseline)" },
        { value: "20", label: "C = 20 Episodes (Slow Target Updates)" },
        { value: "25", label: "C = 25 Episodes (Infrequent / Stale Sync)" }
      ]
    },
    {
      id: "epsilon_decay",
      label: "Epsilon Exploration Annealing",
      type: "select",
      default: "standard_0.995",
      options: [
        { value: "fast_0.95", label: "Fast Decay (0.95 — Rapid Early Exploitation)" },
        { value: "standard_0.995", label: "Standard Lab Decay (0.995 per Episode)" },
        { value: "slow_0.999", label: "Slow Decay (0.999 — Prolonged Exploration)" }
      ]
    },
    {
      id: "episodes_trained",
      label: "Training Epochs (Episodes)",
      type: "select",
      default: "250",
      options: [
        { value: "20", label: "20 Episodes (Initial Exploration, ε ≈ 0.90)" },
        { value: "50", label: "50 Episodes (Early Policy Learning, ε ≈ 0.78)" },
        { value: "100", label: "100 Episodes (Intermediate Policy, ε ≈ 0.60)" },
        { value: "250", label: "250 Episodes (Near 200-Step Reference)" },
        { value: "500", label: "500 Episodes (Asymptotic Convergence, ε = 0.01)" }
      ]
    }
  ],
  views: [
    {
      type: "dual-network-diagram",
      title: "CartPole DQN Architecture and Replay State",
      bindings: ["target_network", "replay_buffer", "target_sync_freq"]
    },
    {
      type: "metric-cards",
      title: "CartPole Performance Metrics",
      bindings: ["cartpole-score", "mse-loss", "current-epsilon", "status"]
    }
  ],
  explanationRules: [
    {
      when: "target_network === 'enabled' && replay_buffer === 'uniform_random' && episodes_trained === '250'",
      summary: "Reference Target Approached",
      detail: "By episode 250 with stable target network updates and decorrelated replay sampling, the policy approaches the 200 consecutive time steps reference target."
    },
    {
      when: "target_network === 'disabled'",
      summary: "Moving Target Divergence in Lab",
      detail: "Without setting target_model weights from model, Bellman targets shift continually, causing pole balance failure within 20 steps."
    }
  ],
  presets: [
    {
      id: "reference-target-200",
      label: "CartPole 200-Step Reference Target",
      values: {
        target_network: "enabled",
        replay_buffer: "uniform_random",
        target_sync_freq: "10",
        epsilon_decay: "standard_0.995",
        episodes_trained: "250"
      }
    },
    {
      id: "early-exploration",
      label: "Early Exploration Stage",
      values: {
        target_network: "enabled",
        replay_buffer: "uniform_random",
        target_sync_freq: "10",
        epsilon_decay: "standard_0.995",
        episodes_trained: "20"
      }
    },
    {
      id: "stale-target-sync",
      label: "Infrequent Target Sync (C=25)",
      values: {
        target_network: "enabled",
        replay_buffer: "uniform_random",
        target_sync_freq: "25",
        epsilon_decay: "standard_0.995",
        episodes_trained: "250"
      }
    }
  ],
  challenge: {
    prompt: "Configure the DQN agent with standard target sync (C=10), uniform random replay, and 250 episodes to approach the 200-step reference target.",
    success: {
      target_network: "enabled",
      replay_buffer: "uniform_random",
      target_sync_freq: "10",
      episodes_trained: "250"
    }
  },
  quiz: [
    {
      question: "In the CartPole DQN lab, what criterion corresponds to the modeled reference target for CartPole-v1 balancing?",
      options: [
        "The pole remains balanced for 200 consecutive time steps without tilting beyond 12 degrees or moving off the screen.",
        "The cart reaches a maximum velocity of 100 meters per second.",
        "The neural network weights reach zero loss on training mini-batches.",
        "The agent collects at least 1,000,000 experience tuples in the replay buffer."
      ],
      correctIndex: 0,
      explanation: "CartPole-v1 grants a reward of +1 for every step the pole stays upright (angle < 12 degrees and cart position < 2.4). Sustaining balance for 200 time steps signifies reaching the modeled reference target used for visual evaluation."
    },
    {
      question: "In the lab code, how are the target Q-network weights updated from the primary model?",
      options: [
        "Periodically copying the primary model weights via `target_model.set_weights(primary_model.get_weights())` every C episodes.",
        "Computing backpropagation gradients directly on the target network using Adam optimizer.",
        "Re-initializing the target network randomly whenever reward drops below 50.",
        "Averaging the predictions of the primary and target networks at every single step."
      ],
      correctIndex: 0,
      explanation: "The target network weights are frozen during gradient steps and periodically synchronized by calling `target_model.set_weights(model.get_weights())` every C episodes to hold target values stationary."
    },
    {
      question: "What data structure is used to implement the experience replay buffer in the lab, and what is its maximum length?",
      options: [
        "A `collections.deque` with `maxlen=2000`.",
        "A standard Python set with unbounded size.",
        "A NumPy 2D array of fixed shape (50, 4).",
        "A SQLite database storing serialized JSON frames."
      ],
      correctIndex: 0,
      explanation: "The lab instantiates `self.memory = deque(maxlen=2000)`. When full, appending a new transition automatically discards the oldest element (FIFO queue behavior), capping memory usage."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive CartPole Deep Q-Network training lab showing primary-target weight synchronization, epsilon decay annealing, and the 200-step reference balance trajectory.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to adjust training episodes, target sync frequencies, and epsilon decay rates."
  }
};
