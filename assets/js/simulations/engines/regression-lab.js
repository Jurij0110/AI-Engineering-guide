const PATTERNS = new Set([
  "linear",
  "quadratic",
  "cubic",
  "exponential",
  "logarithmic",
  "piecewise"
]);

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CHART_WIDTH = 640;
const CHART_HEIGHT = 360;
const CHART_MARGIN = 44;
// Task 9 uses 10-80 samples. This higher API ceiling leaves ample room for
// experimentation while bounding one-shot object allocation before Array.from.
const MAX_DATASET_SAMPLES = 100_000;

function assertSeed(seed) {
  if (!Number.isSafeInteger(seed)) {
    throw new TypeError("seed must be a finite safe integer");
  }
}

function assertDegree(degree) {
  if (!Number.isInteger(degree)) {
    throw new TypeError("degree must be an integer from 1 to 15");
  }
  if (degree < 1 || degree > 15) {
    throw new RangeError("degree must be from 1 to 15");
  }
}

function assertFinitePoint(point, index) {
  if (
    !point ||
    typeof point !== "object" ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new TypeError(`point ${index} must contain finite x and y values`);
  }
}

function assertPoints(points, minimum = 1) {
  if (!Array.isArray(points)) {
    throw new TypeError("points must be an array");
  }
  if (points.length < minimum) {
    throw new RangeError(`at least ${minimum} points are required`);
  }
  for (let index = 0; index < points.length; index += 1) {
    if (!Object.hasOwn(points, index)) {
      throw new TypeError(`point ${index} must contain finite x and y values`);
    }
    assertFinitePoint(points[index], index);
  }
}

function truthValue(pattern, x) {
  switch (pattern) {
    case "linear":
      return 0.5 + 1.2 * x;
    case "quadratic":
      return 0.5 + 0.8 * x + 0.9 * x * x;
    case "cubic":
      return -0.25 + 0.75 * x - 0.4 * x * x + 0.55 * x * x * x;
    case "exponential":
      return Math.exp(0.8 * x) - 1;
    case "logarithmic":
      return 1.5 * Math.log(x + 3);
    case "piecewise":
      return x < 0 ? -0.5 + 0.35 * x : 0.5 + 1.1 * x;
    default:
      throw new RangeError(
        `pattern must be one of: ${[...PATTERNS].join(", ")}`
      );
  }
}

export function seededRandom(seed) {
  assertSeed(seed);
  let state = seed;
  return function random() {
    state |= 0;
    state = state + 0x6D2B79F5 | 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function generateDataset(options) {
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("dataset options must be an object");
  }
  const { pattern, samples, noise, seed } = options;
  if (!PATTERNS.has(pattern)) {
    throw new RangeError(
      `pattern must be one of: ${[...PATTERNS].join(", ")}`
    );
  }
  if (!Number.isInteger(samples)) {
    throw new TypeError("samples must be an integer");
  }
  if (samples < 1) {
    throw new RangeError("samples must be a positive integer");
  }
  if (samples > MAX_DATASET_SAMPLES) {
    throw new RangeError(`samples must be at most ${MAX_DATASET_SAMPLES}`);
  }
  if (!Number.isFinite(noise)) {
    throw new TypeError("noise must be finite and between 0 and 1");
  }
  if (noise < 0 || noise > 1) {
    throw new RangeError("noise must be between 0 and 1");
  }
  assertSeed(seed);

  const random = seededRandom(seed);
  return Array.from({ length: samples }, (_, index) => {
    const x = samples === 1 ? 0 : -2 + 4 * index / (samples - 1);
    const y = truthValue(pattern, x) + noise * (2 * random() - 1);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new RangeError("dataset generation produced a non-finite value");
    }
    return { x, y };
  });
}

