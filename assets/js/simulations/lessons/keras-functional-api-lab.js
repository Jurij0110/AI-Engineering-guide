import { defineKerasGraphSpec } from "./keras-graph-spec.js";

export default defineKerasGraphSpec({
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/keras-functional-api-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "Keras Functional API Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/3-Keras_Functional_API_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "KerasGraphLab",
  learningObjectives: [
    "Map the notebook's Input(shape=(20,)) → hidden Dense layers → binary sigmoid output into a Functional API model.",
    "Interpret a conceptual parameter count before compiling and training the real notebook model."
  ],
  scenario: "The lab builds a Functional API binary classifier from a 20-feature input. Use this graph sketch before implementing Model(inputs, outputs) in the notebook.",
  seed: 303,
  focus: "The actual lab uses Input(shape=(20,)), hidden Dense layers (including 64 units), a single sigmoid output, then Model(inputs, outputs) and compile().",
  challenge: {
    prompt: "Sketch the lab's Functional model with one 20-feature input, a 64-unit hidden branch, and one sigmoid output.",
    success: { api: "functional", branches: "1", hidden: "64", classes: "1" },
    hints: ["The input is a single 20-element feature vector.", "Binary classification uses one sigmoid unit in this notebook."]
  },
  quiz: [{
    prompt: "What connects the input and output tensors in a Functional API model?",
    choices: ["Model(inputs=input_layer, outputs=output_layer)", "A CSV file", "TensorBoard", "The Python interpreter alone"], answer: 0,
    explanation: "The Functional API creates a Model from the input and output tensors after layers are connected."
  }]
});
