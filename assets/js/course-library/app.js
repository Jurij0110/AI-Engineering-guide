const libraryId = new URLSearchParams(location.search).get("id") || "ibm-ai-engineering";
const library = window.COURSE_LIBRARIES.find((item) => item.id === libraryId);

if (!library) throw new Error(`Unknown course library: ${libraryId}`);

const { repository, branch } = library;
const repositoryUrl = `https://github.com/${repository}`;
const treeUrl = `https://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;
const progressStorageKey = library.progressStorageKey || `ai-engineer-course-library-${library.id}-progress`;

const courseCatalog = library.tracks.map(([directory, title, summary], index) => ({
  directory,
  title,
  summary,
  number: String(index + 1).padStart(2, "0")
}));

let courses = [];
let query = "";
let activeType = "all";
const completedFiles = new Set(JSON.parse(localStorage.getItem(progressStorageKey) || "[]"));

function renderLibraryShell() {
  document.title = library.title;
  document.querySelector('meta[name="description"]').content = library.description;
  document.querySelector("#library-eyebrow").textContent = library.eyebrow;
  document.querySelector("#library-title").textContent = library.title;
  document.querySelector("#library-description").textContent = library.description;
  document.querySelector("#library-nav-title").textContent = library.shortTitle;
  document.querySelector("#repository-link").href = repositoryUrl;
  document.querySelector("#source-repository").innerHTML = repository.replace("/", "/<br>");
  document.querySelector("#integrity-title").textContent = library.integrityTitle;
  document.querySelector("#integrity-text").textContent = library.integrityText;
  document.querySelector("#course-count").textContent = courseCatalog.length;
  document.querySelector("#course-index-label").textContent = `${library.provider} course index`;
}

function saveProgress() {
  localStorage.setItem(progressStorageKey, JSON.stringify([...completedFiles]));
}

function completionState(files) {
  const complete = files.filter((file) => completedFiles.has(file.path)).length;
  return { complete, total: files.length, checked: complete === files.length, indeterminate: complete > 0 && complete < files.length };
}

function setFilesComplete(files, checked) {
  files.forEach((file) => checked ? completedFiles.add(file.path) : completedFiles.delete(file.path));
  saveProgress();
  renderCourseIndex();
  renderRepository();
}

function classifyFile(path) {
  const lower = path.toLowerCase();
  const filename = path.split("/").at(-1);
  const extension = filename.includes(".") ? filename.split(".").at(-1).toLowerCase() : "";
  if (lower.includes("/certificate/")) return { type: "resource", label: "Certificate" };
  if (/final[_ -]?project|practice[_ -]?project|capstone|exam|qa_bot_project/.test(lower)) return { type: "assignment", label: "Project" };
  if (extension === "ipynb") return { type: "lab", label: "Notebook lab" };
  if (["py", "json", "csv"].includes(extension)) return { type: "code", label: extension === "py" ? "Python code" : "Data" };
  if (["pdf", "png", "jpg", "jpeg"].includes(extension)) return { type: "resource", label: extension === "pdf" ? "PDF reference" : "Image" };
  if (["txt", "md", ""].includes(extension)) return { type: "note", label: "Course note" };
  return { type: "resource", label: "Resource" };
}

function cleanName(value) {
  return value
    .replace(/\.(ipynb|txt|md|pdf|png|jpg|jpeg|py|json|csv)$/i, "")
    .replace(/^\d+[-_]?/, "")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function githubPath(path, isDirectory = false) {
  const encoded = path.split("/").map((part) => encodeURIComponent(part)).join("/");
  return `${repositoryUrl}/${isDirectory ? "tree" : "blob"}/${branch}/${encoded}`;
}

function buildCourses(tree) {
  const blobs = tree.filter((entry) => entry.type === "blob");
  return courseCatalog.map((catalogCourse) => {
    const files = blobs.filter((entry) => entry.path.startsWith(`${catalogCourse.directory}/`));
    const moduleMap = new Map();
    files.forEach((entry) => {
      const parts = entry.path.split("/");
      const directory = parts.length > 2 ? parts[1] : "Course files";
      const key = directory === "Certificate" ? "Certificates" : directory;
      if (!moduleMap.has(key)) moduleMap.set(key, []);
      const classification = classifyFile(entry.path);
      moduleMap.get(key).push({
        path: entry.path,
        name: cleanName(parts.at(-1)),
        filename: parts.at(-1),
        ...classification
      });
    });
    const modules = [...moduleMap.entries()].map(([directory, moduleFiles]) => ({
      directory,
      title: directory === "Certificates" ? "Certificates" : cleanName(directory.replace(/^Module-?\d+[-_]?/i, "")),
      files: moduleFiles
    }));
    return { ...catalogCourse, files, modules };
  });
}

function fileMatches(file, course, module) {
  const text = `${file.name} ${file.filename} ${course.title} ${course.summary} ${module.title}`.toLowerCase();
  return text.includes(query) && (activeType === "all" || file.type === activeType);
}

function renderStats() {
  const files = courses.flatMap((course) => course.modules.flatMap((module) => module.files));
  const learningModules = courses.flatMap((course) => course.modules).filter((module) => module.directory !== "Certificates");
  document.querySelector("#module-count").textContent = learningModules.length;
  document.querySelector("#lab-count").textContent = files.filter((file) => file.type === "lab").length;
  document.querySelector("#project-count").textContent = files.filter((file) => file.type === "assignment").length;
  document.querySelector("#file-count").textContent = files.length;
}

function renderCourseIndex() {
  document.querySelector("#course-index").innerHTML = courses.map((course) => {
    const progress = completionState(course.files);
    return `<a href="#library-course-${course.number}"><span>${course.number}</span><span>${course.title}<small>${progress.complete}/${progress.total} complete</small></span></a>`;
  }).join("");
}

function renderFile(file) {
  const checked = completedFiles.has(file.path);
  const isNotebook = file.filename.endsWith(".ipynb");
  const colabUrl = isNotebook ? `https://colab.research.google.com/github/${repository}/blob/${branch}/${file.path.split("/").map(part => encodeURIComponent(part)).join("/")}` : "";
  return `<div class="material-row ${checked ? "is-complete" : ""}">
    <label class="library-check"><input type="checkbox" data-file-path="${file.path}" ${checked ? "checked" : ""}><span></span><span class="sr-only">Mark ${file.name} complete</span></label>
    <a class="material-link" href="${githubPath(file.path)}" target="_blank" rel="noreferrer">
      <span class="material-kind ${file.type}">${file.label}</span>
      <span class="material-name"><strong>${file.name}</strong><small>${file.filename}</small></span>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-8 8"></path><path d="M19 13v6H5V5h6"></path></svg>
    </a>
    ${isNotebook ? `<a class="colab-link" href="${colabUrl}" target="_blank" rel="noreferrer" title="Open in Google Colab / Gemini environment"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2A10 10 0 1 0 22 12 10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z"/><path d="M9.5 16.5l7-4.5-7-4.5v9z"/></svg><span>Colab / Gemini</span></a>` : ""}
  </div>`;
}

function renderRepository() {
  let visibleFiles = 0;
  const html = courses.map((course) => {
    const modules = course.modules.map((module) => {
      const files = module.files.filter((file) => fileMatches(file, course, module));
      visibleFiles += files.length;
      if (!files.length) return "";
      const typeCounts = Object.groupBy ? Object.groupBy(files, (file) => file.type) : null;
      const summary = typeCounts
        ? Object.entries(typeCounts).map(([type, entries]) => `${entries.length} ${type}`).join(" · ")
        : `${files.length} materials`;
      const progress = completionState(module.files);
      return `<details class="repo-module" ${query || activeType !== "all" ? "open" : ""}>
        <summary><label class="library-check module-check" data-prevent-toggle><input type="checkbox" data-module="${course.number}|${module.directory}" ${progress.checked ? "checked" : ""} ${progress.indeterminate ? "data-indeterminate" : ""}><span></span><span class="sr-only">Mark ${module.title} complete</span></label><span><strong>${module.title}</strong><small>${summary} · ${progress.complete}/${progress.total} complete</small></span><span class="repo-module-action">View files</span></summary>
        <div class="material-list">${files.map(renderFile).join("")}</div>
      </details>`;
    }).join("");
    if (!modules) return "";
    const courseProgress = completionState(course.files);
    return `<article class="repo-course" id="library-course-${course.number}">
      <header>
        <label class="library-check course-check"><input type="checkbox" data-course="${course.number}" ${courseProgress.checked ? "checked" : ""} ${courseProgress.indeterminate ? "data-indeterminate" : ""}><span></span><span class="sr-only">Mark ${course.title} complete</span></label>
        <div><span class="repo-kicker">${library.provider} · Course ${course.number} · ${courseProgress.complete}/${courseProgress.total} complete</span><h2>${course.title}</h2><p>${course.summary}</p></div>
        <a href="${githubPath(course.directory, true)}" target="_blank" rel="noreferrer" aria-label="Open ${course.title} folder on GitHub">GitHub folder</a>
      </header>
      <div class="repo-modules">${modules}</div>
    </article>`;
  }).join("");
  document.querySelector("#repository-content").innerHTML = html;
  document.querySelector("#library-empty").hidden = visibleFiles !== 0;
  document.querySelectorAll("[data-indeterminate]").forEach((input) => { input.indeterminate = true; });
}

function showError() {
  document.querySelector("#source-status").innerHTML = `<span class="status-pulse error"></span>Live index unavailable`;
  document.querySelector("#repository-content").innerHTML = `<section class="load-error"><strong>Could not load the live file inventory</strong><p>GitHub may be rate-limiting this browser. The ${courseCatalog.length} course folders remain available directly from the repository.</p><div>${courseCatalog.map((course) => `<a href="${githubPath(course.directory, true)}" target="_blank" rel="noreferrer">${course.number} · ${course.title}</a>`).join("")}</div></section>`;
}

document.querySelector("#library-search").addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  renderRepository();
});

document.querySelectorAll("[data-type]").forEach((button) => button.addEventListener("click", () => {
  activeType = button.dataset.type;
  document.querySelectorAll("[data-type]").forEach((item) => item.classList.toggle("active", item === button));
  renderRepository();
}));

document.querySelector("#repository-content").addEventListener("click", (event) => {
  const progressControl = event.target.closest("[data-prevent-toggle]");
  if (!progressControl) return;
  event.preventDefault();
  event.stopPropagation();
  const input = progressControl.querySelector("input");
  input.checked = input.indeterminate || !input.checked;
  input.indeterminate = false;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}, true);

document.querySelector("#repository-content").addEventListener("change", (event) => {
  const input = event.target;
  if (input.matches("[data-file-path]")) {
    const file = courses.flatMap((course) => course.files).find((item) => item.path === input.dataset.filePath);
    if (file) setFilesComplete([file], input.checked);
  }
  if (input.matches("[data-module]")) {
    const [courseNumber, directory] = input.dataset.module.split("|");
    const module = courses.find((course) => course.number === courseNumber)?.modules.find((item) => item.directory === directory);
    if (module) setFilesComplete(module.files, input.checked);
  }
  if (input.matches("[data-course]")) {
    const course = courses.find((item) => item.number === input.dataset.course);
    if (course) setFilesComplete(course.files, input.checked);
  }
});

renderLibraryShell();

fetch(treeUrl)
  .then((response) => {
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  })
  .then((data) => {
    if (data.truncated) throw new Error("GitHub returned a truncated repository tree");
    courses = buildCourses(data.tree);
    renderStats();
    renderCourseIndex();
    renderRepository();
    document.querySelector("#source-status").innerHTML = `<span class="status-pulse"></span>Live index · complete tree`;
  })
  .catch(showError);