function solveLeastSquares(matrix, target) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const r = matrix.map(row => row.slice());
  const transformedTarget = target.slice();
  let matrixScale = 1;
  for (const row of r) {
    for (const value of row) matrixScale = Math.max(matrixScale, Math.abs(value));
  }
  const tolerance = Number.EPSILON * Math.max(rows, columns) * matrixScale * 64;

  for (let column = 0; column < columns; column += 1) {
    let columnNorm = 0;
    for (let row = column; row < rows; row += 1) {
      columnNorm = Math.hypot(columnNorm, r[row][column]);
    }
    if (!Number.isFinite(columnNorm) || columnNorm <= tolerance) {
      throw new RangeError("polynomial system is rank-deficient or singular");
    }

    const diagonal = r[column][column];
    const reflectedDiagonal = diagonal >= 0 ? -columnNorm : columnNorm;
    const vector = Array(rows - column);
    vector[0] = diagonal - reflectedDiagonal;
    for (let row = column + 1; row < rows; row += 1) {
      vector[row - column] = r[row][column];
    }
    const vectorNormSquared = vector.reduce((sum, value) => sum + value * value, 0);
    if (!Number.isFinite(vectorNormSquared) || vectorNormSquared <= tolerance * tolerance) {
      throw new RangeError("polynomial system is rank-deficient or singular");
    }

    for (let targetColumn = column; targetColumn < columns; targetColumn += 1) {
      let projection = 0;
      for (let row = column; row < rows; row += 1) {
        projection += vector[row - column] * r[row][targetColumn];
      }
      const factor = 2 * projection / vectorNormSquared;
      for (let row = column; row < rows; row += 1) {
        r[row][targetColumn] -= factor * vector[row - column];
      }
    }

    let targetProjection = 0;
    for (let row = column; row < rows; row += 1) {
      targetProjection += vector[row - column] * transformedTarget[row];
    }
    const targetFactor = 2 * targetProjection / vectorNormSquared;
    for (let row = column; row < rows; row += 1) {
      transformedTarget[row] -= targetFactor * vector[row - column];
    }

    r[column][column] = reflectedDiagonal;
    for (let row = column + 1; row < rows; row += 1) {
      r[row][column] = 0;
    }
  }

  const coefficients = Array(columns).fill(0);
  for (let row = columns - 1; row >= 0; row -= 1) {
    const diagonal = r[row][row];
    if (!Number.isFinite(diagonal) || Math.abs(diagonal) <= tolerance) {
      throw new RangeError("polynomial system is rank-deficient or singular");
    }
    let remainder = transformedTarget[row];
    for (let column = row + 1; column < columns; column += 1) {
      remainder -= r[row][column] * coefficients[column];
    }
    coefficients[row] = remainder / diagonal;
    if (!Number.isFinite(coefficients[row])) {
      throw new RangeError("polynomial solver produced a non-finite coefficient");
    }
  }
  return coefficients;
}

function binomialCoefficient(n, k) {
  const smallerK = Math.min(k, n - k);
  let value = 1;
  for (let index = 1; index <= smallerK; index += 1) {
    value = value * (n - smallerK + index) / index;
  }
  return value;
}

function convertToOriginalBasis(normalizedCoefficients, center, scale) {
  const inverseScale = 1 / scale;
  const offset = -center / scale;
  if (!Number.isFinite(inverseScale) || !Number.isFinite(offset)) {
    throw new RangeError("original-domain coefficients are not representable as finite numbers");
  }

  return normalizedCoefficients.map((_, originalPower) => {
    const scaledPower = inverseScale ** originalPower;
    if (!Number.isFinite(scaledPower)) {
      throw new RangeError("original-domain coefficients are not representable as finite numbers");
    }
    let sum = 0;
    let correction = 0;
    for (
      let normalizedPower = originalPower;
      normalizedPower < normalizedCoefficients.length;
      normalizedPower += 1
    ) {
      const term = normalizedCoefficients[normalizedPower] *
        binomialCoefficient(normalizedPower, originalPower) *
        scaledPower *
        offset ** (normalizedPower - originalPower);
      if (!Number.isFinite(term)) {
        throw new RangeError("original-domain coefficients are not representable as finite numbers");
      }
      const next = sum + term;
      correction += Math.abs(sum) >= Math.abs(term)
        ? (sum - next) + term
        : (term - next) + sum;
      sum = next;
    }
    const coefficient = sum + correction;
    if (!Number.isFinite(coefficient)) {
      throw new RangeError("original-domain coefficients are not representable as finite numbers");
    }
    return coefficient;
  });
}

