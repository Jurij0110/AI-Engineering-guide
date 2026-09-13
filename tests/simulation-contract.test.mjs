import assert from "node:assert/strict";
import test from "node:test";
import { SIMULATION_CATALOG, SIMULATION_COUNTS, findSimulation } from "../assets/data/simulation-catalog.mjs";
import { engineLoaders } from "../assets/js/simulations/engine-loaders.js";
import { validateLessonSpec } from "../assets/js/simulations/lesson-schema.js";
import { evaluateOverview } from "../assets/js/simulations/engines/ml-overview-workbench.js";
import { evaluateKerasGraph } from "../assets/js/simulations/engines/keras-graph-lab.js";
import { evaluateTensorFlowChoice } from "../assets/js/simulations/engines/tensorflow-ecosystem-lab.js";
import { evaluateDeepVision } from "../assets/js/simulations/engines/deep-vision-lab.js";
import { evaluateImageAugmentation } from "../assets/js/simulations/engines/image-augmentation-lab.js";
import { evaluateTransferLearning } from "../assets/js/simulations/engines/transfer-learning-lab.js";
import { evaluateTransposeConv } from "../assets/js/simulations/engines/transpose-conv-lab.js";
import { evaluateTransformerArch } from "../assets/js/simulations/engines/transformer-architecture-lab.js";
import { evaluateSequentialModel } from "../assets/js/simulations/engines/sequential-modeling-lab.js";
import { evaluateDiffusion } from "../assets/js/simulations/engines/diffusion-lab.js";
import { evaluateGAN } from "../assets/js/simulations/engines/gan-lab.js";
import { evaluateAdvancedKeras } from "../assets/js/simulations/engines/advanced-keras-lab.js";
import { evaluateCustomTrainingLoop } from "../assets/js/simulations/engines/custom-training-loop-lab.js";
import { evaluateKerasTuner } from "../assets/js/simulations/engines/keras-tuner-lab.js";
import { evaluateModelOptimization } from "../assets/js/simulations/engines/model-optimization-lab.js";
import { evaluateDistillation } from "../assets/js/simulations/engines/distillation-optimization-lab.js";
import { evaluateRLOverview } from "../assets/js/simulations/engines/rl-overview-lab.js";
import { evaluateQLearning } from "../assets/js/simulations/engines/q-learning-lab.js";
import { evaluateDeepQNetwork } from "../assets/js/simulations/engines/deep-q-network-lab.js";
import { evaluateFruitClassification } from "../assets/js/simulations/engines/fruit-classification-lab.js";
import { evaluateWasteClassification } from "../assets/js/simulations/engines/waste-classification-lab.js";

const simulatorBase = new URL("../assets/js/simulations/", import.meta.url);

test("ML overview distinguishes labelled, unlabelled, and reward-driven problems", () => {
  const sales = evaluateOverview({ scenario: "sales", technique: "regression", stage: "evaluate" });
  assert.equal(sales.methodMatches, true);
  assert.equal(sales.challengeComplete, true);
  assert.equal(evaluateOverview({ scenario: "sales", technique: "clustering", stage: "evaluate" }).challengeComplete, false);
  assert.equal(evaluateOverview({ scenario: "segments", technique: "clustering", stage: "prepare" }).methodMatches, true);
  assert.equal(evaluateOverview({ scenario: "agent", technique: "reinforcement", stage: "evaluate" }).methodMatches, true);
  assert.throws(() => evaluateOverview({ scenario: "unknown", technique: "regression", stage: "evaluate" }), RangeError);
});

test("Keras graph lab separates static branches, sharing, subclassing and custom layers", () => {
  const twoInputs = { api: "functional", branches: "2", hidden: "32", shared: "yes", custom: "no", dynamic: "no", classes: "1" };
  const valid = evaluateKerasGraph(twoInputs, { api: "functional", branches: "2" });
  assert.equal(valid.valid, true);
  assert.equal(valid.challengeComplete, true);
  assert.equal(valid.parameters, (20 + 1) * 32 + (2 * 32 + 1));
  assert.equal(evaluateKerasGraph({ ...twoInputs, api: "sequential" }).valid, false);
  assert.equal(evaluateKerasGraph({ ...twoInputs, dynamic: "yes" }).valid, false);
  assert.equal(evaluateKerasGraph({ ...twoInputs, api: "subclass", dynamic: "yes" }).valid, true);
  assert.ok(evaluateKerasGraph({ ...twoInputs, custom: "yes" }).parameters > valid.parameters);
});

test("TensorFlow ecosystem choices reflect the lesson and challenge", () => {
  assert.equal(evaluateTensorFlowChoice({ target: "mobile", tool: "lite", execution: "eager" }).challengeComplete, true);
  assert.equal(evaluateTensorFlowChoice({ target: "mobile", tool: "js", execution: "eager" }).match, false);
  assert.equal(evaluateTensorFlowChoice({ target: "web", tool: "js", execution: "eager" }).match, true);
  assert.equal(evaluateTensorFlowChoice({ target: "pipeline", tool: "tfx", execution: "eager" }).match, true);
});

