import { getDedicatedLessonBlueprint, DEDICATED_LESSON_BLUEPRINTS } from "./dedicated-course-blueprints.js";

const select = (id, label, defaultValue, values) => ({
  id,
  label,
  type: "select",
  default: defaultValue,
  options: values.map(([value, text]) => ({ value, label: text }))
});

const controlSet = (topic, controls, metrics) => ({ topic, controls, metrics });

const CONTROL_SETS = {
  tensor: controlSet("PyTorch tensor operations", [
    select("operation", "Tensor operation", "index", [["index", "Index or slice a tensor"], ["broadcast", "Broadcast an elementwise operation"], ["matmul", "Verify matrix multiplication"]]),
    select("shape_check", "Shape check", "skip", [["skip", "Skip the shape check"], ["inspect", "Inspect dimensions"], ["verify", "Verify the result shape"]]),
    select("prediction", "Prediction before execution", "guess", [["guess", "Guess the output"], ["values", "Predict only values"], ["values_and_shape", "Predict values and shape"]])
  ], ["Operation fit", "Shape evidence", "Broadcast risk"]),
  autograd: controlSet("autograd and computational graphs", [
    select("graph_step", "Graph construction", "values", [["values", "Track values only"], ["operations", "Compose differentiable operations"], ["chain_rule", "Trace the chain rule"]]),
    select("gradient_scope", "Gradient scope", "detached", [["detached", "Detach the intermediate value"], ["local", "Inspect a local gradient"], ["full", "Inspect gradients through the full graph"]]),
    select("verification", "Derivative verification", "assume", [["assume", "Assume the derivative"], ["compare", "Compare local derivatives"], ["check", "Check the selected derivative"]])
  ], ["Graph coverage", "Gradient evidence", "Detach risk"]),
  data: controlSet("data loading and preprocessing", [
    select("loading", "Loading strategy", "eager", [["eager", "Load everything eagerly"], ["loader", "Use a dataset loader"], ["streamed", "Use a reproducible streamed loader"]]),
    select("batching", "Batching and order", "unbatched", [["unbatched", "No controlled batching"], ["batched", "Use batches"], ["batched_shuffled", "Batch and shuffle reproducibly"]]),
    select("transforms", "Transform policy", "raw", [["raw", "Use raw samples"], ["applied", "Apply a transform"], ["verified", "Apply and verify label-safe transforms"]])
  ], ["Pipeline fit", "Sample evidence", "Memory / label risk"]),
  regression: controlSet("regression fitting and residuals", [
    select("model", "Regression model", "baseline", [["baseline", "Use a constant baseline"], ["linear", "Fit a linear model"], ["multi_feature", "Fit the matching feature model"]]),
    select("loss", "Loss inspection", "none", [["none", "Do not inspect residuals"], ["residuals", "Inspect residuals"], ["minimized", "Minimize the selected loss"]]),
    select("interpretation", "Parameter interpretation", "skip", [["skip", "Skip parameter meaning"], ["coefficients", "Read coefficients"], ["contributions", "Trace feature contributions"]])
  ], ["Fit quality", "Residual evidence", "Model mismatch risk"]),
  optimizer: controlSet("optimization and parameter updates", [
    select("update_rule", "Update rule", "manual", [["manual", "Unstructured manual updates"], ["gradient", "Use a gradient update"], ["optimizer", "Use a controlled optimizer step"]]),
    select("stability", "Learning-rate stability", "aggressive", [["aggressive", "Aggressive step size"], ["moderate", "Moderate step size"], ["stable", "Stable convergence setting"]]),
    select("gradient_reset", "Gradient lifecycle", "accumulate", [["accumulate", "Accumulate stale gradients"], ["inspect", "Inspect gradients"], ["zero_and_step", "Zero gradients, then step"]])
  ], ["Update quality", "Convergence evidence", "Divergence risk"]),
  validation: controlSet("validation design", [
    select("split", "Data split", "train_only", [["train_only", "Train data only"], ["holdout", "Use a holdout set"], ["train_val_test", "Use train / validation / test"]]),
    select("constraints", "Split constraints", "ignore", [["ignore", "Ignore order or groups"], ["shuffle", "Shuffle when appropriate"], ["respect", "Respect temporal or group constraints"]]),
    select("reporting", "Reporting policy", "single", [["single", "Report one training score"], ["validation", "Compare validation results"], ["unbiased", "Report held-out evidence"]])
  ], ["Design quality", "Held-out evidence", "Leakage risk"]),
  classification: controlSet("classification probabilities and boundaries", [
    select("head", "Prediction head", "raw_score", [["raw_score", "Use raw scores"], ["probability", "Convert scores to probabilities"], ["task_head", "Use the task-appropriate class head"]]),
    select("threshold", "Decision threshold", "default", [["default", "Use an unexamined threshold"], ["inspect", "Inspect probability trade-offs"], ["validated", "Validate the decision threshold"]]),
    select("loss", "Classification loss", "mse", [["mse", "Use mean squared error"], ["compare", "Compare losses"], ["cross_entropy", "Use cross-entropy for class probabilities"]])
  ], ["Decision fit", "Probability evidence", "Misclassification risk"]),
  probability: controlSet("probability distributions and policies", [
    select("scores", "Score representation", "raw", [["raw", "Treat scores as unnormalized"], ["logits", "Inspect logits"], ["distribution", "Normalize a probability distribution"]]),
    select("temperature", "Temperature policy", "extreme", [["extreme", "Use an extreme temperature"], ["explore", "Explore temperature"], ["calibrated", "Use a calibrated temperature"]]),
    select("sampling", "Sampling / preference evidence", "ignore", [["ignore", "Ignore probability mass"], ["inspect", "Inspect probability mass"], ["justify", "Justify the policy change"]])
  ], ["Policy fit", "Distribution evidence", "Sampling risk"]),
  loss: controlSet("loss functions and likelihood", [
    select("target", "Target interpretation", "numeric", [["numeric", "Treat all targets as numeric"], ["labels", "Inspect labels"], ["probabilistic", "Use the probabilistic target model"]]),
    select("objective", "Objective", "mse", [["mse", "Mean squared error"], ["compare", "Compare candidate losses"], ["likelihood", "Use the likelihood-consistent loss"]]),
    select("diagnosis", "Loss diagnosis", "skip", [["skip", "Skip diagnosis"], ["inspect", "Inspect confidence and error"], ["explain", "Explain the loss behavior"]])
  ], ["Objective fit", "Likelihood evidence", "Calibration risk"]),
  project: controlSet("end-to-end project design", [
    select("data_plan", "Data plan", "ad_hoc", [["ad_hoc", "Ad-hoc preparation"], ["reproducible", "Reproducible preparation"], ["audited", "Reproducible and audited preparation"]]),
    select("model_plan", "Model plan", "guess", [["guess", "Choose without a baseline"], ["baseline", "Create a baseline"], ["validated", "Compare validated candidates"]]),
    select("evaluation", "Evaluation evidence", "demo", [["demo", "Use a demo example"], ["metrics", "Use held-out metrics"], ["errors", "Use metrics and error review"]])
  ], ["Project readiness", "Evaluation evidence", "Delivery risk"]),
  network: controlSet("neural-network architecture", [
    select("capacity", "Model capacity", "linear", [["linear", "Linear baseline"], ["hidden", "Add a hidden representation"], ["matched", "Match capacity to the task"]]),
    select("nonlinearity", "Nonlinearity", "none", [["none", "No nonlinear activation"], ["activation", "Choose an activation"], ["tested", "Test activation behavior"]]),
    select("training_check", "Training check", "train_only", [["train_only", "Watch training only"], ["loss", "Inspect loss behavior"], ["validation", "Validate architecture behavior"]])
  ], ["Architecture fit", "Learning evidence", "Underfit / overfit risk"]),
  activation: controlSet("activation and gradient flow", [
    select("activation", "Activation function", "saturated", [["saturated", "Saturated activation region"], ["compare", "Compare activation curves"], ["stable", "Use a stable activation region"]]),
    select("depth", "Depth context", "shallow", [["shallow", "Shallow context"], ["deep", "Deep stack"], ["diagnosed", "Diagnose depth-related gradients"]]),
    select("gradient_check", "Gradient check", "skip", [["skip", "Skip gradient inspection"], ["observe", "Observe gradient scale"], ["preserve", "Preserve useful gradient flow"]])
  ], ["Activation fit", "Gradient evidence", "Vanishing risk"]),
  vision: controlSet("vision model design", [
    select("representation", "Visual representation", "pixels", [["pixels", "Flatten raw pixels"], ["features", "Use learned visual features"], ["spatial", "Preserve spatial structure"]]),
    select("architecture", "Architecture choice", "baseline", [["baseline", "Simple baseline"], ["cnn", "Convolutional model"], ["comparative", "Compare suitable vision architectures"]]),
    select("evaluation", "Vision evaluation", "accuracy", [["accuracy", "Accuracy only"], ["errors", "Review error examples"], ["robust", "Review accuracy, errors, and compute"]])
  ], ["Vision fit", "Feature evidence", "Generalization risk"]),
  performance: controlSet("performance and deployment trade-offs", [
    select("measurement", "Measurement", "single", [["single", "One headline metric"], ["profile", "Profile runtime behavior"], ["balanced", "Balance accuracy, latency, and memory"]]),
    select("optimization", "Optimization", "none", [["none", "No optimization"], ["candidate", "Try an optimization"], ["validated", "Validate an optimization trade-off"]]),
    select("deployment", "Deployment decision", "assume", [["assume", "Assume the target is met"], ["constraints", "Check constraints"], ["evidence", "Document deployment evidence"]])
  ], ["Deployment fit", "Performance evidence", "Resource risk"]),
  concept: controlSet("concepts, tools, and workflows", [
    select("concept", "Core concept", "memorize", [["memorize", "Memorize a label"], ["compare", "Compare concepts"], ["apply", "Apply the concept in context"]]),
    select("workflow", "Workflow step", "isolated", [["isolated", "Treat it in isolation"], ["connected", "Connect workflow stages"], ["end_to_end", "Trace an end-to-end workflow"]]),
    select("evidence", "Evidence check", "assert", [["assert", "Assert an answer"], ["inspect", "Inspect evidence"], ["justify", "Justify the decision"]])
  ], ["Concept fit", "Workflow evidence", "Misconception risk"]),
  safety: controlSet("safety, ethics, and data quality", [
    select("stakeholders", "Stakeholder review", "skip", [["skip", "Skip stakeholder review"], ["identify", "Identify affected groups"], ["address", "Address the stated impact"]]),
    select("controls", "Safeguards", "none", [["none", "No safeguard"], ["monitor", "Add monitoring"], ["mitigate", "Add mitigation and escalation"]]),
    select("documentation", "Documentation", "implicit", [["implicit", "Keep assumptions implicit"], ["record", "Record decisions"], ["auditable", "Make the rationale auditable"]])
  ], ["Safeguard fit", "Review evidence", "Harm risk"]),
  nlp: controlSet("NLP features and tokenization", [
    select("representation", "Text representation", "raw", [["raw", "Use raw text only"], ["tokens", "Inspect tokens"], ["task_features", "Use task-appropriate features"]]),
    select("context", "Context handling", "ignore", [["ignore", "Ignore context"], ["window", "Use a context window"], ["validated", "Validate context and preprocessing"]]),
    select("evaluation", "NLP evaluation", "surface", [["surface", "Surface inspection only"], ["task", "Task metric"], ["error_review", "Task metric plus error review"]])
  ], ["Representation fit", "Context evidence", "Language risk"]),
  embedding: controlSet("embeddings and semantic similarity", [
    select("embedding", "Embedding representation", "one_hot", [["one_hot", "One-hot / sparse features"], ["vectors", "Dense vector embeddings"], ["semantic", "Validate semantic neighborhoods"]]),
    select("similarity", "Similarity signal", "raw", [["raw", "Use raw overlap"], ["cosine", "Use cosine similarity"], ["retrieval", "Inspect similarity for retrieval"]]),
    select("evaluation", "Embedding evaluation", "assume", [["assume", "Assume semantic quality"], ["neighbors", "Inspect neighbors"], ["task", "Evaluate on the target task"]])
  ], ["Semantic fit", "Similarity evidence", "Retrieval risk"]),
  sequence: controlSet("sequence-to-sequence modeling", [
    select("architecture", "Sequence architecture", "single", [["single", "Single sequence component"], ["encoder_decoder", "Encoder-decoder structure"], ["contextual", "Use contextual sequence modeling"]]),
    select("decoding", "Decoding strategy", "unconstrained", [["unconstrained", "Unconstrained output"], ["conditioned", "Condition on encoded context"], ["evaluated", "Evaluate generated output"]]),
    select("metric", "Sequence metric", "surface", [["surface", "Surface form only"], ["task", "Use a task metric"], ["quality", "Use quality and error evidence"]])
  ], ["Sequence fit", "Context evidence", "Generation risk"]),
  transformer: controlSet("Transformer attention and architecture", [
    select("attention", "Attention design", "independent", [["independent", "Independent token processing"], ["self_attention", "Self-attention"], ["task_masked", "Use the task-appropriate attention mask"]]),
    select("position", "Position signal", "none", [["none", "No position signal"], ["encoding", "Add positional encoding"], ["validated", "Validate order-sensitive behavior"]]),
    select("objective", "Training objective", "generic", [["generic", "Generic objective"], ["task", "Task-specific objective"], ["heldout", "Evaluate on held-out behavior"]])
  ], ["Architecture fit", "Attention evidence", "Information-leak risk"]),
  finetune: controlSet("pretraining and fine-tuning", [
    select("starting_point", "Starting point", "random", [["random", "Random initialization"], ["pretrained", "Pretrained checkpoint"], ["matched", "Match checkpoint to the task"]]),
    select("adaptation", "Adaptation strategy", "inference", [["inference", "Inference only"], ["fine_tune", "Fine-tune on task data"], ["validated", "Fine-tune and validate"]]),
    select("data_review", "Data review", "skip", [["skip", "Skip dataset review"], ["inspect", "Inspect examples"], ["document", "Document limits and evaluation"]])
  ], ["Adaptation fit", "Task evidence", "Transfer risk"]),
  alignment: controlSet("alignment, preferences, and policy updates", [
    select("feedback", "Feedback signal", "unstructured", [["unstructured", "Unstructured feedback"], ["preferences", "Pairwise preferences"], ["rubric", "Rubric-backed preference evidence"]]),
    select("update", "Policy update", "unconstrained", [["unconstrained", "Unconstrained update"], ["controlled", "Controlled update"], ["reference", "Constrain against a reference policy"]]),
    select("evaluation", "Alignment evaluation", "claim", [["claim", "Claim alignment"], ["inspect", "Inspect reward / preference behavior"], ["heldout", "Evaluate on held-out preference pairs"]])
  ], ["Alignment fit", "Preference evidence", "Reward-hacking risk"]),
  reinforcement: controlSet("reinforcement learning and returns", [
    select("policy", "Policy", "random", [["random", "Random policy"], ["explore", "Exploration-aware policy"], ["learned", "Use a learned policy"]]),
    select("return", "Return calculation", "immediate", [["immediate", "Immediate reward only"], ["discounted", "Discounted return"], ["long_term", "Compare long-term return"]]),
    select("update", "Value update", "skip", [["skip", "Skip the update"], ["td", "Inspect TD error"], ["verified", "Verify the selected value update"]])
  ], ["Policy fit", "Return evidence", "Exploration risk"]),
  rag: controlSet("retrieval-augmented generation", [
    select("index", "Index / embedding step", "none", [["none", "No searchable index"], ["vector", "Build a vector index"], ["validated", "Validate embedding and index choice"]]),
    select("retrieval", "Retrieval scope", "all", [["all", "Use all documents"], ["top_k", "Retrieve top-k passages"], ["grounded", "Retrieve relevant grounded evidence"]]),
    select("answer", "Answer policy", "memory", [["memory", "Answer from model memory"], ["cite", "Use retrieved context"], ["evidence", "Ground every claim in retrieved evidence"]])
  ], ["Grounding fit", "Retrieval evidence", "Hallucination risk"]),
  chain: controlSet("LangChain components and chains", [
    select("components", "Chain components", "isolated", [["isolated", "Use isolated components"], ["connected", "Connect core components"], ["typed", "Connect and validate component outputs"]]),
    select("flow", "Data flow", "opaque", [["opaque", "Hide values between steps"], ["inspect", "Inspect values between steps"], ["diagnose", "Diagnose a broken connection"]]),
    select("output", "Output handling", "raw", [["raw", "Return raw output"], ["parser", "Use an output parser"], ["verified", "Verify the final chain output"]])
  ], ["Chain fit", "Flow evidence", "Connection risk"]),
  prompt: controlSet("prompt engineering and in-context learning", [
    select("instruction", "Instruction quality", "vague", [["vague", "Vague instruction"], ["specific", "Specific instruction"], ["constrained", "Specific instruction with constraints"]]),
    select("examples", "Examples / context", "none", [["none", "No examples"], ["few_shot", "Add relevant examples"], ["curated", "Use curated examples and context"]]),
    select("budget", "Context budget", "overflow", [["overflow", "Exceed the context budget"], ["fit", "Fit context within budget"], ["reviewed", "Fit and review the target response"]])
  ], ["Prompt fit", "Context evidence", "Instruction risk"]),
  agent: controlSet("agent planning and tool use", [
    select("plan", "Planning step", "skip", [["skip", "Skip the plan"], ["outline", "Outline a plan"], ["verify", "Plan and verify each action"]]),
    select("tools", "Tool choice", "all", [["all", "Call every available tool"], ["relevant", "Call only relevant tools"], ["validated", "Use tools and validate observations"]]),
    select("answer", "Final answer", "ungrounded", [["ungrounded", "Answer without observations"], ["observed", "Use observations"], ["traceable", "Provide a traceable final answer"]])
  ], ["Plan fit", "Observation evidence", "Unnecessary-call risk"]),
  strategy: controlSet("technical strategy trade-offs", [
    select("freshness", "Knowledge freshness", "static", [["static", "Static knowledge only"], ["review", "Review freshness needs"], ["current", "Choose for current information"]]),
    select("constraints", "Constraints", "ignore", [["ignore", "Ignore privacy, latency, and budget"], ["compare", "Compare constraints"], ["dominant", "Choose for the dominant constraint"]]),
    select("decision", "Strategy decision", "default", [["default", "Use a default approach"], ["tradeoff", "State a trade-off"], ["justified", "Justify the selected strategy"]])
  ], ["Strategy fit", "Constraint evidence", "Mismatch risk"]),
  ui: controlSet("user-interface and application flow", [
    select("components", "Interface components", "partial", [["partial", "Partial interface"], ["connected", "Connect input and output"], ["accessible", "Connect accessible interface components"]]),
    select("states", "State handling", "success_only", [["success_only", "Handle success only"], ["loading", "Handle loading state"], ["complete", "Handle success, loading, and errors"]]),
    select("testing", "Interaction test", "assume", [["assume", "Assume it works"], ["manual", "Test a main path"], ["edge_cases", "Test success and error paths"]])
  ], ["Interaction fit", "State evidence", "Usability risk"])
};