export function fitPolynomial(points, degree) {
  assertDegree(degree);
  assertPoints(points, degree + 2);

  let minimumX = Number.POSITIVE_INFINITY;
  let maximumX = Number.NEGATIVE_INFINITY;
  for (const { x } of points) {
    minimumX = Math.min(minimumX, x);
    maximumX = Math.max(maximumX, x);
  }
  const center = minimumX + (maximumX - minimumX) / 2;
  const scale = (maximumX - minimumX) / 2;
  if (!Number.isFinite(center) || !Number.isFinite(scale) || scale <= 0) {
    throw new RangeError("polynomial system is rank-deficient or singular");
  }

  const matrix = points.map(({ x }) => {
    const normalizedX = (x - center) / scale;
    if (!Number.isFinite(normalizedX)) {
      throw new RangeError("x normalization produced a non-finite value");
    }
    const row = Array(degree + 1);
    row[0] = 1;
    for (let power = 1; power <= degree; power += 1) {
      row[power] = row[power - 1] * normalizedX;
    }
    return row;
  });
  const normalizedCoefficients = solveLeastSquares(matrix, points.map(({ y }) => y));
  const coefficients = convertToOriginalBasis(normalizedCoefficients, center, scale);

  return {
    coefficients,
    predict(x) {
      if (!Number.isFinite(x)) {
        throw new TypeError("prediction input x must be finite");
      }
      const normalizedX = (x - center) / scale;
      let prediction = 0;
      for (let index = normalizedCoefficients.length - 1; index >= 0; index -= 1) {
        prediction = prediction * normalizedX + normalizedCoefficients[index];
      }
      if (!Number.isFinite(prediction)) {
        throw new RangeError("polynomial prediction produced a non-finite value");
      }
      return prediction;
    }
  };
}

function shuffledIndices(length, seed) {
  const indices = Array.from({ length }, (_, index) => index);
  const random = seededRandom(seed);
  for (let index = indices.length - 1; index > 0; index -= 1) {
    const replacement = Math.floor(random() * (index + 1));
    [indices[index], indices[replacement]] = [indices[replacement], indices[index]];
  }
  return indices;
}

function meanSquaredError(indices, squaredErrors) {
  return indices.reduce((sum, index) => sum + squaredErrors[index], 0) / indices.length;
}

export function calculateMetrics(points, predict, { degree, seed = 42 } = {}) {
  assertPoints(points, 2);
  if (typeof predict !== "function") {
    throw new TypeError("predict must be a function");
  }
  assertDegree(degree);
  assertSeed(seed);

  const predictions = points.map(({ x }, index) => {
    const prediction = predict(x);
    if (!Number.isFinite(prediction)) {
      throw new TypeError(`prediction ${index} must be finite`);
    }
    return prediction;
  });
  const squaredErrors = predictions.map((prediction, index) => {
    const error = points[index].y - prediction;
    const squaredError = error * error;
    if (!Number.isFinite(squaredError)) {
      throw new RangeError(`squared prediction error ${index} must be finite`);
    }
    return squaredError;
  });
  const mse = squaredErrors.reduce((sum, value) => sum + value, 0) / points.length;
  const meanTarget = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const targetScale = points.reduce(
    (scale, point) => Math.max(scale, Math.abs(point.y)),
    Math.max(1, Math.abs(meanTarget))
  );
  const totalVariation = points.reduce((sum, point) => {
    const difference = point.y - meanTarget;
    return sum + difference * difference;
  }, 0);
  const squaredRoundoff = (Number.EPSILON * targetScale) ** 2 * points.length * 64;
  const squaredError = mse * points.length;
  const r2 = totalVariation <= squaredRoundoff
    ? (squaredError <= squaredRoundoff ? 1 : 0)
    : 1 - squaredError / totalVariation;

  const indices = shuffledIndices(points.length, seed);
  const validationCount = Math.max(1, Math.floor(points.length * 0.2));
  const validationIndices = indices.slice(0, validationCount);
  const trainIndices = indices.slice(validationCount);
  const trainMse = meanSquaredError(trainIndices, squaredErrors);
  const validationMse = meanSquaredError(validationIndices, squaredErrors);

  if (![mse, r2, trainMse, validationMse].every(Number.isFinite)) {
    throw new RangeError("metric calculation produced a non-finite value");
  }
  return { mse, r2, trainMse, validationMse, degree };
}