test("Deep vision lab demonstrates ResNet skip connection gradient flow and TF pipeline targets", () => {
  const resnet = evaluateDeepVision({ architecture: "resnet", depth: "50", shortcuts: "enabled" }, { architecture: "resnet", depth: "50", shortcuts: "enabled" });
  assert.equal(resnet.valid, true);
  assert.equal(resnet.challengeComplete, true);
  assert.equal(resnet.identityPreserved, true);
  assert.ok(resnet.gradientFlow > 0.7);

  const degraded = evaluateDeepVision({ architecture: "resnet", depth: "50", shortcuts: "disabled" });
  assert.equal(degraded.identityPreserved, false);
  assert.ok(degraded.gradientFlow < 0.3);

  const pipeline = evaluateDeepVision({ mode: "pipeline", domain: "autonomous_driving", pipeline: "tf_data", device: "gpu", precision: "fp16" }, { mode: "pipeline", domain: "autonomous_driving", pipeline: "tf_data", device: "gpu", precision: "fp16" });
  assert.equal(pipeline.challengeComplete, true);
  assert.ok(pipeline.throughputFps > 100);
});

test("Image augmentation lab calculates diversity, normalization stats, and semantic risk", () => {
  const safe = evaluateImageAugmentation({ rotation: 20, flip: "yes", zoom: 0.2, shift: 0.15, normalization: "rescale" }, { rotation: "20", flip: "yes", zoom: "0.2", shift: "0.15", normalization: "rescale" });
  assert.equal(safe.valid, true);
  assert.equal(safe.semanticSafe, true);
  assert.equal(safe.challengeComplete, true);
  assert.equal(safe.pixelMean, 0.5);

  const risky = evaluateImageAugmentation({ rotation: 75, flip: "yes", zoom: 0.45, shift: 0.3, normalization: "none", noise: 0.2 });
  assert.equal(risky.semanticSafe, false);
  assert.ok(risky.warnings.length > 0);
});

test("Transfer learning lab models layer freezing, parameter counts, and overfit risk", () => {
  const frozen = evaluateTransferLearning({ backbone: "vgg16", strategy: "feature_extractor", dataSize: "small", headUnits: 256 }, { backbone: "vgg16", strategy: "feature_extractor", dataSize: "small", headUnits: 256 });
  assert.equal(frozen.challengeComplete, true);
  assert.ok(frozen.frozenParams > 10000000);
  assert.ok(frozen.valAcc > 0.8);
  assert.ok(frozen.overfitRisk.includes("Minimal"));

  const scratch = evaluateTransferLearning({ backbone: "vgg16", strategy: "scratch", dataSize: "small", headUnits: 256 });
  assert.equal(scratch.frozenParams, 0);
  assert.ok(scratch.overfitRisk.includes("Overfitting"));
});

test("Transpose convolution lab computes spatial dimensions and identifies checkerboard artifacts", () => {
  const checkerboard = evaluateTransposeConv({ method: "conv2d_transpose", inputDim: "4", kernelSize: "3", stride: "2", padding: "same" });
  assert.equal(checkerboard.outputDim, 8);
  assert.equal(checkerboard.hasCheckerboard, true);

  const clean = evaluateTransposeConv({ method: "conv2d_transpose", inputDim: "4", kernelSize: "4", stride: "2", padding: "same" }, { method: "conv2d_transpose", inputDim: "4", kernelSize: "4", stride: "2", padding: "same" });
  assert.equal(clean.outputDim, 8);
  assert.equal(clean.hasCheckerboard, false);
  assert.equal(clean.challengeComplete, true);

  const upsample = evaluateTransposeConv({ method: "upsample_conv", inputDim: "4", kernelSize: "3", stride: "2", padding: "same" });
  assert.equal(upsample.hasCheckerboard, false);
});

test("Transformer architecture lab evaluates attention masking, multi-head, ViT, and generation", () => {
  const causal = evaluateTransformerArch({ blockType: "decoder", maskType: "causal", dModel: "64" }, { blockType: "decoder", maskType: "causal", dModel: "64" });
  assert.equal(causal.valid, true);
  assert.equal(causal.challengeComplete, true);
  assert.equal(causal.matrix[0][1], 0);

  const leak = evaluateTransformerArch({ blockType: "decoder", maskType: "none" });
  assert.equal(leak.valid, false);

  const mha = evaluateTransformerArch({ mode: "multi_head", embedDim: "256", numHeads: "8", seqLen: "120" }, { mode: "multi_head", embedDim: "256", numHeads: "8", seqLen: "120" });
  assert.equal(mha.headDim, 32);
  assert.equal(mha.challengeComplete, true);

  const vit = evaluateTransformerArch({ mode: "vision_vit", imageSize: "224", patchSize: "16", embedDim: "768" }, { mode: "vision_vit", imageSize: "224", patchSize: "16", embedDim: "768" });
  assert.equal(vit.numPatches, 196);
  assert.equal(vit.challengeComplete, true);

  const gen = evaluateTransformerArch({ mode: "text_generation", temperature: "0.7", topK: "4" }, { mode: "text_generation", temperature: "0.7", topK: "4" });
  assert.equal(gen.challengeComplete, true);
  assert.ok(gen.probabilities.length > 0);
});

test("Sequential modeling lab models time-series forecasting and sequential architecture taxonomy", () => {
  const ts = evaluateSequentialModel({ mode: "time_series", modelType: "transformer", lookback: "120", batchSize: "32", activation: "relu" }, { mode: "time_series", modelType: "transformer", lookback: "120", batchSize: "32", activation: "relu" });
  assert.equal(ts.challengeComplete, true);
  assert.ok(ts.mseLoss < 0.04);
  assert.ok(ts.longRangeFidelity > 0.9);

  const rnnTax = evaluateSequentialModel({ mode: "taxonomy", arch: "simple_rnn", seqLen: "1000" });
  assert.equal(rnnTax.parallelTraining, false);
  assert.ok(rnnTax.vanishingGradientRisk.includes("Severe"));

  const tfTax = evaluateSequentialModel({ mode: "taxonomy", arch: "transformer", seqLen: "1000" }, { mode: "taxonomy", arch: "transformer", seqLen: "1000" });
  assert.equal(tfTax.parallelTraining, true);
  assert.equal(tfTax.challengeComplete, true);
  assert.ok(tfTax.longRangeRetention > 0.9);
});

