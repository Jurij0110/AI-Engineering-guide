import { ProgressStore, setupAuthControls } from "../progress-store.js";

setupAuthControls();

const phases = [
  {
    id: "foundations",
    number: "01",
    title: "Programming Foundations",
    duration: "4-6 weeks",
    color: "#e85d3f",
    summary: "Become comfortable building and debugging small Python programs before touching model code.",
    lessons: [
      lesson("python-core", "Python core", "6 hours", "Write clear programs with functions, collections, modules, classes, and exceptions.",
        ["Use lists, dictionaries, sets, and tuples according to their access patterns.", "Split behavior into small functions and modules; use classes when state and behavior belong together.", "Handle expected failures explicitly with exceptions and use type hints at public boundaries."],
        "Build a command-line expense tracker that imports and exports JSON.",
        "CS50P: Introduction to Programming with Python", "Harvard CS50", "https://www.youtube.com/watch?v=nLRL_NcnK-4"),
      lesson("python-data", "NumPy, pandas & visualization", "8 hours", "Load, inspect, transform, and explain a real dataset.",
        ["Use NumPy arrays for vectorized numerical work and pandas DataFrames for labeled tabular data.", "Inspect missing values, duplicates, distributions, and suspicious outliers before modeling.", "Create charts that answer a specific question rather than decorating a notebook."],
        "Analyze a public dataset and publish a notebook with five evidence-based findings.",
        "Data Analysis with Python", "freeCodeCamp", "https://www.youtube.com/results?search_query=freecodecamp+data+analysis+python+pandas+numpy"),
      lesson("git-cli", "Git, GitHub & command line", "5 hours", "Work reproducibly and communicate changes through version control.",
        ["Practice status, add, commit, log, branch, merge, pull, and push.", "Write focused commits and use a README to make setup and intent obvious.", "Use virtual environments and keep generated files, secrets, and local data out of Git."],
        "Publish your data project with a clean history, README, and requirements file.",
        "Git and GitHub for Beginners", "freeCodeCamp", "https://www.youtube.com/watch?v=RGOj5yH7evk"),
      lesson("sql-api", "SQL, HTTP & APIs", "8 hours", "Query relational data and expose a small application over HTTP.",
        ["Write SELECT, JOIN, GROUP BY, subqueries, and window functions.", "Understand HTTP methods, status codes, headers, JSON, and REST resource design.", "Validate request and response data and return errors that clients can act on."],
        "Create a FastAPI service backed by SQLite with at least four tested endpoints.",
        "FastAPI Course for Beginners", "freeCodeCamp", "https://www.youtube.com/results?search_query=freecodecamp+FastAPI+course+beginners")
    ]
  },
  {
    id: "math",
    number: "02",
    title: "Mathematics for ML",
    duration: "4-6 weeks",
    color: "#269b81",
    summary: "Learn enough mathematics to understand model behavior, gradients, and uncertainty.",
    lessons: [
      lesson("linear-algebra", "Linear algebra", "8 hours", "Reason about vectors, matrices, transformations, and similarity.",
        ["Understand vectors, bases, span, matrix multiplication, transpose, and inverse.", "Interpret the dot product as projection and similarity.", "Connect matrix operations to batches, model weights, embeddings, and linear layers."],
        "Implement common matrix operations and cosine similarity using NumPy.",
        "Essence of Linear Algebra", "3Blue1Brown", "https://www.youtube.com/watch?v=fNk_zzaMoSs"),
      lesson("calculus", "Calculus & gradients", "7 hours", "Understand how optimization changes model parameters.",
        ["Learn derivatives, partial derivatives, the chain rule, and gradients.", "Read a computational graph and trace how local derivatives combine.", "Connect backpropagation to repeated application of the chain rule."],
        "Differentiate a small two-layer function by hand and verify it numerically.",
        "Essence of Calculus", "3Blue1Brown", "https://www.youtube.com/results?search_query=3blue1brown+essence+of+calculus"),
      lesson("probability", "Probability & statistics", "8 hours", "Quantify uncertainty and evaluate evidence in data.",
        ["Study random variables, common distributions, expectation, variance, and covariance.", "Use conditional probability and Bayes' theorem to update beliefs.", "Distinguish correlation from causation and interpret confidence intervals carefully."],
        "Simulate coin flips, normal distributions, and Bayes updates in a notebook.",
        "Statistics Fundamentals", "StatQuest", "https://www.youtube.com/results?search_query=StatQuest+statistics+fundamentals+playlist"),
      lesson("optimization", "Optimization", "6 hours", "Implement gradient descent and diagnose unstable training.",
        ["Understand loss surfaces, learning rates, batches, epochs, and convergence.", "Compare batch, stochastic, and mini-batch gradient descent.", "Recognize exploding gradients, poor scaling, and learning rates that are too high or low."],
        "Implement linear and logistic regression from scratch with gradient descent.",
        "Gradient Descent, Step-by-Step", "StatQuest", "https://www.youtube.com/results?search_query=StatQuest+gradient+descent+step+by+step")
    ]
  },
  {
    id: "classical-ml",
    number: "03",
    title: "Classical Machine Learning",
    duration: "6-8 weeks",
    color: "#3d75c5",
    summary: "Master the end-to-end workflow that makes model results trustworthy.",
    lessons: [
      lesson("ml-workflow", "Data preparation & baselines", "10 hours", "Turn raw data into a leakage-resistant experiment.",
        ["Define the prediction target, unit of observation, and success metric before training.", "Split train, validation, and test data before learning preprocessing parameters.", "Start with a simple baseline so model complexity must earn its place."],
        "Build a reproducible preprocessing pipeline for a customer churn dataset.",
        "Machine Learning Specialization overview", "DeepLearning.AI", "https://www.youtube.com/results?search_query=Andrew+Ng+machine+learning+specialization+supervised+learning"),
      lesson("supervised", "Regression & classification", "12 hours", "Train and compare common supervised models.",
        ["Learn linear and logistic models, k-nearest neighbors, decision trees, random forests, and gradient boosting.", "Match preprocessing to the algorithm and tune only against validation data.", "Use regularization and learning curves to reason about bias and variance."],
        "Compare five models on house-price or churn data using one evaluation protocol.",
        "Machine Learning Fundamentals", "StatQuest", "https://www.youtube.com/results?search_query=StatQuest+machine+learning+fundamentals+playlist"),
      lesson("evaluation", "Evaluation & error analysis", "8 hours", "Choose metrics that represent the real cost of mistakes.",
        ["Use MAE or RMSE for regression and precision, recall, F1, ROC-AUC, or PR-AUC for classification.", "Inspect a confusion matrix and individual failures instead of trusting one aggregate score.", "Use cross-validation, confidence intervals, and untouched test data appropriately."],
        "Write an error-analysis report for your strongest model and identify three improvement experiments.",
        "Precision, Recall and F1", "StatQuest", "https://www.youtube.com/results?search_query=StatQuest+precision+recall+F1"),
      lesson("unsupervised-interpretability", "Unsupervised ML & interpretability", "9 hours", "Find structure without labels and explain model behavior.",
        ["Study k-means, hierarchical clustering, PCA, and their assumptions.", "Use feature importance, partial dependence, and SHAP without claiming causality.", "Treat interpretability as evidence about model behavior, not proof that a model is fair."],
        "Cluster a customer dataset, visualize it with PCA, and explain one tree model with SHAP.",
        "PCA, Step-by-Step", "StatQuest", "https://www.youtube.com/results?search_query=StatQuest+PCA+step+by+step")
    ]
  },
  {
    id: "deep-learning",
    number: "04",
    title: "Deep Learning with PyTorch",
    duration: "6-8 weeks",
    color: "#c78a18",
    summary: "Build, train, debug, and adapt neural networks using a modern framework.",
    lessons: [
      lesson("pytorch", "Tensors & training loops", "10 hours", "Train a neural network without hiding the important mechanics.",
        ["Use tensors, broadcasting, devices, datasets, data loaders, and automatic differentiation.", "Write training and validation loops with explicit loss, optimizer, and gradient steps.", "Track experiments and make runs reproducible with seeds and saved configuration."],
        "Train a multilayer perceptron on Fashion-MNIST and plot its learning curves.",
        "PyTorch for Deep Learning", "freeCodeCamp", "https://www.youtube.com/results?search_query=freecodecamp+pytorch+deep+learning+course"),
      lesson("backprop", "Networks & backpropagation", "9 hours", "Explain how neural networks learn and why training fails.",
        ["Understand activations, initialization, loss functions, and backpropagation.", "Use dropout, weight decay, normalization, and early stopping deliberately.", "Diagnose vanishing gradients, exploding gradients, overfitting, and dead activations."],
        "Implement a tiny autograd engine or neural network using scalar operations.",
        "Neural Networks: Zero to Hero", "Andrej Karpathy", "https://www.youtube.com/watch?v=VMj-3S1tku0"),
      lesson("vision", "Computer vision & transfer learning", "10 hours", "Adapt a pretrained vision model to a new task.",
        ["Understand convolutions, pooling, augmentation, and image normalization.", "Fine-tune a pretrained network before considering training from scratch.", "Inspect class-specific errors and test behavior on images outside the training distribution."],
        "Fine-tune an image classifier on a dataset you collect and document its failure cases.",
        "Practical Deep Learning", "fast.ai", "https://www.youtube.com/results?search_query=fastai+practical+deep+learning+lesson+1"),
      lesson("attention", "Embeddings, attention & transformers", "10 hours", "Understand the architecture behind modern language models.",
        ["Represent discrete items with learned embeddings and positional information.", "Trace queries, keys, values, masking, multi-head attention, and feed-forward blocks.", "Understand pretraining, transfer learning, and why context length affects compute and behavior."],
        "Implement a small character-level transformer and train it on a modest text corpus.",
        "Attention in Transformers", "3Blue1Brown", "https://www.youtube.com/watch?v=eMlx5fFNoYc")
    ]
  },
  {
    id: "llm",
    number: "05",
    title: "LLM Engineering",
    duration: "8-10 weeks",
    color: "#a356a8",
    summary: "Create grounded, evaluated language-model applications rather than chat demos.",
    lessons: [
      lesson("llm-apis", "LLM APIs & structured output", "9 hours", "Build predictable model interactions around an unreliable component.",
        ["Understand tokenization, context windows, sampling parameters, system instructions, and streaming.", "Use schema-constrained structured output and validate every model response.", "Track token usage, latency, failures, and cost from the first prototype."],
        "Build a text extraction API that returns validated JSON and handles malformed responses.",
        "Building Systems with the ChatGPT API", "DeepLearning.AI", "https://www.youtube.com/results?search_query=DeepLearning.AI+building+systems+with+ChatGPT+API"),
      lesson("rag", "Retrieval-augmented generation", "14 hours", "Ground answers in a controlled document collection.",
        ["Build ingestion, parsing, chunking, embedding, indexing, retrieval, and answer-generation stages.", "Compare semantic, keyword, hybrid retrieval, metadata filters, and reranking.", "Require source citations and verify that cited passages actually support each answer."],
        "Create a document assistant with citations, hybrid retrieval, and access-control-aware filtering.",
        "RAG from Scratch", "LangChain", "https://www.youtube.com/results?search_query=LangChain+RAG+from+scratch+playlist"),
      lesson("tools-agents", "Tool use & agent workflows", "12 hours", "Let models perform bounded actions with explicit control flow.",
        ["Define small, typed tools and keep authorization outside the model.", "Prefer deterministic workflows when the steps are known; use agents only when flexible planning adds value.", "Add limits, timeouts, retries, idempotency, and human approval for consequential actions."],
        "Build a support assistant that searches documentation and creates a draft ticket after approval.",
        "AI Agents in LangGraph", "DeepLearning.AI", "https://www.youtube.com/results?search_query=DeepLearning.AI+AI+agents+LangGraph"),
      lesson("llm-eval", "Evaluation, fine-tuning & inference", "14 hours", "Measure quality and know when retrieval, prompting, or training is the right lever.",
        ["Create a representative evaluation set and score retrieval, faithfulness, task success, latency, and cost.", "Use human review and calibrated model judges; inspect disagreements and regressions.", "Learn LoRA, quantization, batching, caching, and open-model serving with Hugging Face and vLLM."],
        "Evaluate 50 realistic RAG questions, improve the weakest stage, and publish a before/after report.",
        "Hugging Face NLP Course", "Hugging Face", "https://www.youtube.com/results?search_query=Hugging+Face+NLP+course+transformers+fine+tuning")
    ]
  },
  {
    id: "production",
    number: "06",
    title: "Production & MLOps",
    duration: "6-8 weeks",
    color: "#147b98",
    summary: "Ship AI services that remain observable, reproducible, and maintainable.",
    lessons: [
      lesson("backend", "Backend engineering", "12 hours", "Design a reliable service around model inference.",
        ["Use FastAPI, Pydantic, async I/O, PostgreSQL, Redis, and background jobs appropriately.", "Separate API, domain, persistence, and model concerns so each can be tested.", "Implement authentication, authorization, rate limits, timeouts, and useful error contracts."],
        "Turn one model project into a versioned API with persistence and integration tests.",
        "FastAPI Full Course", "freeCodeCamp", "https://www.youtube.com/results?search_query=freecodecamp+FastAPI+full+course+PostgreSQL"),
      lesson("containers-ci", "Docker, testing & CI/CD", "10 hours", "Make builds repeatable and changes safe to release.",
        ["Package services with Docker and run dependencies locally with Compose.", "Write unit, integration, contract, and end-to-end tests according to risk.", "Use GitHub Actions to lint, test, build, scan, and deploy without manual steps."],
        "Containerize your API and create a CI pipeline that blocks deployment when tests fail.",
        "Docker Tutorial for Beginners", "TechWorld with Nana", "https://www.youtube.com/results?search_query=TechWorld+with+Nana+Docker+tutorial+beginners"),
      lesson("mlops", "Experiments, data & model lifecycle", "12 hours", "Reproduce a model and promote it through controlled stages.",
        ["Track code, data, configuration, metrics, and artifacts for every consequential run.", "Use experiment tracking, model registries, and pipeline orchestration where they reduce manual risk.", "Support batch and online inference with explicit model versions and rollback paths."],
        "Track an experiment in MLflow and promote a registered model from staging to production.",
        "MLOps Zoomcamp", "DataTalksClub", "https://www.youtube.com/results?search_query=DataTalksClub+MLOps+Zoomcamp"),
      lesson("observability", "Monitoring & cloud deployment", "10 hours", "Detect quality, performance, and data problems after release.",
        ["Monitor availability, latency, errors, cost, input drift, and task-specific quality.", "Add structured logs, traces, dashboards, alerts, and correlation IDs.", "Learn one cloud platform deeply enough to deploy compute, storage, databases, networking, and secrets."],
        "Deploy your service and create a dashboard plus an alert for one simulated failure.",
        "Full Stack Deep Learning", "FSDL", "https://www.youtube.com/results?search_query=Full+Stack+Deep+Learning+deployment+monitoring")
    ]
  },
  {
    id: "responsible-ai",
    number: "07",
    title: "Responsible AI & Security",
    duration: "2-3 weeks",
    color: "#c44c65",
    summary: "Treat safety, privacy, fairness, and security as system requirements.",
    lessons: [
      lesson("fairness", "Bias, fairness & privacy", "8 hours", "Identify who can be harmed and evaluate uneven system behavior.",
        ["Document data origin, consent, representativeness, labels, licensing, and known limitations.", "Measure performance across relevant groups and avoid treating one fairness metric as universal.", "Minimize personal data, define retention, and protect sensitive inputs, outputs, and logs."],
        "Write a model card and perform a subgroup error analysis for a previous project.",
        "Responsible AI", "Google for Developers", "https://www.youtube.com/results?search_query=Google+Developers+Responsible+AI+fairness"),
      lesson("ai-security", "AI security & threat modeling", "8 hours", "Design defenses for model-specific and ordinary application threats.",
        ["Threat-model prompt injection, data exfiltration, poisoned knowledge, insecure tools, and excessive agency.", "Treat model output as untrusted input and enforce permissions in deterministic code.", "Use isolation, allowlists, output validation, audit logs, and human approval where appropriate."],
        "Threat-model your RAG application using the OWASP Top 10 for LLM Applications.",
        "Prompt Injection and AI Security", "OWASP", "https://www.youtube.com/results?search_query=OWASP+LLM+Top+10+prompt+injection"),
      lesson("governance", "Evaluation, governance & incidents", "6 hours", "Define ownership and response before an AI failure happens.",
        ["Set release criteria, prohibited uses, escalation paths, and accountable owners.", "Keep audit evidence for datasets, evaluations, prompts, models, and approvals.", "Practice rollback, user communication, root-cause analysis, and follow-up evaluation after incidents."],
        "Create a release checklist and run a tabletop incident exercise for your deployed system.",
        "NIST AI Risk Management Framework", "NIST", "https://www.youtube.com/results?search_query=NIST+AI+Risk+Management+Framework+introduction")
    ]
  },
  {
    id: "portfolio",
    number: "08",
    title: "Specialize & Get Hired",
    duration: "6-10 weeks",
    color: "#587046",
    summary: "Choose a direction, prove your ability through three systems, and prepare to explain tradeoffs.",
    lessons: [
      lesson("specialize", "Choose a specialization", "5 hours", "Pick a primary direction without closing off adjacent roles.",
        ["Choose among LLM engineering, computer vision, applied ML, robotics AI, or AI platforms.", "Read 20 relevant job descriptions and count recurring skills, tools, and business problems.", "Build depth in one direction while retaining the shared engineering foundation."],
        "Create a one-page skill-gap analysis from 20 target job descriptions.",
        "AI Engineer Roadmap", "AssemblyAI", "https://www.youtube.com/results?search_query=AssemblyAI+AI+engineer+roadmap"),
      lesson("portfolio", "Build three flagship projects", "30+ hours", "Present evidence that you can own an AI system end to end.",
        ["Include one classical ML system, one evaluated RAG or tool-use system, and one specialization project.", "For each: define the problem, baseline, metrics, error analysis, tests, deployment, architecture, and limitations.", "Prefer three deep projects with real decisions over many copied tutorials."],
        "Publish all three projects with live demos, architecture diagrams, and concise case studies.",
        "How to Build a Machine Learning Portfolio", "DataTalksClub", "https://www.youtube.com/results?search_query=DataTalksClub+machine+learning+portfolio"),
      lesson("interviews", "Interview preparation", "20 hours", "Explain code, model behavior, and system design under constraints.",
        ["Practice Python, moderate data structures, SQL, ML fundamentals, and metric selection.", "Design systems involving data ingestion, training, serving, RAG, evaluation, monitoring, and rollback.", "Use a clear structure: requirements, estimates, architecture, failure modes, tradeoffs, and measurement."],
        "Complete five mock interviews and write down every weak answer for targeted review.",
        "Machine Learning System Design", "Chip Huyen", "https://www.youtube.com/results?search_query=Chip+Huyen+machine+learning+systems+design+interview"),
      lesson("applications", "Applications & continuous learning", "Ongoing", "Run a measurable job search while continuing to improve your evidence.",
        ["Apply once two strong projects are public; do not wait to know every tool.", "Tailor the top third of your resume to the role and quantify project outcomes honestly.", "Track applications, responses, interview stages, feedback, and experiments in a weekly review."],
        "Create a job-search tracker and complete five high-quality applications each week.",
        "How to Get a Job in Machine Learning", "Made With ML", "https://www.youtube.com/results?search_query=Made+With+ML+get+a+job+machine+learning")
    ]
  }
];

