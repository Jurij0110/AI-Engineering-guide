const FORMATS = new Set(["txt", "md", "ipynb"]);
const CONTROL_TYPES = new Set(["range", "select", "toggle", "number", "text", "button"]);

export function validateLessonSpec(spec) {
  const errors = [];
  for (const field of ["id", "courseId", "moduleId", "title", "sourcePath", "sourceFormat", "engine"]) {
    if (typeof spec?.[field] !== "string" || !spec[field].trim()) {
      errors.push(field + " must be a non-empty string");
    }
  }
  if (spec && !FORMATS.has(spec.sourceFormat)) errors.push("sourceFormat must be txt, md, or ipynb");
  if (!Array.isArray(spec?.learningObjectives) || spec.learningObjectives.length < 2) {
    errors.push("learningObjectives must contain at least 2 items");
  }
  if (!Array.isArray(spec?.controls)) errors.push("controls must be an array");
  else spec.controls.forEach((control, index) => {
    if (!control?.id) errors.push("controls[" + index + "].id must be a non-empty string");
    if (!CONTROL_TYPES.has(control?.type)) errors.push("controls[" + index + "].type is unsupported");
    if (control?.type === "range" &&
        (control.default < control.min || control.default > control.max)) {
      errors.push("controls[" + index + "].default must be between min and max");
    }
  });
  if (!spec?.scenario || !Number.isInteger(spec.scenario.seed)) {
    errors.push("scenario.seed must be an integer");
  }
  for (const field of ["views", "explanationRules", "presets", "quiz"]) {
    if (!Array.isArray(spec?.[field]) || spec[field].length === 0) {
      errors.push(field + " must contain at least 1 item");
    }
  }
  if (!spec?.challenge?.prompt || !spec.challenge.success) {
    errors.push("challenge must define prompt and success");
  }
  if (!spec?.accessibility?.canvasSummary || !spec.accessibility.keyboardHelp) {
    errors.push("accessibility must define canvasSummary and keyboardHelp");
  }
  return { valid: errors.length === 0, errors };
}

