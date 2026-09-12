import { defineKerasGraphSpec } from "./keras-graph-spec.js";

export default defineKerasGraphSpec({
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/intro-to-advanced-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "Intro to Advanced Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/1-Intro_to_Advanced_Keras.txt",
  sourceFormat: "txt",
  engine: "KerasGraphLab",
  learningObjectives: [
    "Explain why Sequential suits a linear stack while Functional API can describe multiple inputs and non-sequential data flow.",
    "Build a conceptual two-branch Keras graph and distinguish graph design from actual model training."
  ],
  scenario: "An image branch and a tabular branch must merge before a binary prediction. Explore the API choice and parameter count without running Python.",
  seed: 301,
  focus: "The Functional API connects Input tensors to layers and can concatenate separate branches before constructing Model(inputs, outputs).",
  challenge: {
    prompt: "Choose the Functional API with two input branches for a merged binary-output model.",
    success: { api: "functional", branches: "2", classes: "1" },
    hints: ["Sequential only represents a simple linear stack.", "Use two inputs and a single sigmoid output for this design."]
  },
  quiz: [{
    prompt: "Which Keras API naturally represents two inputs that merge before one output?",
    choices: ["Functional API", "Sequential only", "A fixed optimizer", "TensorBoard"], answer: 0,
    explanation: "Functional API explicitly wires Input tensors and branches into one Model."
  }]
});
