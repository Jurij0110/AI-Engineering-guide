const libraries = window.COURSE_LIBRARIES;

function progressFor(library) {
  const storageKey = library.progressStorageKey || `ai-engineer-course-library-${library.id}-progress`;
  return JSON.parse(localStorage.getItem(storageKey) || "[]").length;
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

const completedMaterials = libraries.reduce((total, library) => total + progressFor(library), 0);
document.querySelector("#library-count").textContent = libraries.length;
document.querySelector("#track-count").textContent = libraries.reduce((total, library) => total + library.tracks.length, 0);
document.querySelector("#completed-count").textContent = completedMaterials;
document.querySelector("#course-libraries").innerHTML = libraries.map(renderLibraryCard).join("");