const FAMILY_TO_MODE = Object.freeze({
  TensorPlayground: "tensor", AutogradGraph: "autograd", DataPipeline: "data", RegressionLab: "regression",
  OptimizerLab: "optimizer", ValidationLab: "validation", DecisionBoundary: "classification",
  ProbabilityPolicyLab: "probability", LossLab: "loss", ProjectWorkbench: "project", NeuralNetworkLab: "network",
  ActivationLab: "activation", CNNWorkbench: "vision", VisionWorkbench: "vision", PerformanceLab: "performance",
  OptimizationDashboard: "performance", ConceptMap: "concept", ToolComparator: "concept", GenerativeConceptLab: "concept",
  SafetyScenario: "safety", EthicsScenario: "safety", DataQualityLab: "safety", NLPFeatureLab: "nlp",
  TokenizationLab: "nlp", NGramLab: "nlp", EmbeddingSpace: "embedding", Seq2SeqWorkbench: "sequence",
  ArchitectureBuilder: "network", TransformerWorkbench: "transformer", AttentionLab: "transformer",
  FineTuneLab: "finetune", InferenceWorkbench: "finetune", PEFTWorkbench: "finetune", RewardModelLab: "alignment",
  AlignmentLab: "alignment", AlignmentPipeline: "alignment", RLGridworld: "reinforcement", RAGPipeline: "rag",
  DocumentPipeline: "rag", ChainGraph: "chain", PromptLab: "prompt", AgentTrace: "agent",
  StrategyComparator: "strategy", UIFlowBuilder: "ui", TrainingDynamics: "optimizer", TrainingLoopLab: "optimizer",
  MetricWorkbench: "validation"
});