test("Diffusion lab models forward noise dissipation, reverse denoising, and cosine schedule", () => {
  const pristine = evaluateDiffusion({ step: 0, noise_factor: 0.5, schedule: "linear" });
  assert.equal(pristine.status, "Pristine Signal");
  assert.ok(pristine.snrDb > 20);

  const diffused = evaluateDiffusion({ step: 50, noise_factor: 0.9, schedule: "cosine" });
  assert.equal(diffused.status, "Pure Gaussian Diffusion");
  assert.ok(diffused.snrDb < 0);

  const challengeState = { step: 5, noise_factor: 0.2, schedule: "cosine", mode: "reverse_denoising" };
  const chal = evaluateDiffusion(challengeState, challengeState);
  assert.equal(chal.challengeComplete, true);
  assert.ok(chal.reconstructionMse < 0.05);

  const conv = evaluateDiffusion({ backbone: "conv_transpose", step: 20 });
  const dense = evaluateDiffusion({ backbone: "dense_bottleneck", step: 20 });
  assert.ok(conv.reconstructionMse < dense.reconstructionMse);
});

test("GAN lab models minimax loss dynamics, LeakyReLU gradient stability, and mode collapse", () => {
  const balanced = evaluateGAN({ epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "balanced" }, { epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "balanced" });
  assert.equal(balanced.challengeComplete, true);
  assert.equal(balanced.status, "Nash Equilibrium Achieved");
  assert.ok(balanced.dAccuracy >= 48 && balanced.dAccuracy <= 55);
  assert.ok(balanced.fidEstimate < 35);

  const dyingRelu = evaluateGAN({ epoch: 200, activation: "standard_relu", batch_norm: "enabled", balance: "balanced" });
  assert.ok(dyingRelu.status.includes("Dying ReLU"));
  assert.ok(dyingRelu.dAccuracy > 95);
  assert.ok(dyingRelu.gLoss > 4.0);

  const modeCollapse = evaluateGAN({ epoch: 200, activation: "leaky_relu", batch_norm: "disabled", balance: "balanced" });
  assert.ok(modeCollapse.status.includes("Mode Collapse"));

  const overpoweredD = evaluateGAN({ epoch: 200, activation: "leaky_relu", batch_norm: "enabled", balance: "d_overpowered" });
  assert.ok(overpoweredD.status.includes("Discriminator Overpowered"));
});

test("Advanced Keras lab models layer subclassing, GradientTape loops, custom callbacks, and mixed precision", () => {
  const customLayer = evaluateAdvancedKeras({ technique: "custom_layer", custom_layer_units: "64", precision_policy: "mixed_float16" }, { technique: "custom_layer", custom_layer_units: "64", precision_policy: "mixed_float16" });
  assert.equal(customLayer.trainableParams, 784 * 64 + 64);
  assert.equal(customLayer.isMixedPrecision, true);
  assert.equal(customLayer.challengeComplete, true);
  assert.ok(customLayer.codeSnippet.includes("class CustomDenseLayer"));

  const customLoop = evaluateAdvancedKeras({ technique: "custom_loop", precision_policy: "float32" });
  assert.ok(customLoop.codeSnippet.includes("with tf.GradientTape() as tape:"));
  assert.ok(Number(customLoop.memoryFootprintMb) > Number(customLayer.memoryFootprintMb));
});

test("Custom training loop lab evaluates GradientTape forward/backward flow, metrics, and callbacks", () => {
  const initStep = evaluateCustomTrainingLoop({ epoch: 1, step: 0, metric_tracking: "enabled" });
  assert.ok(initStep.loss > 2.2);
  assert.ok(initStep.accuracy < 30);
  assert.equal(initStep.tapeStatus.includes("Initialized"), true);

  const convergedStep = evaluateCustomTrainingLoop({ epoch: 2, step: 1800, metric_tracking: "enabled", callback_hook: "on_epoch_end", optimizer: "adam" }, { epoch: 2, step: 1800, metric_tracking: "enabled", callback_hook: "on_epoch_end", optimizer: "adam" });
  assert.ok(convergedStep.loss < 0.12);
  assert.ok(convergedStep.accuracy > 95);
  assert.equal(convergedStep.challengeComplete, true);
  assert.ok(convergedStep.callbackLog.includes("End of epoch 2"));

  const noMetric = evaluateCustomTrainingLoop({ epoch: 1, step: 200, metric_tracking: "disabled" });
  assert.equal(noMetric.accuracy, null);
});

test("Keras Tuner lab evaluates RandomSearch, trials leaderboard, and best hyperparameters", () => {
  const search = evaluateKerasTuner({ algorithm: "random_search", max_trials: 10, executions_per_trial: 2, selected_trial: "trial_04" }, { algorithm: "random_search", max_trials: 10, executions_per_trial: 2, selected_trial: "trial_04" });
  assert.equal(search.bestTrial.id, "Trial 04");
  assert.equal(search.bestTrial.units, 128);
  assert.ok(search.bestTrial.score > 0.925);
  assert.equal(search.challengeComplete, true);
  assert.equal(search.activeTrials.length, 10);
  assert.ok(search.elapsedTimeStr.includes("m"));

  const smallSearch = evaluateKerasTuner({ algorithm: "random_search", max_trials: 5, executions_per_trial: 1 });
  assert.equal(smallSearch.activeTrials.length, 5);
});

