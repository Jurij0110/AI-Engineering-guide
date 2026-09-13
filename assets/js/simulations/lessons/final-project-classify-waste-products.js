export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-7-final-project/final-project-classify-waste-products",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-7-final-project",
  title: "Final Project: Classify Waste Products Using Transfer Learning",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-7-Final_Project/2-Final_Project_Classify_Waste_Products.ipynb",
  sourceFormat: "ipynb",
  engine: "WasteClassificationLab",
  learningObjectives: [
    "Build an automated binary waste classification model differentiating Recyclable ('R') from Organic ('O') items using transfer learning.",
    "Compare frozen VGG16 feature extraction against fine-tuning Block 5 layers to improve sorting accuracy on 150x150 images.",
    "Evaluate classification performance using confusion matrices and assess recyclable batch contamination rates to optimize industrial sorting thresholds."
  ],
  prerequisites: [
    "Transfer learning workflows in TensorFlow / Keras",
    "Binary classification loss functions and threshold tuning",
    "Confusion matrix metrics: Precision, Recall, False Positive rates"
  ],
  scenario: {
    description: "Simulate EcoClean's automated waste sorting facility. Compare VGG16 feature extraction vs fine-tuning, evaluate recyclable vs organic confusion matrices, and tune decision thresholds to prevent recycling lot contamination.",
    seed: 702
  },
  controls: [
    {
      id: "model_mode",
      label: "Model Architecture & Strategy",
      type: "select",
      default: "feature_extraction",
      options: [
        { value: "fine_tuning", label: "Fine-Tuned VGG16 (Unfreeze Block 5 Conv Layers)" },
        { value: "feature_extraction", label: "Feature Extractor (Pretrained VGG16 Base Frozen)" },
        { value: "from_scratch", label: "Trained From Scratch (Random Initialization)" }
      ]
    },
    {
      id: "data_augmentation",
      label: "Training Data Augmentation",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (Width/Height Shift 0.1, Horizontal Flip)" },
        { value: "disabled", label: "Disabled (Rescaling 1/255 Only — Overfitting Risk)" }
      ]
    },
    {
      id: "learning_rate",
      label: "Optimizer Learning Rate (RMSprop)",
      type: "select",
      default: "0.0001",
      options: [
        { value: "0.0001", label: "1e-4 (Standard Notebook Initial Learning Rate)" },
        { value: "0.00005", label: "5e-5 (Step-Decay Annealed Learning Rate)" },
        { value: "0.001", label: "1e-3 (Aggressive — Destabilizes Fine-Tuning)" }
      ]
    },
    {
      id: "decision_threshold",
      label: "Recyclable Classification Threshold (τ)",
      type: "select",
      default: "0.5",
      options: [
        { value: "0.35", label: "0.35 (High Recall — Maximizes Recyclable Recovery)" },
        { value: "0.5", label: "0.50 (Standard Decision Boundary)" },
        { value: "0.65", label: "0.65 (High Precision — Suppresses Contamination)" }
      ]
    },
    {
      id: "epochs",
      label: "Training Epochs",
      type: "select",
      default: "10",
      options: [
        { value: "2", label: "2 Epochs (Initial Convergence)" },
        { value: "5", label: "5 Epochs (Midway Checkpoint)" },
        { value: "10", label: "10 Epochs (Full Notebook Training Run)" }
      ]
    }
  ],
  views: [
    {
      type: "confusion-matrix-dashboard",
      title: "Waste Sorting Confusion Matrix and Facility Metrics",
      bindings: ["model_mode", "data_augmentation", "decision_threshold"]
    },
    {
      type: "metric-cards",
      title: "Waste Classification Performance",
      bindings: ["test-acc", "contamination-rate", "precision", "status"]
    }
  ],
  explanationRules: [
    {
      when: "model_mode === 'fine_tuning' && decision_threshold === '0.65'",
      summary: "Low-Contamination Industrial Policy",
      detail: "Elevating the decision threshold to 0.65 demands higher model confidence before routing an item to the recycling hopper, driving contamination rates down."
    },
    {
      when: "model_mode === 'feature_extraction'",
      summary: "Feature Extraction Baseline",
      detail: "Freezing all VGG16 base layers trains only the top Dense classifier (4.46M params), providing quick convergence but leaving subtle texture cues unadapted."
    },
    {
      when: "data_augmentation === 'disabled'",
      summary: "Training Set Memorization",
      detail: "Without spatial data augmentation, training loss drops rapidly while validation and test accuracy stall due to overfitting on the illustrative 800-image training distribution."
    }
  ],
  presets: [
    {
      id: "fine-tuned-standard",
      label: "Fine-Tuned VGG16 (EcoClean)",
      values: {
        model_mode: "fine_tuning",
        data_augmentation: "enabled",
        learning_rate: "0.00005",
        decision_threshold: "0.5",
        epochs: "10"
      }
    },
    {
      id: "feature-extractor-baseline",
      label: "Feature Extractor (Baseline)",
      values: {
        model_mode: "feature_extraction",
        data_augmentation: "enabled",
        learning_rate: "0.0001",
        decision_threshold: "0.5",
        epochs: "10"
      }
    },
    {
      id: "low-contamination-policy",
      label: "Low Contamination (τ = 0.65)",
      values: {
        model_mode: "fine_tuning",
        data_augmentation: "enabled",
        learning_rate: "0.00005",
        decision_threshold: "0.65",
        epochs: "10"
      }
    },
    {
      id: "no-augmentation-overfit",
      label: "No Augmentation (Overfitting)",
      values: {
        model_mode: "feature_extraction",
        data_augmentation: "disabled",
        learning_rate: "0.0001",
        decision_threshold: "0.5",
        epochs: "10"
      }
    }
  ],
  challenge: {
    prompt: "Configure the model for fine-tuning with data augmentation enabled to achieve at least 85% test accuracy with a recyclable batch contamination rate below 12%.",
    success: {
      model_mode: "fine_tuning",
      data_augmentation: "enabled"
    }
  },
  quiz: [
    {
      question: "In an automated municipal recycling facility like EcoClean, what is the critical industrial risk of a False Recyclable classification (labeling Organic waste as Recyclable)?",
      options: [
        "Organic matter enters the recyclable bales, rotting and contaminating entire batches of recycled paper or plastic, leading to facility penalties or landfill diversion.",
        "The server running TensorFlow runs out of RAM during the inference pass.",
        "The image generator automatically flips the binary labels from 0 to 1.",
        "The model weights are permanently overwritten by the operating system."
      ],
      correctIndex: 0,
      explanation: "In recycling plants, organic material (food scraps, moisture) corrupts bales of recyclables, degrading material purity and causing recyclers to reject entire batches. Controlling the False Recyclable rate is therefore a paramount business metric."
    },
    {
      question: "Why does the lab model use `class_mode='binary'`, a single sigmoid output unit, and `binary_crossentropy` loss?",
      options: [
        "The problem consists of exactly two mutually exclusive categories (Organic 0 vs Recyclable 1), where a single unit outputting probability P(R) is statistically optimal and parameter-efficient.",
        "Convolutional neural networks cannot compute gradients for more than one output node.",
        "ImageDataGenerator requires binary class mode to enable GPU acceleration.",
        "VGG16 pre-trained weights only function on binary classification tasks."
      ],
      correctIndex: 0,
      explanation: "For binary classification, a single sigmoid node computes probability p in [0, 1]. It directly matches binary crossentropy loss: L = -[y*log(p) + (1-y)*log(1-p)], avoiding redundant parameters."
    },
    {
      question: "What effect does raising the decision threshold from 0.50 to 0.65 have on the recycling classification stream?",
      options: [
        "It increases precision on recyclables and reduces false recyclables (contamination), at the cost of sending some ambiguous recyclables to organic compost.",
        "It doubles the learning rate during backpropagation.",
        "It unfreezes all layers of the VGG16 backbone automatically.",
        "It forces the model to classify 100% of images as Recyclable."
      ],
      correctIndex: 0,
      explanation: "Raising the decision threshold makes the classifier more conservative: only images with high confidence (>0.65) are routed to Recyclables. This lowers false positives (contaminants) while slightly increasing false negatives."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive Waste Classification simulation displaying a 2x2 confusion matrix heatmap, recyclable batch contamination rate, and threshold-dependent sorting accuracy.",
    keyboardHelp: "Use Tab to navigate controls and select options with arrow keys or Enter to toggle model fine-tuning, augmentation, and decision thresholds."
  }
};