function cloneControls(controls) {
  return controls.map((control) => ({
    ...control,
    options: control.options?.map((option) => ({ ...option }))
  }));
}

function seedFor(number) {
  return 24000 + Number(number);
}

function notebookCheckpoint() {
  return select("notebook_checkpoint", "Notebook checkpoint", "setup", [
    ["setup", "Inspect setup and imports"],
    ["trace", "Trace the key cell output"],
    ["verify", "Verify the notebook result"]
  ]);
}

function evidenceControl(blueprint) {
  return select("lesson_evidence", `Evidence for ${blueprint.title}`, "repeat", [
    ["repeat", "Repeat the starting condition"],
    ["inspect", `Inspect: ${blueprint.interaction}`],
    ["justify", `Justify: ${blueprint.successCriterion}`]
  ]);
}

function expectedState(recipe, entry, blueprint) {
  const expected = Object.fromEntries(recipe.controls.map((control) => {
    const lastOption = control.options?.at(-1);
    return [control.id, lastOption?.value ?? control.default];
  }));
  expected.lesson_evidence = "justify";
  if (entry.sourceFormat === "ipynb") expected.notebook_checkpoint = "verify";
  return expected;
}

function workflowFor(blueprint) {
  return [
    `Inspect ${blueprint.title}`,
    blueprint.interaction,
    blueprint.successCriterion
  ];
}

