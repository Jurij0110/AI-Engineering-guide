export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/advanced-transformer-applications",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Advanced Transformer Applications",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/4-Advanced_Transformer_Applications.txt",
  sourceFormat: "txt",
  engine: "TransformerArchitectureLab",
  learningObjectives: [
    "Explain how Vision Transformers (ViT) adapt self-attention to computer vision by tokenizing 2D images into linear patch projections.",
    "Calculate the sequence length N = (H/P) * (W/P) of image tokens and analyze projection parameter complexity."
  ],
  prerequisites: [
    "Multi-Head Attention and Transformer Encoder architecture",
    "2D Convolutional neural networks and spatial receptive fields"
  ],
  scenario: {
    description: "Explore Vision Transformers (ViT) applied to image understanding. Dissect how high-resolution images are partitioned into a grid of non-overlapping patches, linearly embedded, and processed as sequence tokens.",
    seed: 3304
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "vision_vit", label: "Vision Transformer (ViT) Patch Tokenizer" }
      ],
      default: "vision_vit"
    },
    {
      id: "imageSize",
      label: "Input Image Resolution (H x W)",
      type: "select",
      options: [
        { value: "224", label: "224 x 224 Pixels (Standard ViT)" },
        { value: "384", label: "384 x 384 Pixels (High Resolution ViT)" }
      ],
      default: "224"
    },
    {
      id: "patchSize",
      label: "Patch Size (P x P)",
      type: "select",
      options: [
        { value: "16", label: "16 x 16 Pixels (14x14 = 196 Patches)" },
        { value: "32", label: "32 x 32 Pixels (7x7 = 49 Patches)" }
      ],
      default: "16"
    },
    {
      id: "embedDim",
      label: "Patch Linear Projection Dimension (D)",
      type: "select",
      options: [
        { value: "128", label: "128 Dimensions (ViT-Tiny/Small)" },
        { value: "256", label: "256 Dimensions (ViT-Base Lightweight)" },
        { value: "768", label: "768 Dimensions (ViT-Base Standard)" }
      ],
      default: "128"
    }
  ],
  views: [
    {
      type: "patch-grid",
      title: "Image Patch Grid & Token Sequence",
      bindings: ["imageSize", "patchSize", "numPatches"]
    },
    {
      type: "metrics-panel",
      title: "ViT Sequence & Projection Metrics",
      bindings: ["numPatches", "patchPixels", "patchProjectionParams"]
    }
  ],
  explanationRules: [
    {
      when: "imageSize === '224' && patchSize === '16'",
      summary: "Canonical ViT-16/224 Configuration",
      detail: "224x224 image yields exactly 196 patch tokens (14x14 grid). Each patch contains 16x16x3 = 768 raw pixel values projected into the transformer embedding space."
    },
    {
      when: "patchSize === '32'",
      summary: "Coarser ViT-32 Patch Tokens",
      detail: "Larger 32x32 patches reduce sequence length to 49 tokens, reducing self-attention O(N^2) computational cost by 16x at the cost of fine spatial resolution."
    }
  ],
  presets: [
    {
      id: "vit-base-16",
      label: "Standard ViT-16/224",
      values: { mode: "vision_vit", imageSize: "224", patchSize: "16", embedDim: "128" },
      teachingPoint: "Standard 196-patch sequence, balancing spatial granularity and self-attention computational load."
    },
    {
      id: "vit-large-patch",
      label: "Fast ViT-32/224",
      values: { mode: "vision_vit", imageSize: "224", patchSize: "32", embedDim: "128" },
      teachingPoint: "Reduces tokens to 49 for ultra-fast attention computation on resource-constrained hardware."
    }
  ],
  challenge: {
    prompt: "Configure a standard ViT with 224x224 input, 16x16 patch size, and 768 projection dimension to inspect standard ViT-Base tokenization.",
    success: { mode: "vision_vit", imageSize: "224", patchSize: "16", embedDim: "768" },
    hints: [
      "Set Input Image Resolution to 224 x 224.",
      "Set Patch Size to 16 x 16.",
      "Select Projection Dimension D = 768."
    ]
  },
  quiz: [
    {
      prompt: "For an RGB image of size 224x224 divided into 16x16 patches, how many sequence tokens enter the Transformer Encoder (excluding any [CLS] token)?",
      choices: [
        "196",
        "256",
        "14",
        "49"
      ],
      answer: 0,
      explanation: "Patches per side = 224 / 16 = 14. Total patches = 14 * 14 = 196 tokens."
    },
    {
      prompt: "Why must positional embeddings be added to patch tokens before feeding them to a Vision Transformer?",
      choices: [
        "Self-attention is permutation-invariant and lacks inherent awareness of spatial 2D coordinates",
        "To invert the color channels from RGB to BGR",
        "To prevent gradient exploding in the classification head",
        "Because convolution layers require positional coordinates"
      ],
      answer: 0,
      explanation: "Standard self-attention computes pairwise similarities without regard to spatial order. Adding 1D or 2D learnable positional embeddings restores spatial geometry awareness."
    }
  ],
  accessibility: {
    canvasSummary: "Vision Transformer patch grid breakdown showing how an image is split into 196 patches of 16x16 pixels and projected into token vectors.",
    keyboardHelp: "Use Tab to cycle through image size, patch size, and embedding dimension dropdowns. Watch patch counts and token sequence lengths recompute."
  }
};

