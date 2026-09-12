import { defineKerasGraphSpec } from "./keras-graph-spec.js";

export default defineKerasGraphSpec({
  id: "03-deep-learning-with-keras-and-tensorflow/module-1-advanced-keras-functionality/keras-functional-and-subclassing-api",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-1-advanced-keras-functionality",
  title: "Keras Functional and Subclassing API",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-1-Advanced_Keras_Functionality/2-Keras_Functional_and_Subclassing_API.txt ",
  sourceFormat: "txt",
  engine: "KerasGraphLab",
  learningObjectives: [
    "Distinguish explicit Functional API graphs with shared layer weights from subclassed Models with a custom call() forward pass.",
    "Select subclassing for dynamic model logic while recognizing that it still defines reusable trainable layers."
  ],
  scenario: "A research model needs dynamic Python control flow in call(). Compare static Functional graphs and a subclassed Model.",
  seed: 302,
  focus: "A subclass of keras.Model defines layers in __init__ and forward computation in call(); a shared Functional layer reuses one set of weights across inputs.",
  challenge: {
    prompt: "Represent dynamic forward-pass logic with a subclassed Model and one input branch.",
    success: { api: "subclass", dynamic: "yes", branches: "1" },
    hints: ["Functional API is best for explicit static wiring.", "Choose subclassing for dynamic call() control flow."]
  },
  quiz: [{
    prompt: "What method defines the forward pass in a subclassed keras.Model?",
    choices: ["call()", "compile()", "summary()", "add_weight()"], answer: 0,
    explanation: "Subclassed Models implement call() to describe forward computation."
  }]
});
