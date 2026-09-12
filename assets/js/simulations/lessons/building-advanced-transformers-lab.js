export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/building-advanced-transformers-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Building Advanced Transformers Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/3-Building_Advanced Transformers_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "SequentialModelingLab",
  learningObjectives: [
    "Construct customized Transformer blocks incorporating LayerNormalization, MultiHeadAttention, and FeedForward layers in Keras.",
    "Evaluate training dynamics, batch sizing, and lookback window impacts on sequence forecasting error."
  ],
  prerequisites: [
    "Keras subclassing and functional API",
    "Layer Normalization vs Batch Normalization in NLP and sequential models"
  ],
  scenario: {
    description: "Build and tune an advanced Transformer sequential model in Keras. Experiment with lookback horizons, batch sizes, and activations to achieve optimal MSE loss on sequential benchmarks.",
    seed: 3303
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "time_series", label: "Sequential Model Training & Evaluation" }
      ],
      default: "time_series"
    },
    {
      id: "modelType",
      label: "Sequence Model Architecture",
      type: "select",
      options: [
        { value: "transformer", label: "Custom Transformer Encoder Block" },
        { value: "lstm", label: "Stacked LSTM Recurrent Baseline" }
      ],
      default: "transformer"
    },
    {
      id: "lookback",
      label: "Temporal Lookback Window (Steps)",
      type: "select",
      options: [
        { value: "30", label: "30 Steps (Short Horizon)" },
        { value: "60", label: "60 Steps (Medium Horizon)" },
        { value: "90", label: "90 Steps (Extended Horizon)" }
      ],
      default: "60"
    },
    {
      id: "batchSize",
      label: "Mini-Batch Size",
      type: "select",
      options: [
        { value: "16", label: "16 (Fine-Grained Gradients)" },
        { value: "32", label: "32 (Balanced Throughput)" },
        { value: "64", label: "64 (High Throughput)" }
      ],
      default: "32"
    },
    {
      id: "activation",
      label: "FeedForward Activation",
      type: "select",
      options: [
        { value: "relu", label: "ReLU (Standard FeedForward)" },
        { value: "gelu", label: "GELU (Smooth Gaussian Error Linear Unit)" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "forecast-chart",
      title: "Sequential Prediction vs Ground Truth",
      bindings: ["modelType", "lookback", "mseLoss"]
    },
    {
      type: "metrics-panel",
      title: "Convergence & Fidelity Metrics",
      bindings: ["mseLoss", "trainTimeSeconds", "longRangeFidelity"]
    }
  ],
  explanationRules: [
    {
      when: "modelType === 'transformer' && lookback === '60'",
      summary: "High-Fidelity Transformer Forecasting",
      detail: "Multi-Head Attention captures periodic and non-linear sequential dependencies across 60 steps, yielding lower MSE than recurrent baselines."
    },
    {
      when: "modelType === 'lstm'",
      summary: "Recurrent Sequential Processing Bottleneck",
      detail: "LSTM requires sequential step-by-step unrolling, leading to longer training times and potential gradient decay over extended horizons."
    }
  ],
  presets: [
    {
      id: "optimal-transformer",
      label: "High-Performance Transformer Block",
      values: { mode: "time_series", modelType: "transformer", lookback: "60", batchSize: "16", activation: "relu" },
      teachingPoint: "Achieves lowest MSE loss with strong long-range fidelity on 60-step temporal sequences."
    },
    {
      id: "lstm-baseline",
      label: "LSTM Sequential Comparison",
      values: { mode: "time_series", modelType: "lstm", lookback: "60", batchSize: "32", activation: "relu" },
      teachingPoint: "Demonstrates higher training latency and slightly reduced retention over longer horizons."
    }
  ],
  challenge: {
    prompt: "Configure the custom Transformer model with lookback=60, batchSize=16, and relu activation to attain the optimal MSE loss (<0.025).",
    success: { mode: "time_series", modelType: "transformer", lookback: "60", batchSize: "16", activation: "relu" },
    hints: [
      "Select Custom Transformer Encoder Block as the architecture.",
      "Set Temporal Lookback Window to 60 Steps.",
      "Set Mini-Batch Size to 16.",
      "Keep FeedForward Activation at ReLU."
    ]
  },
  quiz: [
    {
      prompt: "Why is Layer Normalization preferred over Batch Normalization in Transformer blocks for sequential modeling?",
      choices: [
        "LayerNorm normalizes across feature dimensions independently for each sample, making it invariant to sequence length and mini-batch size",
        "LayerNorm requires zero learnable weights",
        "LayerNorm forces all embeddings to equal zero",
        "Batch Normalization cannot be computed on GPUs"
      ],
      answer: 0,
      explanation: "Layer Normalization computes statistics per-sample across the hidden feature dimension, eliminating batch size dependence and padding length distortions common in NLP."
    },
    {
      prompt: "What is the primary role of the Pointwise Feed-Forward Network (FFN) following the Multi-Head Attention layer in a Transformer block?",
      choices: [
        "To apply non-linear feature transformations independently at each sequence position",
        "To compress the sequence into a single scalar",
        "To mask future tokens from past positions",
        "To calculate dot-product attention scores"
      ],
      answer: 0,
      explanation: "The pointwise FFN consists of two linear transformations with an activation in between, applied identically and separately to each position: FFN(x) = max(0, xW1 + b1)W2 + b2."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive sequential forecasting simulator comparing Transformer and LSTM architectures across various lookback windows and batch sizes.",
    keyboardHelp: "Use Tab to cycle through model architectures and hyperparameter dropdowns. Observe MSE loss and long-range fidelity metrics."
  }
};

