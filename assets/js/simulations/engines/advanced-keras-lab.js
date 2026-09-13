// AdvancedKerasLab: Interactive simulation of Advanced Keras Techniques
// Models custom training loops with GradientTape, custom layer subclassing with build()/call(),
// custom callbacks with on_epoch_end(), and mixed precision training policies.

export function evaluateAdvancedKeras(state = {}, challenge = {}) {
  const technique = state.technique || "custom_layer";
  const units = parseInt(state.custom_layer_units ?? 64, 10);
  const precision = state.precision_policy || "mixed_float16";
  const callbackAction = state.callback_action || "log_metrics";

  // Simulated metrics
  const inputDim = 784; // MNIST 28x28 flattened
  const layerWeights = inputDim * units;
  const layerBiases = units;
  const trainableParams = layerWeights + layerBiases;

  const isMixedPrecision = precision === "mixed_float16";
  const memoryMultiplier = isMixedPrecision ? 0.55 : 1.0;
  const throughputMultiplier = isMixedPrecision ? 1.95 : 1.0;

  let baseMemoryMb = 48.0;
  let baseThroughput = 420;

  if (technique === "custom_loop") {
    baseThroughput *= 1.15; // C++ graph optimization or custom unrolled tape
  } else if (technique === "custom_layer") {
    baseMemoryMb += (units / 64) * 3.2;
  } else if (technique === "custom_callback") {
    baseThroughput *= 0.98; // Minor callback overhead
  }

  const memoryFootprintMb = (baseMemoryMb * memoryMultiplier).toFixed(1);
  const throughputFps = Math.round(baseThroughput * throughputMultiplier);

  let status = "Operational";
  let diagnosis = "";
  let codeSnippet = "";

  switch (technique) {
    case "custom_layer":
      status = `Custom Layer (${units} units, ${precision})`;
      diagnosis = `CustomDenseLayer subclassed from tf.keras.layers.Layer: Allocates ${layerWeights} weights and ${layerBiases} biases in build(${inputDim}) with trainable=True. Forward pass in call() executes tf.matmul(inputs, w) + b.`;
      codeSnippet = `class CustomDenseLayer(tf.keras.layers.Layer):
    def __init__(self, units=${units}):
        super().__init__()
        self.units = units
    def build(self, input_shape):
        self.w = self.add_weight(shape=(input_shape[-1], self.units), initializer='random_normal', trainable=True)
        self.b = self.add_weight(shape=(self.units,), initializer='zeros', trainable=True)
    def call(self, inputs):
        return tf.matmul(inputs, self.w) + self.b`;
      break;
    case "custom_loop":
      status = `GradientTape Training Loop (${precision})`;
      diagnosis = `Eager execution loop records tensor operations in GradientTape, differentiates with tape.gradient(loss, model.trainable_weights), and executes optimizer.apply_gradients().`;
      codeSnippet = `for epoch in range(epochs):
    for x_batch, y_batch in train_dataset:
        with tf.GradientTape() as tape:
            logits = model(x_batch, training=True)
            loss = loss_fn(y_batch, logits)
        grads = tape.gradient(loss, model.trainable_weights)
        optimizer.apply_gradients(zip(grads, model.trainable_weights))`;
      break;
    case "custom_callback":
      status = `Custom Callback Hook (${callbackAction})`;
      diagnosis = `Custom callback inheriting from tf.keras.callbacks.Callback overrides lifecycle methods (e.g. on_epoch_end) to extract internal logs and dispatch notifications.`;
      codeSnippet = `class CustomCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        print(f"End of epoch {epoch}: loss={logs.get('loss')}, acc={logs.get('accuracy')}")`;
      break;
    case "mixed_precision":
      status = `Mixed Precision Policy (${precision})`;
      diagnosis = isMixedPrecision
        ? "Global policy 'mixed_float16': Matrix multiplications run in float16 for 2x memory bandwidth and compute speedup; loss scaling and master weight updates remain in float32."
        : "Standard 'float32' policy: Full 32-bit precision across all activations, gradients, and model parameters.";
      codeSnippet = `from tensorflow.keras import mixed_precision
policy = mixed_precision.Policy('${precision}')
mixed_precision.set_global_policy(policy)`;
      break;
  }

  const challengeComplete = Object.entries(challenge).length > 0 &&
    Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  return {
    technique,
    units,
    precision,
    callbackAction,
    trainableParams,
    memoryFootprintMb,
    throughputFps,
    isMixedPrecision,
    status,
    diagnosis,
    codeSnippet,
    challengeComplete
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = {};

  function renderVisualSVG(res) {
    const width = 560, height = 210;

    const pillars = [
      { id: "custom_loop", label: "1. Custom Loop", sub: "tf.GradientTape", x: 20, y: 35, w: 120, h: 100 },
      { id: "custom_layer", label: "2. Custom Layer", sub: "build() & call()", x: 155, y: 35, w: 120, h: 100 },
      { id: "custom_callback", label: "3. Callback Hook", sub: "on_epoch_end()", x: 290, y: 35, w: 120, h: 100 },
      { id: "mixed_precision", label: "4. Mixed Precision", sub: "FP16 / FP32", x: 425, y: 35, w: 120, h: 100 }
    ];

    const cards = pillars.map(p => {
      const active = res.technique === p.id;
      const stroke = active ? "#0969da" : "var(--line, #d0d7de)";
      const bg = active ? "#ddf4ff" : "#ffffff";
      const textColor = active ? "#0969da" : "var(--ink, #1f2328)";

      return `
        <g class="pillar-node" style="cursor: pointer;">
          <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="${active ? 2.5 : 1}"/>
          <text x="${p.x + p.w / 2}" y="${p.y + 24}" text-anchor="middle" fill="${textColor}" font-size="11" font-weight="bold">${p.label}</text>
          <text x="${p.x + p.w / 2}" y="${p.y + 42}" text-anchor="middle" fill="var(--muted, #656d76)" font-size="9">${p.sub}</text>
          
          ${p.id === "custom_layer" ? `
            <rect x="${p.x + 12}" y="${p.y + 54}" width="${p.w - 24}" height="18" rx="3" fill="#eaeef2"/>
            <text x="${p.x + p.w / 2}" y="${p.y + 66}" text-anchor="middle" fill="#24292f" font-size="8">${res.units} Units [${res.trainableParams}p]</text>
          ` : ""}

          ${p.id === "mixed_precision" ? `
            <rect x="${p.x + 12}" y="${p.y + 54}" width="${p.w - 24}" height="18" rx="3" fill="${res.isMixedPrecision ? '#dafbe1' : '#eaeef2'}"/>
            <text x="${p.x + p.w / 2}" y="${p.y + 66}" text-anchor="middle" fill="${res.isMixedPrecision ? '#1a7f37' : '#24292f'}" font-size="8">${res.precision}</text>
          ` : ""}

          ${p.id === "custom_loop" ? `
            <rect x="${p.x + 12}" y="${p.y + 54}" width="${p.w - 24}" height="18" rx="3" fill="#eaeef2"/>
            <text x="${p.x + p.w / 2}" y="${p.y + 66}" text-anchor="middle" fill="#24292f" font-size="8">Forward + Backprop</text>
          ` : ""}

          ${p.id === "custom_callback" ? `
            <rect x="${p.x + 12}" y="${p.y + 54}" width="${p.w - 24}" height="18" rx="3" fill="#eaeef2"/>
            <text x="${p.x + p.w / 2}" y="${p.y + 66}" text-anchor="middle" fill="#24292f" font-size="8">${res.callbackAction}</text>
          ` : ""}

          <circle cx="${p.x + p.w / 2}" cy="${p.y + 84}" r="4" fill="${active ? '#0969da' : '#8c959f'}"/>
        </g>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" class="advanced-keras-svg" role="img" aria-label="Advanced Keras Techniques Architecture" style="width: 100%; max-width: 100%; height: auto; display: block;">
        <rect width="${width}" height="${height}" fill="var(--color-surface, #f6f8fa)" rx="6"/>
        <text x="20" y="22" fill="var(--ink, #1f2328)" font-size="11" font-weight="bold">Advanced Keras Architectural Pillars</text>
        ${cards}
        
        <!-- Bottom Summary Bar -->
        <rect x="20" y="150" width="525" height="46" rx="5" fill="#ffffff" stroke="var(--line, #d0d7de)"/>
        <text x="32" y="168" fill="var(--ink, #1f2328)" font-size="9" font-weight="bold">Active Configuration:</text>
        <text x="145" y="168" fill="#0969da" font-size="9">${res.status}</text>
        <text x="32" y="184" fill="var(--muted, #656d76)" font-size="8">Throughput: ~${res.throughputFps} samples/s | VRAM Footprint: ~${res.memoryFootprintMb} MB | Trainable Params: ${res.trainableParams.toLocaleString()}</text>
      </svg>
    `;
  }

  function updateView() {
    if (!root || !spec) return;
    const res = evaluateAdvancedKeras(state, spec?.challenge?.success);

    const chart = root.querySelector("[data-chart-container]");
    if (chart) chart.innerHTML = renderVisualSVG(res);

    const statusElem = root.querySelector("[data-metric='status']");
    if (statusElem) statusElem.textContent = res.status;

    const memElem = root.querySelector("[data-metric='memory']");
    if (memElem) memElem.textContent = `${res.memoryFootprintMb} MB`;

    const throughputElem = root.querySelector("[data-metric='throughput']");
    if (throughputElem) throughputElem.textContent = `${res.throughputFps} fps`;

    const paramsElem = root.querySelector("[data-metric='params']");
    if (paramsElem) paramsElem.textContent = res.trainableParams.toLocaleString();

    const diagnosisElem = root.querySelector("[data-metric='diagnosis']");
    if (diagnosisElem) diagnosisElem.textContent = res.diagnosis;

    const codeElem = root.querySelector("[data-code-preview]");
    if (codeElem) codeElem.textContent = res.codeSnippet;

    const challengeElem = root.querySelector("[data-testid='challenge-status']");
    if (challengeElem && spec?.challenge) {
      challengeElem.textContent = res.challengeComplete
        ? `Challenge complete: ${spec.challenge.prompt}`
        : `Challenge in progress: ${spec.challenge.prompt}`;
      challengeElem.dataset.success = String(res.challengeComplete);
    }
  }

  function notifyChange() {
    if (root && typeof root.dispatchEvent === "function") {
      try {
        const evt = typeof Event === "function"
          ? new Event("change", { bubbles: true })
          : { type: "change", bubbles: true };
        root.dispatchEvent(evt);
      } catch (_) {}
    }
  }

  function applyControls(candidate = {}) {
    if (!candidate || typeof candidate !== "object") return;
    for (const [k, v] of Object.entries(candidate)) {
      state[k] = v;
      const input = root?.querySelector(`[data-control="${k}"]`);
      if (input) input.value = v;
    }
    updateView();
  }

  return {
    mount(container, lessonSpec) {
      root = container;
      spec = lessonSpec;
      state = {};
      for (const ctrl of spec.controls) state[ctrl.id] = ctrl.default;

      root.innerHTML = `
        <div data-advanced-keras-lab class="lab-container" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
          <div class="metrics-row" style="min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Pillar:</span> <strong data-metric="status">Custom Layer</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Memory (Modeled):</span> <strong data-metric="memory">28.4 MB</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Throughput (Modeled):</span> <strong data-metric="throughput">840 fps</strong></div>
            <div class="metric-card" style="min-width: 0; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;"><span class="label">Layer Params:</span> <strong data-metric="params">50,240</strong></div>
          </div>
          ${spec.presets && spec.presets.length > 0 ? `
            <div class="presets-row" style="display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; max-width: 100%; box-sizing: border-box;">
              ${spec.presets.map(p => `
                <button type="button" class="preset-btn" data-preset-id="${p.id}" style="min-height: 36px; padding: 8px 12px; color: var(--ink); background: var(--surface); border: 1px solid var(--line); font-size: 10px; font-weight: 600; cursor: pointer; max-width: 100%; white-space: normal; text-align: center;">
                  ${p.label}
                </button>
              `).join("")}
            </div>
          ` : ""}
          <div data-chart-container class="chart-wrapper" style="min-width: 0; max-width: 100%; box-sizing: border-box; overflow-x: auto;"></div>
          <div style="margin-top: 8px; padding: 10px 12px; background: #f6f8fa; border: 1px solid var(--line, #d0d7de); border-radius: 4px; font-size: 11px; line-height: 1.5; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
            <strong>Architectural Insight:</strong> <span data-metric="diagnosis"></span>
          </div>
          <div style="margin-top: 8px; min-width: 0; max-width: 100%; box-sizing: border-box;">
            <div style="font-size: 10px; font-weight: bold; color: var(--muted, #656d76); margin-bottom: 4px;">TensorFlow / Keras Implementation Code:</div>
            <pre style="margin: 0; padding: 10px 12px; background: #24292e; color: #f6f8fa; font-family: monospace; font-size: 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; min-width: 0; max-width: 100%; box-sizing: border-box;"><code data-code-preview></code></pre>
          </div>
          <div class="controls-panel" style="margin-top: 8px; min-width: 0; max-width: 100%; box-sizing: border-box;">
            ${spec.controls.map(c => `
              <div class="control-group">
                <label for="ctrl-${c.id}">${c.label}</label>
                ${c.type === "select" ? `
                  <select id="ctrl-${c.id}" data-control="${c.id}">
                    ${c.options.map(o => `<option value="${o.value}" ${String(o.value) === String(c.default) ? "selected" : ""}>${o.label}</option>`).join("")}
                  </select>
                ` : `
                  <input type="${c.type}" id="ctrl-${c.id}" data-control="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.default}">
                `}
              </div>
            `).join("")}
          </div>
          <div class="simulation-disclosure" data-simulation-disclosure style="margin-top: 8px; padding: 6px 10px; background: #fff8c5; border: 1px solid #d4a72c; border-radius: 4px; font-size: 9.5px; color: #744500; line-height: 1.4; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
            <strong>Notice:</strong> Illustrative simulation — no network is trained and values are not measured benchmarks.
          </div>
          ${spec.challenge ? `
            <div class="challenge-status" data-testid="challenge-status" style="margin-top: 8px; padding: 12px 14px; background: #eef1ec; border-left: 3px solid var(--accent); font-size: 10px; line-height: 1.6; min-width: 0; max-width: 100%; box-sizing: border-box; overflow-wrap: anywhere; word-break: break-word;">
              Challenge in progress: ${spec.challenge.prompt}
            </div>
          ` : ""}
        </div>
      `;

      root.querySelectorAll("[data-control]").forEach(input => {
        const handler = (e) => {
          state[e.target.dataset.control] = e.target.value;
          updateView();
        };
        input.addEventListener("input", handler);
        input.addEventListener("change", handler);
      });

      root.querySelectorAll("[data-preset-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const presetId = btn.dataset.presetId;
          const preset = spec.presets.find(p => p.id === presetId);
          if (preset?.values) {
            applyControls(preset.values);
            notifyChange();
          }
        });
      });

      updateView();
    },
    update(candidate = {}) {
      applyControls(candidate);
      notifyChange();
    },
    reset() {
      if (!spec) return;
      for (const ctrl of spec.controls) {
        state[ctrl.id] = ctrl.default;
        const input = root?.querySelector(`[data-control="${ctrl.id}"]`);
        if (input) input.value = ctrl.default;
      }
      updateView();
      notifyChange();
    },
    getAccessibleSummary() {
      if (!spec) return "Interactive Advanced Keras Techniques Simulator.";
      const res = evaluateAdvancedKeras(state, spec?.challenge?.success);
      return `Advanced Keras simulation: Technique ${res.technique}, ${res.status}. Memory footprint: ${res.memoryFootprintMb} MB, Throughput: ${res.throughputFps} samples/s. ${res.diagnosis}`;
    },
    destroy() {
      if (root) root.innerHTML = "";
      root = null;
      spec = null;
      state = {};
    }
  };
}
