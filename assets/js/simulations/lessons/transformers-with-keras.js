export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-4-dl-models/transformers-with-keras",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-4-dl-models",
  title: "Transformers with Keras",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-4-DL_Models/6-Transformers_with_Keras.ipynb",
  sourceFormat: "ipynb",
  engine: "TransformerWorkbench",
  learningObjectives: [
    "Implement Transformer Encoder blocks using Keras MultiHeadAttention and LayerNormalization layers.",
    "Build text classification and sequence-to-sequence NLP pipelines in Keras."
  ],
  prerequisites: [
    "Transformer self-attention theory",
    "Keras MultiHeadAttention API"
  ],
  scenario: {
    description: "Follow the Transformers with Keras notebook lab. Assemble MultiHeadAttention, feed-forward sub-layers, and residual skip connections to inspect attention weights across sentences.",
    seed: 6262
  },
  controls: [
    {
      id: "token_index",
      label: "Lab Focus Token",
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
      title: "Lab Multi-Head Attention Map",
      bindings: ["token_index"]
    },
    {
      type: "metric-cards",
      title: "Lab Attention Metrics",
      bindings: ["target-token", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "token_index === 6",
      summary: "Lab Attention Map State",
      detail: "Keras MultiHeadAttention layer learns distinct projection heads to capture syntactic and semantic token relations."
    }
  ],
  presets: [
    {
      id: "lab-mha",
      label: "Lab Attention Benchmark",
      values: { token_index: 6 },
      teachingPoint: "keras.layers.MultiHeadAttention(num_heads=4, key_dim=64) enables multi-perspective context aggregation."
    }
  ],
  challenge: {
    prompt: "Replicate the lab attention analysis: set Lab Focus Token to 6 to reach Balanced status.",
    success: { token_index: 6, diagnosis: "Balanced" },
    hints: [
      "Set Lab Focus Token to 6."
    ]
  },
  quiz: [
    {
      prompt: "In Keras, what layer is commonly used in Transformer blocks alongside MultiHeadAttention to stabilize training across sequence lengths?",
      choices: [
        "LayerNormalization (normalizing features across each sample independently)",
        "BatchNormalization",
        "ZeroPadding2D",
        "MaxPooling1D"
      ],
      answer: 0,
      explanation: "LayerNormalization normalizes across feature channels for each token independently, making it ideal for variable-length sequence batches."
    },
    {
      prompt: "Why must Positional Encodings be added to input token embeddings in Transformer models?",
      choices: [
        "Because self-attention is permutation-invariant (it calculates set-based dot products with no inherent awareness of word order or sequence position).",
        "To encrypt user queries.",
        "To reduce vocabulary size.",
        "To convert words into Spanish."
      ],
      answer: 0,
      explanation: "Without positional encodings, 'dog bites man' and 'man bites dog' would produce identical self-attention representations."
    }
  ],
  accessibility: {
    canvasSummary: "Keras Transformer attention matrix chart showing multi-head attention weights.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