test("Model optimization lab evaluates weight init, LR schedule, pruning sparsity, and TFLite INT8 quantization", () => {
  const optimized = evaluateModelOptimization({ init_method: "he_normal", lr_schedule: "exponential_decay", batch_norm: "enabled", pruning_sparsity: "50", quantization: "int8_tflite" }, { init_method: "he_normal", lr_schedule: "exponential_decay", batch_norm: "enabled", pruning_sparsity: "50", quantization: "int8_tflite" });
  assert.equal(optimized.challengeComplete, true);
  assert.ok(optimized.compressedSizeMb < 0.7);
  assert.ok(optimized.compressionRatio >= 6.0);
  assert.ok(optimized.speedupRatio >= 4.0);
  assert.ok(optimized.validationAccuracy > 97.0);

  const degraded = evaluateModelOptimization({ init_method: "random_normal", batch_norm: "disabled" });
  assert.ok(degraded.validationAccuracy < 88.0);
  assert.ok(degraded.status.includes("Degraded"));
});

test("Distillation optimization lab models teacher-student compression, temperature scaling, and dark knowledge", () => {
  const distilled = evaluateDistillation({ training_mode: "distillation", temperature: 3, student_units: 32, precision: "mixed_float16" }, { training_mode: "distillation", temperature: 3, student_units: 32, precision: "mixed_float16" });
  assert.equal(distilled.challengeComplete, true);
  assert.equal(distilled.compressionRatio, 4.0);
  assert.ok(distilled.studentAccuracy > 96.5);
  assert.ok(distilled.accuracyRetention > 98.0);
  assert.ok(distilled.softProbs.length === 10);
  assert.ok(distilled.softProbs[7] > 0.4);

  const hardLabels = evaluateDistillation({ training_mode: "scratch_hard_labels", student_units: 32 });
  assert.ok(hardLabels.studentAccuracy < distilled.studentAccuracy);
  assert.ok(hardLabels.status.includes("Hard Label"));
});

test("RL overview lab models MDP feedback loop, discount factor, and policy return", () => {
  const balanced = evaluateRLOverview({ environment: "cartpole", policy_type: "epsilon_soft", discount_factor: "0.9", reward_scheme: "shaped_dense", horizon_steps: "20" }, { environment: "cartpole", policy_type: "epsilon_soft", discount_factor: "0.9", reward_scheme: "shaped_dense" });
  assert.equal(balanced.challengeComplete, true);
  assert.ok(balanced.cumulativeDiscountedReturn > 5);
  assert.ok(balanced.survivalSteps >= 15);
  assert.ok(balanced.status.includes("Optimal"));

  const myopic = evaluateRLOverview({ environment: "cartpole", policy_type: "greedy", discount_factor: "0.2", reward_scheme: "shaped_dense", horizon_steps: "20" });
  assert.ok(myopic.cumulativeDiscountedReturn < balanced.cumulativeDiscountedReturn);

  const random = evaluateRLOverview({ environment: "cartpole", policy_type: "random", discount_factor: "0.9", reward_scheme: "shaped_dense", horizon_steps: "20" });
  assert.ok(random.survivalSteps <= balanced.survivalSteps);
});

test("Q-learning lab models Bellman optimality update, TD error, and survival score", () => {
  const balanced = evaluateQLearning({ current_state: "s1_slight_tilt", selected_action: "push_right", learning_rate: "0.1", discount_factor: "0.95" }, { current_state: "s1_slight_tilt", selected_action: "push_right", learning_rate: "0.1", discount_factor: "0.95" });
  assert.equal(balanced.challengeComplete, true);
  assert.ok(balanced.updatedQ < balanced.currentQ);
  assert.ok(balanced.tdError < 0);
  assert.equal(balanced.isExploiting, true);

  const surprise = evaluateQLearning({ current_state: "s1_slight_tilt", selected_action: "push_left", learning_rate: "0.1", discount_factor: "0.95" });
  assert.ok(surprise.updatedQ > surprise.currentQ);
  assert.ok(surprise.tdError > 0);

  const replay = evaluateQLearning({ training_mode: "cartpole_replay", batch_size: 64, exploration_epsilon: 0.05, discount_factor: 0.95 });
  assert.ok(replay.survivalScore > 150);

  const highEpsilon = evaluateQLearning({ training_mode: "cartpole_replay", batch_size: 64, exploration_epsilon: 0.8, discount_factor: 0.95 });
  assert.ok(highEpsilon.survivalScore < replay.survivalScore);
});

test("Deep Q-Network lab models dual network architecture, target sync, and experience replay", () => {
  const stable = evaluateDeepQNetwork({ target_network: "enabled", replay_buffer: "uniform_random", target_sync_freq: 10, epsilon_decay: "standard_0.995", episodes_trained: 250 }, { target_network: "enabled", replay_buffer: "uniform_random", episodes_trained: 250 });
  assert.equal(stable.challengeComplete, true);
  assert.equal(stable.status, "Stable DQN Convergence");
  assert.ok(stable.meanScore >= 180);
  assert.ok(stable.mseLoss < 0.1);
  assert.equal(stable.totalModelParams, stable.primaryParams * 2);
  assert.ok(stable.diagnosis.includes("reference target"), "High-score state should describe 200 as reference target");
  assert.equal(stable.diagnosis.includes("masters the 200-step benchmark"), false, "Must not claim official benchmark mastery");

  // Default state check (100 episodes, meanScore ~86)
  const defaultState = evaluateDeepQNetwork();
  assert.equal(defaultState.episodes, 100);
  assert.ok(defaultState.meanScore < 100, "Default state modeled score is below 100");
  assert.equal(defaultState.diagnosis.includes("masters"), false, "Default state must not claim mastery");
  assert.ok(defaultState.diagnosis.includes("progressing"), "Default state should indicate training is progressing");
  assert.ok(defaultState.diagnosis.includes("reference target"), "Default state should refer to 200 as visual reference target");

  const movingTarget = evaluateDeepQNetwork({ target_network: "disabled", replay_buffer: "uniform_random", episodes_trained: 100 });
  assert.equal(movingTarget.status, "Moving-Target Oscillations");
  assert.ok(movingTarget.meanScore < 100);
  assert.ok(movingTarget.mseLoss > stable.mseLoss);

  const correlated = evaluateDeepQNetwork({ target_network: "enabled", replay_buffer: "sequential", episodes_trained: 100 });
  assert.equal(correlated.status, "Temporal Correlation Drift");
  assert.ok(correlated.meanScore < 120);
});

