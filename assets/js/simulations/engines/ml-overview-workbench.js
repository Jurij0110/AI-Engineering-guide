// Conceptual decision lab for the IBM ML overview. No model accuracy is simulated:
// the learner chooses a learning paradigm and a workflow stage for a real task.
const CASES = Object.freeze({
  sales: {
    title: "Forecast monthly sales",
    data: "Past months have revenue labels and business features.",
    goal: "Predict a continuous revenue value for a future month.",
    technique: "regression",
    reason: "Regression learns from labelled examples and predicts a continuous number."
  },
  churn: {
    title: "Identify customers likely to leave",
    data: "Past customers have a yes/no churn label.",
    goal: "Predict a discrete class for a new customer.",
    technique: "classification",
    reason: "Classification uses labelled examples to predict a category."
  },
  segments: {
    title: "Discover customer segments",
    data: "Purchase patterns are available, but no segment labels exist.",
    goal: "Find natural groups with similar behaviour.",
    technique: "clustering",
    reason: "Clustering discovers groups in unlabelled data."
  },
  sparse: {
    title: "Expand a small labelled dataset",
    data: "Only a small subset of records has trusted labels.",
    goal: "Use high-confidence predictions to learn from the remaining records.",
    technique: "semi-supervised",
    reason: "Semi-supervised learning combines a small labelled set with a larger unlabelled set."
  },
  agent: {
    title: "Train an agent through feedback",
    data: "The agent can act in an environment and receive rewards.",
    goal: "Improve decisions by learning from consequences of actions.",
    technique: "reinforcement",
    reason: "Reinforcement learning improves a policy from interaction and reward feedback."
  }
});

const STAGES = Object.freeze({
  problem: "Problem definition: specify the decision and success criterion.",
  collect: "Data collection: obtain relevant observations and permissions.",
  prepare: "Data preparation: inspect, clean and partition the dataset; ETL may help.",
  evaluate: "Model development and evaluation: train, validate and compare appropriate methods.",
  deploy: "Deployment: integrate the evaluated model and monitor its behaviour."
});

function element(doc, tag, className = "", value = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
}

export function evaluateOverview({ scenario, technique, stage }) {
  const selectedCase = CASES[scenario];
  if (!selectedCase || !Object.hasOwn(STAGES, stage)) {
    throw new RangeError("Choose a valid case and workflow stage.");
  }
  const methodMatches = selectedCase.technique === technique;
  return {
    methodMatches,
    challengeComplete: scenario === "sales" && technique === "regression" && stage === "evaluate",
    case: selectedCase,
    stageDescription: STAGES[stage],
    feedback: methodMatches
      ? selectedCase.reason
      : `This case calls for ${selectedCase.technique}: ${selectedCase.reason}`
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = null;
  let selects = null;
  let output = null;
  let summary = "";

  function render() {
    if (!root) return;
    const result = evaluateOverview(state);
    output.title.textContent = result.case.title;
    output.data.textContent = result.case.data;
    output.goal.textContent = result.case.goal;
    output.match.textContent = result.methodMatches ? "Appropriate method" : "Reconsider the method";
    output.match.dataset.match = String(result.methodMatches);
    output.feedback.textContent = result.feedback;
    output.stage.textContent = result.stageDescription;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: labelled continuous sales data, regression, and model evaluation align."
      : "Challenge in progress: select the sales case, regression, and model development/evaluation.";
    summary = `${result.case.title}. ${result.case.data} ${result.case.goal} ${output.match.textContent}. ${result.feedback} ${result.stageDescription} ${output.challenge.textContent}`;
  }

  function writeState(candidate) {
    for (const control of spec.controls) {
      const next = candidate?.[control.id] ?? state[control.id];
      const allowed = control.options.map((option) => option.value);
      if (allowed.includes(next)) state[control.id] = next;
      selects[control.id].value = state[control.id];
    }
    render();
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) {
        throw new TypeError("ML overview requires a DOM container and LessonSpec controls.");
      }
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((control) => [control.id, control.default]));
      selects = {};
      const doc = container.ownerDocument;
      root = element(doc, "div", "ml-overview-workbench");
      root.setAttribute("data-ml-overview-workbench", "");

      const hierarchy = element(doc, "div", "ml-overview-hierarchy");
      hierarchy.setAttribute("aria-label", "Concept hierarchy: artificial intelligence contains machine learning, which contains deep learning");
      for (const [label, detail] of [
        ["AI", "Human-like cognitive tasks"],
        ["ML", "Learn patterns from data"],
        ["DL", "Multi-layer networks learn features"]
      ]) {
        const card = element(doc, "div", "ml-overview-hierarchy-card");
        card.append(element(doc, "strong", "", label), element(doc, "span", "", detail));
        hierarchy.append(card);
      }
      root.append(hierarchy);

      const controls = element(doc, "div", "ml-overview-controls");
      for (const control of spec.controls) {
        const group = element(doc, "div", "control-group");
        const id = `ml-overview-${control.id}`;
        const label = element(doc, "label", "", control.label);
        label.htmlFor = id;
        const select = element(doc, "select");
        select.id = id;
        select.dataset.control = control.id;
        for (const option of control.options) {
          const node = element(doc, "option", "", option.label);
          node.value = option.value;
          select.append(node);
        }
        select.value = control.default;
        select.addEventListener("change", () => writeState({ [control.id]: select.value }));
        selects[control.id] = select;
        group.append(label, select);
        controls.append(group);
      }
      root.append(controls);

      const presets = element(doc, "div", "ml-overview-presets");
      for (const preset of spec.presets) {
        const button = element(doc, "button", "", preset.label);
        button.type = "button";
        button.addEventListener("click", () => writeState(preset.values));
        presets.append(button);
      }
      root.append(presets);

      const casePanel = element(doc, "section", "ml-overview-case");
      casePanel.append(element(doc, "span", "simulation-label", "CASE STUDY"));
      output = {
        title: element(doc, "h3"),
        data: element(doc, "p"),
        goal: element(doc, "p"),
        match: element(doc, "strong", "ml-overview-match"),
        feedback: element(doc, "p"),
        stage: element(doc, "p"),
        challenge: element(doc, "p", "ml-overview-challenge")
      };
      casePanel.append(output.title, output.data, output.goal, output.match, output.feedback);
      root.append(casePanel);
      const stagePanel = element(doc, "section", "ml-overview-stage");
      stagePanel.append(element(doc, "span", "simulation-label", "MODEL LIFECYCLE"), output.stage);
      root.append(stagePanel, output.challenge);
      container.append(root);
      render();
    },
    update(candidate = {}) {
      if (root) writeState(candidate);
    },
    reset() {
      if (root) writeState(Object.fromEntries(spec.controls.map((control) => [control.id, control.default])));
    },
    getAccessibleSummary() {
      return summary;
    },
    destroy() {
      root?.remove();
      root = null;
      spec = null;
      state = null;
      selects = null;
      output = null;
      summary = "";
    }
  };
}
