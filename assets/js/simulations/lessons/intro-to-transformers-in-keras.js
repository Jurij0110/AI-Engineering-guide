export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/intro-to-transformers-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Intro to Transformers in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/1-Intro_to_Transformers_in_Keras.txt",
  sourceFormat: "txt",
  engine: "TransformerArchitectureLab",
  learningObjectives: [
    "Explain how Multi-Head Attention projects query, key, and value vectors into multiple subspaces simultaneously.",
    "Calculate the head dimension (d_k = d_model / h) and verify parameter counts for Q, K, V, and output projection matrices."
  ],
  prerequisites: [
    "Recurrent Neural Networks and sequential sequence-to-sequence limitations",
    "Matrix multiplication and dense layer parameter calculations"
  ],
  scenario: {
    description: "Explore the internal mechanics of Multi-Head Attention in Keras. Observe how splitting d_model across multiple attention heads allows the model to attend to different representational subspaces.",
    seed: 3301
  },
  controls: [
    {
      id: "mode",
      label: "Architecture Mode",
      type: "select",
      options: [
        { value: "multi_head", label: "Multi-Head Attention (Q, K, V Subspaces)" }
      ],
      default: "multi_head"
    },
    {
      id: "embedDim",
      label: "Model Embedding Dimension (d_model)",
      type: "select",
      options: [
        { value: "64", label: "64 Dimensions" },
        { value: "128", label: "128 Dimensions" },
        { value: "256", label: "256 Dimensions" },
        { value: "512", label: "512 Dimensions" }
      ],
      default: "128"
    },
    {
      id: "numHeads",
      label: "Number of Attention Heads (h)",
      type: "select",
      options: [
        { value: "2", label: "2 Heads" },
        { value: "4", label: "4 Heads" },
        { value: "8", label: "8 Heads" },
        { value: "16", label: "16 Heads" }
      ],
      default: "4"
    },
    {
      id: "seqLen",
      label: "Sequence Length (Tokens)",
      type: "select",
      options: [
        { value: "30", label: "30 Tokens" },
        { value: "60", label: "60 Tokens" },
        { value: "120", label: "120 Tokens" }
      ],
      default: "60"
    }
  ],
  views: [
    {
      type: "architecture-diagram",
      title: "Multi-Head Attention Subspace Projection",
      bindings: ["embedDim", "numHeads", "headDim"]
    },
    {
      type: "metrics-panel",
      title: "Projection Parameters & Head Dimensions",
      bindings: ["headDim", "totalMhaParams", "valid"]
    }
  ],
  explanationRules: [
    {
      when: "embedDim === '128' && numHeads === '4'",
      summary: "Balanced 4-Head Configuration",
      detail: "128 embedding dimensions split evenly into 4 heads of 32 dimensions each, enabling parallel representations without parameter explosion."
    },
    {
      when: "numHeads === '8'",
      summary: "Fine-Grained 8-Head Subspaces",
      detail: "More attention heads allow the model to attend to syntactic, positional, semantic, and coreference patterns concurrently."
    }
  ],
  presets: [
    {
      id: "standard-mha",
      label: "Standard 4-Head Configuration (128 dims)",
      values: { mode: "multi_head", embedDim: "128", numHeads: "4", seqLen: "60" },
      teachingPoint: "Balanced dimension per head (32 dims), standard baseline for lightweight transformer blocks."
    },
    {
      id: "deep-8head",
      label: "Large 8-Head Configuration (256 dims)",
      values: { mode: "multi_head", embedDim: "256", numHeads: "8", seqLen: "120" },
      teachingPoint: "Demonstrates 8 parallel heads with 32 dimensions each for longer contexts."
    }
  ],
  challenge: {
    prompt: "Configure Multi-Head Attention with d_model=256 and h=8 heads to observe 32 dims per head on a 120-token sequence.",
    success: { mode: "multi_head", embedDim: "256", numHeads: "8", seqLen: "120" },
    hints: [
      "Select Model Embedding Dimension = 256.",
      "Set Number of Attention Heads = 8.",
      "Set Sequence Length = 120 Tokens."
    ]
  },
  quiz: [
    {
      prompt: "If a Multi-Head Attention layer has d_model=512 and 8 attention heads, what is the dimension of each head (d_k)?",
      choices: [
        "64",
        "128",
        "512",
        "32"
      ],
      answer: 0,
      explanation: "Head dimension d_k = d_model / num_heads = 512 / 8 = 64."
    },
    {
      prompt: "Why does Multi-Head Attention use a scaled dot-product dividing by sqrt(d_k)?",
      choices: [
        "To prevent large dot products from pushing softmax into regions with vanishing gradients",
        "To reduce the number of weights in Q, K, and V",
        "To convert floating point tensors into integers",
        "To enforce recurrence along the time steps"
      ],
      answer: 0,
      explanation: "For large d_k, dot products grow large in magnitude, pushing softmax into extreme values with near-zero gradients. Scaling by sqrt(d_k) preserves stable variance."
    }
  ],
  accessibility: {
    canvasSummary: "Multi-Head Attention visualization breaking down d_model into parallel head projections and calculating trainable weights for Q, K, V, and output layers.",
    keyboardHelp: "Use Tab to navigate through embedding dimension and head count dropdowns. Observe head dimensions and total parameters update dynamically."
  }
};

