export default {
  id: "01-machine-learning-with-python/module-4-unsupervised-learning-models/k-means-customer-seg-lab",
  courseId: "01-machine-learning-with-python",
  moduleId: "module-4-unsupervised-learning-models",
  title: "K Means Customer Seg Lab",
  sourcePath: "01-Machine_Learning_with_Python/Module-4-Unsupervised_Learning_Models/03-K_Means_Customer_Seg_Lab.ipynb",
  sourceFormat: "ipynb",
  engine: "ClusterExplorer",
  learningObjectives: [
    "Preprocess customer demographics (Cust_Segmentation.csv), drop categorical identifiers (Address), and scale features with StandardScaler.",
    "Train KMeans(n_clusters=3) in scikit-learn and profile customer personas by age, income, and debt ratio."
  ],
  prerequisites: [
    "K-Means algorithm",
    "StandardScaler preprocessing"
  ],
  scenario: {
    description: "Follow the telecommunications customer segmentation lab. Cluster 800+ customers by Age, Income, and Debt Ratio into distinct economic personas (Affluent Senior, Middle-aged Educated, Young High Debt).",
    seed: 2222
  },
  controls: [
    {
      id: "algorithm",
      label: "Clustering Engine",
      type: "select",
      options: [
        { value: "kmeans", label: "KMeans (scikit-learn)" }
      ],
      default: "kmeans"
    },
    {
      id: "k",
      label: "Persona Segments (k)",
      type: "range",
      min: 2,
      max: 5,
      step: 1,
      default: 3
    },
    {
      id: "pattern",
      label: "Customer Demographics",
      type: "select",
      options: [
        { value: "customers", label: "Income vs Debt Ratio Segments" }
      ],
      default: "customers"
    }
  ],
  views: [
    {
      type: "scatter-plot",
      title: "Customer Persona Partitions",
      bindings: ["data", "assignments", "centroids"]
    },
    {
      type: "metric-cards",
      title: "Segmentation Profile",
      bindings: ["silhouette", "diagnosis", "clusters"]
    }
  ],
  explanationRules: [
    {
      when: "k === 3",
      summary: "Lab 3-Persona Benchmark",
      detail: "The notebook reveals 3 distinct clusters: 1. Affluent older customers, 2. Middle-income educated, 3. Young high-debt individuals."
    }
  ],
  presets: [
    {
      id: "lab-3-segments",
      label: "Lab Benchmark (3 Segments)",
      values: { algorithm: "kmeans", k: 3, pattern: "customers" },
      teachingPoint: "3 personas provide actionable targeted marketing groups with high internal consistency."
    }
  ],
  challenge: {
    prompt: "Replicate the lab persona segmentation: set Persona Segments to 3 to achieve Balanced status.",
    success: { k: 3, diagnosis: "Balanced" },
    hints: [
      "Set Persona Segments (k) to 3.",
      "Verify Silhouette Score is above 0.60."
    ]
  },
  quiz: [
    {
      prompt: "Why was the 'Address' column dropped before running KMeans in the customer segmentation notebook?",
      choices: [
        "Address was a non-numerical categorical string variable that cannot be directly computed into Euclidean distances.",
        "Because all customers lived at the same address.",
        "To make the dataset smaller for memory reasons.",
        "Because scikit-learn only accepts 2 columns."
      ],
      answer: 0,
      explanation: "Euclidean distance requires numerical dimensions; non-ordinal categorical text variables must be encoded or dropped."
    },
    {
      prompt: "Why is feature standardization (StandardScaler) necessary before clustering customer income and age?",
      choices: [
        "Because income values in $10,000s would completely dwarf age values in 10s in distance computations.",
        "To convert negative values into positive values.",
        "To make all values integers.",
        "StandardScaler is required by law in banking."
      ],
      answer: 0,
      explanation: "Without scaling, income variations would account for >99% of Euclidean distance calculations."
    }
  ],
  accessibility: {
    canvasSummary: "Customer segmentation 2D plot showing 3 distinct clusters and centroid markers.",
    keyboardHelp: "Use Tab to navigate controls. Adjust sliders with Arrow keys and select dropdown options with Up/Down keys."
  }
};

