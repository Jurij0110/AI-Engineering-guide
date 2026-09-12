export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-3-transformers-in-keras/text-generation-transformer-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-3-transformers-in-keras",
  title: "Text Generation Transformer Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-3-Transformers_in_Keras/7-Text_Generation_Transformer_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "TransformerArchitectureLab",
  learningObjectives: [
    "Implement autoregressive text generation using a trained Transformer Decoder in Keras.",
    "Analyze the impact of temperature scaling and top-k filtering on token probability distributions, output entropy, and response diversity."
  ],
  prerequisites: [
    "Transformer Decoder and causal attention masking",
    "Softmax probability distributions and categorical sampling"
  ],
  scenario: {
    description: "Experiment with autoregressive sampling strategies in a Transformer text generation model. Adjust temperature scaling and top-k thresholds to control the trade-off between deterministic precision and creative diversity.",
    seed: 3307
  },
  controls: [
    {
      id: "mode",
      label: "Engine Mode",
      type: "select",
      options: [
        { value: "text_generation", label: "Autoregressive Sampling & Temperature Scaling" }
      ],
      default: "text_generation"
    },
    {
      id: "temperature",
      label: "Sampling Temperature (T)",
      type: "select",
      options: [
        { value: "0.2", label: "0.2 (Low Temperature - Greedy / Conservative)" },
        { value: "0.7", label: "0.7 (Medium Temperature - Balanced)" },
        { value: "1.2", label: "1.2 (High Temperature - Creative / Varied)" },
        { value: "1.8", label: "1.8 (Very High Temperature - High Entropy)" }
      ],
      default: "0.7"
    },
    {
      id: "topK",
      label: "Top-K Filtering Threshold",
      type: "select",
      options: [
        { value: "2", label: "Top-2 Candidates" },
        { value: "4", label: "Top-4 Candidates" },
        { value: "6", label: "Top-6 (Full Candidate Set)" }
      ],
      default: "4"
    }
  ],
  views: [
    {
      type: "token-distribution",
      title: "Softmax Token Probabilities",
      bindings: ["temperature", "topK", "probabilities"]
    },
    {
      type: "metrics-panel",
      title: "Generation Entropy & Status",
      bindings: ["temperature", "entropy", "valid"]
    }
  ],
  explanationRules: [
    {
      when: "temperature === '0.2'",
      summary: "Low Temperature: Greedy Concentration",
      detail: "Dividing logits by 0.2 sharply accentuates differences, concentrating >80% probability onto the single highest-logit token for deterministic, repetitive outputs."
    },
    {
      when: "temperature === '0.7'",
      summary: "Balanced Generation Temperature",
      detail: "T=0.7 preserves semantic coherence while allowing natural token variation across plausible candidates."
    },
    {
      when: "temperature === '1.8'",
      summary: "High Temperature: Flattened Probability & Chaos",
      detail: "High temperature flattens logits toward uniform distribution, increasing the likelihood of selecting improbable or nonsensical tokens."
    }
  ],
  presets: [
    {
      id: "greedy-deterministic",
      label: "Greedy Generation (T=0.2, Top-2)",
      values: { mode: "text_generation", temperature: "0.2", topK: "2" },
      teachingPoint: "Concentrates almost all probability mass on top candidates for predictable generation."
    },
    {
      id: "balanced-creative",
      label: "Balanced Sampling (T=0.7, Top-4)",
      values: { mode: "text_generation", temperature: "0.7", topK: "4" },
      teachingPoint: "Optimal balance between coherence and lexical variety."
    }
  ],
  challenge: {
    prompt: "Configure balanced text generation with temperature T=0.7 and Top-K=4 to achieve optimal coherence without repetitive collapse.",
    success: { mode: "text_generation", temperature: "0.7", topK: "4" },
    hints: [
      "Set Sampling Temperature to 0.7.",
      "Set Top-K Filtering Threshold to Top-4 Candidates."
    ]
  },
  quiz: [
    {
      prompt: "What happens to the softmax probability distribution as temperature T approaches 0?",
      choices: [
        "It approaches an argmax (one-hot vector) where the highest logit receives probability 1.0",
        "It becomes a uniform distribution where all tokens have equal probability",
        "All probabilities become negative",
        "The model stops generating output"
      ],
      answer: 0,
      explanation: "Dividing logits by a value approaching 0 amplifies the differences toward infinity. Softmax then yields probability 1.0 for the maximum logit (greedy argmax decoding)."
    },
    {
      prompt: "What is the primary benefit of Top-K sampling during text generation?",
      choices: [
        "It prevents sampling improbable tokens from the long tail of the distribution by truncating to the K most likely candidates",
        "It reduces model size on disk",
        "It replaces the attention mechanism with convolution",
        "It removes punctuation from generated text"
      ],
      answer: 0,
      explanation: "Top-K filtering zeros out probabilities for all tokens ranked below rank K, preventing the generator from hallucinating low-probability out-of-context words."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive text generation probability bar chart demonstrating temperature scaling and top-k filtering over candidate tokens.",
    keyboardHelp: "Use Tab to cycle between temperature options and top-k thresholds. Observe the probability distribution chart dynamically flatten or sharpen."
  }
};

