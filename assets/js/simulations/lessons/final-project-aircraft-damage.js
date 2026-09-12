export default {
  id: "02-intro-to-deep-learning-and-neural-networks-with-keras/module-5-final-project/final-project-aircraft-damage",
  courseId: "02-intro-to-deep-learning-and-neural-networks-with-keras",
  moduleId: "module-5-final-project",
  title: "Final Project Aircraft Damage",
  sourcePath: "02-Intro_to_Deep_Learning_and_Neural_Networks_with_Keras/Module-5-Final_Project/Final_Project_Aircraft_Damage.ipynb",
  sourceFormat: "ipynb",
  engine: "ProjectWorkbench",
  learningObjectives: [
    "Build an end-to-end computer vision classifier for aircraft fuselage damage inspection (Dent vs Crack vs Intact) using transfer learning with pre-trained ResNet/VGG16 backbones in Keras.",
    "Evaluate test classification performance using ROC-AUC, Confusion Matrix, and precision-recall trade-offs."
  ],
  prerequisites: [
    "CNN architectures and Transfer Learning",
    "Classification evaluation metrics"
  ],
  scenario: {
    description: "Capstone Project: Aircraft Damage Visual Inspection. Optimize feature extraction backbones, data augmentation, and classification heads to detect structural aircraft defects with high sensitivity.",
    seed: 6565
  },
  controls: [
    {
      id: "dataset",
      label: "Inspection Domain Dataset",
      type: "select",
      options: [
        { value: "aircraft_damage", label: "Aircraft Fuselage Damage Dataset (Inspection Images)" }
      ],
      default: "aircraft_damage"
    },
    {
      id: "model_type",
      label: "Architecture Backbone",
      type: "select",
      options: [
        { value: "transfer_cnn", label: "ResNet50 Transfer Learning (Pretrained Backbone + Fine-Tuning)" },
        { value: "scratch_cnn", label: "Custom CNN from Scratch (3 Conv2D Layers)" }
      ],
      default: "transfer_cnn"
    },
    {
      id: "imbalance_strategy",
      label: "Class Imbalance Mitigation",
      type: "select",
      options: [
        { value: "balanced_weights", label: "Class-Weighted Loss & Focal Loss" },
        { value: "none", label: "Standard Loss (Unweighted)" }
      ],
      default: "balanced_weights"
    }
  ],
  views: [
    {
      type: "project-dashboard",
      title: "Aircraft Damage Detection Pipeline",
      bindings: ["dataset", "model_type", "imbalance_strategy"]
    },
    {
      type: "metric-cards",
      title: "Capstone Test Results",
      bindings: ["accuracy", "f1", "status", "diagnosis"]
    }
  ],
  explanationRules: [
    {
      when: "model_type === 'transfer_cnn' && imbalance_strategy === 'balanced_weights'",
      summary: "Capstone Production Benchmark",
      detail: "Leveraging pre-trained ResNet50 features combined with class-weighted loss yields top defect detection sensitivity (>94% F1-score)."
    }
  ],
  presets: [
    {
      id: "capstone-production",
      label: "Production ResNet50 Solution",
      values: { dataset: "aircraft_damage", model_type: "transfer_cnn", imbalance_strategy: "balanced_weights" },
      teachingPoint: "Transfer learning provides robust visual representations even with modest quantities of specialized aerospace defect images."
    }
  ],
  challenge: {
    prompt: "Configure ResNet50 Transfer Learning with Class-Weighted Loss to achieve Balanced status and F1-Score >= 90%.",
    success: { dataset: "aircraft_damage", model_type: "transfer_cnn", imbalance_strategy: "balanced_weights", diagnosis: "Balanced" },
    hints: [
      "Select ResNet50 Transfer Learning.",
      "Select Class-Weighted Loss & Focal Loss."
    ]
  },
  quiz: [
    {
      prompt: "In the aircraft damage visual inspection capstone, why is Class-Weighted Loss critical during model training?",
      choices: [
        "Damaged aircraft images (cracks/dents) are far rarer than intact panels in real inspection datasets; class weighting penalizes missed defects heavily, preventing the model from trivial all-intact guessing.",
        "Because airplanes fly at high altitudes.",
        "To make the images black and white.",
        "Because ResNet requires weights to sum to 10."
      ],
      answer: 0,
      explanation: "Class weighting addresses severe dataset imbalance, boosting recall on critical minority defect classes."
    },
    {
      prompt: "What data augmentation techniques are most effective for improving generalization on aircraft fuselage visual inspection models?",
      choices: [
        "Random rotations, horizontal/vertical flips, zoom, and brightness/contrast adjustments to simulate varying lighting and camera inspection angles.",
        "Deleting 80% of pixels randomly.",
        "Adding random emoji stickers.",
        "Sorting pixels by color value."
      ],
      answer: 0,
      explanation: "Geometric and photometric data augmentations prevent CNN overfitting by teaching invariance to lighting variations and drone inspection angles."
    }
  ],
  accessibility: {
    canvasSummary: "Aircraft damage inspection capstone dashboard showing defect classification metrics and confusion matrix.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

