# AI Engineer Field Guide

A dependency-free learning application that runs directly from local HTML files.

## Pages

- `index.html` - the AI engineering roadmap and lesson tracker.
- `courses.html` - the catalog of configured course libraries.
- `course-library.html?id=...` - the reusable repository index and hierarchical progress tracker.
- `ibm-ai-engineering.html` - a compatibility redirect for the original IBM URL.

## Source structure

```text
AI-course/
|-- index.html
|-- courses.html
|-- course-library.html
|-- ibm-ai-engineering.html
|-- README.md
`-- assets/
    |-- css/
    |   |-- base.css
    |   |-- course-catalog.css
    |   `-- course-library.css
    |-- data/
    |   `-- course-libraries.js
    `-- js/
        |-- course-catalog/
        |   `-- app.js
        |-- course-library/
        |   `-- app.js
        `-- roadmap/
            `-- app.js
```

Shared design rules live in `assets/css/base.css`. Page-specific styles and behavior belong in the matching page folder. Course metadata is separate from rendering in `assets/data/course-libraries.js`.

## Progress storage

Progress is stored locally in the browser and never sent to a server.

- Roadmap lessons: `ai-engineer-field-guide-progress`
- IBM repository materials: `ai-engineer-ibm-library-progress`

IBM progress uses the full GitHub file path as its stable identifier. Module and course completion are derived from their child files, so no duplicate parent state is stored.

## Add another course library

Add one object to `window.COURSE_LIBRARIES` in `assets/data/course-libraries.js`. No new HTML, CSS, or renderer is required.

Each object defines:

- `id` - URL-safe unique identifier used by `course-library.html?id=...`.
- `title`, `shortTitle`, `provider`, `eyebrow`, and `description` - page and catalog copy.
- `repository` and `branch` - the public GitHub repository to index.
- `progressStorageKey` - a unique browser storage key.
- `integrityTitle` and `integrityText` - source-use guidance.
- `tracks` - top-level repository folders as `[directory, title, summary]` entries.

The generic renderer reads the repository tree from GitHub, groups each track by its second-level folders, classifies materials, and creates search, filters, links, and persistent completion controls automatically.

```js
{
    id: "new-course",
    title: "New Course Library",
    shortTitle: "New Course",
    provider: "Provider",
    eyebrow: "Repository companion",
    description: "Course description.",
    repository: "owner/repository",
    branch: "main",
    progressStorageKey: "ai-engineer-new-course-progress",
    integrityTitle: "Use this as reference material.",
    integrityText: "Complete graded work independently.",
    tracks: [
        ["01-First_Course", "First Course", "What this course covers."]
    ]
}
```
