import { EngineRegistry } from "./engine-registry.js";
import { registerEngineLoaders } from "./engine-loaders.js";
import { validateLessonSpec } from "./lesson-schema.js";

const registry = new EngineRegistry();
registerEngineLoaders(registry);

function importLessonSpec(specifier) {
  if (!/^\.\/lessons\/[a-z0-9-]+\.js$/.test(specifier)) {
    return Promise.reject(new Error("The lesson specifier is not allowed."));
  }
  return import(new URL(specifier, import.meta.url));
}

function assertMatchingSpec(entry, spec) {
  const validation = validateLessonSpec(spec);
  if (!validation.valid) throw new Error(validation.errors.join("; "));

  for (const field of ["id", "courseId", "moduleId", "sourcePath", "sourceFormat", "engine"]) {
    if (spec[field] !== entry[field]) {
      throw new Error(`Simulation manifest mismatch for ${field}.`);
    }
  }
}

function setTextList(container, items) {
  container.replaceChildren(...items.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

export function createSimulationIntegration({ dialog, isComplete, setComplete }) {
  const panel = dialog.querySelector(".simulation-panel");
  const title = dialog.querySelector("#simulation-title");
  const context = dialog.querySelector("#simulation-context");
  const source = dialog.querySelector("#simulation-source");
  const objectives = dialog.querySelector("#simulation-objectives");
  const challenge = dialog.querySelector("#simulation-challenge");
  const keyboardHelp = dialog.querySelector("#simulation-keyboard-help");
  const mountPoint = dialog.querySelector("#simulation-mount");
  const loading = dialog.querySelector("#simulation-loading");
  const errorPanel = dialog.querySelector("#simulation-error");
  const errorMessage = dialog.querySelector("#simulation-error-message");
  const summary = dialog.querySelector("#simulation-summary");
  const liveSummary = dialog.querySelector("#simulation-live-summary");
  const closeButtons = [...dialog.querySelectorAll("[data-simulation-close]")];
  const closeButton = closeButtons[0];
  const resetButton = dialog.querySelector("[data-simulation-reset]");
  const retryButton = dialog.querySelector("[data-simulation-retry]");
  const completeButton = dialog.querySelector("[data-simulation-complete]");

  let activeEngine = null;
  let activeEntry = null;
  let activeContext = null;
  let returnFocus = null;
  let generation = 0;
  let summaryFrame = 0;

  function destroyEngine(engine = activeEngine) {
    if (engine === activeEngine) activeEngine = null;
    try {
      engine?.destroy?.();
    } catch (error) {
      console.error("Could not destroy the simulation engine", error);
    }
  }

  function updateCompleteButton() {
    if (!activeContext) return;
    const complete = isComplete(activeContext.file);
    completeButton.dataset.complete = String(complete);
    completeButton.textContent = complete ? "Mark as incomplete" : "Mark lesson complete";
    completeButton.setAttribute("aria-pressed", String(complete));
  }

  function updateSummary() {
    cancelAnimationFrame(summaryFrame);
    summaryFrame = requestAnimationFrame(() => {
      const text = activeEngine?.getAccessibleSummary?.() || "Adjust the controls to explore this simulation.";
      summary.textContent = text;
      liveSummary.textContent = text;
    });
  }

  function showLoading() {
    panel.dataset.state = "loading";
    loading.hidden = false;
    errorPanel.hidden = true;
    mountPoint.replaceChildren();
    resetButton.disabled = true;
    retryButton.disabled = false;
    summary.textContent = "Loading the interactive model…";
    liveSummary.textContent = "Loading the interactive model.";
  }

  function showError(error) {
    panel.dataset.state = "error";
    loading.hidden = true;
    errorPanel.hidden = false;
    errorMessage.textContent = error?.message || "The simulator could not be loaded.";
    resetButton.disabled = true;
    summary.textContent = "Simulation unavailable. You can retry without leaving this lesson.";
    liveSummary.textContent = "Simulation unavailable.";
  }

  async function mountActiveSimulation() {
    const token = ++generation;
    let pendingEngine = null;
    destroyEngine();
    showLoading();

    try {
      const specModule = await importLessonSpec(activeEntry.specifier);
      if (token !== generation) return;
      const specExport = specModule?.default;
      const spec = typeof specExport === "function" ? specExport(activeEntry) : specExport;
      assertMatchingSpec(activeEntry, spec);

      const engineModule = await registry.load(activeEntry.engine);
      if (token !== generation) return;
      const engine = engineModule.createEngine();
      pendingEngine = engine;
      if (token !== generation) {
        destroyEngine(engine);
        return;
      }

      mountPoint.replaceChildren();
      engine.mount(mountPoint, spec, {});
      if (token !== generation) {
        destroyEngine(engine);
        return;
      }

      activeEngine = engine;
      pendingEngine = null;
      panel.dataset.state = "ready";
      loading.hidden = true;
      errorPanel.hidden = true;
      resetButton.disabled = false;
      setTextList(objectives, spec.learningObjectives);
      challenge.textContent = spec.challenge.prompt;
      keyboardHelp.textContent = spec.accessibility.keyboardHelp;
      updateSummary();
    } catch (error) {
      destroyEngine(pendingEngine);
      if (token === generation) showError(error);
    }
  }

  async function open({ entry, file, course, module, trigger, sourceUrl }) {
    if (!entry || entry.status !== "ready" || !entry.specifier) return;
    generation += 1;
    destroyEngine();
    activeEntry = entry;
    activeContext = { file, course, module };
    returnFocus = trigger;

    title.textContent = file.name;
    context.textContent = `${course.title} · ${module.title}`;
    source.href = sourceUrl;
    source.textContent = file.filename;
    objectives.replaceChildren();
    challenge.textContent = "Loading challenge…";
    keyboardHelp.textContent = "Loading keyboard instructions…";
    updateCompleteButton();

    if (!dialog.open) dialog.showModal();
    closeButton.focus();
    await mountActiveSimulation();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  function teardown({ restoreFocus = true } = {}) {
    const fallbackFocus = activeContext
      ? document.querySelector(`[data-simulation-path="${encodeURIComponent(activeContext.file.path)}"]`)
      : null;
    generation += 1;
    cancelAnimationFrame(summaryFrame);
    destroyEngine();
    mountPoint.replaceChildren();
    activeEntry = null;
    activeContext = null;
    if (restoreFocus) {
      const focusTarget = returnFocus?.isConnected ? returnFocus : fallbackFocus;
      focusTarget?.focus();
    }
    returnFocus = null;
  }

  closeButtons.forEach((button) => button.addEventListener("click", close));
  retryButton.addEventListener("click", mountActiveSimulation);
  resetButton.addEventListener("click", () => {
    activeEngine?.reset?.();
    updateSummary();
  });
  completeButton.addEventListener("click", async () => {
    if (!activeContext || completeButton.disabled) return;
    const token = generation;
    const file = activeContext.file;
    const nextComplete = !isComplete(activeContext.file);
    completeButton.disabled = true;
    let saved = false;
    try {
      saved = await setComplete(file, nextComplete);
    } catch (error) {
      console.error("Could not save simulation progress", error);
    }
    if (token !== generation) return;
    completeButton.disabled = false;
    updateCompleteButton();
    liveSummary.textContent = saved
      ? (nextComplete ? "Lesson marked complete." : "Lesson marked incomplete.")
      : "Progress could not be saved. The previous state was restored.";
  });
  mountPoint.addEventListener("input", updateSummary);
  mountPoint.addEventListener("change", updateSummary);
  dialog.addEventListener("close", () => teardown());
  window.addEventListener("pagehide", () => {
    teardown({ restoreFocus: false });
    if (dialog.open) dialog.close();
  });

  return { open, destroy: teardown };
}
