export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/rnns",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "RNNs",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/4-RNNs.txt",
  sourceFormat: "txt",
  engine: "SequenceModelLab",
  learningObjectives: [
    "Model temporal sequences where current outputs depend on prior sequential context (text, financial time series, audio, video frames).",
    "Compare Vanilla Recurrent Neural Networks against Gated architectures (LSTM: Long Short-Term Memory and GRU: Gated Recurrent Unit)."
  ],
  prerequisites: [
    "Sequential time-series data concepts",
    "Hidden state recurrence"
  ],
  scenario: {
    description: "Explore sequential modeling with Recurrent Neural Networks and LSTMs. Compare memory retention and gradient propagation across increasing sequence time steps.",
    seed: 6060
  },
  controls: [
    {
      id: "model_type",
      label: "Recurrent Cell Architecture",
      type: "select",
      options: [
        { value: "lstm", label: "LSTM (Gated Cell State — Preserves Long-Range Memory)" },
        { value: "vanilla_rnn", label: "Vanilla RNN (Subject to Vanishing Gradients over Time)" }
      ],
      default: "lstm"
    },
    {
      id: "seq_length",
      label: "Sequence Time Steps (T)",
      type: "range",
      min: 4,
      max: 16,
      step: 2,
      default: 10
    }
  ],
  views: [
    {
      type: "recurrent-memory",
      title: "Temporal Memory State Retention",
      bindings: ["model_type", "seq_length"]
    },
    {
      type: "metric-cards",
      title: "Sequence Metrics",
      bindings: ["retention", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "model_type === 'lstm'",
      summary: "LSTM Constant Error Carousel",
      detail: "LSTMs use forget, input, and output gates with additive cell state updates to prevent gradient vanishing across long temporal spans."
    },
    {
      when: "model_type === 'vanilla_rnn' && seq_length >= 8",
      summary: "Temporal Vanishing Gradient",
      detail: "Repeated matrix multiplications over 8+ time steps cause earlier context gradients to vanish exponentially."
    }
  ],
  presets: [
    {
      id: "lstm-long",
      label: "LSTM Long Sequence (T=10)",
      values: { model_type: "lstm", seq_length: 10 },
      teachingPoint: "Gated cell state enables LSTMs to capture long-term semantic dependencies in natural language."
    },
    {
      id: "rnn-decay",
      label: "Vanilla RNN Decay Demo",
      values: { model_type: "vanilla_rnn", seq_length: 10 },
      teachingPoint: "Vanilla RNN memory decays rapidly over extended time steps."
    }
  ],
  challenge: {
    prompt: "Select LSTM architecture on a 10-step sequence to achieve Balanced status and Retention >= 80%.",
    success: { model_type: "lstm", seq_length: 10, diagnosis: "Balanced" },
    hints: [
      "Select LSTM.",
      "Set Sequence Time Steps to 10."
    ]
  },
  quiz: [
    {
      prompt: "Why do standard Vanilla RNNs suffer from vanishing gradients when unrolled over long sequences (e.g. 50+ time steps)?",
      choices: [
        "Backpropagating through time (BPTT) requires multiplying the recurrent weight matrix W_hh repeatedly (T times), causing gradients to decay exponentially to 0 if eigenvalues < 1.",
        "Because RNNs only run on Sundays.",
        "Because sequences cannot be stored in RAM.",
        "Because time is continuous rather than discrete."
      ],
      answer: 0,
      explanation: "Backpropagation Through Time (BPTT) chains multiplicative Jacobians over T steps, exponentially attenuating early step error signals."
    },
    {
      prompt: "What is the key mechanism in an LSTM (Long Short-Term Memory) cell that allows it to maintain information across long time horizons?",
      choices: [
        "The additive cell state (C_t) regulated by sigmoid forget, input, and output gates that selectively add or remove information without multiplicative decay.",
        "A hard drive caching script.",
        "Converting text words into audio waves.",
        "Removing all weights from the network."
      ],
      answer: 0,
      explanation: "The additive linear cell state acts as an information conveyor belt, passing error gradients intact across arbitrary time steps."
    }
  ],
  accessibility: {
    canvasSummary: "Sequence model memory retention bar chart comparing Vanilla RNN decay with LSTM gating stability.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

