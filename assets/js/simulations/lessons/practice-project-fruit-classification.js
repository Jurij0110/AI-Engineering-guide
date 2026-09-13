export default {
  id: "03-deep-learning-with-keras-and-tensorflow/module-7-final-project/practice-project-fruit-classification",
  courseId: "03-deep-learning-with-keras-and-tensorflow",
  moduleId: "module-7-final-project",
  title: "Practice Project: Fruit Classification Using Transfer Learning",
  sourcePath: "03-Deep_Learning_with_Keras_and_Tensorflow/Module-7-Final_Project/1-Practice_Project_Fruit Classification.ipynb",
  sourceFormat: "ipynb",
  engine: "FruitClassificationLab",
  learningObjectives: [
    "Organize a multi-class image dataset of 24 fruit categories with ImageDataGenerator for training, validation, and testing at 64x64 resolution.",
    "Construct a transfer learning pipeline using a pre-trained VGG16 base with custom GlobalAveragePooling2D, BatchNormalization, and Dense classification head.",
    "Fine-tune the model by unfreezing the last 5 layers of VGG16 with a reduced learning rate (1e-5) to improve generalization on unseen test fruit images."
  ],
  prerequisites: [
    "Convolutional Neural Networks and Transfer Learning principles",
    "Keras ImageDataGenerator and image augmentation techniques",
    "VGG16 architecture and layer unfreezing semantics"
  ],
  scenario: {
    description: "Explore the two-stage transfer learning workflow for classifying 24 fruit classes from Fruits-360. Compare frozen feature extraction against selective fine-tuning of the last 5 VGG16 layers with data augmentation and learning rate tuning.",
    seed: 701
  },
  controls: [
    {
      id: "training_stage",
      label: "Training Stage & Transfer Strategy",
      type: "select",
      default: "feature_extraction",
      options: [
        { value: "feature_extraction", label: "Stage 1: Feature Extraction (VGG16 Base Frozen)" },
        { value: "fine_tuning", label: "Stage 2: Fine-Tuning (Unfreeze Top Conv Layers)" },
        { value: "from_scratch", label: "Baseline: Train Entire Network From Scratch" }
      ]
    },
    {
      id: "data_augmentation",
      label: "Training Data Augmentation",
      type: "select",
      default: "enabled",
      options: [
        { value: "enabled", label: "Enabled (Rotation 20°, Zoom 0.2, Shear 0.2, Flip)" },
        { value: "disabled", label: "Disabled (Rescaling 1/255 Only — High Overfit Risk)" }
      ]
    },
    {
      id: "learning_rate",
      label: "Optimizer Learning Rate (Adam)",
      type: "select",
      default: "0.001",
      options: [
        { value: "0.001", label: "1e-3 (Standard for Stage 1 Head Training)" },
        { value: "0.0001", label: "1e-4 (Moderate Fine-Tuning)" },
        { value: "0.00001", label: "1e-5 (Recommended for Stage 2 Fine-Tuning)" }
      ]
    },
    {
      id: "unfrozen_layers",
      label: "Base Model Trainable Layers",
      type: "select",
      default: "0",
      options: [
        { value: "0", label: "0 Layers (All 19 VGG16 Layers Frozen)" },
        { value: "5", label: "Last 5 Base Layers Unfrozen (Block 5 Convolutions)" },
        { value: "19", label: "All 19 Layers Unfrozen (Full Network Training)" }
      ]
    },
    {
      id: "epochs",
      label: "Training Epochs",
      type: "select",
      default: "5",
      options: [
        { value: "1", label: "1 Epoch (Initial Warmup)" },
        { value: "3", label: "3 Epochs (Midway Convergence)" },
        { value: "5", label: "5 Epochs (Standard Notebook Baseline)" },
        { value: "10", label: "10 Epochs (Extended Optimization)" }
      ]
    }
  ],
  views: [
    {
      type: "transfer-learning-dashboard",
      title: "VGG16 Fruit Classifier Training & Generalization",
      bindings: ["training_stage", "data_augmentation", "learning_rate", "unfrozen_layers"]
    },
    {
      type: "metric-cards",
      title: "Fruit Classification Performance",
      bindings: ["test-acc", "val-loss", "trainable-params", "status"]
    }
  ],
  explanationRules: [
    {
      when: "training_stage === 'fine_tuning' && learning_rate === '0.00001' && unfrozen_layers === '5'",
      summary: "Optimal Two-Stage Fine-Tuning",
      detail: "Unfreezing the top 5 layers with a low learning rate (1e-5) allows the deep convolutional filters to adapt to fine fruit textures without destroying general low-level edge features."
    },
    {
      when: "training_stage === 'fine_tuning' && learning_rate === '0.001'",
      summary: "Catastrophic Forgetting Risk",
      detail: "Using an excessive learning rate (1e-3) while unfreezing base convolutional layers causes massive gradient updates that overwrite pre-trained ImageNet representations."
    },
    {
      when: "training_stage === 'feature_extraction'",
      summary: "Stable Feature Extraction",
      detail: "Freezing all 19 VGG16 base layers preserves pre-trained weights intact, optimizing only the 138k parameters of the custom classification head."
    }
  ],
  presets: [
    {
      id: "stage1-feature-extraction",
      label: "Stage 1: Feature Extraction",
      values: {
        training_stage: "feature_extraction",
        data_augmentation: "enabled",
        learning_rate: "0.001",
        unfrozen_layers: "0",
        epochs: "5"
      }
    },
    {
      id: "stage2-fine-tuning",
      label: "Stage 2: Fine-Tuning (Optimal)",
      values: {
        training_stage: "fine_tuning",
        data_augmentation: "enabled",
        learning_rate: "0.00001",
        unfrozen_layers: "5",
        epochs: "5"
      }
    },
    {
      id: "cold-init-scratch",
      label: "Cold Init (From Scratch)",
      values: {
        training_stage: "from_scratch",
        data_augmentation: "disabled",
        learning_rate: "0.001",
        unfrozen_layers: "19",
        epochs: "5"
      }
    },
    {
      id: "destructive-high-lr",
      label: "High LR Fine-Tuning (Destructive)",
      values: {
        training_stage: "fine_tuning",
        data_augmentation: "enabled",
        learning_rate: "0.001",
        unfrozen_layers: "5",
        epochs: "5"
      }
    }
  ],
  challenge: {
    prompt: "Configure the model for Stage 2 Fine-Tuning with data augmentation enabled, the last 5 layers unfrozen, and a low learning rate (1e-5) to achieve at least 75% test accuracy across 24 fruit classes.",
    success: {
      training_stage: "fine_tuning",
      data_augmentation: "enabled",
      learning_rate: "0.00001",
      unfrozen_layers: "5"
    }
  },
  quiz: [
    {
      question: "Why are the pre-trained VGG16 base layers initially frozen (`layer.trainable = False`) during feature extraction in Task 3?",
      options: [
        "To prevent randomly initialized weights in the new classification head from sending large destructive gradient updates through the pre-trained feature extractors.",
        "Because TensorFlow does not allow backpropagation through convolution layers under any circumstances.",
        "To compress the model weights into 8-bit quantized integers automatically.",
        "To double the number of output classes from 12 to 24."
      ],
      correctIndex: 0,
      explanation: "Freezing the pre-trained base retains the learned feature extractors from ImageNet while only the freshly initialized dense layers are trained, preventing catastrophic disruption of convolutional weights."
    },
    {
      question: "When unfreezing the last 5 layers of VGG16 for fine-tuning in Task 6, why is a much smaller learning rate (`1e-5`) used compared to initial training (`1e-3`)?",
      options: [
        "To make gentle, incremental weight updates to the specialized high-level feature maps without destroying existing representations.",
        "Because smaller learning rates force the GPU to bypass memory caching bottlenecks.",
        "To guarantee that the validation loss monotonically decreases to exactly zero.",
        "Because VGG16 layers are mathematically incompatible with learning rates greater than 1e-4."
      ],
      correctIndex: 0,
      explanation: "A small learning rate (such as 1e-5) is crucial during fine-tuning because the convolutional layers already possess well-structured visual filters; aggressive updates would destroy these pre-trained representations."
    },
    {
      question: "In Task 2, why is data augmentation applied exclusively to `train_datagen` while `val_datagen` and `test_datagen` only rescale pixel values?",
      options: [
        "Validation and test sets must evaluate model performance on genuine, unaltered real-world images to provide an unbiased benchmark.",
        "Keras throws a runtime exception if data augmentation is enabled on validation generators.",
        "Augmenting test data would artificially increase the number of fruit classes beyond 24.",
        "Test images cannot be rotated because fruit orientations are standardized by botanical definition."
      ],
      correctIndex: 0,
      explanation: "Data augmentation artificially expands the training distribution to improve generalization; validation and test sets must remain representative of natural, unperturbed inputs to measure true generalization accurately."
    }
  ],
  accessibility: {
    canvasSummary: "Interactive Fruit Classification simulation showing VGG16 transfer learning parameter allocation, training/validation loss curves, and top-3 class prediction distributions.",
    keyboardHelp: "Use Tab to navigate controls and select options with arrow keys or Enter to toggle training stages, learning rates, and data augmentation."
  }
};
