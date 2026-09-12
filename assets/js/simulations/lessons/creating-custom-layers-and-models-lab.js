import { defineKerasGraphSpec } from "./keras-graph-spec.js";

export default defineKerasGraphSpec({
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/creating-custom-layers-and-models-lab",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "Creating Custom Layers and Models Lab",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/6-Creating_Custom_Layers_and_Models_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "KerasGraphLab",
  learningObjectives: [
    "Sketch the notebook's 32-unit custom Dense/ReLU layer and a softmax output for multi-class classification.",
    "Separate architecture design from the notebook's later compile(Adam, categorical cross-entropy), train, and evaluate steps."
  ],
  scenario: "The notebook creates a custom layer with 32 units, integrates it into a model, then compiles and evaluates on example data. Sketch its architecture without claiming to run the notebook.",
  seed: 306,
  focus: "The lab's custom layer has 32 units and ReLU; its multi-class output uses softmax. The real notebook compiles with Adam and categorical cross-entropy.",
  challenge: {
    prompt: "Sketch one input, a 32-unit custom layer, and a three-class softmax output in the Functional API.",
    success: { api: "functional", branches: "1", hidden: "32", custom: "yes", classes: "3" },
    hints: ["Set hidden units to 32 and enable the custom layer.", "A multi-class head uses softmax in this lab."]
  },
  quiz: [{
    prompt: "Which output activation and loss pairing does the notebook describe for multi-class classification?",
    choices: ["Softmax and categorical cross-entropy", "Sigmoid and mean squared error", "ReLU and no loss", "Linear output and clustering"], answer: 0,
    explanation: "The lab uses a softmax output and categorical cross-entropy for its multi-class setup."
  }]
});
