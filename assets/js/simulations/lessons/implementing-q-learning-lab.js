export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-6-intro-to-reinforcement-learning-with-keras/implementing-q-learning-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-6-intro-to-reinforcement-learning-with-keras",
  title: "Implementing Q-Learning Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/3-Implementing_Q_Learning_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "QLearningLab",
  learningObjectives: [
    "Construct a neural network model in Keras (Dense(24, relu) -> Dense(action_size, linear)) to approximate continuous state Q-values.",
    "Implement an experience replay buffer using collections.deque to store transitions and train on mini-batches.",
    "Evaluate CartPole-v1 pole-balancing performance across training episodes as exploration decays and replay batches stabilize policy updates."
  ],
  prerequisites: [
    "Keras Sequential model construction",
    "OpenAI Gym CartPole environment API"
  ],
  scenario: {
    description: "Analyze the hands-on implementation from the IBM lab notebook: setting up CartPole-v1, building a 2-layer dense Q-network, collecting experiences in a 2,000-element deque buffer, and sampling mini-batches of size 64 to balance the pole.",
    seed: 603
  },
  controls: [
    {
      id: "training_mode",
      label: "Execution Context",
      type: "select",
      default: "cartpole_replay",
      options: [
        { value: "cartpole_replay", label: "CartPole-v1 Experience Replay (Lab Pipeline)" },
        { value: "tabular_bellman", label: "Direct Tabular Bellman Computation" }
      ]
    },
    {
      id: "batch_size",
      label: "Replay Mini-Batch Size",
      type: "select",
      default: "64",
      options: [
        { value: "16", label: "Batch Size 16 (Higher Stochastic Variance)" },
        { value: "32", label: "Batch Size 32 (Moderate Gradient Stability)" },
        { value: "64", label: "Batch Size 64 (IBM Lab Standard: Optimal Replay)" }
      ]
    },
    {
      id: "learning_rate",
      label: "Adam Optimizer Learning Rate",
      type: "select",
      default: "0.01",
      options: [
        { value: "0.01", label: "α = 0.001 / 0.01 (Lab Adam Specification)" },
        { value: "0.1", label: "α = 0.1 (High Learning Rate)" },
        { value: "0.25", label: "α = 0.25 (Aggressive Convergence)" }
      ]
    },
    {
      id: "discount_factor",
      label: "Bellman Discount Factor (γ)",
      type: "select",
      default: "0.95",
      options: [
        { value: "0.8", label: "γ = 0.80 (Shorter Horizon)" },
        { value: "0.95", label: "γ = 0.95 (Lab Target Specification)" },
        { value: "0.99", label: "γ = 0.99 (Extended Credit Assignment)" }
      ]
    },
    {
      id: "exploration_epsilon",
      label: "Current Exploration (ε)",
      type: "select",
      default: "0.01",
      options: [
        { value: "1.0", label: "ε = 1.0 (Episode 1: Random Exploration)" },
        { value: "0.5", label: "ε = 0.5 (Mid-Training Transition)" },
        { value: "0.1", label: "ε = 0.1 (Late-Training Greedy Focus)" },
        { value: "0.01", label: "ε = 0.01 (Evaluation Mode: Pure Exploitation)" }
      ]
    },
    {
      id: "current_state",
      label: "Observed State Angle",
      type: "select",
      default: "s0_balanced",
      options: [
        { value: "s0_balanced", label: "s0: Centered Balance (Near θ=0.0)" },
        { value: "s1_slight_tilt", label: "s1: Angular Velocity Rising (θ=+0.05)" },
        { value: "s2_falling", label: "s2: Terminal Threshold Angle (θ>0.2)" }
      ]
    }
  ],
  views: [
    {
      type: "cartpole-replay-workbench",
      title: "CartPole Experience Replay & Q-Updates",
      bindings: ["training_mode", "batch_size", "learning_rate", "discount_factor", "exploration_epsilon", "current_state"]
    },
    {
      type: "metric-cards",
      title: "Replay & Survival Performance",
      bindings: ["td-target", "td-error", "updated-q", "survival-score"]
    }
  ],
  explanationRules: [
    {
      when: "training_mode === 'cartpole_replay' && batch_size === '64' && exploration_epsilon === '0.01'",
      summary: "Optimal Trained Agent Evaluation",
      detail: "With mini-batch replay of 64 transitions and exploration rate decayed to 0.01, the network produces stable, greedy actions that balance the CartPole across long horizons."
    }
  ],
  presets: [
    {
      id: "lab-standard-evaluation",
      label: "Lab Evaluation Run (ε = 0.01, Batch 64)",
      values: { training_mode: "cartpole_replay", batch_size: "64", learning_rate: "0.01", discount_factor: "0.95", exploration_epsilon: "0.01", current_state: "s0_balanced" },
      teachingPoint: "Demonstrates the final evaluation step from the lab notebook where exploration is turned off and the agent balances stably."
    },
    {
      id: "early-training-exploration",
      label: "Early Training Phase (ε = 1.0, Batch 16)",
      values: { training_mode: "cartpole_replay", batch_size: "16", learning_rate: "0.01", discount_factor: "0.95", exploration_epsilon: "1.0", current_state: "s1_slight_tilt" },
      teachingPoint: "Simulates initial episodes where the agent explores randomly to populate the experience buffer."
    },
    {
      id: "mid-convergence-replay",
      label: "Mid-Training Replay (ε = 0.5, Batch 32)",
      values: { training_mode: "cartpole_replay", batch_size: "32", learning_rate: "0.01", discount_factor: "0.95", exploration_epsilon: "0.5", current_state: "s0_balanced" },
      teachingPoint: "Shows the transition phase as epsilon decays and mini-batch replay refines state-action value estimates."
    }
  ],
  challenge: {
    prompt: "Configure the lab simulation for evaluation mode: CartPole experience replay with batch size 64, discount factor γ=0.95, and minimal exploration ε=0.01.",
    success: { training_mode: "cartpole_replay", batch_size: "64", discount_factor: "0.95", exploration_epsilon: "0.01" },
    hints: [
      "Select CartPole-v1 Experience Replay as the Execution Context.",
      "Choose Batch Size 64 for optimal replay sample diversity.",
      "Set Exploration Rate to ε = 0.01 for evaluation mode."
    ]
  },
  quiz: [
    {
      prompt: "In the IBM CartPole lab, why does the replay() function wait until len(memory) >= batch_size before training?",
      choices: [
        "Because random sampling without replacement requires at least batch_size stored experiences to draw a valid mini-batch.",
        "Because Keras throws an error if fewer than 1,000 samples exist.",
        "Because the CartPole environment only creates rewards after batch_size steps.",
        "Because TensorFlow cannot allocate GPU memory for fewer than 64 floats."
      ],
      answer: 0,
      explanation: "random.sample(memory, batch_size) requires the deque buffer to hold at least batch_size experiences, preventing indexing errors during the initial warm-up phase."
    },
    {
      prompt: "What is the penalty reward assigned in the lab when the pole angle exceeds the terminal threshold (done = True)?",
      choices: [
        "-10 reward to explicitly penalize terminal failure states.",
        "0 reward, treating failure as neutral.",
        "+100 reward to encourage resetting.",
        "-1,000 reward causing immediate gradient resets."
      ],
      answer: 0,
      explanation: "The lab explicitly sets reward = -10 upon episode termination (done = True) so the Q-network learns to strongly avoid boundary angles and angular velocities that cause failure."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive CartPole experience replay simulator showing mini-batch target computations and state-action Q-table convergence.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to adjust batch sizes, exploration rates, and observed states."
  }
};