test("Fruit classification lab models VGG16 feature extraction, fine-tuning, and augmentation", () => {
  const stage1 = evaluateFruitClassification({ training_stage: "feature_extraction", data_augmentation: "enabled", learning_rate: "0.001", unfrozen_layers: "0", epochs: "5" });
  assert.equal(stage1.stage, "feature_extraction");
  assert.equal(stage1.frozenParams, 14714688);
  assert.equal(stage1.trainableParams, 138520);
  assert.equal((stage1.trainableParams / 1e6).toFixed(2), "0.14");
  assert.ok(stage1.testAccuracy > 0.60);

  const fineTuned = evaluateFruitClassification({ training_stage: "fine_tuning", data_augmentation: "enabled", learning_rate: "0.00001", unfrozen_layers: "5", epochs: "5" }, { training_stage: "fine_tuning", data_augmentation: "enabled", min_accuracy: 0.75 });
  assert.equal(fineTuned.challengeComplete, true);
  assert.equal(fineTuned.trainableParams, 7079424 + 138520);
  assert.equal((fineTuned.trainableParams / 1e6).toFixed(2), "7.22");
  assert.ok(fineTuned.testAccuracy >= 0.75);
  assert.ok(fineTuned.diagnosis.includes(`${(fineTuned.testAccuracy * 100).toFixed(0)}%`), "Diagnosis must dynamically reflect modeled test accuracy");
  assert.equal(fineTuned.diagnosis.includes("~82% test accuracy benchmark"), false, "Must not contain hardcoded conflicting ~82% benchmark text");
  assert.ok(fineTuned.top1Prob > 0.7);

  const catastrophic = evaluateFruitClassification({ training_stage: "fine_tuning", data_augmentation: "enabled", learning_rate: "0.001", unfrozen_layers: "5" });
  assert.equal(catastrophic.isCatastrophic, true);
  assert.ok(catastrophic.diagnosis.includes("Catastrophic Forgetting") || catastrophic.diagnosis.includes("too high"));

  const scratch = evaluateFruitClassification({ training_stage: "from_scratch", data_augmentation: "disabled", unfrozen_layers: "19" });
  assert.equal(scratch.frozenParams, 0);
  assert.equal(scratch.trainableParams, scratch.totalParams);
});

test("Waste classification lab models binary sorting, confusion matrix, and contamination rate", () => {
  const challengeSuccess = { model_mode: "fine_tuning", data_augmentation: "enabled", min_accuracy: 0.85, max_contamination: 12.0 };

  // 1. Initial default state: feature extraction baseline must NOT be challenge complete
  const initialDefault = evaluateWasteClassification({}, challengeSuccess);
  assert.equal(initialDefault.challengeComplete, false, "Initial default state must have challenge in progress");
  assert.equal(initialDefault.modelMode, "feature_extraction");
  assert.ok(initialDefault.contaminationRate > 12.0, "Baseline contamination rate exceeds 12%");
  assert.ok(initialDefault.diagnosis.includes("illustrative"), "Diagnosis must label training image count as illustrative");

  // 2. Achievable configuration: fine-tuned VGG16 reaches challenge
  const standard = evaluateWasteClassification({ model_mode: "fine_tuning", data_augmentation: "enabled", learning_rate: 0.00005, decision_threshold: 0.5, epochs: 10 }, challengeSuccess);
  assert.equal(standard.challengeComplete, true, "Fine-tuned preset must achieve challenge");
  assert.ok(standard.testAccuracy >= 0.85);
  assert.ok(standard.contaminationRate <= 12.0);
  assert.equal(standard.trueOrganic + standard.falseRecyclable + standard.falseOrganic + standard.trueRecyclable, 200);

  // 3. High contamination baseline without augmentation
  const highContam = evaluateWasteClassification({ model_mode: "feature_extraction", data_augmentation: "disabled", decision_threshold: 0.35 });
  assert.ok(highContam.contaminationRate > 15.0);

  // 4. Low contamination policy with elevated threshold
  const lowContam = evaluateWasteClassification({ model_mode: "fine_tuning", data_augmentation: "enabled", decision_threshold: 0.65 });
  assert.ok(lowContam.contaminationRate <= standard.contaminationRate);
  assert.ok(lowContam.precisionRecyclable >= standard.precisionRecyclable);
});

