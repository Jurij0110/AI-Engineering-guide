export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/transformers",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "Transformers",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/5-Transformers.txt",
  sourceFormat: "txt",
  engine: "TransformerWorkbench",
  learningObjectives: [
    "Understand the Transformer architecture: self-attention mechanism (Q, K, V vectors), parallel token processing, and multi-head attention.",
    "Contrast Transformers against sequential RNNs (O(1) sequential path length vs O(T)) and explore GPT / BERT foundation models."
  ],
  prerequisites: [
    "Sequence modeling concepts",
    "Dot product attention mathematics"
  ],
  scenario: {
    description: "Explore the Self-Attention mechanism powering modern Large Language Models. Inspect Query, Key, and Value interactions and examine attention distribution heatmaps across sequence tokens.",
    seed: 6161
  },
  controls: [
    {
      id: "token_index",
      label: "Query Token Focus (Q)",
      type: "range",
      min: 0,
      max: 8,
      step: 1,
      default: 6
    }
  ],
  views: [
    {
      type: "attention-matrix",
      title: "Self-Attention Softmax Matrix",
      bindings: ["token_index"]
    },
    {
      type: "metric-cards",
      title: "Attention Metrics",
      bindings: ["target-token", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "token_index === 6",
      summary: "Pronoun Resolution Attention",
      detail: "For query token 'it' (index 6), self-attention assigns high affinity weights to 'animal', successfully resolving long-range coreference."
    }
  ],
  presets: [
    {
      id: "pronoun-it",
      label: "Query 'it' Coreference",
      values: { token_index: 6 },
      teachingPoint: "Self-attention dynamically routes contextual information across distant tokens simultaneously."
    }
  ],
  challenge: {
    prompt: "Select Query Token Index 6 ('it') to observe pronoun resolution attention and achieve Balanced status.",
    success: { token_index: 6, diagnosis: "Balanced" },
    hints: [
      "Set Query Token Focus (Q) to 6."
    ]
  },
  quiz: [
    {
      prompt: "What mathematical formula computes Scaled Dot-Product Attention for Query (Q), Key (K), and Value (V) matrices?",
      choices: [
        "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V",
        "Attention(Q, K, V) = Q + K + V",
        "Attention(Q, K, V) = (Q * V) / K",
        "Attention(Q, K, V) = max(0, Q * K)"
      ],
      answer: 0,
      explanation: "Q dot K.T evaluates similarity scores, sqrt(d_k) stabilizes softmax gradients against saturation, and softmax weights average the values V."
    },
    {
      prompt: "Why are Transformers significantly faster to train on GPUs compared to recurrent architectures (RNN/LSTM)?",
      choices: [
        "Transformers process all tokens in a sequence simultaneously in parallel via matrix multiplications, whereas RNNs must process tokens one by one in series.",
        "Because Transformers have no training data.",
        "Because Transformers don't use floating-point numbers.",
        "Because Transformers only run on TPUs."
      ],
      answer: 0,
      explanation: "Self-attention eliminates temporal step dependencies during training, fully saturating massively parallel GPU tensor cores."
    }
  ],
  accessibility: {
    canvasSummary: "Self-attention weight heatmap matrix illustrating cross-token contextual relevance.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