export function diagnoseFit(metrics) {
  if (!metrics || typeof metrics !== "object") {
    throw new TypeError("metrics must be an object");
  }
  const { trainMse, validationMse, degree } = metrics;
  assertDegree(degree);
  if (![trainMse, validationMse].every(Number.isFinite)) {
    throw new TypeError("trainMse and validationMse must be finite");
  }
  if (trainMse < 0 || validationMse < 0) {
    throw new RangeError("trainMse and validationMse cannot be negative");
  }

  // These fixed teaching thresholds make the supplied nonlinear presets
  // deterministic: degree 1 underfits, degree 3 balances, and degree 15
  // overfits. A large validation gap also identifies overfit at lower degrees.
  if (degree >= 10 || validationMse > Math.max(0.5, trainMse * 3)) {
    return "overfit";
  }
  if ((degree === 1 && metrics.pattern !== "linear") || (trainMse > 1 && validationMse > 1)) {
    return "underfit";
  }
  return "balanced";
}

function createElement(document, tagName, attributes = {}, text = null) {
  const element = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  if (text !== null) element.textContent = text;
  return element;
}

function createSvgElement(document, tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMetric(value) {
  return Number.isFinite(value) ? value.toFixed(4) : "Unavailable";
}

function stateExplanation(state, diagnosis, metrics) {
  if (diagnosis === "underfit") {
    return `Degree ${state.degree} is too simple for the ${state.pattern} pattern, so both training and validation errors remain visible.`;
  }
  if (diagnosis === "overfit") {
    return `Degree ${state.degree} is overly flexible for ${state.samples} noisy samples, which makes the fit less reliable beyond the observed points.`;
  }
  return `Degree ${state.degree} follows the ${state.pattern} pattern while keeping training MSE ${formatMetric(metrics.trainMse)} and validation MSE ${formatMetric(metrics.validationMse)} close.`;
}

function chartPath(values, xScale, yScale) {
  return values.map(({ x, y }, index) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new RangeError("chart path values must be finite");
    }
    const chartX = xScale(x);
    const chartY = yScale(y);
    if (!Number.isFinite(chartX) || !Number.isFinite(chartY)) {
      throw new RangeError("chart coordinates must be finite");
    }
    return `${index === 0 ? "M" : "L"}${chartX.toFixed(2)},${chartY.toFixed(2)}`;
  }).join(" ");
}

function numericStateValue(control, candidate) {
  let value = Number(candidate);
  if (!Number.isFinite(value)) value = Number(control.default);
  if (["degree", "samples", "seed"].includes(control.id)) value = Math.round(value);
  if (Number.isFinite(Number(control.min))) value = Math.max(value, Number(control.min));
  if (Number.isFinite(Number(control.max))) value = Math.min(value, Number(control.max));
  return value;
}