test("Course 03 Module 5 engines mount with user-visible simulation disclosure notice", async () => {
  const m5Engines = [
    "AdvancedKerasLab",
    "CustomTrainingLoopLab",
    "KerasTunerLab",
    "ModelOptimizationLab",
    "DistillationOptimizationLab"
  ];

  for (const engineName of m5Engines) {
    const loader = engineLoaders.get(engineName);
    assert.equal(typeof loader, "function", engineName);
    const engine = (await loader()).createEngine();
    const mockContainer = {
      innerHTML: "",
      querySelector: () => null,
      querySelectorAll: () => []
    };
    const dummySpec = {
      controls: [],
      presets: [],
      challenge: { prompt: "Test", success: {} },
      scenario: { seed: 42 }
    };
    engine.mount(mockContainer, dummySpec);
    assert.ok(
      mockContainer.innerHTML.includes("data-simulation-disclosure"),
      `${engineName} must have data-simulation-disclosure attribute`
    );
    assert.ok(
      mockContainer.innerHTML.includes("Illustrative simulation — no network is trained and values are not measured benchmarks."),
      `${engineName} must include disclosure text in UI`
    );
    engine.destroy();
  }
});

test("Course 03 Module 5 engines dispatch bubbling change event on preset click, update, and reset", async () => {
  const m5Lessons = [
    { engine: "AdvancedKerasLab", specifier: "./lessons/advanced-keras-techniques.js" },
    { engine: "CustomTrainingLoopLab", specifier: "./lessons/custom-training-loops-in-keras.js" },
    { engine: "KerasTunerLab", specifier: "./lessons/hyperparameter-tuning-with-keras-tuner.js" },
    { engine: "ModelOptimizationLab", specifier: "./lessons/model-optimization.js" },
    { engine: "DistillationOptimizationLab", specifier: "./lessons/tensorflow-for-model-optimization.js" }
  ];

  for (const item of m5Lessons) {
    const spec = (await import(new URL(item.specifier, simulatorBase))).default;
    const loader = engineLoaders.get(item.engine);
    const engine = (await loader()).createEngine();

    const mockButtons = (spec.presets || []).map(p => ({
      dataset: { presetId: p.id },
      listeners: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      click() { this.listeners.click?.(); }
    }));

    let changeDispatched = 0;
    let lastEvent = null;

    const mockContainer = {
      innerHTML: "",
      querySelector: () => null,
      querySelectorAll: (sel) => {
        if (sel === "[data-preset-id]") return mockButtons;
        return [];
      },
      dispatchEvent: (event) => {
        if (event.type === "change") {
          changeDispatched += 1;
          lastEvent = event;
        }
      }
    };

    engine.mount(mockContainer, spec);

    // Verify responsive styling constraints on root innerHTML
    assert.ok(mockContainer.innerHTML.includes("min-width: 0"), `${item.engine} must include min-width: 0 constraint`);
    assert.ok(mockContainer.innerHTML.includes("max-width: 100%"), `${item.engine} must include max-width: 100% constraint`);
    if (mockContainer.innerHTML.includes("<pre")) {
      assert.ok(mockContainer.innerHTML.includes("white-space: pre-wrap"), `${item.engine} code block must wrap lines to avoid overflow`);
    }

    // 1. Test preset click emits bubbling change event
    if (mockButtons.length > 0) {
      changeDispatched = 0;
      lastEvent = null;
      mockButtons[0].click();
      assert.ok(changeDispatched >= 1, `${item.engine} preset button click must dispatch change event on root`);
      assert.equal(lastEvent?.bubbles, true, `${item.engine} dispatched change event must bubble`);
      const summaryAfterPreset = engine.getAccessibleSummary();
      assert.ok(summaryAfterPreset.length > 10, `${item.engine} accessible summary must be available`);
    }

    // 2. Test engine.update() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.update(spec.presets?.[0]?.values || {});
    assert.ok(changeDispatched >= 1, `${item.engine} engine.update() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    // 3. Test engine.reset() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.reset();
    assert.ok(changeDispatched >= 1, `${item.engine} engine.reset() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    engine.destroy();
  }
});

test("Course 03 Module 6 engines mount with user-visible simulation disclosure notice", async () => {
  const m6Engines = [
    "RLOverviewLab",
    "QLearningLab",
    "DeepQNetworkLab"
  ];

  for (const engineName of m6Engines) {
    const loader = engineLoaders.get(engineName);
    assert.equal(typeof loader, "function", engineName);
    const engine = (await loader()).createEngine();
    let chartHtml = "";
    const mockChart = {
      set innerHTML(val) { chartHtml = val; },
      get innerHTML() { return chartHtml; }
    };
    const mockContainer = {
      innerHTML: "",
      querySelector: (sel) => {
        if (sel === "[data-chart-container]") return mockChart;
        return null;
      },
      querySelectorAll: () => []
    };
    const dummySpec = {
      controls: [],
      presets: [],
      challenge: { prompt: "Test", success: {} },
      scenario: { seed: 42 }
    };
    engine.mount(mockContainer, dummySpec);
    assert.ok(
      mockContainer.innerHTML.includes("data-simulation-disclosure"),
      `${engineName} must have data-simulation-disclosure attribute`
    );
    assert.ok(
      mockContainer.innerHTML.includes("Illustrative simulation — no network is trained and values are not measured benchmarks."),
      `${engineName} must include disclosure text in UI`
    );
    if (engineName === "DeepQNetworkLab") {
      assert.ok(
        chartHtml.includes("200-Step Reference Target"),
        "DeepQNetworkLab must label 200-step line as reference target"
      );
      assert.equal(
        chartHtml.includes("200 Step Benchmark"),
        false,
        "DeepQNetworkLab must not label 200-step line as official benchmark"
      );
    }
    engine.destroy();
  }
});

test("Course 03 Module 6 engines dispatch bubbling change event on preset click, update, and reset", async () => {
  const m6Lessons = [
    { engine: "RLOverviewLab", specifier: "./lessons/reinforcement-learning-overview.js" },
    { engine: "QLearningLab", specifier: "./lessons/q-learning-in-keras.js" },
    { engine: "QLearningLab", specifier: "./lessons/implementing-q-learning-lab.js" },
    { engine: "DeepQNetworkLab", specifier: "./lessons/deep-q-networks-with-keras.js" },
    { engine: "DeepQNetworkLab", specifier: "./lessons/deep-q-network-with-keras-lab.js" }
  ];

  for (const item of m6Lessons) {
    const spec = (await import(new URL(item.specifier, simulatorBase))).default;
    const loader = engineLoaders.get(item.engine);
    const engine = (await loader()).createEngine();

    const mockButtons = (spec.presets || []).map(p => ({
      dataset: { presetId: p.id },
      listeners: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      click() { this.listeners.click?.(); }
    }));

    let changeDispatched = 0;
    let lastEvent = null;

    const mockContainer = {
      innerHTML: "",
      querySelector: () => null,
      querySelectorAll: (sel) => {
        if (sel === "[data-preset-id]") return mockButtons;
        return [];
      },
      dispatchEvent: (event) => {
        if (event.type === "change") {
          changeDispatched += 1;
          lastEvent = event;
        }
      }
    };

    engine.mount(mockContainer, spec);

    // Verify responsive styling constraints on root innerHTML
    assert.ok(mockContainer.innerHTML.includes("min-width: 0"), `${item.engine} must include min-width: 0 constraint`);
    assert.ok(mockContainer.innerHTML.includes("max-width: 100%"), `${item.engine} must include max-width: 100% constraint`);

    if (item.specifier === "./lessons/deep-q-network-with-keras-lab.js") {
      assert.equal(mockContainer.innerHTML.includes("Benchmark Solved"), false, "Must not contain Benchmark Solved");
      assert.ok(mockContainer.innerHTML.includes("Near 200-Step Reference"), "Must contain Near 200-Step Reference");
      assert.equal(spec.learningObjectives.some(o => o.includes("reach the 200 consecutive time steps balance threshold")), false, "Objective must not guarantee reaching threshold");
      assert.ok(spec.learningObjectives.some(o => o.includes("explore and approach the 200 consecutive time steps modeled reference target")), "Objective must state explore/approach reference target");
    }

    // 1. Test preset click emits bubbling change event
    if (mockButtons.length > 0) {
      changeDispatched = 0;
      lastEvent = null;
      mockButtons[0].click();
      assert.ok(changeDispatched >= 1, `${item.engine} preset button click must dispatch change event on root`);
      assert.equal(lastEvent?.bubbles, true, `${item.engine} dispatched change event must bubble`);
      const summaryAfterPreset = engine.getAccessibleSummary();
      assert.ok(summaryAfterPreset.length > 10, `${item.engine} accessible summary must be available`);
    }

    // 2. Test engine.update() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.update(spec.presets?.[0]?.values || {});
    assert.ok(changeDispatched >= 1, `${item.engine} engine.update() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    // 3. Test engine.reset() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.reset();
    assert.ok(changeDispatched >= 1, `${item.engine} engine.reset() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    engine.destroy();
  }
});

test("Course 03 Module 7 engines mount with user-visible simulation disclosure notice", async () => {
  const m7Engines = [
    { engine: "FruitClassificationLab", specifier: "./lessons/practice-project-fruit-classification.js" },
    { engine: "WasteClassificationLab", specifier: "./lessons/final-project-classify-waste-products.js" }
  ];

  for (const item of m7Engines) {
    const spec = (await import(new URL(item.specifier, simulatorBase))).default;
    const loader = engineLoaders.get(item.engine);
    const engine = (await loader()).createEngine();
    let chartHtml = "";
    const mockContainer = {
      innerHTML: "",
      querySelector: (sel) => {
        if (sel === "[data-chart-container]") {
          return {
            set innerHTML(val) { chartHtml = val; },
            get innerHTML() { return chartHtml; }
          };
        }
        return null;
      },
      querySelectorAll: () => []
    };
    engine.mount(mockContainer, spec);

    assert.ok(
      mockContainer.innerHTML.includes("data-simulation-disclosure"),
      `${item.engine} must have data-simulation-disclosure attribute`
    );
    assert.ok(
      mockContainer.innerHTML.includes("Illustrative simulation — no network is trained and values are not measured benchmarks."),
      `${item.engine} must include disclosure text in UI`
    );
    assert.ok(mockContainer.innerHTML.includes("min-width: 0"), `${item.engine} must include min-width: 0 constraint`);
    assert.ok(mockContainer.innerHTML.includes("max-width: 100%"), `${item.engine} must include max-width: 100% constraint`);

    if (item.specifier === "./lessons/practice-project-fruit-classification.js") {
      assert.equal(mockContainer.innerHTML.includes("Block 5 Conv + Dense"), false, "Must not label base layers as Conv + Dense");
      assert.ok(mockContainer.innerHTML.includes("Block 5 Convolutions"), "Must label base layers as Block 5 Convolutions");
    }

    if (item.specifier === "./lessons/final-project-classify-waste-products.js") {
      assert.equal(mockContainer.innerHTML.includes("Challenge complete"), false, "Waste lab must not open as Challenge complete without interaction");
      assert.ok(mockContainer.innerHTML.includes("Challenge in progress"), "Waste lab must open with Challenge in progress");
      assert.ok(chartHtml.includes("Illustrative Confusion Matrix"), "Waste lab SVG must label confusion matrix as illustrative");
    }

    engine.destroy();
  }
});

test("Course 03 Module 7 engines dispatch bubbling change event on preset click, update, and reset", async () => {
  const m7Lessons = [
    { engine: "FruitClassificationLab", specifier: "./lessons/practice-project-fruit-classification.js" },
    { engine: "WasteClassificationLab", specifier: "./lessons/final-project-classify-waste-products.js" }
  ];

  for (const item of m7Lessons) {
    const spec = (await import(new URL(item.specifier, simulatorBase))).default;
    const loader = engineLoaders.get(item.engine);
    const engine = (await loader()).createEngine();

    const mockButtons = (spec.presets || []).map(p => ({
      dataset: { presetId: p.id },
      listeners: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      click() { this.listeners.click?.(); }
    }));

    let changeDispatched = 0;
    let lastEvent = null;

    const mockContainer = {
      innerHTML: "",
      querySelector: () => null,
      querySelectorAll: (sel) => {
        if (sel === "[data-preset-id]") return mockButtons;
        return [];
      },
      dispatchEvent: (event) => {
        if (event.type === "change") {
          changeDispatched += 1;
          lastEvent = event;
        }
      }
    };

    engine.mount(mockContainer, spec);

    // 1. Test preset click emits bubbling change event
    if (mockButtons.length > 0) {
      changeDispatched = 0;
      lastEvent = null;
      mockButtons[0].click();
      assert.ok(changeDispatched >= 1, `${item.engine} preset button click must dispatch change event on root`);
      assert.equal(lastEvent?.bubbles, true, `${item.engine} dispatched change event must bubble`);
      const summaryAfterPreset = engine.getAccessibleSummary();
      assert.ok(summaryAfterPreset.length > 10, `${item.engine} accessible summary must be available`);
    }

    // 2. Test engine.update() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.update(spec.presets?.[0]?.values || {});
    assert.ok(changeDispatched >= 1, `${item.engine} engine.update() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    // 3. Test engine.reset() emits bubbling change event
    changeDispatched = 0;
    lastEvent = null;
    engine.reset();
    assert.ok(changeDispatched >= 1, `${item.engine} engine.reset() must dispatch bubbling change event`);
    assert.equal(lastEvent?.bubbles, true);

    engine.destroy();
  }
});

test("exact-path manifest maps 108 ready and 200 planned lessons", () => {
  assert.equal(SIMULATION_CATALOG.length, 308);
  const actualReady = SIMULATION_CATALOG.filter((entry) => entry.status === "ready").length;
  const actualPlanned = SIMULATION_CATALOG.filter((entry) => entry.status === "planned").length;
  assert.equal(actualReady, 108);
  assert.equal(actualPlanned, 200);
  assert.equal(SIMULATION_COUNTS.ready, 108);
  assert.equal(SIMULATION_COUNTS.planned, 200);
  assert.equal(SIMULATION_COUNTS.engines, 45);
  assert.equal(SIMULATION_COUNTS.ready, actualReady, "SIMULATION_COUNTS.ready must match actual filtered catalog count");
  assert.equal(SIMULATION_COUNTS.planned, actualPlanned, "SIMULATION_COUNTS.planned must match actual filtered catalog count");
  assert.equal(SIMULATION_COUNTS.engines, engineLoaders.size, "SIMULATION_COUNTS.engines must match registered loader size");
  assert.equal(SIMULATION_COUNTS.lessons, SIMULATION_CATALOG.length);
  assert.equal(new Set(SIMULATION_CATALOG.map((entry) => `${entry.libraryId}\0${entry.sourcePath}`)).size, 308);
  assert.equal(findSimulation("another-library", SIMULATION_CATALOG[0].sourcePath), null);
  assert.equal(findSimulation("ibm-ai-engineering", "01-Machine_Learning_with_Python/Module-1-Intro_to_Machine_Learning/ML_Overview.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/1-Advanced_CNNs_in_Keras.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/1-Intro_to_Unsupervised_Learning_in_Keras.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/1-Advanced_Keras_Techniques.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/3-Custom_Training_Loops_Lab.ipynb")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/6-Hyperparameter_Tuning_with_Keras_Tuner_Lab.ipynb")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-5-Advanced_Keras_Techniques/8-Tensorflow_for_Model_Optimization.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/1-Reinforcement_Learning_Overview.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/2-Q_Learning_in_Keras.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/3-Implementing_Q_Learning_Lab.ipynb")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/4-Deep_Q_Networks_with_Keras.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-6-Intro_to_Reinforcement_Learning_with_Keras/5-Deep_Q_Network_with_Keras_Lab.ipynb")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-7-Final_Project/1-Practice_Project_Fruit Classification.ipynb")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-7-Final_Project/2-Final_Project_Classify_Waste_Products.ipynb")?.status, "ready");
});

test("every ready spec matches its source and loads a compliant engine", async () => {
  assert.equal(engineLoaders.size, 45);
  for (const entry of SIMULATION_CATALOG) {
    if (entry.status === "planned") {
      assert.equal(entry.specifier, null);
      continue;
    }

    assert.match(entry.specifier, /^\.\/lessons\/[a-z0-9-]+\.js$/);
    const spec = (await import(new URL(entry.specifier, simulatorBase))).default;
    const validation = validateLessonSpec(spec);
    assert.deepEqual(validation.errors, [], entry.sourcePath);
    for (const field of ["id", "courseId", "moduleId", "sourcePath", "sourceFormat", "engine"]) {
      assert.equal(spec[field], entry[field], `${entry.sourcePath}: ${field}`);
    }

    const loader = engineLoaders.get(entry.engine);
    assert.equal(typeof loader, "function", entry.engine);
    const engine = (await loader()).createEngine();
    for (const method of ["mount", "update", "reset", "getAccessibleSummary", "destroy"]) {
      assert.equal(typeof engine[method], "function", `${entry.engine}.${method}`);
    }
    engine.destroy();
  }
});