export function getDedicatedCoverageReport() {
  const families = new Set(DEDICATED_LESSON_BLUEPRINTS.map((blueprint) => blueprint.family));
  return {
    lessons: DEDICATED_LESSON_BLUEPRINTS.length,
    families: families.size,
    missingFamilies: [...families].filter((family) => !FAMILY_TO_MODE[family])
  };
}

export function createDedicatedCourseSpec(entry) {
  if (!entry?.id || !entry.sourcePath || !entry.sourceFormat) {
    throw new Error("A dedicated-course lesson requires its complete manifest entry.");
  }
  const blueprint = getDedicatedLessonBlueprint(entry.sourcePath);
  if (!blueprint) throw new Error(`No dedicated blueprint registered for ${entry.sourcePath}.`);
  if (blueprint.sourceFormat !== entry.sourceFormat) {
    throw new Error(`Source format mismatch for ${entry.sourcePath}.`);
  }
  const mode = FAMILY_TO_MODE[blueprint.family];
  const recipe = CONTROL_SETS[mode];
  if (!recipe) throw new Error(`No interaction recipe registered for ${blueprint.family}.`);

  const controls = [
    ...cloneControls(recipe.controls),
    evidenceControl(blueprint),
    ...(entry.sourceFormat === "ipynb" ? [notebookCheckpoint()] : [])
  ];
  const baseline = Object.fromEntries(controls.map((control) => [control.id, control.default]));
  const target = expectedState(recipe, entry, blueprint);
  const workflow = workflowFor(blueprint);

  return {
    id: entry.id,
    courseId: entry.courseId,
    moduleId: entry.moduleId,
    title: blueprint.title,
    sourcePath: entry.sourcePath,
    sourceFormat: entry.sourceFormat,
    engine: "DedicatedLessonLab",
    learningObjectives: [
      `Use the ${blueprint.family} activity to explore ${blueprint.simulation}.`,
      `Perform this lesson's central interaction: ${blueprint.interaction}.`,
      `Use evidence to ${blueprint.successCriterion.toLowerCase()}.`
    ],
    scenario: {
      description: `This activity is specific to “${blueprint.title}”: ${blueprint.simulation}. It models the decision described by the source; it does not execute the source notebook or call a remote model.`,
      seed: seedFor(blueprint.number)
    },
    controls,
    views: [
      { type: `${mode}-visual`, title: `${blueprint.title}: interactive model`, bindings: controls.map((control) => control.id) },
      { type: "lesson-evidence", title: blueprint.successCriterion, bindings: ["alignment", "evidence", "risk"] }
    ],
    explanationRules: [
      {
        when: Object.entries(target).map(([key, value]) => `${key} === '${value}'`).join(" && "),
        summary: "Lesson target reached",
        detail: `The selected decisions now support this lesson's goal: ${blueprint.successCriterion}.`
      },
      {
        when: "otherwise",
        summary: "Explore this lesson's trade-off",
        detail: blueprint.interaction
      }
    ],
    presets: [
      { id: "baseline", label: `${blueprint.title}: starting point`, values: baseline },
      { id: "target", label: `Model the lesson target`, values: target }
    ],
    challenge: {
      prompt: `${blueprint.successCriterion}. Configure the ${blueprint.family} activity, then justify the result using the source lesson.`,
      success: target,
      hints: [
        `Follow the lesson sequence: ${workflow.join(" → ")}.`,
        "Use “Model the lesson target” to inspect the target, then Reset and reproduce the decision yourself."
      ]
    },
    quiz: [{
      prompt: `Which outcome matches the purpose of “${blueprint.title}”?`,
      choices: [
        blueprint.successCriterion,
        "Skip the evidence check and accept the initial configuration.",
        "Use the activity as a replacement for the source lesson or notebook.",
        "Assume the result transfers without reviewing the task constraints."
      ],
      answer: 0,
      explanation: `${blueprint.simulation} The key interaction is: ${blueprint.interaction}.`
    }],
    accessibility: {
      canvasSummary: `${blueprint.title} uses a ${blueprint.family} visual. The workflow is: ${workflow.join(", then ")}.`,
      keyboardHelp: "Use Tab to move through the lesson controls and presets. Select values with the arrow keys; use Reset to return to this lesson's starting point."
    },
    activity: {
      id: `dedicated-${blueprint.number}`,
      family: blueprint.family,
      mode,
      simulation: blueprint.simulation,
      interaction: blueprint.interaction,
      successCriterion: blueprint.successCriterion,
      notebookTrace: entry.sourceFormat === "ipynb"
    },
    simulation: {
      topic: recipe.topic,
      workflow,
      metrics: recipe.metrics,
      nextInsight: `This is the ${blueprint.title} activity. ${blueprint.interaction}.`,
      successInsight: `This configuration reaches the modeled target for ${blueprint.title}: ${blueprint.successCriterion}.`
    }
  };
}

export default createDedicatedCourseSpec;
