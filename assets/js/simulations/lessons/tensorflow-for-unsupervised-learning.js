export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-4-unsupervised-and-generative-in-keras/tensorflow-for-unsupervised-learning",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-4-unsupervised-and-generative-in-keras",
  title: "Tensorflow for Unsupervised Learning",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-4-Unsupervised_and_Generative_in_Keras/7-Tensorflow_for_Unsupervised_Learning.txt",
  sourceFormat: "txt",
  engine: "TensorFlowEcosystemLab",
  learningObjectives: [
    "Integrate TensorFlow and Keras tensor processing with scikit-learn for KMeans clustering on unlabelled MNIST data.",
    "Combine deep autoencoder bottleneck representations with non-linear projection techniques (such as t-SNE) for 2D latent visualization."
  ],
  prerequisites: [
    "Keras data preparation and reshaping",
    "KMeans clustering and t-SNE projection fundamentals"
  ],
  scenario: {
    description: "Match unsupervised learning and clustering goals to the appropriate TensorFlow and Keras ecosystem components and execution modes.",
    seed: 3407
  },
  controls: [
    {
      id: "target",
      label: "Workflow Goal",
      type: "select",
      default: "clustering",
      options: [
        { value: "clustering", label: "Cluster unlabelled data & extract representations" },
        { value: "training", label: "Build and debug a supervised model" },
        { value: "mobile", label: "Deploy to a mobile or edge device" },
        { value: "web", label: "Run inference in a web app" },
        { value: "reusable", label: "Find reusable model components" },
        { value: "monitoring", label: "Visualize training behavior" }
      ]
    },
    {
      id: "tool",
      label: "Ecosystem Component",
      type: "select",
      default: "tensorflow",
      options: [
        { value: "tensorflow", label: "TensorFlow + Keras" },
        { value: "lite", label: "TensorFlow Lite" },
        { value: "js", label: "TensorFlow.js" },
        { value: "tfx", label: "TensorFlow Extended (TFX)" },
        { value: "hub", label: "TensorFlow Hub" },
        { value: "tensorboard", label: "TensorBoard" }
      ]
    },
    {
      id: "execution",
      label: "Execution Mode",
      type: "select",
      default: "eager",
      options: [
        { value: "eager", label: "Eager operations" },
        { value: "graph", label: "Prebuilt graph" }
      ]
    }
  ],
  views: [
    {
      type: "ecosystem-match",
      title: "TensorFlow Ecosystem Unsupervised Alignment",
      bindings: ["target", "tool", "execution"]
    }
  ],
  explanationRules: [
    {
      when: "target === 'clustering' && tool === 'tensorflow'",
      summary: "TensorFlow & Scikit-Learn Unsupervised Pipeline",
      detail: "TensorFlow and Keras preprocess high-dimensional tensors and train autoencoders, which convert to NumPy arrays for scikit-learn KMeans clustering and t-SNE manifold visualization."
    },
    {
      when: "target === 'monitoring' && tool === 'tensorboard'",
      summary: "TensorBoard Projector",
      detail: "TensorBoard includes the Embedding Projector tool to interactively explore high-dimensional latent vectors using PCA, UMAP, or t-SNE."
    }
  ],
  presets: [
    {
      id: "unsupervised-cluster",
      label: "Unsupervised Clustering (TF + Eager)",
      values: { target: "clustering", tool: "tensorflow", execution: "eager" },
      teachingPoint: "Use TensorFlow 2 eager execution with Keras to prepare tensors and train autoencoder embeddings for clustering."
    },
    {
      id: "edge-deploy",
      label: "Edge Inference (TF Lite)",
      values: { target: "mobile", tool: "lite", execution: "eager" },
      teachingPoint: "Use TensorFlow Lite for optimized on-device edge deployment."
    },
    {
      id: "visualize-training",
      label: "Training Monitoring (TensorBoard)",
      values: { target: "monitoring", tool: "tensorboard", execution: "eager" },
      teachingPoint: "TensorBoard tracks loss curves and projects embedding spaces."
    }
  ],
  challenge: {
    prompt: "Configure TensorFlow and Keras with eager execution for unlabelled clustering and latent representation extraction.",
    success: { target: "clustering", tool: "tensorflow", execution: "eager" },
    hints: [
      "Select 'Cluster unlabelled data & extract representations' as the Workflow Goal.",
      "Choose 'TensorFlow + Keras' as the Ecosystem Component.",
      "Select 'Eager operations' as the Execution Mode."
    ]
  },
  quiz: [
    {
      prompt: "In Lesson 7, how is the KMeans algorithm from scikit-learn connected with TensorFlow MNIST data?",
      choices: [
        "MNIST data is normalized and flattened with NumPy/TensorFlow, then fitted directly using KMeans(n_clusters=10).",
        "KMeans compiles into a CUDA kernel that replaces all TensorFlow layers.",
        "TensorFlow cannot exchange tensors with scikit-learn.",
        "KMeans requires supervised ground-truth labels for every image."
      ],
      answer: 0,
      explanation: "TensorFlow tensors evaluate eagerly and convert seamlessly to NumPy arrays, allowing scikit-learn clustering algorithms like KMeans to cluster unlabelled representations."
    },
    {
      prompt: "According to Lesson 7, what is a powerful workflow after training a 64-dimensional autoencoder bottleneck?",
      choices: [
        "Extract the 64D bottleneck representations and use t-SNE to project and visualize the latent clusters in 2D space.",
        "Delete all autoencoder weights and train a linear regression.",
        "Increase the number of output pixels to 10,000.",
        "Re-label the dataset manually."
      ],
      answer: 0,
      explanation: "Autoencoders compress 784D data into 64D latent vectors; applying t-SNE projects these representations down to 2D for intuitive visual cluster analysis."
    }
  ],
  accessibility: {
    canvasSummary: "TensorFlow ecosystem selector matching unsupervised clustering and representation learning goals to TensorFlow components.",
    keyboardHelp: "Use Tab and Arrow keys to choose the workflow goal, ecosystem tool, and execution mode."
  }
};
