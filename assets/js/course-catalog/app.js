import { ProgressStore, setupAuthControls } from "../progress-store.js";

setupAuthControls();

const libraries = window.COURSE_LIBRARIES;
const completedByLibrary = new Map();

function progressFor(library) {
  return completedByLibrary.get(library.id) || 0;
}

function renderLibraryCard(library, index) {
  const completed = progressFor(library);
  return `<article class="course-library-card">
    <div class="catalog-card-number">${String(index + 1).padStart(2, "0")}</div>
    <div class="catalog-card-copy">
      <span class="catalog-provider">${library.provider} · ${library.tracks.length} courses</span>
      <h2>${library.shortTitle}</h2>
      <p>${library.description}</p>
      <div class="catalog-card-meta"><span>${library.repository}</span><span>${completed} materials complete</span></div>
    </div>
    <a class="catalog-open" href="course-library.html?id=${encodeURIComponent(library.id)}" aria-label="Open ${library.shortTitle}">
      <span>Open library</span>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"></path></svg>
    </a>
  </article>`;
}

function renderCatalog() {
  const completedMaterials = libraries.reduce((total, library) => total + progressFor(library), 0);
  document.querySelector("#library-count").textContent = libraries.length;
  document.querySelector("#track-count").textContent = libraries.reduce((total, library) => total + library.tracks.length, 0);
  document.querySelector("#completed-count").textContent = completedMaterials;
  document.querySelector("#course-libraries").innerHTML = libraries.map(renderLibraryCard).join("");
}

async function initialize() {
  let loadError = null;
  for (const library of libraries) {
    try {
      const storageKey = library.progressStorageKey || `ai-engineer-course-library-${library.id}-progress`;
      const store = new ProgressStore(`library:${library.id}`, storageKey);
      const items = await store.load();
      completedByLibrary.set(library.id, items.length);
    } catch (error) {
      loadError ||= error;
    }
  }
  if (loadError) {
    const statusStore = new ProgressStore("catalog");
    statusStore.setStatus("error", "Firebase unavailable — progress totals could not be loaded");
    console.error(loadError);
  }
  renderCatalog();
}

initialize();
