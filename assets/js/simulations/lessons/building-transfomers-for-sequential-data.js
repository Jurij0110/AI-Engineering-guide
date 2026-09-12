export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/building-transfomers-for-sequential-data",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Building Transfomers for Sequential Data",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/2-Building_Transfomers_for_Sequential_Data.txt",
  sourceFormat: "txt",
  engine: "TransformerArchitectureLab",
  learningObjectives: [
    "Differentiate bidirectional self-attention in Transformer Encoders from causal masked self-attention in Transformer Decoders.",
    "Explain how causal look-ahead masking prevents future token leakage during autoregressive sequence generation."
  ],
  prerequisites: [
    "Self-attention dot-product mechanics: Softmax(Q * K^T / sqrt(d_k)) * V",
    "Autoregressive generation fundamentals"
  ],
  scenario: {
    description: "Investigate causal masking in sequential Transformer blocks. Observe how setting upper-triangular attention logits to negative infinity prevents future tokens from leaking into past representations.",
    seed: 3302
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "attention_masking", label: "Attention Masking Matrix" }
      ],
      default: "attention_masking"
    },
    {
      id: "blockType",
      label: "Transformer Block Type",
      type: "select",
      options: [
        { value: "decoder", label: "Decoder (Autoregressive Causal Block)" },
        { value: "encoder", label: "Encoder (Bidirectional Block)" }
      ],
      default: "decoder"
    },
    {
      id: "maskType",
      label: "Attention Masking Strategy",
      type: "select",
      options: [
        { value: "causal", label: "Causal Look-Ahead Mask (Upper Triangle Masked)" },
        { value: "none", label: "No Mask (Bidirectional Attention)" }
      ],
      default: "causal"
    },
    {
      id: "dModel",
      label: "Key Dimension Scale (d_k)",
      type: "select",
      options: [
        { value: "32", label: "d_k = 32 (Scale = 5.7)" },
        { value: "64", label: "d_k = 64 (Scale = 8.0)" },
        { value: "128", label: "d_k = 128 (Scale = 11.3)" }
      ],
      default: "64"
    }
  ],
  views: [
    {
      type: "attention-heatmap",
      title: "Self-Attention Weight Matrix (5x5 Tokens)",
      bindings: ["blockType", "maskType", "matrix"]
    },
    {
      type: "metrics-panel",
      title: "Masking Verification & Scale Factor",
      bindings: ["scaleFactor", "valid", "blockType"]
    }
  ],
  explanationRules: [
    {
      when: "blockType === 'decoder' && maskType === 'causal'",
      summary: "Strict Causal Decoder Compliance",
      detail: "Future positions (j > i) are zeroed out after softmax, guaranteeing that token i depends solely on tokens 0..i."
    },
    {
      when: "blockType === 'decoder' && maskType === 'none'",
      summary: "Data Leakage Alert: Decoder Without Causal Mask",
      detail: "Allowing a decoder to attend to subsequent tokens causes look-ahead cheating during training, causing disastrous collapse during live generation."
    },
    {
      when: "blockType === 'encoder'",
      summary: "Bidirectional Contextual Representation",
      detail: "Transformer Encoders (like BERT) intentionally inspect the entire sequence in both directions to maximize contextual embeddings."
    }
  ],
  presets: [
    {
      id: "valid-decoder",
      label: "Standard Decoder with Causal Mask",
      values: { mode: "attention_masking", blockType: "decoder", maskType: "causal", dModel: "64" },
      teachingPoint: "Standard autoregressive decoder setting with upper triangular zeros."
    },
    {
      id: "bidirectional-encoder",
      label: "Bidirectional Encoder (No Causal Mask)",
      values: { mode: "attention_masking", blockType: "encoder", maskType: "none", dModel: "64" },
      teachingPoint: "Encoder allows full cross-token attention for rich representation learning."
    }
  ],
  challenge: {
    prompt: "Configure a valid autoregressive Decoder block with a Causal Look-Ahead Mask and d_k=64 to prevent future information leakage.",
    success: { mode: "attention_masking", blockType: "decoder", maskType: "causal", dModel: "64" },
    hints: [
      "Set Block Type to Decoder.",
      "Select Causal Look-Ahead Mask.",
      "Set Key Dimension Scale to 64."
    ]
  },
  quiz: [
    {
      prompt: "In a causal decoder attention mask, what value is added to future token logits prior to the softmax operation?",
      choices: [
        "-1e9 (or -inf)",
        "0.0",
        "+1.0",
        "0.5"
      ],
      answer: 0,
      explanation: "Adding -1e9 or -infinity ensures that exp(-inf) = 0 in the softmax calculation, yielding exactly 0.0 attention probability for future tokens."
    },
    {
      prompt: "Why is causal masking NOT used in a standard BERT-style Transformer Encoder?",
      choices: [
        "Encoders perform non-causal representation where understanding past and future context simultaneously improves token representations",
        "Encoders do not have key or query matrices",
        "Encoders cannot process more than 1 token at a time",
        "Masking increases parameter count"
      ],
      answer: 0,
      explanation: "Encoder tasks (e.g. classification, masked language modeling) benefit from full bidirectional context without generation causality constraints."
    }
  ],
  accessibility: {
    canvasSummary: "A 5x5 self-attention matrix showing lower-triangular values when causal masking is enabled and full bidirectional attention when disabled.",
    keyboardHelp: "Use Tab to cycle through block types and masking strategies. Observe the attention matrix update to confirm future token suppression."
  }
};

