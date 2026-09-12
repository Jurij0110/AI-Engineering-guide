export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/transformers-for-time-series",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Transformers for Time Series",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/5-Transformers_for_Time_Series.txt",
  sourceFormat: "txt",
  engine: "SequentialModelingLab",
  learningObjectives: [
    "Analyze how multi-head self-attention enables multi-horizon time-series forecasting across extended temporal windows.",
    "Compare Transformer temporal models against classical ARIMA and recurrent LSTM architectures in terms of long-range dependency retention and MSE loss."
  ],
  prerequisites: [
    "Time series fundamentals (trend, seasonality, noise)",
    "Self-attention mechanism and feedforward networks"
  ],
  scenario: {
    description: "Compare Transformer-based time-series forecasting against LSTM and ARIMA models. Observe how attention mechanisms capture both short-term oscillations and long-range seasonal patterns.",
    seed: 3305
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "time_series", label: "Multi-Horizon Time Series Forecasting" }
      ],
      default: "time_series"
    },
    {
      id: "modelType",
      label: "Forecasting Model",
      type: "select",
      options: [
        { value: "transformer", label: "Transformer (Multi-Head Self-Attention)" },
        { value: "lstm", label: "LSTM (Gated Recurrent Memory)" },
        { value: "arima", label: "ARIMA (Autoregressive Integrated Moving Average)" }
      ],
      default: "transformer"
    },
    {
      id: "lookback",
      label: "Lookback Historical Window (Timesteps)",
      type: "select",
      options: [
        { value: "30", label: "30 Timesteps (1 Month Lookback)" },
        { value: "60", label: "60 Timesteps (2 Months Lookback)" },
        { value: "120", label: "120 Timesteps (Extended Seasonal Lookback)" }
      ],
      default: "60"
    },
    {
      id: "batchSize",
      label: "Training Batch Size",
      type: "select",
      options: [
        { value: "16", label: "16 (Fine-Grained Updates)" },
        { value: "32", label: "32 (Balanced Standard)" },
        { value: "64", label: "64 (Fast Epoch Steps)" }
      ],
      default: "32"
    },
    {
      id: "activation",
      label: "FFN Activation",
      type: "select",
      options: [
        { value: "relu", label: "ReLU" },
        { value: "gelu", label: "GELU" }
      ],
      default: "relu"
    }
  ],
  views: [
    {
      type: "forecast-chart",
      title: "Forecast Horizon vs Ground Truth Waveform",
      bindings: ["modelType", "lookback", "mseLoss"]
    },
    {
      type: "metrics-panel",
      title: "Model Accuracy & Retention",
      bindings: ["mseLoss", "trainTimeSeconds", "longRangeFidelity"]
    }
  ],
  explanationRules: [
    {
      when: "modelType === 'transformer' && lookback === '120'",
      summary: "Superior Long-Range Temporal Attention",
      detail: "Self-attention creates direct connections between distant timesteps (e.g. t-120 and t), maintaining 93% fidelity without recurrence degradation."
    },
    {
      when: "modelType === 'arima'",
      summary: "Linear Autoregressive Baseline",
      detail: "ARIMA struggles with complex non-linear multi-periodic waves, resulting in higher MSE (0.092) and rapid uncertainty divergence over long horizons."
    },
    {
      when: "modelType === 'lstm' && lookback === '120'",
      summary: "Recurrent Attenuation over Extended Horizons",
      detail: "Even with gated memory cells, LSTM memory attenuates over 120 steps due to repeated matrix multiplications."
    }
  ],
  presets: [
    {
      id: "transformer-extended",
      label: "Transformer Extended Lookback (120 steps)",
      values: { mode: "time_series", modelType: "transformer", lookback: "120", batchSize: "32", activation: "relu" },
      teachingPoint: "Maintains high fidelity over 120 historical steps with low MSE."
    },
    {
      id: "classical-arima",
      label: "Classical ARIMA Comparison",
      values: { mode: "time_series", modelType: "arima", lookback: "30", batchSize: "32", activation: "relu" },
      teachingPoint: "Demonstrates fast training but limited non-linear expressive capacity."
    }
  ],
  challenge: {
    prompt: "Configure a Transformer model with 120-step extended lookback and batch size 32 to maximize long-range temporal fidelity (>90%).",
    success: { mode: "time_series", modelType: "transformer", lookback: "120", batchSize: "32", activation: "relu" },
    hints: [
      "Select Transformer as the Forecasting Model.",
      "Set Lookback Historical Window to 120 Timesteps.",
      "Set Training Batch Size to 32."
    ]
  },
  quiz: [
    {
      prompt: "What major advantage does Transformer self-attention offer over recurrent LSTM cells in long time series?",
      choices: [
        "Path length between any two arbitrary time steps is O(1) instead of O(N) sequential steps",
        "Transformers require strictly zero GPU memory",
        "Transformers do not require numerical scaling of input series",
        "Attention mechanisms cannot overfit"
      ],
      answer: 0,
      explanation: "In self-attention, any past timestamp directly attends to any other timestamp with a single matrix operation (O(1) path length), preventing the vanishing gradient bottleneck of O(N) recurrent unrolling."
    },
    {
      prompt: "In time-series forecasting with Transformers, what replaces positional embeddings if timestamps have regular intervals and periodic calendar features?",
      choices: [
        "Temporal embeddings (hour-of-day, day-of-week, month) combined with 1D positional encodings",
        "Fourier transform low-pass filter coefficients only",
        "Random Gaussian noise vectors",
        "Zero-padding arrays"
      ],
      answer: 0,
      explanation: "Temporal Transformer architectures (such as Informer or TFT) encode hierarchical calendar attributes (hour, day, week, month) alongside learnable or sinusoidal position vectors."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive time series forecasting comparison between Transformer, LSTM, and ARIMA models across multiple temporal horizons.",
    keyboardHelp: "Use Tab to cycle through forecasting models and lookback sliders. Observe the forecast curve aligning with the ground truth signal."
  }
};

