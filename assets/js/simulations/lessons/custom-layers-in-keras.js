import { defineKerasGraphSpec } from "./keras-graph-spec.js";

export default defineKerasGraphSpec({
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/custom-layers-in-keras",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "Custom Layers in Keras",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/4-Custom_Layers_in_Keras.txt",
  sourceFormat: "txt",
  engine: "KerasGraphLab",
  learningObjectives: [
    "Identify when a custom Keras Layer encapsulates a novel or reusable operation rather than a standard Dense layer.",
    "Distinguish build(), which creates weights from the input shape, from call(), which computes the forward transformation."
  ],
  scenario: "Insert a custom Dense-like transformation into a one-input Functional graph; inspect how its weights add to the conceptual parameter budget.",
  seed: 304,
  focus: "A custom Layer creates trainable weights in build(input_shape) using add_weight(), then applies them in call(inputs).",
  challenge: {
    prompt: "Use the Functional API with one input and a custom Dense-like layer whose build() and call() define its behaviour.",
    success: { api: "functional", branches: "1", custom: "yes" },
    hints: ["Turn on the custom layer.", "The custom operation is still a layer in a model graph."]
  },
  quiz: [{
    prompt: "Where should a custom Keras Layer create weights based on the incoming shape?",
    choices: ["build(input_shape)", "fit()", "predict()", "TensorBoard"], answer: 0,
    explanation: "build(input_shape) creates weights; call(inputs) computes the forward pass."
  }]
});
