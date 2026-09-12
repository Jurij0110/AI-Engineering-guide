export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/tensorflow-for-sequential-data",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Tensorflow for Sequential Data",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/6-Tensorflow_for_Sequential_Data.txt",
  sourceFormat: "txt",
  engine: "SequentialModelingLab",
  learningObjectives: [
    "Compare sequential deep learning architectures in TensorFlow/Keras: SimpleRNN, LSTM, GRU, Conv1D, and Transformer.",
    "Evaluate trade-offs between parallelizability during training, gradient flow stability, and computational complexity over long sequence lengths."
  ],
  prerequisites: [
    "Recurrent neural networks (hidden states and unrolling over time)",
    "Convolutional layers vs Self-Attention mechanisms"
  ],
  scenario: {
    description: "Navigate the taxonomy of sequential neural network architectures available in TensorFlow. Compare how SimpleRNN, LSTM, GRU, Conv1D, and Transformer scale as sequence length expands from 50 to 1,000 steps.",
    seed: 3306
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "taxonomy", label: "Sequential Architecture Taxonomy" }
      ],
      default: "taxonomy"
    },
    {
      id: "arch",
      label: "Sequential Model Architecture",
      type: "select",
      options: [
        { value: "transformer", label: "Transformer (Parallel Self-Attention)" },
        { value: "gru", label: "GRU (Gated Recurrent Unit - 2 Gates)" },
        { value: "lstm", label: "LSTM (Long Short-Term Memory - 3 Gates)" },
        { value: "conv1d", label: "Conv1D (Dilated Causal 1D Convolution)" },
        { value: "simple_rnn", label: "SimpleRNN (Vanilla Elman Recurrent Cell)" }
      ],
      default: "transformer"
    },
    {
      id: "seqLen",
      label: "Sequence Length (N Timesteps)",
      type: "select",
      options: [
        { value: "50", label: "50 Timesteps (Short Sequence)" },
        { value: "100", label: "100 Timesteps (Medium Sequence)" },
        { value: "300", label: "300 Timesteps (Long Sequence)" },
        { value: "1000", label: "1000 Timesteps (Ultra-Long Sequence)" }
      ],
      default: "100"
    }
  ],
  views: [
    {
      type: "architecture-diagram",
      title: "Sequential Architecture Profile",
      bindings: ["arch", "seqLen", "parallelTraining"]
    },
    {
      type: "metrics-panel",
      title: "Complexity & Gradient Flow Metrics",
      bindings: ["parallelTraining", "longRangeRetention", "vanishingGradientRisk", "inferenceComplexity"]
    }
  ],
  explanationRules: [
    {
      when: "arch === 'transformer'",
      summary: "Transformer: Fully Parallel Training with Direct Pathways",
      detail: "Attention connects any token pair in O(1) operations, eliminating vanishing gradient risks and allowing massive GPU parallelization across all sequence steps."
    },
    {
      when: "arch === 'simple_rnn' && seqLen === '1000'",
      summary: "Severe Recurrent Degradation in Vanilla RNN",
      detail: "Backpropagation Through Time (BPTT) over 1000 steps causes exponential gradient decay (vanishing gradients), rendering early input signals undetectable."
    },
    {
      when: "arch === 'conv1d'",
      summary: "Conv1D: Parallel Local Receptive Fields",
      detail: "1D convolutions can be computed in parallel across time steps, but expanding receptive field to 1000 steps requires dilated convolutions or deep stacking."
    }
  ],
  presets: [
    {
      id: "modern-transformer",
      label: "Transformer Parallel Baseline (1000 steps)",
      values: { mode: "taxonomy", arch: "transformer", seqLen: "1000" },
      teachingPoint: "Maintains 94% retention with full parallel training even on 1000 steps."
    },
    {
      id: "rnn-collapse",
      label: "SimpleRNN Vanishing Gradient Collapse",
      values: { mode: "taxonomy", arch: "simple_rnn", seqLen: "1000" },
      teachingPoint: "Demonstrates near-zero signal retention on 1000-step sequences."
    }
  ],
  challenge: {
    prompt: "Select the modern sequential architecture that provides full parallel training support and zero vanishing gradient risk on a 1000-timestep sequence.",
    success: { mode: "taxonomy", arch: "transformer", seqLen: "1000" },
    hints: [
      "Choose Transformer as the architecture.",
      "Select Sequence Length = 1000 Timesteps."
    ]
  },
  quiz: [
    {
      prompt: "Why can Transformers be trained significantly faster than LSTMs on GPUs for large sequential datasets?",
      choices: [
        "Self-attention processes all time steps simultaneously in parallel, avoiding the sequential loop constraint of recurrent state updates",
        "Transformers contain zero trainable parameters",
        "Transformers run only on CPU registers",
        "Transformers ignore token sequences entirely"
      ],
      answer: 0,
      explanation: "Recurrent networks must compute h_t using h_{t-1}, creating an O(N) sequential dependency bottleneck. Transformers process the entire sequence in parallel using tensor matrix multiplications."
    },
    {
      prompt: "What is the computational complexity of standard self-attention with respect to sequence length N?",
      choices: [
        "O(N^2)",
        "O(N)",
        "O(log N)",
        "O(1)"
      ],
      answer: 0,
      explanation: "Standard scaled dot-product attention computes an N x N attention matrix (Q * K^T), resulting in quadratic O(N^2) memory and time complexity with respect to sequence length."
    }
  ],
  accessibility: {
    canvasSummary: "Sequential architecture taxonomy comparison contrasting SimpleRNN, LSTM, GRU, Conv1D, and Transformer on parallelizability, gradient flow, and horizon retention.",
    keyboardHelp: "Use Tab to cycle between architectures and sequence lengths. Observe the parallel training indicator and vanishing gradient risk assessment."
  }
};