export function createEngine() {
  let root = null;
  let summaryNode = null;
  let controlDefinitions = [];
  let controls = new Map();
  let outputs = new Map();
  let defaults = {};
  let view = null;
  const cleanup = [];

  function teardown() {
    cleanup.splice(0).forEach(dispose => dispose());
    root?.remove();
    root = null;
    summaryNode = null;
    controlDefinitions = [];
    controls = new Map();
    outputs = new Map();
    defaults = {};
    view = null;
  }

  function listen(target, event, handler) {
    target.addEventListener(event, handler);
    cleanup.push(() => target.removeEventListener(event, handler));
  }

  function normalizeState(candidate = {}) {
    const state = {};
    for (const definition of controlDefinitions) {
      const supplied = Object.hasOwn(candidate, definition.id)
        ? candidate[definition.id]
        : controls.get(definition.id).value;
      if (definition.type === "select") {
        const allowed = (definition.options ?? []).map(optionValue);
        const value = String(supplied);
        state[definition.id] = allowed.includes(value) ? value : String(defaults[definition.id]);
      } else {
        state[definition.id] = numericStateValue(definition, supplied);
      }
    }
    return state;
  }

  function writeState(state) {
    for (const definition of controlDefinitions) {
      const value = String(state[definition.id]);
      controls.get(definition.id).value = value;
      outputs.get(definition.id).textContent = value;
    }
  }

  function renderError(error, state) {
    view.truthPath.setAttribute("d", "");
    view.fittedPath.setAttribute("d", "");
    view.pointsGroup.replaceChildren();
    view.r2.textContent = "Unavailable";
    view.trainMse.textContent = "Unavailable";
    view.validationMse.textContent = "Unavailable";
    view.diagnosis.textContent = "Adjust controls";
    view.explanation.textContent = error instanceof Error ? error.message : "Unable to render this regression state.";
    view.challenge.textContent = "Challenge unavailable until the controls describe a solvable fit.";
    summaryNode.textContent = `${view.summaryPrefix}: unavailable for ${state.samples} samples at degree ${state.degree}.`;
  }

  function renderState(state) {
    const points = generateDataset(state);
    const model = fitPolynomial(points, state.degree);
    const metrics = calculateMetrics(points, model.predict, {
      degree: state.degree,
      seed: state.seed
    });
    const diagnosis = diagnoseFit({ ...metrics, pattern: state.pattern });
    const curveX = Array.from({ length: 121 }, (_, index) => -2 + 4 * index / 120);
    const truth = curveX.map(x => ({ x, y: truthValue(state.pattern, x) }));
    const fitted = curveX.map(x => ({ x, y: model.predict(x) }));
    const allY = [...points, ...truth, ...fitted].map(point => point.y);
    let minimumY = Math.min(...allY);
    let maximumY = Math.max(...allY);
    if (!Number.isFinite(minimumY) || !Number.isFinite(maximumY)) {
      throw new RangeError("chart bounds must be finite");
    }
    if (minimumY === maximumY) {
      minimumY -= 1;
      maximumY += 1;
    }
    const innerWidth = CHART_WIDTH - 2 * CHART_MARGIN;
    const innerHeight = CHART_HEIGHT - 2 * CHART_MARGIN;
    const xScale = x => CHART_MARGIN + (x + 2) / 4 * innerWidth;
    const yScale = y => CHART_HEIGHT - CHART_MARGIN - (y - minimumY) / (maximumY - minimumY) * innerHeight;

    view.truthPath.setAttribute("d", chartPath(truth, xScale, yScale));
    view.fittedPath.setAttribute("d", chartPath(fitted, xScale, yScale));
    const shownPoints = points.length <= 200
      ? points
      : Array.from({ length: 200 }, (_, index) => points[Math.floor(index * points.length / 200)]);
    const circles = shownPoints.map(point => createSvgElement(root.ownerDocument, "circle", {
      cx: xScale(point.x).toFixed(2),
      cy: yScale(point.y).toFixed(2),
      r: "3",
      fill: "var(--accent, #0369a1)",
      stroke: "var(--panel, #ffffff)",
      "stroke-width": "1.5",
      "aria-hidden": "true"
    }));
    view.pointsGroup.replaceChildren(...circles);

    view.r2.textContent = formatMetric(metrics.r2);
    view.trainMse.textContent = formatMetric(metrics.trainMse);
    view.validationMse.textContent = formatMetric(metrics.validationMse);
    view.diagnosis.textContent = titleCase(diagnosis);
    view.explanation.textContent = stateExplanation(state, diagnosis, metrics);
    const challenge = view.challengeSuccess;
    const challengeComplete = Boolean(challenge) &&
      (challenge.diagnosis == null || diagnosis.toLowerCase() === String(challenge.diagnosis).toLowerCase()) &&
      (challenge.pattern == null || state.pattern === challenge.pattern) &&
      (challenge.degree == null || state.degree === challenge.degree) &&
      (challenge.maxDegree == null || state.degree <= challenge.maxDegree) &&
      (challenge.maxNoise == null || state.noise <= challenge.maxNoise) &&
      (challenge.minR2 == null || metrics.r2 >= challenge.minR2) &&
      (challenge.maxValidationMse == null || metrics.validationMse <= challenge.maxValidationMse);
    view.challenge.textContent = challengeComplete
      ? "Challenge complete: this is a balanced fit within the requested limits."
      : "Challenge in progress: adjust the controls to meet every target.";
    summaryNode.textContent = `${view.summaryPrefix}: ${state.pattern} regression chart with ${state.samples} samples, degree ${state.degree}, R² ${formatMetric(metrics.r2)}, training MSE ${formatMetric(metrics.trainMse)}, validation MSE ${formatMetric(metrics.validationMse)}, diagnosed ${diagnosis}.`;
  }

  function update(candidate = {}) {
    if (!root) return;
    const state = normalizeState(candidate);
    writeState(state);
    try {
      renderState(state);
    } catch (error) {
      renderError(error, state);
    }
  }

  function reset() {
    if (!root) return;
    update(defaults);
  }

  function mount(container, spec) {
    if (!container || typeof container.appendChild !== "function" || !container.ownerDocument) {
      throw new TypeError("mount requires a DOM container with an ownerDocument");
    }
    if (!spec || !Array.isArray(spec.controls) || !Array.isArray(spec.presets)) {
      throw new TypeError("RegressionLab requires controls and presets arrays");
    }
    teardown();

    const document = container.ownerDocument;
    const mountedRoot = createElement(document, "section", { "data-regression-lab": "" });
    root = mountedRoot;
    controlDefinitions = spec.controls.slice();
    defaults = Object.fromEntries(controlDefinitions.map(definition => [definition.id, definition.default]));
    if (Object.hasOwn(defaults, "seed") && Number.isSafeInteger(spec.scenario?.seed)) {
      defaults.seed = spec.scenario.seed;
    }

    const controlsRegion = createElement(document, "div", { "aria-label": "Regression controls" });
    for (const definition of controlDefinitions) {
      const group = createElement(document, "div");
      const id = `regression-control-${definition.id}`;
      const label = createElement(document, "label", { for: id }, definition.label);
      let input;
      if (definition.type === "select") {
        input = createElement(document, "select", { id, "data-control": definition.id });
        for (const optionDefinition of definition.options ?? []) {
          input.appendChild(createElement(document, "option", {
            value: optionValue(optionDefinition)
          }, optionLabel(optionDefinition)));
        }
      } else {
        const attributes = { id, type: definition.type, "data-control": definition.id };
        for (const name of ["min", "max", "step"]) {
          if (definition[name] !== undefined) attributes[name] = definition[name];
        }
        input = createElement(document, "input", attributes);
      }
      const output = createElement(document, "output", {
        for: id,
        "data-control-output": definition.id,
        "aria-live": "polite"
      });
      controls.set(definition.id, input);
      outputs.set(definition.id, output);
      group.append(label, input, output);
      controlsRegion.appendChild(group);
      const rerender = () => {
        if (root === mountedRoot) update();
      };
      listen(input, "input", rerender);
      listen(input, "change", rerender);
    }

    const actions = createElement(document, "div");
    for (const preset of spec.presets) {
      const button = createElement(document, "button", { type: "button" }, `${preset.label} preset`);
      listen(button, "click", () => {
        if (root === mountedRoot) update({ ...normalizeState(), ...preset.values });
      });
      actions.appendChild(button);
    }
    const resetButton = createElement(document, "button", { type: "button" }, "Reset");
    listen(resetButton, "click", () => {
      if (root === mountedRoot) reset();
    });
    actions.appendChild(resetButton);
    const keyboardHelp = createElement(
      document,
      "p",
      { class: "visually-hidden" },
      spec.accessibility?.keyboardHelp ?? "Use native keyboard controls to adjust the regression inputs."
    );

    const svg = createSvgElement(document, "svg", {
      role: "img",
      "aria-label": "Regression chart",
      viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`,
      preserveAspectRatio: "xMidYMid meet"
    });
    svg.append(
      createSvgElement(document, "line", { x1: CHART_MARGIN, y1: CHART_HEIGHT - CHART_MARGIN, x2: CHART_WIDTH - CHART_MARGIN, y2: CHART_HEIGHT - CHART_MARGIN, stroke: "currentColor", "stroke-width": "1", opacity: "0.45", "data-axis": "x" }),
      createSvgElement(document, "line", { x1: CHART_MARGIN, y1: CHART_MARGIN, x2: CHART_MARGIN, y2: CHART_HEIGHT - CHART_MARGIN, stroke: "currentColor", "stroke-width": "1", opacity: "0.45", "data-axis": "y" })
    );
    const truthPath = createSvgElement(document, "path", { "data-truth-path": "", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-dasharray": "7 5" });
    const fittedPath = createSvgElement(document, "path", { "data-fitted-path": "", fill: "none", stroke: "var(--accent, #0369a1)", "stroke-width": "3" });
    const pointsGroup = createSvgElement(document, "g", { "data-sample-points": "" });
    svg.append(truthPath, fittedPath, pointsGroup);

    const metricsRegion = createElement(document, "div", { "aria-label": "Regression metrics" });
    const makeMetric = (label, key) => {
      const card = createElement(document, "section", { "data-metric-card": key });
      card.append(
        createElement(document, "h3", {}, label),
        createElement(document, "p", { "data-metric": key, "aria-live": "polite" })
      );
      metricsRegion.appendChild(card);
      return card.children[1];
    };
    const r2 = makeMetric("R²", "r2");
    const trainMse = makeMetric("Train MSE", "train-mse");
    const validationMse = makeMetric("Validation MSE", "validation-mse");
    const diagnosis = createElement(document, "p", {
      "data-testid": "diagnosis",
      "aria-live": "polite"
    });
    const explanationSection = createElement(document, "section");
    explanationSection.append(
      createElement(document, "h3", {}, "What changed and why?"),
      createElement(document, "p", { "data-explanation": "" })
    );
    const challenge = createElement(document, "p", {
      role: "status",
      "data-challenge-status": ""
    });
    const challengePrompt = createElement(
      document,
      "p",
      { "data-challenge-prompt": "" },
      spec.challenge?.prompt ?? "Regression challenge"
    );
    summaryNode = createElement(document, "p", {
      class: "visually-hidden",
      "data-chart-summary": ""
    });

    view = {
      truthPath,
      fittedPath,
      pointsGroup,
      r2,
      trainMse,
      validationMse,
      diagnosis,
      explanation: explanationSection.children[1],
      challenge,
      challengeSuccess: spec.challenge?.success ?? null,
      summaryPrefix: spec.accessibility?.canvasSummary ?? "Regression chart"
    };
    mountedRoot.append(
      controlsRegion,
      actions,
      keyboardHelp,
      svg,
      metricsRegion,
      diagnosis,
      explanationSection,
      challengePrompt,
      challenge,
      summaryNode
    );
    container.appendChild(mountedRoot);
    reset();
  }

  return {
    mount,
    update,
    reset,
    getAccessibleSummary() {
      return root && summaryNode ? summaryNode.textContent : "";
    },
    destroy: teardown
  };
}
