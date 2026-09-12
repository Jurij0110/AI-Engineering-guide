export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-2-advanced-cnns-in-keras/tensorflow-for-image-processing",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-2-advanced-cnns-in-keras",
  title: "Tensorflow for Image Processing",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-2-Advanced_CNNs_in_Keras/6-Tensorflow_for_Image_Processing.txt",
  sourceFormat: "txt",
  engine: "DeepVisionLab",
  learningObjectives: [
    "Identify key TensorFlow tools and ecosystems for production image processing: tf.data streaming pipelines, Keras preprocessing layers, and pre-trained model hubs.",
    "Evaluate performance trade-offs (latency, FPS throughput, memory footprint) across real-world domains like autonomous driving and mobile edge deployment."
  ],
  prerequisites: [
    "Image dataset pipelines and batching",
    "Hardware targets (GPU, TPU, Edge embedded devices)"
  ],
  scenario: {
    description: "Design an optimized TensorFlow image ingestion and inference pipeline for an autonomous driving perception system requiring high throughput and low latency.",
    seed: 3206
  },
  controls: [
    {
      id: "mode",
      label: "Workbench Mode",
      type: "select",
      options: [
        { value: "pipeline", label: "Image Processing Pipeline Mode" }
      ],
      default: "pipeline"
    },
    {
      id: "domain",
      label: "Application Domain",
      type: "select",
      options: [
        { value: "autonomous_driving", label: "Autonomous Driving (Low Latency / High FPS)" },
        { value: "medical_imaging", label: "Medical Imaging (High Resolution / FP32 Precision)" },
        { value: "facial_recognition", label: "Facial Recognition / Mobile Edge" }
      ],
      default: "autonomous_driving"
    },
    {
      id: "pipeline",
      label: "Data Ingestion Pipeline",
      type: "select",
      options: [
        { value: "tf_data", label: "tf.data (Prefetch, Parallel Map, Cache)" },
        { value: "generator", label: "ImageDataGenerator (Python Threaded Flow)" }
      ],
      default: "tf_data"
    },
    {
      id: "device",
      label: "Target Compute Hardware",
      type: "select",
      options: [
        { value: "gpu", label: "Discrete GPU (NVIDIA Tensor Core)" },
        { value: "tpu", label: "Cloud TPU Pod" },
        { value: "edge", label: "Edge Device (ARM / TFLite INT8)" }
      ],
      default: "gpu"
    },
    {
      id: "precision",
      label: "Inference Precision",
      type: "select",
      options: [
        { value: "fp16", label: "FP16 Mixed Precision (Accelerated)" },
        { value: "fp32", label: "FP32 Full Precision" },
        { value: "int8", label: "INT8 Quantized (Edge Minimal)" }
      ],
      default: "fp16"
    }
  ],
  views: [
    {
      type: "pipeline-diagram",
      title: "TensorFlow Processing Flow",
      bindings: ["domain", "pipeline", "device", "precision"]
    },
    {
      type: "system-metrics",
      title: "System Performance Profile",
      bindings: ["throughputFps", "latencyMs", "memoryMb"]
    }
  ],
  explanationRules: [
    {
      when: "pipeline === 'tf_data'",
      summary: "High Throughput with tf.data",
      detail: "tf.data utilizes C++ multithreading, prefetching (prefetch(AUTOTUNE)), and caching to eliminate GPU input starvation."
    },
    {
      when: "precision === 'fp16' && device === 'gpu'",
      summary: "Mixed Precision Acceleration",
      detail: "FP16 halves memory bandwidth requirements and leverages Tensor Cores for up to 3x higher inference frame rates."
    }
  ],
  presets: [
    {
      id: "target-autonomous-pipeline",
      label: "Autonomous Vehicle Vision Pipeline (Target)",
      values: { mode: "pipeline", domain: "autonomous_driving", pipeline: "tf_data", device: "gpu", precision: "fp16" },
      teachingPoint: "Optimized for real-time perception: tf.data with GPU FP16 mixed precision delivers >150 FPS."
    },
    {
      id: "legacy-generator-bottleneck",
      label: "Legacy ImageDataGenerator (Input Bottleneck)",
      values: { mode: "pipeline", domain: "autonomous_driving", pipeline: "generator", device: "gpu", precision: "fp32" },
      teachingPoint: "Shows how Python GIL and synchronous disk reads starve GPU compute."
    }
  ],
  challenge: {
    prompt: "Configure the Autonomous Driving pipeline using tf.data on a GPU with FP16 precision to achieve high throughput.",
    success: { mode: "pipeline", domain: "autonomous_driving", pipeline: "tf_data", device: "gpu", precision: "fp16" },
    hints: [
      "Select Autonomous Driving as Domain.",
      "Choose tf.data for ingestion.",
      "Select Discrete GPU.",
      "Choose FP16 Mixed Precision."
    ]
  },
  quiz: [
    {
      prompt: "Why is tf.data preferred over legacy ImageDataGenerator in modern TensorFlow pipelines?",
      choices: [
        "It supports asynchronous prefetching (AUTOTUNE), parallel mapping, and C++ execution without Python GIL bottlenecks",
        "It only works on CPUs",
        "It removes all layers from the neural network",
        "It converts images into text files"
      ],
      answer: 0,
      explanation: "tf.data runs natively in C++ and overlaps data preprocessing with GPU computation using dataset.prefetch(tf.data.AUTOTUNE)."
    },
    {
      prompt: "What is the primary benefit of INT8 quantization for edge image processing?",
      choices: [
        "It reduces model size and memory bandwidth by ~4x, enabling fast low-power execution on edge chips",
        "It increases the number of classes the model can classify",
        "It makes convolutional filters transparent",
        "It disables backpropagation permanently"
      ],
      answer: 0,
      explanation: "INT8 quantization maps 32-bit floats to 8-bit integers, drastically reducing memory footprint and power consumption on mobile/edge devices."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive TensorFlow image processing architecture simulator comparing data pipeline backends, hardware targets, throughput FPS, and latency.",
    keyboardHelp: "Use Tab and Arrow keys to configure application domain, pipeline backend, hardware device, and numerical precision."
  }
};

