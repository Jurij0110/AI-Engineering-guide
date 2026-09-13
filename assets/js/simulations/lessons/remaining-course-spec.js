const option = (id, label, defaultValue, values) => ({
  id,
  label,
  type: "select",
  default: defaultValue,
  options: values.map(([value, text]) => ({ value, label: text }))
});

function profile(topic, concepts, workflow, controls, success, question, explanation, metrics) {
  return { topic, concepts, workflow, controls, success, question, explanation, metrics };
}

// These profiles deliberately model decisions taught in each source module. A lesson's
// exact source identity remains in the catalog entry passed to createRemainingLessonSpec.
const PROFILES = new Map([
  ["04-intro-to-neural-networks-and-pytorch/module-1-tensor-and-datasets", profile(
    "PyTorch tensors, autograd, and dataset transforms", "tensor shape, gradient tracking, and sample transforms",
    ["Represent the data", "Track or transform it", "Inspect the resulting batch"], [
      option("tensor_form", "Tensor representation", "scalar", [["scalar", "Scalar value"], ["vector", "1-D feature vector"], ["matrix", "2-D batch matrix"]]),
      option("gradient_tracking", "Autograd tracking", "off", [["off", "Off — values only"], ["on", "On — requires_grad=True"]]),
      option("dataset_step", "Dataset preparation", "raw", [["raw", "Raw sample"], ["normalized", "Normalize / transform sample"], ["batched", "Build a transformed batch"]])
    ], { tensor_form: "matrix", gradient_tracking: "on", dataset_step: "batched" },
    "Why are tensor shape and gradient tracking both important before a PyTorch training step?",
    "Shape determines whether operations are valid; gradient tracking determines whether autograd can compute parameter updates.",
    ["Tensor readiness", "Autograd coverage", "Shape / data risk"]
  )],
  ["04-intro-to-neural-networks-and-pytorch/module-2-linear-regression", profile(
    "linear regression loss and gradient descent", "a linear prediction, a loss function, and a stable parameter update",
    ["Describe a linear relation", "Measure prediction error", "Update slope and bias"], [
      option("model_form", "Prediction model", "constant", [["constant", "Constant baseline"], ["linear", "Linear slope + bias"]]),
      option("loss_function", "Objective to minimize", "absolute", [["absolute", "Absolute error"], ["mse", "Mean squared error"]]),
      option("update_policy", "Gradient-descent update", "aggressive", [["aggressive", "Aggressive learning rate"], ["stable", "Stable learning rate"], ["holdout", "Validate with a held-out split"]])
    ], { model_form: "linear", loss_function: "mse", update_policy: "holdout" },
    "What does gradient descent use to improve the slope and bias of a linear-regression model?",
    "It uses the derivative of the selected loss with respect to each parameter to take a small error-reducing update.",
    ["Regression fit", "Loss evidence", "Divergence risk"]
  )],
  ["04-intro-to-neural-networks-and-pytorch/module-3-linear-regression-pytorch-way", profile(
    "PyTorch optimization with stochastic and mini-batch gradient descent", "batching, torch optimizers, and validation splits",
    ["Choose a batch strategy", "Delegate updates to an optimizer", "Check generalization"], [
      option("batch_strategy", "Training batch strategy", "full_batch", [["full_batch", "Full-batch updates"], ["stochastic", "Stochastic single-example updates"], ["mini_batch", "Mini-batch updates"]]),
      option("optimizer_api", "Parameter-update API", "manual", [["manual", "Manual tensor update"], ["torch_optim", "torch.optim optimizer"]]),
      option("evaluation_split", "Generalization check", "train_only", [["train_only", "Training loss only"], ["train_validation_test", "Train / validation / test split"]])
    ], { batch_strategy: "mini_batch", optimizer_api: "torch_optim", evaluation_split: "train_validation_test" },
    "Why are mini-batches commonly combined with a PyTorch optimizer?",
    "They offer efficient, noisy-but-useful gradient estimates while the optimizer owns parameter state and the update rule.",
    ["Update strategy", "Validation evidence", "Overfit risk"]
  )],
  ["04-intro-to-neural-networks-and-pytorch/module-4-multiple-input-output-linear-regression", profile(
    "multiple-input and multiple-output linear regression", "feature matrices, target matrices, and dimension-compatible training",
    ["Organize input features", "Select output targets", "Verify matrix dimensions"], [
      option("input_design", "Input feature design", "single_feature", [["single_feature", "One input feature"], ["feature_matrix", "Multiple-feature matrix"]]),
      option("target_design", "Prediction target", "single_target", [["single_target", "One target"], ["multi_target", "Multiple output targets"]]),
      option("shape_check", "Dimension check before training", "skip", [["skip", "Skip shape check"], ["verify", "Verify batch × feature / target shapes"]])
    ], { input_design: "feature_matrix", target_design: "multi_target", shape_check: "verify" },
    "What must align when a model predicts multiple targets from multiple input features?",
    "The input feature dimension must match the weight matrix and the output dimension must match every target vector.",
    ["Matrix alignment", "Target coverage", "Shape risk"]
  )],
  ["04-intro-to-neural-networks-and-pytorch/module-5-logistic-regression-for-classification", profile(
    "logistic regression for binary classification", "a sigmoid probability, a Bernoulli target, and binary cross-entropy",
    ["Map scores to probabilities", "Choose a classification loss", "Inspect initialization"], [
      option("output_link", "Output activation", "linear", [["linear", "Linear score"], ["sigmoid", "Sigmoid probability"]]),
      option("classification_loss", "Classification loss", "mse", [["mse", "Mean squared error"], ["binary_crossentropy", "Binary cross-entropy"]]),
      option("initialization", "Initial parameter state", "poor", [["poor", "Poor / saturated initialization"], ["balanced", "Balanced initialization"]])
    ], { output_link: "sigmoid", classification_loss: "binary_crossentropy", initialization: "balanced" },
    "Why is binary cross-entropy paired with a sigmoid output for Bernoulli labels?",
    "The sigmoid represents a class probability and binary cross-entropy is the negative log-likelihood for observed binary outcomes.",
    ["Classification fit", "Likelihood evidence", "Optimization risk"]
  )],
  ["04-intro-to-neural-networks-and-pytorch/module-6-final-project", profile(
    "an end-to-end PyTorch predictive project", "a reproducible split, an appropriate metric, and an honest baseline",
    ["Define the prediction task", "Set an evaluation plan", "Compare with a baseline"], [
      option("data_split", "Data split", "single_split", [["single_split", "One undifferentiated split"], ["reproducible_split", "Reproducible train / validation / test split"]]),
      option("metric", "Primary evaluation metric", "accuracy_only", [["accuracy_only", "Accuracy only"], ["task_metric", "Task-appropriate metric set"]]),
      option("baseline", "Baseline comparison", "none", [["none", "No baseline"], ["documented", "Documented baseline model"]])
    ], { data_split: "reproducible_split", metric: "task_metric", baseline: "documented" },
    "Why should a final project retain a test set and a baseline?",
    "They make the reported result comparable and help distinguish real generalization from tuning to a familiar validation set.",
    ["Project readiness", "Evaluation evidence", "Reporting risk"]
  )],
  ["05-deep-learning-with-pytorch/module-2-softmax-regression", profile(
    "softmax regression for multi-class prediction", "logits, normalized probabilities, and cross-entropy",
    ["Produce class logits", "Normalize with softmax", "Train with cross-entropy"], [
      option("prediction_head", "Class prediction head", "independent_scores", [["independent_scores", "Independent raw scores"], ["softmax", "Softmax over all classes"]]),
      option("loss", "Training loss", "mse", [["mse", "Mean squared error"], ["cross_entropy", "Cross-entropy on class labels"]]),
      option("input_shape", "Input representation", "flat", [["flat", "Flattened feature vector"], ["batch_classes", "Batched logits × classes"]])
    ], { prediction_head: "softmax", loss: "cross_entropy", input_shape: "batch_classes" },
    "What does softmax guarantee about a vector of class scores?",
    "It converts scores into non-negative probabilities that sum to one across the candidate classes.",
    ["Class calibration", "Label evidence", "Prediction risk"]
  )],
  ["05-deep-learning-with-pytorch/module-3-shallow-neural-networks", profile(
    "shallow neural networks and activation functions", "hidden units, nonlinear activation, and the XOR decision boundary",
    ["Add a hidden representation", "Choose a nonlinearity", "Test a nonlinear pattern"], [
      option("hidden_layer", "Hidden-layer capacity", "none", [["none", "No hidden layer"], ["compact", "Compact hidden layer"], ["expanded", "More hidden neurons"]]),
      option("activation", "Activation function", "linear", [["linear", "Linear activation"], ["relu", "ReLU activation"], ["sigmoid", "Sigmoid activation"]]),
      option("pattern", "Training pattern", "linearly_separable", [["linearly_separable", "Linearly separable samples"], ["xor", "XOR samples"]])
    ], { hidden_layer: "compact", activation: "relu", pattern: "xor" },
    "Why can a shallow network solve XOR while a single linear classifier cannot?",
    "A hidden layer with nonlinear activations can compose multiple boundaries into a nonlinearly separable decision region.",
    ["Representation fit", "Nonlinearity evidence", "Underfit risk"]
  )],
  ["05-deep-learning-with-pytorch/module-4-deep-neural-networks", profile(
    "deep-network training stability", "depth, initialization, regularization, momentum, and batch normalization",
    ["Build stacked layers", "Stabilize gradients", "Validate regularization"], [
      option("initialization", "Weight initialization", "same_value", [["same_value", "Same-value weights"], ["xavier_he", "Xavier / He initialization"]]),
      option("regularization", "Regularization", "none", [["none", "No dropout or normalization"], ["dropout_batchnorm", "Dropout plus batch normalization"]]),
      option("optimizer", "Optimizer behavior", "plain_sgd", [["plain_sgd", "Plain SGD"], ["momentum", "SGD with momentum"]])
    ], { initialization: "xavier_he", regularization: "dropout_batchnorm", optimizer: "momentum" },
    "How do initialization, normalization, and momentum help a deep network train?",
    "They improve signal and gradient scale, reduce unstable internal distributions, and smooth updates through consistently useful directions.",
    ["Training stability", "Generalization evidence", "Gradient risk"]
  )],
  ["05-deep-learning-with-pytorch/module-5-convolutional-neural-networks", profile(
    "convolutional neural networks in PyTorch", "local kernels, channel depth, pooling, and pretrained vision models",
    ["Extract local patterns", "Reduce spatial dimensions", "Choose a vision backbone"], [
      option("feature_extractor", "Feature extractor", "dense", [["dense", "Dense layers on pixels"], ["convolution", "Convolutional kernels"]]),
      option("spatial_reduction", "Spatial reduction", "none", [["none", "No pooling"], ["maxpool", "Max pooling"]]),
      option("model_start", "Model starting point", "scratch", [["scratch", "Train from scratch"], ["torchvision", "Use a torchvision pretrained model"]])
    ], { feature_extractor: "convolution", spatial_reduction: "maxpool", model_start: "torchvision" },
    "Why are convolutions useful for images?",
    "Shared local kernels detect patterns wherever they occur, retaining spatial structure with far fewer parameters than dense pixel connections.",
    ["Vision design", "Feature evidence", "Compute risk"]
  )],
  ["05-deep-learning-with-pytorch/module-6-final-project", profile(
    "a PyTorch computer-vision capstone", "data augmentation, model selection, and error-aware evaluation",
    ["Prepare image data", "Train a vision model", "Review errors and metrics"], [
      option("augmentation", "Image augmentation", "none", [["none", "No augmentation"], ["task_safe", "Task-safe augmentation"]]),
      option("model", "Vision model", "baseline", [["baseline", "Small baseline CNN"], ["validated_cnn", "Validated CNN / transfer model"]]),
      option("evaluation", "Evaluation review", "accuracy_only", [["accuracy_only", "Accuracy only"], ["errors_metrics", "Metrics plus error examples"]])
    ], { augmentation: "task_safe", model: "validated_cnn", evaluation: "errors_metrics" },
    "Why inspect error examples in addition to aggregate accuracy in a vision project?",
    "Errors reveal class imbalance, ambiguous labels, and data shifts that a single aggregate metric can hide.",
    ["Capstone fit", "Error evidence", "Deployment risk"]
  )],
  ["06-ai-capstone-project-with-deep-learning/module-1-data-handling", profile(
    "image data loading and augmentation", "lazy loading, augmentation safety, and framework-specific pipelines",
    ["Load the image corpus", "Apply safe augmentation", "Batch reproducibly"], [
      option("loading", "Loading strategy", "bulk", [["bulk", "Load all images eagerly"], ["lazy", "Lazy / streamed loading"]]),
      option("augmentation", "Augmentation policy", "none", [["none", "No augmentation"], ["label_safe", "Label-safe image augmentation"]]),
      option("pipeline", "Data pipeline", "manual", [["manual", "Manual batch handling"], ["framework_pipeline", "Keras / PyTorch data pipeline"]])
    ], { loading: "lazy", augmentation: "label_safe", pipeline: "framework_pipeline" },
    "When is lazy image loading preferable to loading a whole corpus at once?",
    "It bounds memory use and can overlap disk access, transformation, and model computation for large datasets.",
    ["Pipeline fit", "Data coverage", "Memory risk"]
  )],
  ["06-ai-capstone-project-with-deep-learning/module-2-cnn-model-development", profile(
    "CNN model development across Keras and PyTorch", "comparable architectures, compatible preprocessing, and fair evaluation",
    ["Define a classifier", "Keep experiments comparable", "Evaluate both implementations"], [
      option("framework", "Implementation framework", "single", [["single", "One untracked implementation"], ["keras_pytorch", "Comparable Keras and PyTorch implementations"]]),
      option("preprocessing", "Image preprocessing", "inconsistent", [["inconsistent", "Different preprocessing paths"], ["matched", "Matched preprocessing and labels"]]),
      option("comparison", "Model comparison", "anecdotal", [["anecdotal", "Anecdotal comparison"], ["heldout_metrics", "Held-out metrics and timing"]])
    ], { framework: "keras_pytorch", preprocessing: "matched", comparison: "heldout_metrics" },
    "Why must preprocessing be matched when comparing Keras and PyTorch classifiers?",
    "Otherwise differences in the input distribution can be mistaken for differences in framework or architecture quality.",
    ["Comparison fairness", "Evaluation evidence", "Confounding risk"]
  )],
  ["06-ai-capstone-project-with-deep-learning/module-3-cnn-vision-transformer-integration", profile(
    "CNN and Vision Transformer integration", "inductive bias, patch embeddings, and comparative evaluation",
    ["Choose visual representation", "Configure patches or kernels", "Evaluate the trade-off"], [
      option("architecture", "Visual architecture", "cnn_only", [["cnn_only", "CNN only"], ["vit", "Vision Transformer"], ["comparative", "CNN and ViT comparison"]]),
      option("representation", "Input representation", "raw", [["raw", "Unspecified input"], ["patch_or_kernel", "Explicit patches / kernels"]]),
      option("evaluation", "Evaluation approach", "single_metric", [["single_metric", "One metric"], ["accuracy_cost", "Accuracy plus compute cost"]])
    ], { architecture: "comparative", representation: "patch_or_kernel", evaluation: "accuracy_cost" },
    "What is a useful reason to compare a CNN and a Vision Transformer?",
    "They encode different visual assumptions, so comparing accuracy and compute under the same data pipeline clarifies the practical trade-off.",
    ["Architecture fit", "Comparison evidence", "Compute risk"]
  )],
  ["07-gen-ai-and-llms-architecture-and-data-preparation/module-1-generative-ai-architecture", profile(
    "generative-AI architectures, tools, and hallucination awareness", "model family, grounded use, and output review",
    ["Select a generative task", "Choose an appropriate model/tool", "Review generated output"], [
      option("model_family", "Generative model family", "unspecified", [["unspecified", "Unspecified model"], ["transformer", "Transformer language model"], ["diffusion", "Diffusion image model"]]),
      option("grounding", "Output grounding", "none", [["none", "No supporting context"], ["source_context", "Use supplied source context"]]),
      option("review", "Hallucination review", "skip", [["skip", "Skip review"], ["verify", "Verify claims before use"]])
    ], { model_family: "transformer", grounding: "source_context", review: "verify" },
    "Why should generated content be reviewed even when a model appears fluent?",
    "Fluency does not guarantee factual support, so claims need verification against reliable context or sources.",
    ["Task alignment", "Grounding evidence", "Hallucination risk"]
  )],
  ["07-gen-ai-and-llms-architecture-and-data-preparation/module-2-data-prep-for-llms", profile(
    "LLM tokenization and data preparation", "token boundaries, data quality and diversity, and reproducible loaders",
    ["Tokenize the corpus", "Filter and diversify examples", "Create a reproducible loader"], [
      option("tokenization", "Tokenization approach", "character", [["character", "Character-level only"], ["subword", "Subword tokenization"]]),
      option("data_quality", "Data quality policy", "unfiltered", [["unfiltered", "Unfiltered corpus"], ["clean_diverse", "Clean and diverse corpus"]]),
      option("loader", "Dataset loader", "ad_hoc", [["ad_hoc", "Ad-hoc loading"], ["reproducible", "Reproducible loader and split"]])
    ], { tokenization: "subword", data_quality: "clean_diverse", loader: "reproducible" },
    "Why are data quality and diversity both important for LLM preparation?",
    "Quality reduces harmful noise while diversity broadens coverage and reduces brittle behavior on varied language use.",
    ["Corpus readiness", "Data evidence", "Bias / noise risk"]
  )],
  ["08-gen-ai-foundational-models-for-nlp/module-1-fundamentals-of-language-understanding", profile(
    "foundational NLP representations and language modeling", "word features, document labels, n-grams, and training objectives",
    ["Represent text as features", "Choose a prediction objective", "Evaluate held-out language"], [
      option("representation", "Text representation", "raw_text", [["raw_text", "Raw text only"], ["features", "Token / feature representation"], ["ngram", "N-gram representation"]]),
      option("objective", "Learning objective", "unspecified", [["unspecified", "Unspecified objective"], ["document_classification", "Document classification"], ["next_token", "Next-token language modeling"]]),
      option("evaluation", "Held-out check", "none", [["none", "No held-out evaluation"], ["heldout", "Held-out examples / loss"]])
    ], { representation: "features", objective: "document_classification", evaluation: "heldout" },
    "What distinguishes document classification from language modeling?",
    "Classification maps a document to a label, while language modeling estimates likely next tokens in context.",
    ["Representation fit", "Objective evidence", "Generalization risk"]
  )],
  ["08-gen-ai-foundational-models-for-nlp/module-2-word2-vec-and-sequence-to-sequence-models", profile(
    "Word2Vec, encoder-decoder models, and sequence evaluation", "embeddings, context windows, encoder-decoder roles, and generation metrics",
    ["Learn word relationships", "Encode an input sequence", "Decode and evaluate output"], [
      option("embedding", "Embedding strategy", "one_hot", [["one_hot", "One-hot vectors"], ["word2vec", "Word2Vec embeddings"]]),
      option("sequence_model", "Sequence architecture", "single_encoder", [["single_encoder", "Encoder only"], ["encoder_decoder", "Encoder-decoder model"]]),
      option("evaluation", "Generation evaluation", "surface_only", [["surface_only", "Surface form only"], ["task_metrics", "Task and generation metrics"]])
    ], { embedding: "word2vec", sequence_model: "encoder_decoder", evaluation: "task_metrics" },
    "What does an encoder-decoder architecture separate in a sequence-to-sequence task?",
    "The encoder builds a contextual representation of the input, and the decoder conditions on it to generate the output sequence.",
    ["Sequence design", "Semantic evidence", "Generation risk"]
  )],
  ["09-gen-ai-language-modeling-with-transformers/module-1-fundamental-concepts-of-transformer-architecture", profile(
    "Transformer encoder fundamentals", "positional encoding, self-attention, and efficient supervised training",
    ["Add position information", "Route context with attention", "Train and validate the encoder"], [
      option("position_signal", "Position information", "none", [["none", "No position signal"], ["positional_encoding", "Positional encoding"]]),
      option("attention", "Attention mechanism", "independent_tokens", [["independent_tokens", "Independent tokens"], ["self_attention", "Self-attention across tokens"]]),
      option("training", "Training evaluation", "train_only", [["train_only", "Training result only"], ["validated", "Validated efficient training"]])
    ], { position_signal: "positional_encoding", attention: "self_attention", training: "validated" },
    "Why does a Transformer need positional information?",
    "Self-attention alone is permutation-invariant, so positional encoding tells the model which tokens occur earlier or later.",
    ["Context modeling", "Position evidence", "Sequence risk"]
  )],
  ["09-gen-ai-language-modeling-with-transformers/module-2-advanced-concepts-of-transformer-architecture", profile(
    "decoder, BERT-style pretraining, and translation Transformers", "causal masks, masked-token objectives, and encoder-decoder translation",
    ["Select a language-model objective", "Apply the right attention mask", "Evaluate generation or translation"], [
      option("architecture", "Transformer architecture", "encoder_only", [["encoder_only", "Encoder-only model"], ["decoder_causal", "Causal decoder"], ["encoder_decoder", "Encoder-decoder translation"]]),
      option("mask", "Attention mask", "none", [["none", "No task-specific mask"], ["causal", "Causal mask for decoding"], ["masked_token", "Masked-token pretraining"]]),
      option("evaluation", "Output evaluation", "train_loss", [["train_loss", "Training loss only"], ["heldout_generation", "Held-out generation / translation"]])
    ], { architecture: "decoder_causal", mask: "causal", evaluation: "heldout_generation" },
    "Why is a causal mask required in autoregressive decoding?",
    "It prevents each position from reading future tokens, preserving the prediction task of generating the next token from prior context.",
    ["Architecture fit", "Mask evidence", "Information-leak risk"]
  )],
  ["10-gen-ai-engineering-and-fine-tuning-transformers/module-1-transformers-and-fine-tuning", profile(
    "pretrained Transformer inference and fine-tuning", "model loading, task datasets, parameter updates, and held-out evaluation",
    ["Load a pretrained model", "Adapt it to the task", "Measure the result"], [
      option("starting_point", "Model starting point", "random", [["random", "Random initialization"], ["pretrained", "Pretrained Hugging Face / PyTorch model"]]),
      option("adaptation", "Adaptation stage", "inference_only", [["inference_only", "Inference only"], ["fine_tune", "Task-specific fine-tuning"]]),
      option("evaluation", "Evaluation policy", "demo", [["demo", "Single demo example"], ["heldout", "Held-out task metrics"]])
    ], { starting_point: "pretrained", adaptation: "fine_tune", evaluation: "heldout" },
    "What is the advantage of fine-tuning a pretrained Transformer rather than starting randomly?",
    "Pretraining supplies broadly useful representations so the task-specific dataset can adapt them with far less data and compute.",
    ["Adaptation fit", "Task evidence", "Overfit risk"]
  )],
  ["10-gen-ai-engineering-and-fine-tuning-transformers/module-2-parameter-efficient-fine-tuning-peft", profile(
    "parameter-efficient fine-tuning with adapters and LoRA", "frozen base weights, low-rank updates, and responsible adaptation",
    ["Freeze the base model", "Add a small adaptation path", "Evaluate capability and impact"], [
      option("method", "Adaptation method", "full_fine_tune", [["full_fine_tune", "Update all model weights"], ["adapter_lora", "Adapters / LoRA"]]),
      option("base_weights", "Base-model weights", "updated", [["updated", "Update base weights"], ["frozen", "Freeze base weights"]]),
      option("review", "Responsible-use review", "skip", [["skip", "Skip review"], ["document", "Document data, limits, and impact"]])
    ], { method: "adapter_lora", base_weights: "frozen", review: "document" },
    "How does LoRA reduce fine-tuning cost?",
    "It keeps the large base weights fixed and learns small low-rank update matrices instead of a full parameter delta.",
    ["Efficiency fit", "Adaptation evidence", "Governance risk"]
  )],
  ["11-gen-ai-advanced-fine-tuning-for-llms/module-1-diff-approaches-to-fine-tuning", profile(
    "instruction tuning and reward modeling", "instruction-response data, preference signals, reward-model evaluation, and best practices",
    ["Format instruction data", "Model response preferences", "Validate reward behavior"], [
      option("training_style", "Fine-tuning style", "raw_completion", [["raw_completion", "Raw completion data"], ["instruction_tuning", "Instruction-response tuning"]]),
      option("preference_signal", "Preference signal", "none", [["none", "No preference signal"], ["reward_model", "Reward-model preference signal"]]),
      option("validation", "Reward validation", "train_only", [["train_only", "Training result only"], ["heldout_pairs", "Held-out preference pairs"]])
    ], { training_style: "instruction_tuning", preference_signal: "reward_model", validation: "heldout_pairs" },
    "What does a reward model learn in preference-based fine-tuning?",
    "It estimates which response is preferred for a prompt, creating a scalar training signal from comparative human feedback.",
    ["Alignment design", "Preference evidence", "Reward-hacking risk"]
  )],
  ["11-gen-ai-advanced-fine-tuning-for-llms/module-2-fine-tuning-causal-llms-w-human-feedback-and-direct-preference", profile(
    "RLHF, PPO, and direct preference optimization", "policy distributions, preference pairs, constrained updates, and direct objectives",
    ["Represent a response policy", "Use preference feedback", "Constrain optimization"], [
      option("objective", "Optimization objective", "likelihood_only", [["likelihood_only", "Likelihood only"], ["rlhf_or_dpo", "RLHF / DPO preference objective"]]),
      option("policy_update", "Policy update", "unconstrained", [["unconstrained", "Unconstrained update"], ["ppo_constrained", "PPO-style constrained update"]]),
      option("preference_data", "Preference data", "single_response", [["single_response", "Single response labels"], ["paired_preferences", "Chosen / rejected pairs"]])
    ], { objective: "rlhf_or_dpo", policy_update: "ppo_constrained", preference_data: "paired_preferences" },
    "Why does PPO constrain policy updates in RLHF?",
    "The constraint limits harmful jumps away from the reference behavior while still improving predicted reward from preference feedback.",
    ["Preference fit", "Policy evidence", "Drift risk"]
  )],
  ["12-fundamentals-of-ai-agents-w-rag-and-lang-chain/module-1-rag-framework", profile(
    "retrieval-augmented generation", "embedding retrieval, vector indexes, source grounding, and answer evaluation",
    ["Index relevant documents", "Retrieve contextual passages", "Generate a grounded answer"], [
      option("retrieval", "Retrieval method", "none", [["none", "No retrieval context"], ["vector_search", "Vector search / FAISS"]]),
      option("context", "Answer context", "model_memory", [["model_memory", "Model memory only"], ["retrieved_sources", "Retrieved source passages"]]),
      option("evaluation", "Answer check", "fluency_only", [["fluency_only", "Fluency only"], ["grounding", "Grounding and relevance check"]])
    ], { retrieval: "vector_search", context: "retrieved_sources", evaluation: "grounding" },
    "What is the core purpose of retrieval in a RAG system?",
    "It supplies relevant external context at answer time so the model can ground a response in selected documents rather than rely only on parameters.",
    ["Retrieval fit", "Grounding evidence", "Hallucination risk"]
  )],
  ["12-fundamentals-of-ai-agents-w-rag-and-lang-chain/module-2-prompt-engineering-and-lang-chain", profile(
    "prompt engineering, LangChain components, and agent workflows", "clear instructions, prompt templates, tool calls, memory, and output checks",
    ["Frame the prompt", "Compose chains and tools", "Check the agent output"], [
      option("prompt_style", "Prompt strategy", "vague", [["vague", "Vague instruction"], ["structured", "Structured prompt template"], ["few_shot", "Few-shot in-context examples"]]),
      option("workflow", "Application workflow", "single_call", [["single_call", "Single unstructured call"], ["chain_tools", "Chain with explicit tools / components"]]),
      option("verification", "Output verification", "none", [["none", "No output check"], ["source_or_tool_check", "Source or tool-result check"]])
    ], { prompt_style: "structured", workflow: "chain_tools", verification: "source_or_tool_check" },
    "What is a benefit of a prompt template in an application workflow?",
    "It makes the task instructions and required variables repeatable, testable, and easier to revise than ad-hoc prompt strings.",
    ["Workflow fit", "Tool evidence", "Reliability risk"]
  )],
  ["13-gen-ai-applications-with-rag-and-lang-chain-project/module-1-document-loader-using-lang-chain", profile(
    "document loading and text splitting for LangChain", "loader choice, metadata retention, chunk boundaries, and retrieval-ready documents",
    ["Load source documents", "Preserve useful metadata", "Split text for retrieval"], [
      option("loader", "Document loader", "generic", [["generic", "Generic untracked loader"], ["source_aware", "Source-aware LangChain loader"]]),
      option("metadata", "Metadata handling", "discard", [["discard", "Discard metadata"], ["retain", "Retain source and page metadata"]]),
      option("chunking", "Text splitting strategy", "single_document", [["single_document", "One large document"], ["semantic_chunks", "Bounded semantic chunks"]])
    ], { loader: "source_aware", metadata: "retain", chunking: "semantic_chunks" },
    "Why preserve source metadata when loading documents for RAG?",
    "Metadata supports filtering, citations, debugging, and traceable answers after the text has been split into chunks.",
    ["Loading fit", "Traceability evidence", "Retrieval risk"]
  )],
  ["13-gen-ai-applications-with-rag-and-lang-chain-project/module-2-rag-using-lang-chain", profile(
    "building a LangChain RAG application", "embeddings, vector stores, retrievers, and grounded answer generation",
    ["Embed document chunks", "Retrieve relevant context", "Answer with source support"], [
      option("index", "Vector index", "none", [["none", "No vector index"], ["embedding_store", "Embedding vector store"]]),
      option("retriever", "Retriever strategy", "all_docs", [["all_docs", "Pass all documents"], ["relevance_retriever", "Relevance-based retriever"]]),
      option("answer", "Answer policy", "ungrounded", [["ungrounded", "Answer without cited context"], ["grounded", "Grounded answer using retrieved context"]])
    ], { index: "embedding_store", retriever: "relevance_retriever", answer: "grounded" },
    "Why use a retriever instead of passing every document to a language model?",
    "Retrieval selects a smaller relevant context, which reduces prompt cost and distraction while improving traceability.",
    ["RAG design", "Context evidence", "Irrelevance risk"]
  )],
  ["13-gen-ai-applications-with-rag-and-lang-chain-project/module-3-qa-bot", profile(
    "a retrieval-backed QA bot with Gradio", "user interface inputs, retrieval context, and transparent answer feedback",
    ["Accept a user question", "Retrieve supporting context", "Show a grounded response"], [
      option("interface", "QA interface", "static", [["static", "Static answer page"], ["gradio", "Interactive Gradio interface"]]),
      option("context", "Answer context", "none", [["none", "No retrieved context"], ["retrieved", "Retrieved documents"]]),
      option("feedback", "Answer feedback", "hidden", [["hidden", "Hide support and limits"], ["transparent", "Show sources / limitations"]])
    ], { interface: "gradio", context: "retrieved", feedback: "transparent" },
    "What should a useful QA bot surface alongside an answer when possible?",
    "It should make the supporting context or limitations visible so the user can judge whether the response is well grounded.",
    ["Application fit", "Answer evidence", "Trust risk"]
  )]
]);

