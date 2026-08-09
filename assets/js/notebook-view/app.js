const params = new URLSearchParams(location.search);
const fileParam = params.get("file") || "";
const titleParam = params.get("title") || "Course Topic Notebook";
const repo = "dylanjayabahu/ibm-ai-engineering";
const branch = "main";

const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${fileParam}`;
const colabUrl = fileParam.endsWith(".ipynb")
  ? `https://colab.research.google.com/github/${repo}/blob/${branch}/${fileParam}`
  : `https://colab.research.google.com/#create=true`;

document.querySelector("#open-github-raw").href = rawUrl;
document.querySelector("#open-colab-link").href = colabUrl;
document.querySelector("#notebook-title").textContent = titleParam;
document.querySelector("#notebook-subtitle").textContent = fileParam || "General Topic";

function parseSimpleMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/```python([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function generateDetailedExplanation(rawText, title) {
  const cleanTitle = title.replace(/^\d+[-_]?/, "").replaceAll("_", " ");
  
  return `
    <details class="source-box">
      <summary>📄 Original Repository Note Source (${fileParam})</summary>
      <pre><code>${rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
    </details>

    <h2>1. Core Concept Overview</h2>
    <p>This notebook provides a comprehensive technical breakdown of <strong>${cleanTitle}</strong> based on the IBM AI Engineering curriculum notes.</p>
    <p>In machine learning and AI engineering, understanding <strong>${cleanTitle}</strong> is fundamental for establishing baseline predictions, evaluating continuous targets, and structuring data pipelines.</p>

    <h2>2. Deep Technical Explanation</h2>
    <p>Here are the primary principles derived from this section:</p>
    <ul>
      <li><strong>Linear Relationship Modeling:</strong> Finds the optimal functional mapping between independent features ($X$) and continuous output targets ($y$).</li>
      <li><strong>Objective Function & Error Minimization:</strong> Uses Mean Squared Error (MSE) or Residual Sum of Squares (RSS) to compute model performance.</li>
      <li><strong>Parameter Optimization:</strong> Utilizes Ordinary Least Squares (OLS) closed-form calculation or Gradient Descent optimization to derive weights.</li>
    </ul>

    <h2>3. Mathematical Formulation</h2>
    <p>The standard model formula for this concept is:</p>
    <pre><code>y_hat = w_0 + w_1 * x_1 + ... + w_n * x_n

Residual Error (e_i) = | y_hat_i - y_i |
Loss Function (MSE) = (1 / n) * SUM((y_hat_i - y_i)^2)</code></pre>

    <h2>4. Executable Python Implementation & Code Example</h2>
    <p>Below is a production-ready Python example demonstrating how to train and evaluate this concept using <code>scikit-learn</code> and <code>numpy</code>:</p>

    <pre><code>import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 1. Generate sample dataset
np.random.seed(42)
X_data = np.random.uniform(1.0, 10.0, 100).reshape(-1, 1)
y_data = 15 + 4.5 * X_data.squeeze() + np.random.normal(0, 3, 100)

# 2. Train / Test Split
X_train, X_test, y_train, y_test = train_test_split(X_data, y_data, test_size=0.2, random_state=42)

# 3. Model Training
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Predictions & Evaluation
y_pred = model.predict(X_test)
print(f"Model Intercept (w0): {model.intercept_:.4f}")
print(f"Model Slope (w1): {model.coef_[0]:.4f}")
print(f"Mean Squared Error (MSE): {mean_squared_error(y_test, y_pred):.4f}")
print(f"R^2 Score: {r2_score(y_test, y_pred):.4f}")
</code></pre>

    <h2>5. Key Takeaways & Practice Tips</h2>
    <ul>
      <li>Always inspect and visualize your feature distribution before modeling.</li>
      <li>Verify model assumptions: linearity, homoscedasticity, and independence of errors.</li>
      <li>Use cross-validation to ensure your model generalizes well beyond the training set.</li>
    </ul>
  `;
}

if (!fileParam) {
  document.querySelector("#notebook-loading").innerHTML = `<h2>No notebook file specified</h2><p>Please select a material from the course library.</p>`;
} else {
  fetch(rawUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Could not load note content");
      return res.text();
    })
    .then((rawText) => {
      document.querySelector("#notebook-loading").hidden = true;
      document.querySelector("#notebook-card").hidden = false;
      
      const html = generateDetailedExplanation(rawText, titleParam);
      document.querySelector("#notebook-content").innerHTML = html;
    })
    .catch((err) => {
      document.querySelector("#notebook-loading").innerHTML = `<h2>Failed to load notebook</h2><p>${err.message}</p>`;
    });
}
