import assert from "node:assert/strict";
import test from "node:test";
import { SIMULATION_CATALOG, findSimulation } from "../assets/data/simulation-catalog.mjs";
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

test("exact-path manifest maps 94 ready and 214 planned lessons", () => {
  assert.equal(SIMULATION_CATALOG.length, 308);
  assert.equal(SIMULATION_CATALOG.filter((entry) => entry.status === "ready").length, 94);
  assert.equal(SIMULATION_CATALOG.filter((entry) => entry.status === "planned").length, 214);
  assert.equal(new Set(SIMULATION_CATALOG.map((entry) => `${entry.libraryId}\0${entry.sourcePath}`)).size, 308);
  assert.equal(findSimulation("another-library", SIMULATION_CATALOG[0].sourcePath), null);
  assert.equal(findSimulation("ibm-ai-engineering", "01-Machine_Learning_with_Python/Module-1-Intro_to_Machine_Learning/ML_Overview.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/1-Advanced_CNNs_in_Keras.txt")?.status, "ready");
  assert.equal(findSimulation("ibm-ai-engineering", "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/1-Intro_to_Unsupervised_Learning_in_Keras.txt")?.status, "ready");
});

test("every ready spec matches its source and loads a compliant engine", async () => {
  assert.equal(engineLoaders.size, 35);
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