function lesson(id, title, time, objective, notes, practice, videoTitle, channel, videoUrl) {
  return { id, title, time, objective, notes, practice, video: { title: videoTitle, channel, url: videoUrl } };
}

function detail(sequence, checkpoint, documents, github, coursera = null) {
  return { sequence, checkpoint, documents, github, coursera };
}

const lessonDetails = {
  "python-core": detail(
    ["Syntax, values, control flow, and collection types", "Functions, modules, packages, and type hints", "Classes, exceptions, files, and JSON", "Testing and debugging a command-line program"],
    "You can design a small program from a written requirement, split it into modules, test its behavior, and explain each failure message.",
    [["The Python Tutorial", "https://docs.python.org/3/tutorial/"], ["Python typing guide", "https://docs.python.org/3/library/typing.html"]],
    [["TheAlgorithms/Python", "https://github.com/TheAlgorithms/Python"], ["realpython/python-guide", "https://github.com/realpython/python-guide"]]
  ),
  "python-data": detail(
    ["Array shapes, dtypes, indexing, broadcasting, and vectorization", "DataFrame selection, joins, grouping, missing values, and dates", "Exploratory analysis and data-quality checks", "Choosing clear plots and communicating evidence"],
    "Given an unfamiliar CSV, you can produce a reproducible analysis that identifies data-quality risks and supports each conclusion with a table or chart.",
    [["NumPy user guide", "https://numpy.org/doc/stable/user/"], ["pandas getting started", "https://pandas.pydata.org/docs/getting_started/index.html"], ["Matplotlib tutorials", "https://matplotlib.org/stable/tutorials/index.html"]],
    [["jakevdp/PythonDataScienceHandbook", "https://github.com/jakevdp/PythonDataScienceHandbook"], ["pandas-dev/pandas", "https://github.com/pandas-dev/pandas"]]
  ),
  "git-cli": detail(
    ["Terminal navigation, pipes, environment variables, and processes", "Repository lifecycle: clone, status, add, commit, log, and diff", "Branches, merging, remotes, pull requests, and conflict resolution", "Environment files, dependency locks, secrets, and reproducible setup"],
    "You can recover from a merge conflict, review a diff before committing, and help another developer run your project from a fresh clone.",
    [["Pro Git book", "https://git-scm.com/book/en/v2"], ["GitHub Skills", "https://skills.github.com/"]],
    [["github/gitignore", "https://github.com/github/gitignore"], ["GitHub Skills exercises", "https://github.com/skills"]]
  ),
  "sql-api": detail(
    ["Relational modeling, keys, normalization, and indexes", "Filtering, joins, aggregation, subqueries, CTEs, and windows", "HTTP methods, resources, status codes, JSON, and errors", "FastAPI routing, Pydantic validation, persistence, and API tests"],
    "You can model a small domain, answer multi-table questions in SQL, and expose validated CRUD operations through a tested API.",
    [["PostgreSQL tutorial", "https://www.postgresql.org/docs/current/tutorial.html"], ["MDN HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"], ["FastAPI tutorial", "https://fastapi.tiangolo.com/tutorial/"]],
    [["fastapi/fastapi", "https://github.com/fastapi/fastapi"], ["full-stack-fastapi-template", "https://github.com/fastapi/full-stack-fastapi-template"]]
  ),
  "linear-algebra": detail(
    ["Vectors, norms, dot products, cosine similarity, and projections", "Matrices as transformations; multiplication, transpose, and inverse", "Rank, basis, linear independence, eigenvectors, and eigenvalues", "How batches, embeddings, linear layers, and PCA use these operations"],
    "You can explain matrix dimensions before computing an operation and implement cosine similarity, projection, and a linear transformation with NumPy.",
    [["MIT Linear Algebra materials", "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"], ["NumPy linear algebra reference", "https://numpy.org/doc/stable/reference/routines.linalg.html"]],
    [["fastai/numerical-linear-algebra", "https://github.com/fastai/numerical-linear-algebra"]]
  ),
  "calculus": detail(
    ["Functions, slopes, derivatives, and local linear approximation", "Partial derivatives, gradients, and directional change", "Chain rule through a computational graph", "Numerical gradient checking and backpropagation"],
    "You can derive gradients for a two-layer expression, verify them with finite differences, and identify where the chain rule is applied.",
    [["MIT Single Variable Calculus", "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/"], ["PyTorch autograd mechanics", "https://pytorch.org/docs/stable/notes/autograd.html"]],
    [["karpathy/micrograd", "https://github.com/karpathy/micrograd"]]
  ),
  "probability": detail(
    ["Random variables, probability mass and density, expectation, and variance", "Bernoulli, binomial, normal, categorical, and conditional distributions", "Bayes' theorem, likelihood, priors, and posterior reasoning", "Sampling, confidence intervals, hypothesis tests, correlation, and calibration"],
    "You can choose a distribution for a simple situation, simulate it, and explain uncertainty without confusing correlation, confidence, or probability.",
    [["Seeing Theory", "https://seeing-theory.brown.edu/"], ["SciPy statistics reference", "https://docs.scipy.org/doc/scipy/reference/stats.html"]],
    [["rougier/scientific-visualization-book", "https://github.com/rougier/scientific-visualization-book"]]
  ),
  "optimization": detail(
    ["Objective functions and the geometry of a loss surface", "Batch, stochastic, and mini-batch gradient descent", "Learning rates, momentum, Adam, schedules, and convergence", "Feature scaling, unstable gradients, saddle points, and debugging"],
    "You can implement gradient descent, graph its loss curve, and diagnose divergence or slow convergence by changing one variable at a time.",
    [["PyTorch optimization documentation", "https://pytorch.org/docs/stable/optim.html"], ["Dive into Deep Learning: Optimization", "https://d2l.ai/chapter_optimization/index.html"]],
    [["google/jaxopt", "https://github.com/google/jaxopt"]]
  ),
  "ml-workflow": detail(
    ["Problem framing, target definition, unit of observation, and baseline", "Train/validation/test strategy for random, grouped, and time-based data", "Column transformations, pipelines, leakage prevention, and reproducibility", "Experiment records and comparison against a simple baseline"],
    "You can audit a proposed dataset for leakage and create one pipeline that fits preprocessing only on training data.",
    [["scikit-learn: common pitfalls", "https://scikit-learn.org/stable/common_pitfalls.html"], ["scikit-learn pipeline guide", "https://scikit-learn.org/stable/modules/compose.html"]],
    [["scikit-learn/scikit-learn", "https://github.com/scikit-learn/scikit-learn"]],
    ["IBM: Machine Learning with Python", "https://www.coursera.org/learn/machine-learning-with-python?specialization=ai-engineer"]
  ),
  "supervised": detail(
    ["Linear and logistic models with regularization", "Nearest neighbors, decision trees, and random forests", "Gradient boosting and practical hyperparameter search", "Bias, variance, learning curves, and model selection"],
    "You can compare at least five models under one validation protocol and justify the final model using quality, latency, and interpretability.",
    [["scikit-learn supervised learning", "https://scikit-learn.org/stable/supervised_learning.html"], ["XGBoost documentation", "https://xgboost.readthedocs.io/en/stable/"]],
    [["dmlc/xgboost", "https://github.com/dmlc/xgboost"], ["scikit-learn examples", "https://github.com/scikit-learn/scikit-learn/tree/main/examples"]],
    ["IBM: Machine Learning with Python", "https://www.coursera.org/learn/machine-learning-with-python?specialization=ai-engineer"]
  ),
  "evaluation": detail(
    ["Regression metrics: MAE, RMSE, residuals, and business tolerance", "Classification metrics: confusion matrix, precision, recall, F1, ROC-AUC, and PR-AUC", "Cross-validation, uncertainty, threshold selection, and calibration", "Slice-based error analysis and turning failures into experiments"],
    "You can select a metric from the cost of mistakes, tune a decision threshold, and present both aggregate and subgroup performance.",
    [["scikit-learn model evaluation", "https://scikit-learn.org/stable/modules/model_evaluation.html"], ["Google ML rules", "https://developers.google.com/machine-learning/guides/rules-of-ml"]],
    [["evidentlyai/evidently", "https://github.com/evidentlyai/evidently"]],
    ["IBM: Machine Learning with Python", "https://www.coursera.org/learn/machine-learning-with-python?specialization=ai-engineer"]
  ),
  "unsupervised-interpretability": detail(
    ["Distance metrics, scaling, k-means, and hierarchical clustering", "PCA, explained variance, projections, and reconstruction", "Permutation importance, partial dependence, and local explanations", "SHAP values, correlated features, limitations, and responsible claims"],
    "You can evaluate whether a cluster is useful, explain what PCA discarded, and communicate a model explanation without presenting it as causality.",
    [["scikit-learn clustering", "https://scikit-learn.org/stable/modules/clustering.html"], ["SHAP documentation", "https://shap.readthedocs.io/en/latest/"]],
    [["shap/shap", "https://github.com/shap/shap"]],
    ["IBM: Machine Learning with Python", "https://www.coursera.org/learn/machine-learning-with-python?specialization=ai-engineer"]
  ),
  "pytorch": detail(
    ["Tensor creation, shapes, broadcasting, dtypes, and devices", "Datasets, DataLoaders, transforms, batches, and shuffling", "Modules, losses, optimizers, autograd, and the training loop", "Validation, checkpoints, reproducibility, and experiment tracking"],
    "You can write a complete PyTorch training loop from memory and explain the purpose of zero_grad, backward, step, train, and eval.",
    [["PyTorch beginner tutorials", "https://pytorch.org/tutorials/beginner/basics/intro.html"], ["PyTorch reproducibility", "https://pytorch.org/docs/stable/notes/randomness.html"]],
    [["pytorch/examples", "https://github.com/pytorch/examples"], ["pytorch/pytorch", "https://github.com/pytorch/pytorch"]],
    ["IBM: Introduction to Neural Networks and PyTorch", "https://www.coursera.org/learn/deep-neural-networks-with-pytorch?specialization=ai-engineer"]
  ),
  "backprop": detail(
    ["Perceptrons, multilayer networks, activations, and expressiveness", "Forward pass, losses, computational graphs, and backpropagation", "Initialization, normalization, dropout, weight decay, and early stopping", "Gradient inspection and diagnosis of overfitting or dead activations"],
    "You can trace tensor shapes and gradients through a network, deliberately overfit one small batch, then regularize it.",
    [["Dive into Deep Learning: MLPs", "https://d2l.ai/chapter_multilayer-perceptrons/index.html"], ["PyTorch neural network tutorial", "https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html"]],
    [["karpathy/micrograd", "https://github.com/karpathy/micrograd"], ["karpathy/nn-zero-to-hero", "https://github.com/karpathy/nn-zero-to-hero"]],
    ["IBM: Deep Learning with PyTorch", "https://www.coursera.org/learn/advanced-deep-learning-with-pytorch?specialization=ai-engineer"]
  ),
  "vision": detail(
    ["Image tensors, convolutions, receptive fields, pooling, and augmentation", "CNN architectures and reading training/validation curves", "Transfer learning, frozen features, fine-tuning, and learning rates", "Confusion matrices, saliency, robustness, and out-of-distribution examples"],
    "You can fine-tune a pretrained vision model, report per-class errors, and demonstrate at least three real failure cases.",
    [["PyTorch transfer learning tutorial", "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"], ["torchvision documentation", "https://pytorch.org/vision/stable/index.html"]],
    [["pytorch/vision", "https://github.com/pytorch/vision"], ["fastai/fastai", "https://github.com/fastai/fastai"]],
    ["IBM: AI Capstone Project with Deep Learning", "https://www.coursera.org/learn/ai-deep-learning-capstone?specialization=ai-engineer"]
  ),
  "attention": detail(
    ["Token and positional embeddings", "Queries, keys, values, scaled dot-product attention, and masking", "Multi-head attention, residual paths, normalization, and feed-forward blocks", "Encoder/decoder models, pretraining objectives, context length, and inference"],
    "You can calculate a tiny attention example by hand and label every major tensor shape in a transformer block.",
    [["The Annotated Transformer", "https://nlp.seas.harvard.edu/annotated-transformer/"], ["Hugging Face transformer models", "https://huggingface.co/docs/transformers/index"]],
    [["karpathy/nanoGPT", "https://github.com/karpathy/nanoGPT"], ["huggingface/transformers", "https://github.com/huggingface/transformers"]],
    ["IBM: Generative AI Language Modeling with Transformers", "https://www.coursera.org/learn/generative-ai-language-modeling-with-transformers?specialization=ai-engineer"]
  ),
  "llm-apis": detail(
    ["Tokens, context windows, message roles, sampling, and model selection", "Prompt contracts, few-shot examples, delimiters, and structured output", "Schema validation, retries, streaming, timeouts, and fallbacks", "Tracing quality, token use, latency, errors, and cost"],
    "You can build an extraction endpoint that never passes unvalidated model output to application logic and has tests for malformed responses.",
    [["OpenAI developer resources", "https://platform.openai.com/docs/overview"], ["Pydantic documentation", "https://docs.pydantic.dev/latest/"]],
    [["openai/openai-cookbook", "https://github.com/openai/openai-cookbook"], ["instructor-ai/instructor", "https://github.com/instructor-ai/instructor"]],
    ["IBM: Generative AI and LLM Architecture", "https://www.coursera.org/learn/generative-ai-llm-architecture-data-preparation?specialization=ai-engineer"]
  ),
  "rag": detail(
    ["Document loading, parsing, cleaning, metadata, and chunking", "Embeddings, vector indexes, sparse retrieval, and hybrid search", "Query transformation, metadata filters, reranking, and context assembly", "Citation grounding, retrieval metrics, answer evaluation, and access control"],
    "You can identify whether a failed answer came from ingestion, retrieval, ranking, context, or generation and measure the failing stage separately.",
    [["Hugging Face semantic search", "https://huggingface.co/learn/nlp-course/chapter5/6"], ["LangChain retrieval guide", "https://python.langchain.com/docs/tutorials/rag/"]],
    [["langchain-ai/rag-from-scratch", "https://github.com/langchain-ai/rag-from-scratch"], ["facebookresearch/faiss", "https://github.com/facebookresearch/faiss"]],
    ["IBM: Project - Generative AI Applications with RAG", "https://www.coursera.org/learn/project-generative-ai-applications-with-rag-and-langchain?specialization=ai-engineer"]
  ),
  "tools-agents": detail(
    ["Typed tool schemas, tool selection, and validated arguments", "Deterministic workflows, routers, state machines, and agent loops", "State, memory, retries, idempotency, budgets, and stopping conditions", "Authorization, sandboxing, human approval, and audit trails"],
    "You can explain why an agent is needed for a workflow and prove that tool permissions and business rules remain outside model control.",
    [["LangGraph concepts", "https://langchain-ai.github.io/langgraph/concepts/why-langgraph/"], ["Anthropic: building effective agents", "https://www.anthropic.com/research/building-effective-agents"]],
    [["langchain-ai/langgraph", "https://github.com/langchain-ai/langgraph"], ["microsoft/autogen", "https://github.com/microsoft/autogen"]],
    ["IBM: Fundamentals of AI Agents Using RAG and LangChain", "https://www.coursera.org/learn/fundamentals-of-ai-agents-using-rag-and-langchain?specialization=ai-engineer"]
  ),
  "llm-eval": detail(
    ["Representative test sets, rubrics, retrieval metrics, and task-success metrics", "Human review, model judges, pairwise comparison, and regression gates", "Fine-tuning datasets, LoRA/PEFT, preference tuning, and overfitting", "Quantization, batching, caching, throughput, latency, and vLLM serving"],
    "You can run a repeatable evaluation before and after a change and decide from evidence whether to alter retrieval, prompting, fine-tuning, or serving.",
    [["Hugging Face PEFT guide", "https://huggingface.co/docs/peft/index"], ["vLLM documentation", "https://docs.vllm.ai/en/latest/"]],
    [["huggingface/peft", "https://github.com/huggingface/peft"], ["vllm-project/vllm", "https://github.com/vllm-project/vllm"], ["confident-ai/deepeval", "https://github.com/confident-ai/deepeval"]],
    ["IBM: Advanced Fine-Tuning for LLMs", "https://www.coursera.org/learn/generative-ai-advanced-fine-tuning-for-llms?specialization=ai-engineer"]
  ),
  "backend": detail(
    ["Layered API design, schemas, configuration, and dependency injection", "Async I/O, PostgreSQL transactions, Redis caching, and background jobs", "Authentication, authorization, rate limits, retries, and idempotency", "Unit, integration, contract, and end-to-end test boundaries"],
    "You can deploy a versioned inference API whose model, database, and provider dependencies can each be replaced in tests.",
    [["FastAPI advanced guide", "https://fastapi.tiangolo.com/advanced/"], ["SQLAlchemy unified tutorial", "https://docs.sqlalchemy.org/en/20/tutorial/"]],
    [["fastapi/full-stack-fastapi-template", "https://github.com/fastapi/full-stack-fastapi-template"], ["encode/httpx", "https://github.com/encode/httpx"]]
  ),
  "containers-ci": detail(
    ["Images, layers, Dockerfiles, build context, and multi-stage builds", "Containers, volumes, networks, health checks, and Compose", "Test pyramid, fixtures, service dependencies, and deterministic builds", "CI jobs for lint, test, build, dependency scan, and deployment"],
    "A fresh machine can run your complete stack with one documented command, while CI independently verifies the same build.",
    [["Docker getting started", "https://docs.docker.com/get-started/"], ["GitHub Actions documentation", "https://docs.github.com/en/actions"]],
    [["docker/awesome-compose", "https://github.com/docker/awesome-compose"], ["actions/starter-workflows", "https://github.com/actions/starter-workflows"]]
  ),
  "mlops": detail(
    ["Run identity: code, data, environment, parameters, metrics, and artifacts", "Experiment tracking and model registry stages", "Data validation, feature pipelines, training pipelines, and orchestration", "Batch versus online inference, model versioning, promotion, and rollback"],
    "You can reproduce a chosen model from recorded inputs and promote or roll it back without replacing files by hand.",
    [["MLflow documentation", "https://mlflow.org/docs/latest/index.html"], ["DVC user guide", "https://dvc.org/doc/user-guide"]],
    [["mlflow/mlflow", "https://github.com/mlflow/mlflow"], ["iterative/dvc", "https://github.com/iterative/dvc"]]
  ),
  "observability": detail(
    ["Service-level indicators for availability, latency, errors, and saturation", "Structured logs, metrics, traces, correlation IDs, dashboards, and alerts", "Input drift, prediction quality, LLM quality, feedback, and delayed labels", "Cloud compute, storage, networking, managed databases, secrets, and rollback"],
    "You can detect a simulated failure from an alert, trace it to one request, explain user impact, and recover through a documented rollback.",
    [["OpenTelemetry documentation", "https://opentelemetry.io/docs/"], ["Prometheus getting started", "https://prometheus.io/docs/prometheus/latest/getting_started/"]],
    [["open-telemetry/opentelemetry-python", "https://github.com/open-telemetry/opentelemetry-python"], ["prometheus/prometheus", "https://github.com/prometheus/prometheus"]]
  ),
  "fairness": detail(
    ["Data provenance, consent, representativeness, labels, and licensing", "Harms, affected groups, subgroup metrics, and fairness tradeoffs", "Privacy minimization, retention, deletion, and sensitive logs", "Datasheets, model cards, limitations, and accountable review"],
    "You can name who may be harmed, measure relevant group differences, and document limitations without claiming that one metric makes a system fair.",
    [["Google Responsible AI practices", "https://ai.google/responsibility/responsible-ai-practices/"], ["Model Cards paper and resources", "https://modelcards.withgoogle.com/about"]],
    [["fairlearn/fairlearn", "https://github.com/fairlearn/fairlearn"], ["tensorflow/model-card-toolkit", "https://github.com/tensorflow/model-card-toolkit"]]
  ),
  "ai-security": detail(
    ["Assets, trust boundaries, threat actors, abuse cases, and risk ranking", "Prompt injection, poisoned retrieval, data leakage, and insecure output", "Excessive agency, unsafe tools, permission checks, isolation, and approval", "Red-team tests, audit logs, incident signals, and residual risk"],
    "You can threat-model an LLM system and demonstrate that a prompt injection cannot expand a user's permissions or invoke an unapproved action.",
    [["OWASP Top 10 for LLM Applications", "https://genai.owasp.org/llm-top-10/"], ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"]],
    [["OWASP/www-project-top-10-for-large-language-model-applications", "https://github.com/OWASP/www-project-top-10-for-large-language-model-applications"], ["protectai/llm-guard", "https://github.com/protectai/llm-guard"]]
  ),
  "governance": detail(
    ["Use-case inventory, owners, risk tiers, and prohibited uses", "Release criteria, evaluation evidence, approvals, and auditability", "User disclosure, feedback, escalation, contestability, and human oversight", "Incident triage, containment, rollback, communication, and follow-up tests"],
    "You can produce a release decision with named evidence and lead a tabletop incident from detection through corrective evaluation.",
    [["NIST AI RMF Playbook", "https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook"], ["OECD AI principles", "https://oecd.ai/en/ai-principles"]],
    [["microsoft/responsible-ai-toolbox", "https://github.com/microsoft/responsible-ai-toolbox"]]
  ),
  "specialize": detail(
    ["Compare LLM, vision, applied ML, robotics, and AI-platform roles", "Collect target job descriptions and normalize recurring requirements", "Score your evidence, gaps, interest, and local job availability", "Choose one 8-week depth project and define what you will stop studying"],
    "You can defend one target role using job evidence and identify the three highest-value gaps your next project must close.",
    [["Made With ML roadmap", "https://madewithml.com/"], ["Full Stack Deep Learning course", "https://fullstackdeeplearning.com/course/"]],
    [["dair-ai/ML-YouTube-Courses", "https://github.com/dair-ai/ML-YouTube-Courses"], ["mrdbourke/machine-learning-roadmap", "https://github.com/mrdbourke/machine-learning-roadmap"]]
  ),
  "portfolio": detail(
    ["Problem statement, users, constraints, baseline, and measurable target", "Data and model pipeline, experiment history, and error analysis", "API or application, tests, deployment, monitoring, security, and cost", "Case-study writing: architecture, decisions, failures, evidence, and limitations"],
    "A reviewer can run each project, see measured improvement over a baseline, inspect failures, and understand your personal decisions in under ten minutes.",
    [["GitHub README guidance", "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"], ["Made With ML: project design", "https://madewithml.com/courses/mlops/design/"]],
    [["GokuMohandas/Made-With-ML", "https://github.com/GokuMohandas/Made-With-ML"], ["mlops-guide/mlops", "https://github.com/mlops-guide/mlops"]]
  ),
  "interviews": detail(
    ["Python fluency, data structures, complexity, tests, and debugging", "SQL joins, aggregations, windows, and analytical reasoning", "ML concepts, experiment design, metrics, leakage, and failure diagnosis", "AI system design: requirements, scale, architecture, tradeoffs, evaluation, and operations"],
    "You can complete a 45-minute mock interview, state assumptions aloud, and turn every weak answer into a scheduled review item.",
    [["Designing Machine Learning Systems notes", "https://huyenchip.com/machine-learning-systems-design/toc.html"], ["Google ML problem framing", "https://developers.google.com/machine-learning/problem-framing"]],
    [["alexeygrigorev/mlbookcamp-code", "https://github.com/alexeygrigorev/mlbookcamp-code"], ["khangich/machine-learning-interview", "https://github.com/khangich/machine-learning-interview"]]
  ),
  "applications": detail(
    ["Target-role list, evidence inventory, resume, GitHub profile, and project demos", "Role-specific resume tailoring and concise project impact statements", "Application tracking, networking, recruiter screens, and follow-up", "Weekly funnel review: applications, replies, interviews, gaps, and experiments"],
    "You maintain a weekly application system and can show which change improved response or interview conversion rather than applying blindly.",
    [["GitHub profile README guidance", "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"], ["Google technical development guide", "https://techdevguide.withgoogle.com/"]],
    [["practical-tutorials/project-based-learning", "https://github.com/practical-tutorials/project-based-learning"], ["EbookFoundation/free-programming-books", "https://github.com/EbookFoundation/free-programming-books"]]
  )
};

const moduleOverrides = {
  "backprop:0": {
    explanation: "A perceptron is the smallest neural classifier: it multiplies each input by a learned weight, adds a bias, and applies a decision function. A multilayer network connects many units in layers. Hidden layers learn intermediate representations, while activation functions such as ReLU introduce non-linearity. Without non-linear activations, stacked layers collapse mathematically into one linear layer. Expressiveness describes the complexity of functions a network can represent; depth can represent compositional patterns more efficiently than one very wide layer.",
    example: "XOR cannot be separated by one straight line, so one perceptron fails. A network with two hidden ReLU units can form multiple boundaries and combine them to represent XOR. In vision, early units may respond to edges, later units to textures, and deeper units to object parts.",
    concepts: ["weighted sum z = w·x + b", "decision boundary", "hidden and output layers", "ReLU, sigmoid, and softmax", "expressiveness and depth"],
    code: `import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(2, 4),
    nn.ReLU(),
    nn.Linear(4, 1),
)

x = torch.tensor([[0., 0.], [0., 1.], [1., 0.], [1., 1.]])
probabilities = torch.sigmoid(model(x))
print(probabilities)`
  },
  "backprop:1": {
    explanation: "The forward pass sends a batch through the network to produce predictions. A loss function turns prediction error into one scalar objective. Those operations form a computational graph. Backpropagation walks the graph in reverse and applies the chain rule, producing the derivative of the loss with respect to every trainable parameter. The optimizer then uses those gradients to update the parameters.",
    example: "For binary classification, the network returns logits and binary cross-entropy measures error. backward computes gradients but does not update weights. optimizer.step performs the update, while optimizer.zero_grad clears accumulated gradients before the next batch.",
    concepts: ["forward pass and logits", "scalar loss", "computational graph", "chain rule", "zero_grad, backward, and step"],
    code: `loss_fn = nn.BCEWithLogitsLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)

optimizer.zero_grad()
logits = model(x)
loss = loss_fn(logits, targets)
loss.backward()
optimizer.step()
print(loss.item())`
  },
  "backprop:2": {
    explanation: "Initialization sets a useful starting scale so signals and gradients neither vanish nor explode. Normalization stabilizes intermediate values. Dropout randomly removes activations during training, weight decay discourages large parameters, and early stopping ends training when validation quality stops improving. These methods solve different problems and should be selected from observed behavior.",
    example: "If training loss falls while validation loss rises, the model is overfitting. Compare one intervention at a time: weight decay, dropout, data augmentation, or early stopping. Batch normalization may improve optimization, but it does not replace validation.",
    concepts: ["Xavier and Kaiming initialization", "batch and layer normalization", "dropout train versus eval behavior", "weight decay", "early stopping"],
    code: `regularized_model = nn.Sequential(
    nn.Linear(20, 64),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(64, 2),
)
optimizer = torch.optim.AdamW(
    regularized_model.parameters(), lr=1e-3, weight_decay=1e-4
)`
  },
  "backprop:3": {
    explanation: "Gradient inspection makes training failures observable. Missing gradients often indicate a detached tensor or unused parameter; tiny gradients can stop early layers from learning, while very large gradients destabilize updates. Dead ReLU units output zero for every input. Overfitting is a generalization gap, so compare training and validation curves and inspect concrete errors.",
    example: "Before a full run, deliberately overfit one tiny batch. Failure usually reveals a bug in the data, labels, model, loss, or update loop. During training, log gradient norms by layer. If they spike, inspect the batch and learning rate before relying on clipping.",
    concepts: ["tiny-batch overfit test", "gradient norms", "vanishing and exploding gradients", "dead activations", "generalization gap"],
    code: `loss.backward()
for name, parameter in model.named_parameters():
    if parameter.grad is None:
        print(f"{name}: no gradient")
        continue
    print(f"{name}: {parameter.grad.norm().item():.4f}")

torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()`
  }
};

function sampleCode(item, topic) {
  const code = {
    python: `values = [2.0, 4.0, 6.0]\nmean = sum(values) / len(values)\nprint({"count": len(values), "mean": mean})`,
    data: `import pandas as pd\n\ndata = pd.read_csv("data.csv")\nprint(data.info())\nprint(data.groupby("category")["value"].mean())`,
    math: `import numpy as np\n\nleft = np.array([1., 2., 3.])\nright = np.array([2., 0., 1.])\nresult = left @ right\nprint(result)`,
    sklearn: `from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression())\nmodel.fit(X_train, y_train)\nprint(model.score(X_valid, y_valid))`,
    torch: `for features, targets in train_loader:\n    optimizer.zero_grad()\n    predictions = model(features)\n    loss = loss_fn(predictions, targets)\n    loss.backward()\n    optimizer.step()`,
    llm: `query_vector = embed(query)\nmatches = vector_index.search(query_vector, k=8)\ncontexts = reranker.rank(query, matches)[:4]\nanswer = generate_answer(query, contexts)\nprint(answer)`,
    api: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post("/v1/predict")\nasync def predict(request: Request):\n    return {"prediction": service.predict(request.text)}`,
    mlops: `import mlflow\n\nwith mlflow.start_run():\n    mlflow.log_params({"model": "baseline", "seed": 42})\n    mlflow.log_metric("validation_score", score)`,
    safety: `def run_tool(user, tool_call):\n    if not authorization.can_use(user, tool_call.name):\n        raise PermissionError("Action is not permitted")\n    return sandbox.execute(tool_call.name, tool_call.arguments)`,
    career: `evidence = {\n    "problem": "What user problem did I solve?",\n    "metric": "How did I measure success?",\n    "tradeoff": "What did I choose and why?",\n}\nprint(evidence)`
  };
  const group = ["python-core", "git-cli", "sql-api"].includes(item.id) ? "python"
    : item.id === "python-data" ? "data"
    : ["linear-algebra", "calculus", "probability", "optimization"].includes(item.id) ? "math"
    : ["ml-workflow", "supervised", "evaluation", "unsupervised-interpretability"].includes(item.id) ? "sklearn"
    : ["pytorch", "backprop", "vision", "attention"].includes(item.id) ? "torch"
    : ["llm-apis", "rag", "tools-agents", "llm-eval"].includes(item.id) ? "llm"
    : item.id === "backend" ? "api"
    : ["containers-ci", "mlops", "observability"].includes(item.id) ? "mlops"
    : ["fairness", "ai-security", "governance"].includes(item.id) ? "safety" : "career";
  return `# Minimal reference for: ${topic}\n${code[group]}`;
}

function buildModule(item, guide, topic, index) {
  const override = moduleOverrides[`${item.id}:${index}`];
  const concepts = topic.split(/[,;]| and /).map((part) => part.trim()).filter(Boolean);
  return {
    title: topic,
    explanation: override?.explanation || `${topic} is a practical part of ${item.title.toLowerCase()}. Learn what each component does, its assumptions, and how it changes the input, output, or behavior of the system. Trace one small input through the process, inspect the result, and identify when this approach would be a poor choice. This module supports the lesson goal: ${item.objective}`,
    example: override?.example || `Apply this idea to the required project: ${item.practice} Begin with the smallest working case, record the input and expected output, then change one condition and explain the observed difference.`,
    concepts: override?.concepts || concepts,
    code: override?.code || sampleCode(item, topic),
    documents: guide.documents
  };
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const storageKey = "ai-engineer-field-guide-progress";
const progressStore = new ProgressStore("roadmap", storageKey);
const completed = new Set();
let activeFilter = "all";
let query = "";

const curriculum = document.querySelector("#curriculum");
const phaseNav = document.querySelector("#phase-nav");
const dialog = document.querySelector("#lesson-dialog");
const totalLessons = phases.reduce((sum, phase) => sum + phase.lessons.length, 0);

function renderNavigation() {
  phaseNav.innerHTML = phases.map((phase) => {
    const phaseComplete = phase.lessons.filter((item) => completed.has(item.id)).length;
    return `<a href="#${phase.id}"><span>${phase.number}</span><span>${phase.title}<small>${phaseComplete}/${phase.lessons.length}</small></span></a>`;
  }).join("");
}

function matchesLesson(item, phase) {
  const detailText = lessonDetails[item.id]?.sequence.join(" ") || "";
  const searchable = `${item.title} ${item.objective} ${item.notes.join(" ")} ${detailText} ${phase.title}`.toLowerCase();
  const matchesQuery = searchable.includes(query);
  const matchesFilter = activeFilter === "all" || (activeFilter === "complete" ? completed.has(item.id) : !completed.has(item.id));
  return matchesQuery && matchesFilter;
}

function renderCurriculum() {
  let visibleCount = 0;
  curriculum.innerHTML = phases.map((phase) => {
    const visibleLessons = phase.lessons.filter((item) => matchesLesson(item, phase));
    visibleCount += visibleLessons.length;
    if (!visibleLessons.length) return "";
    const phaseComplete = phase.lessons.filter((item) => completed.has(item.id)).length;
    const rows = visibleLessons.map((item, index) => `
      <article class="lesson-row ${completed.has(item.id) ? "is-complete" : ""}">
        <label class="lesson-check" title="Mark ${item.title} complete">
          <input type="checkbox" data-lesson-id="${item.id}" ${completed.has(item.id) ? "checked" : ""} />
          <span aria-hidden="true"></span>
          <span class="sr-only">Mark ${item.title} complete</span>
        </label>
        <button class="lesson-open" type="button" data-open-lesson="${item.id}" data-phase-id="${phase.id}">
          <span class="lesson-index">${phase.number}.${String(index + 1).padStart(2, "0")}</span>
          <span class="lesson-copy"><strong>${item.title}</strong><small>${item.objective}</small></span>
          <span class="lesson-time">${item.time}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>
        </button>
      </article>`).join("");
    return `<section class="phase" id="${phase.id}" style="--phase-color:${phase.color}">
      <header class="phase-header">
        <div class="phase-number">${phase.number}</div>
        <div><span class="phase-duration">${phase.duration}</span><h2>${phase.title}</h2><p>${phase.summary}</p></div>
        <div class="phase-progress"><strong>${phaseComplete}/${phase.lessons.length}</strong><span>complete</span></div>
      </header>
      <div class="lesson-list">${rows}</div>
    </section>`;
  }).join("");
  document.querySelector("#lesson-result-count").textContent = `${visibleCount} lesson${visibleCount === 1 ? "" : "s"}`;
  document.querySelector("#empty-state").hidden = visibleCount !== 0;
  updateProgress();
}

function updateProgress() {
  const percent = Math.round((completed.size / totalLessons) * 100);
  document.querySelector("#progress-percent").textContent = `${percent}%`;
  document.querySelector("#progress-count").textContent = `${completed.size} of ${totalLessons} lessons`;
  document.querySelector("#progress-ring").style.setProperty("--progress", `${percent * 3.6}deg`);
}

function openLesson(lessonId, phaseId) {
  const phase = phases.find((item) => item.id === phaseId);
  const item = phase.lessons.find((entry) => entry.id === lessonId);
  const guide = lessonDetails[item.id];
  const modules = guide.sequence.map((topic, index) => buildModule(item, guide, topic, index));
  const linkIcon = `<svg class="external-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-8 8"></path><path d="M19 13v6H5V5h6"></path></svg>`;
  document.querySelector("#dialog-content").innerHTML = `
    <div class="dialog-top" style="--phase-color:${phase.color}">
      <div><span class="eyebrow">Phase ${phase.number} · ${item.time}</span><h2 id="dialog-title">${item.title}</h2><p>${item.objective}</p><div class="lesson-meta"><span>${guide.sequence.length} modules</span><span>${guide.documents.length} official documents</span><span>${guide.github.length} GitHub reference${guide.github.length === 1 ? "" : "s"}</span></div></div>
      <button class="icon-button dialog-close" type="button" aria-label="Close lesson" title="Close"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>
    </div>
    <div class="dialog-body">
      <div class="study-guide">
        <section class="document"><span class="section-label">Learning outcomes</span><h3>What you need to understand</h3><ul>${item.notes.map((note) => `<li>${note}</li>`).join("")}</ul></section>
        <section class="syllabus"><span class="section-label">Course detail</span><h3>Study in this order</h3><div class="module-list">${modules.map((module, index) => `
          <details class="module" ${index === 0 ? "open" : ""}>
            <summary><span>${String(index + 1).padStart(2, "0")}</span><strong>${module.title}</strong><span class="module-action">Read module</span></summary>
            <div class="module-content">
              <section><h4>Explanation</h4><p>${module.explanation}</p></section>
              <section><h4>Key concepts</h4><ul class="concept-list">${module.concepts.map((concept) => `<li>${concept}</li>`).join("")}</ul></section>
              <section class="worked-example"><h4>Worked example</h4><p>${module.example}</p></section>
              <section><h4>Reference code</h4><pre><code>${escapeHtml(module.code)}</code></pre></section>
              <section><h4>Read the documentation</h4><div class="module-documents">${module.documents.map(([title, url]) => `<a href="${url}" target="_blank" rel="noreferrer"><span>${title}</span>${linkIcon}</a>`).join("")}</div></section>
            </div>
          </details>`).join("")}</div></section>
        <section class="checkpoint"><span class="section-label">Completion checkpoint</span><p>${guide.checkpoint}</p></section>
      </div>
      <aside class="lesson-resources">
        <section class="deliverable"><span class="section-label">Required project</span><h3>Build this</h3><p>${item.practice}</p></section>
        <section class="resource-group"><span class="section-label">Official reading</span>${guide.documents.map(([title, url]) => `<a class="resource-link" href="${url}" target="_blank" rel="noreferrer"><span><small>Document</small><strong>${title}</strong></span>${linkIcon}</a>`).join("")}</section>
        <section class="resource-group"><span class="section-label">GitHub references</span>${guide.github.map(([title, url]) => `<a class="resource-link github-link" href="${url}" target="_blank" rel="noreferrer"><span class="github-mark" aria-hidden="true">GH</span><span><small>Repository</small><strong>${title}</strong></span>${linkIcon}</a>`).join("")}</section>
        <a class="video-link" href="${item.video.url}" target="_blank" rel="noreferrer">
          <span class="video-visual"><span class="play-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 7 8 5-8 5z"></path></svg></span><span>Suggested video</span></span>
          <span><strong>${item.video.title}</strong><small>${item.video.channel} · Opens on YouTube</small></span>
          ${linkIcon}
        </a>
        ${guide.coursera ? `<a class="coursera-link" href="${guide.coursera[1]}" target="_blank" rel="noreferrer"><span><small>Optional companion · IBM on Coursera</small><strong>${guide.coursera[0]}</strong></span>${linkIcon}</a>` : ""}
      </aside>
    </div>
    <div class="dialog-footer">
      <label class="complete-toggle"><input type="checkbox" data-dialog-lesson="${item.id}" ${completed.has(item.id) ? "checked" : ""} /><span></span> Lesson complete</label>
    </div>`;
  dialog.showModal();
  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
}

function saveProgress() {
  return progressStore.replace(completed);
}

document.addEventListener("change", async (event) => {
  const lessonId = event.target.dataset.lessonId || event.target.dataset.dialogLesson;
  if (!lessonId) return;
  const wasCompleted = completed.has(lessonId);
  event.target.checked ? completed.add(lessonId) : completed.delete(lessonId);
  renderNavigation();
  renderCurriculum();
  if (event.target.dataset.dialogLesson) dialog.close();
  try {
    await saveProgress();
  } catch (error) {
    wasCompleted ? completed.add(lessonId) : completed.delete(lessonId);
    renderNavigation();
    renderCurriculum();
    console.error(error);
  }
});

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-lesson]");
  if (openButton) openLesson(openButton.dataset.openLesson, openButton.dataset.phaseId);
});

document.querySelector("#course-search").addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  renderCurriculum();
});

document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderCurriculum();
}));

document.querySelector("#reset-progress").addEventListener("click", async () => {
  if (!completed.size || !window.confirm("Reset all course progress?")) return;
  const previousItems = [...completed];
  completed.clear();
  renderNavigation();
  renderCurriculum();
  try {
    await saveProgress();
  } catch (error) {
    previousItems.forEach((item) => completed.add(item));
    renderNavigation();
    renderCurriculum();
    console.error(error);
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

async function initialize() {
  try {
    const items = await progressStore.load();
    items.forEach((item) => completed.add(item));
  } catch (error) {
    progressStore.setStatus("error", "Firebase unavailable — progress is not being synced");
    console.error(error);
  }
  renderNavigation();
  renderCurriculum();
}

initialize();