function humanize(value) {
  return String(value || "Lesson")
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+-/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\bvi t\b/gi, "ViT")
    .replace(/\bllms?\b/gi, (match) => match.toUpperCase())
    .replace(/\brag\b/gi, "RAG")
    .replace(/\blo ra\b/gi, "LoRA")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sourceTitle(entry) {
  const filename = String(entry.sourcePath || "").split("/").at(-1) || entry.id.split("/").at(-1);
  return humanize(filename);
}

function seedFor(text) {
  return [...String(text)].reduce((seed, character) => ((seed * 31) + character.charCodeAt(0)) % 100000, 17);
}

function cloneControls(controls) {
  return controls.map((control) => ({ ...control, options: control.options?.map((item) => ({ ...item })) }));
}

export function createRemainingLessonSpec(entry) {
  if (!entry?.id || !entry.courseId || !entry.moduleId || !entry.sourcePath || !entry.sourceFormat) {
    throw new Error("A remaining-course lesson requires its complete manifest entry.");
  }
  const key = `${entry.courseId}/${entry.moduleId}`;
  const config = PROFILES.get(key);
  if (!config) throw new Error(`No lesson profile registered for ${key}.`);
  const title = sourceTitle(entry);
  const baseline = Object.fromEntries(config.controls.map((control) => [control.id, control.default]));

  return {
    id: entry.id,
    courseId: entry.courseId,
    moduleId: entry.moduleId,
    title,
    sourcePath: entry.sourcePath,
    sourceFormat: entry.sourceFormat,
    engine: "LessonStudioLab",
    learningObjectives: [
      `Explain how ${title.toLowerCase()} relates to ${config.topic}.`,
      `Configure a lesson scenario using ${config.concepts} and interpret the modeled trade-offs.`
    ],
    scenario: {
      description: `Use this guided model to make the key decisions behind “${title}”. The controls represent concepts from the source lesson; outcomes are illustrative rather than measured notebook results.`,
      seed: seedFor(entry.id)
    },
    controls: cloneControls(config.controls),
    views: [
      { type: "decision-workflow", title: `${title}: concept workflow`, bindings: config.controls.map((control) => control.id) },
      { type: "modeled-metrics", title: "Configuration fit and risk", bindings: ["alignment", "evidence", "risk"] }
    ],
    explanationRules: [
      {
        when: Object.entries(config.success).map(([key, value]) => `${key} === '${value}'`).join(" && "),
        summary: "Recommended lesson configuration",
        detail: `This setting combines ${config.concepts} in the direction emphasized by this module.`
      },
      {
        when: "otherwise",
        summary: "Compare the trade-off",
        detail: "Change one control at a time, then relate the modeled change to the corresponding source explanation or lab cell."
      }
    ],
    presets: [
      { id: "baseline", label: "Starting point", values: baseline },
      { id: "recommended", label: "Recommended concept setup", values: { ...config.success } }
    ],
    challenge: {
      prompt: `Configure the lesson decisions so they reflect the recommended ${config.topic} workflow.`,
      success: { ...config.success },
      hints: [
        `Follow the three workflow steps: ${config.workflow.join(" → ")}.`,
        "Use “Recommended concept setup” to review the target, then Reset and reproduce it yourself."
      ]
    },
    quiz: [{
      prompt: config.question,
      choices: [config.explanation, "It is only a formatting choice and does not affect the model or workflow.", "It removes the need to evaluate held-out data.", "It guarantees a result without checking the source material."],
      answer: 0,
      explanation: config.explanation
    }],
    accessibility: {
      canvasSummary: `A three-step workflow for ${title}: ${config.workflow.join(", then ")}.`,
      keyboardHelp: "Use Tab to move through presets and controls. Choose a value with arrow keys, then use Reset to restore the starting point."
    },
    simulation: {
      topic: config.topic,
      workflow: config.workflow,
      metrics: config.metrics,
      nextInsight: `The current choices do not yet align with all of this module's modeled recommendations for ${config.concepts}.`,
      successInsight: `The choices now align with the core module concepts: ${config.concepts}.`
    }
  };
}

export default createRemainingLessonSpec;
