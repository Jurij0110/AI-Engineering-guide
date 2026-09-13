export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-6-intro-to-reinforcement-learning-with-keras/reinforcement-learning-overview",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-6-intro-to-reinforcement-learning-with-keras",
  title: "Reinforcement Learning Overview",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/1-Reinforcement_Learning_Overview.txt",
  sourceFormat: "txt",
  engine: "RLOverviewLab",
  learningObjectives: [
    "Identify the foundational elements of the Markov Decision Process (MDP): Agent, Environment, State, Action, Reward, and Policy.",
    "Explain how an agent's actions impact the environment dynamically and how reward signals reinforce optimal decisions over time.",
    "Analyze the effect of the discount factor (gamma) on cumulative return and understand computational challenges in large state-action spaces."
  ],
  prerequisites: [
    "Basic Python programming",
    "Understanding of supervised vs unsupervised learning paradigms"
  ],
  scenario: {
    description: "Explore the reinforcement learning framework where an autonomous agent interacts with an environment in discrete time steps, observing states, executing actions, receiving rewards, and optimizing a policy to maximize discounted cumulative return.",
    seed: 601
  },
  controls: [
    {
      id: "environment",
      label: "Simulation Environment",
      type: "select",
      default: "cartpole",
      options: [
        { value: "cartpole", label: "CartPole-v1 (Inverted Pendulum Balance)" },
        { value: "gridworld", label: "GridWorld (Navigation to Target)" },
        { value: "lunar_lander", label: "LunarLander (Controlled Descent)" }
      ]
    },
    {
      id: "policy_type",
      label: "Agent Policy Strategy",
      type: "select",
      default: "epsilon_soft",
      options: [
        { value: "epsilon_soft", label: "ε-Soft Exploration (Balanced Search)" },
        { value: "greedy", label: "Pure Greedy (Exploit Estimated Utility)" },
        { value: "random", label: "Uniform Random (Pure Exploration)" }
      ]
    },
    {
      id: "discount_factor",
      label: "Discount Factor (γ)",
      type: "select",
      default: "0.9",
      options: [
        { value: "0.2", label: "γ = 0.2 (Myopic / Immediate Rewards Only)" },
        { value: "0.5", label: "γ = 0.5 (Moderate Short-Term Horizon)" },
        { value: "0.9", label: "γ = 0.9 (Standard Balanced Horizon)" },
        { value: "0.99", label: "γ = 0.99 (Far-Sighted / Long-Term Focus)" }
      ]
    },
    {
      id: "reward_scheme",
      label: "Environment Reward Structure",
      type: "select",
      default: "shaped_dense",
      options: [
        { value: "shaped_dense", label: "Dense Shaped (+1 per Step Alive)" },
        { value: "step_penalty", label: "Step Penalty (-1 per Step, +50 Goal)" },
        { value: "sparse_goal", label: "Sparse Reward (0 Until Goal +100)" }
      ]
    },
    {
      id: "horizon_steps",
      label: "Episode Horizon Length",
      type: "select",
      default: "20",
      options: [
        { value: "10", label: "10 Steps" },
        { value: "20", label: "20 Steps" },
        { value: "35", label: "35 Steps" },
        { value: "50", label: "50 Steps" }
      ]
    }
  ],
  views: [
    {
      type: "mdp-diagram",
      title: "Agent-Environment MDP Feedback Loop",
      bindings: ["environment", "policy_type", "discount_factor", "reward_scheme", "horizon_steps"]
    },
    {
      type: "metric-cards",
      title: "Cumulative Return Metrics",
      bindings: ["discounted-return", "raw-return", "survival-steps", "status"]
    }
  ],
  explanationRules: [
    {
      when: "policy_type === 'epsilon_soft' && discount_factor === '0.9' && reward_scheme === 'shaped_dense'",
      summary: "Balanced Exploration and Temporal Credit",
      detail: "Dense shaped rewards with gamma=0.9 provide consistent, well-attributed reinforcement signals while epsilon-soft exploration prevents premature convergence to suboptimal policies."
    }
  ],
  presets: [
    {
      id: "balanced-cartpole",
      label: "Standard CartPole Balance",
      values: { environment: "cartpole", policy_type: "epsilon_soft", discount_factor: "0.9", reward_scheme: "shaped_dense", horizon_steps: "20" },
      teachingPoint: "Demonstrates standard CartPole MDP with dense survival rewards and balanced discount factor."
    },
    {
      id: "myopic-agent",
      label: "Myopic Agent (Short-Sighted)",
      values: { environment: "cartpole", policy_type: "greedy", discount_factor: "0.2", reward_scheme: "shaped_dense", horizon_steps: "20" },
      teachingPoint: "Shows how low gamma causes the agent to heavily discount future consequences, prioritizing immediate gain."
    },
    {
      id: "sparse-goal-navigation",
      label: "Sparse Goal Discovery",
      values: { environment: "gridworld", policy_type: "epsilon_soft", discount_factor: "0.99", reward_scheme: "sparse_goal", horizon_steps: "35" },
      teachingPoint: "Illustrates the credit assignment problem when non-zero reward only occurs upon reaching the terminal goal state."
    }
  ],
  challenge: {
    prompt: "Configure the simulation to model the CartPole environment with an epsilon-soft policy, a balanced discount factor gamma=0.9, and dense shaped rewards.",
    success: { environment: "cartpole", policy_type: "epsilon_soft", discount_factor: "0.9", reward_scheme: "shaped_dense" },
    hints: [
      "Select CartPole-v1 as the simulation environment.",
      "Set Agent Policy Strategy to ε-Soft Exploration.",
      "Choose γ = 0.9 as the Discount Factor with Dense Shaped rewards."
    ]
  },
  quiz: [
    {
      prompt: "In the Reinforcement Learning framework, what role does the discount factor (γ) play?",
      choices: [
        "It determines the present value of future rewards, balancing immediate vs long-term consequences.",
        "It scales down the learning rate of the gradient optimizer.",
        "It sets the probability of taking a random exploratory action.",
        "It reduces the size of the neural network layers."
      ],
      answer: 0,
      explanation: "The discount factor gamma (between 0 and 1) weights future rewards in the cumulative return sum G_t = sum gamma^k R_{t+k+1}, ensuring mathematical convergence and modeling temporal preference."
    },
    {
      prompt: "What is a major limitation of traditional tabular reinforcement learning in complex environments?",
      choices: [
        "The state-action space becomes exponentially large (curse of dimensionality), making it infeasible to store or visit all table entries.",
        "Tabular RL cannot execute on CPU hardware.",
        "Q-tables can only be used with supervised classification models.",
        "OpenAI Gym does not support discrete action spaces."
      ],
      answer: 0,
      explanation: "Continuous observation spaces (like CartPole angles or Atari pixel grids) contain infinite or billions of states, which cannot be represented in a discrete table, motivating deep neural function approximation."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive MDP diagram showing the Agent-Environment feedback loop with action outputs, state transitions, and step-by-step discounted reward curves.",
    keyboardHelp: "Use Tab to navigate controls and Enter or Space to adjust simulation parameters."
  }
};
