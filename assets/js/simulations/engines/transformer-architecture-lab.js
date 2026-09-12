// TransformerArchitectureLab: Self-Attention Mathematics, Causal Masking,
// Multi-Head Projections, Vision Transformers (ViT), and Autoregressive Generation.

function make(doc, tag, className = "", text = "") {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

export function evaluateTransformerArch(state, challenge = {}) {
  const mode = state.mode || "attention_masking"; // attention_masking | multi_head | vision_vit | text_generation

  if (mode === "multi_head") {
    const embedDim = Number(state.embedDim || 128);
    const numHeads = Number(state.numHeads || 4);
    const seqLen = Number(state.seqLen || 60);

    const headDim = Math.floor(embedDim / numHeads);
    const isCleanDivision = (embedDim % numHeads) === 0;

    // Parameters: Q, K, V dense layers + combine_heads output dense layer
    // Each projection is embedDim * embedDim + biases
    const qkvParams = 3 * (embedDim * embedDim + embedDim);
    const outProjParams = embedDim * embedDim + embedDim;
    const totalMhaParams = qkvParams + outProjParams;

    const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
    const explanation = `Multi-Head Attention splits ${embedDim}-dim embedding across ${numHeads} heads (${headDim} dims per head). Computes ${numHeads} parallel attention projections with ${totalMhaParams.toLocaleString()} trainable parameters.`;

    return {
      mode,
      valid: isCleanDivision,
      embedDim,
      numHeads,
      headDim,
      seqLen,
      totalMhaParams,
      challengeComplete,
      explanation
    };
  }

  if (mode === "vision_vit") {
    const imageSize = Number(state.imageSize || 224);
    const patchSize = Number(state.patchSize || 16);
    const embedDim = Number(state.embedDim || 128);

    const patchesPerSide = Math.floor(imageSize / patchSize);
    const numPatches = patchesPerSide * patchesPerSide;
    const patchPixels = patchSize * patchSize * 3; // RGB
    const patchProjectionParams = (patchPixels + 1) * embedDim;

    const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
    const explanation = `Vision Transformer divides ${imageSize}x${imageSize} image into ${numPatches} non-overlapping patches of ${patchSize}x${patchSize}. Each patch is linearly projected into a ${embedDim}-dim token, yielding a sequence of ${numPatches} tokens for Transformer Encoder blocks.`;

    return {
      mode,
      valid: true,
      imageSize,
      patchSize,
      numPatches,
      patchPixels,
      patchProjectionParams,
      challengeComplete,
      explanation
    };
  }

  if (mode === "text_generation") {
    const temperature = Number(state.temperature || 0.7);
    const topK = Number(state.topK || 4);
    const prompt = state.prompt || "The artificial intelligence model";

    // Vocabulary tokens with raw logits
    const candidates = [
      { token: "predicts", logit: 3.2 },
      { token: "generates", logit: 2.8 },
      { token: "learns", logit: 2.4 },
      { token: "adapts", logit: 1.6 },
      { token: "hallucinates", logit: 0.5 },
      { token: "pineapple", logit: -1.2 }
    ];

    // Scale by temperature and compute softmax probabilities
    const scaledLogits = candidates.map(c => c.logit / Math.max(0.1, temperature));
    const maxLogit = Math.max(...scaledLogits);
    const exps = scaledLogits.map(s => Math.exp(s - maxLogit));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    const probabilities = candidates.map((c, i) => ({
      token: c.token,
      prob: exps[i] / sumExp
    }));

    const entropy = temperature < 0.4 ? "Low (Greedy / Deterministic)" : temperature > 1.0 ? "High (Creative / Random)" : "Balanced";
    const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));
    const explanation = `At temperature T=${temperature.toFixed(1)}, token distribution entropy is ${entropy}. Lower temperatures concentrate probability on top candidates ("${probabilities[0].token}"), while higher temperatures flatten the distribution.`;

    return {
      mode,
      valid: true,
      temperature,
      topK,
      probabilities,
      entropy,
      challengeComplete,
      explanation
    };
  }

  // Default mode: attention_masking
  const blockType = state.blockType || "decoder"; // encoder | decoder
  const maskType = state.maskType || "causal"; // none | causal | padding
  const dModel = Number(state.dModel || 64);

  const tokens = ["Start", "Machine", "Learning", "Predicts", "End"];
  const n = tokens.length;
  const scaleFactor = Math.sqrt(dModel);

  // Compute 5x5 attention scores
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      if (maskType === "causal" && j > i) {
        row.push(0); // Masked future token
      } else {
        const rawScore = 2.0 - Math.abs(i - j) * 0.4;
        row.push(Number((rawScore / scaleFactor).toFixed(2)));
      }
    }
    // Row softmax normalization
    const maxVal = Math.max(...row);
    const exps = row.map((v, j) => (maskType === "causal" && j > i) ? 0 : Math.exp(v - maxVal));
    const sum = exps.reduce((a, b) => a + b, 0) || 1;
    matrix.push(exps.map(e => Number((e / sum).toFixed(2))));
  }

  const isCausalValid = blockType === "decoder" ? maskType === "causal" : true;
  const challengeComplete = Object.entries(challenge).every(([k, v]) => String(state[k]) === String(v));

  let explanation = `Self-Attention scaled by sqrt(d_k)=${scaleFactor.toFixed(1)}. `;
  if (blockType === "decoder" && maskType === "causal") {
    explanation += `Causal Look-Ahead Mask sets future positions (j > i) to -inf before softmax, ensuring autoregressive generation cannot look ahead.`;
  } else if (blockType === "decoder" && maskType === "none") {
    explanation += `WARNING: Without causal masking in the Decoder, future tokens leak into past representations, violating autoregressive generation!`;
  } else {
    explanation += `Transformer Encoder applies bidirectional self-attention across all tokens simultaneously.`;
  }

  return {
    mode,
    valid: isCausalValid,
    blockType,
    maskType,
    dModel,
    scaleFactor,
    tokens,
    matrix,
    challengeComplete,
    explanation
  };
}

export function createEngine() {
  let root = null;
  let spec = null;
  let state = null;
  let inputs = null;
  let output = null;
  let summary = "";

  function render() {
    if (!root) return;
    const result = evaluateTransformerArch(state, spec.challenge?.success || {});
    const doc = root.ownerDocument;

    output.status.textContent = result.challengeComplete ? "Challenge complete!" : result.valid ? "Configuration Valid" : "Configuration Warning";
    output.status.dataset.valid = String(result.challengeComplete);

    output.diagram.replaceChildren();

    if (result.mode === "multi_head") {
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">Embedding Dim:</span> <strong>${result.embedDim}</strong></div>
        <div class="metric-card"><span class="label">Attention Heads:</span> <strong>${result.numHeads}</strong></div>
        <div class="metric-card"><span class="label">Per-Head Dim:</span> <strong>${result.headDim}</strong></div>
        <div class="metric-card"><span class="label">MHA Parameters:</span> <strong>${result.totalMhaParams.toLocaleString()}</strong></div>
      `;

      const mhaContainer = make(doc, "div", "mha-split-diagram");
      let headBoxes = "";
      for (let h = 0; h < result.numHeads; h++) {
        headBoxes += `<div style="padding:8px; background:#e0e7ff; border:1px solid #4f46e5; border-radius:4px; font-size:10px; text-align:center;">Head ${h+1}<br>(${result.headDim} dims)</div>`;
      }
      mhaContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px; padding:12px; background:var(--paper); border:1px solid var(--line);">
          <div style="text-align:center; font-weight:bold; font-size:11px;">Input: (batch, seq_len=${result.seqLen}, embed_dim=${result.embedDim})</div>
          <div style="text-align:center; color:#555;">&darr; Linear Projections (W_q, W_k, W_v) & Reshape</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(80px, 1fr)); gap:6px;">${headBoxes}</div>
          <div style="text-align:center; color:#555;">&darr; Scaled Dot-Product & Concatenate</div>
          <div style="text-align:center; font-weight:bold; font-size:11px;">Combine Heads Dense(${result.embedDim}) &rarr; Output (${result.seqLen}, ${result.embedDim})</div>
        </div>
      `;
      output.diagram.append(mhaContainer);
    } else if (result.mode === "vision_vit") {
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">Image Resolution:</span> <strong>${result.imageSize}x${result.imageSize}</strong></div>
        <div class="metric-card"><span class="label">Patch Size:</span> <strong>${result.patchSize}x${result.patchSize}</strong></div>
        <div class="metric-card"><span class="label">Token Patches:</span> <strong>${result.numPatches} tokens</strong></div>
        <div class="metric-card"><span class="label">Patch Projection:</span> <strong>${result.patchProjectionParams.toLocaleString()} params</strong></div>
      `;

      const vitBox = make(doc, "div", "vit-patch-view");
      vitBox.innerHTML = `
        <div style="display:flex; gap:16px; align-items:center; justify-content:center; flex-wrap:wrap; padding:14px; background:var(--paper); border:1px solid var(--line);">
          <div style="width:100px; height:100px; display:grid; grid-template-columns:repeat(4, 1fr); gap:1px; background:#ccc; padding:1px;">
            ${Array.from({length: 16}).map((_, i) => `<div style="background:#0f62fe; opacity:${0.3 + (i%5)*0.15}; font-size:7px; color:#fff; display:grid; place-items:center;">P${i+1}</div>`).join('')}
          </div>
          <div style="font-weight:bold; font-size:16px;">&rarr; Flatten & Linear &rarr;</div>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:10px;">
            <span class="badge" style="background:#24a148; color:#fff; padding:4px 8px; border-radius:4px;">[CLS] Token + 196 Patch Tokens</span>
            <span class="badge" style="background:#8a3ffc; color:#fff; padding:4px 8px; border-radius:4px;">+ Learnable 1D Position Embeddings</span>
            <span class="badge" style="background:#0043ce; color:#fff; padding:4px 8px; border-radius:4px;">&rarr; Stacked Transformer Encoders &rarr; MLP Head</span>
          </div>
        </div>
      `;
      output.diagram.append(vitBox);
    } else if (result.mode === "text_generation") {
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">Temperature:</span> <strong>${result.temperature.toFixed(1)}</strong></div>
        <div class="metric-card"><span class="label">Entropy State:</span> <strong>${result.entropy.split(' ')[0]}</strong></div>
        <div class="metric-card"><span class="label">Top Candidate:</span> <strong>${result.probabilities[0].token} (${(result.probabilities[0].prob * 100).toFixed(0)}%)</strong></div>
        <div class="metric-card"><span class="label">Top-4 Cumulative:</span> <strong>${(result.probabilities.slice(0, 4).reduce((a, b) => a + b.prob, 0) * 100).toFixed(0)}%</strong></div>
      `;

      const genBox = make(doc, "div", "text-gen-prob-view");
      const bars = result.probabilities.map(p => `
        <div style="display:flex; align-items:center; gap:8px; font-size:10px; margin-bottom:4px;">
          <span style="width:90px; text-align:right; font-family:'DM Mono', monospace;">${p.token}:</span>
          <div style="flex:1; background:#e0e0e0; height:14px; border-radius:2px; overflow:hidden;">
            <div style="width:${(p.prob * 100).toFixed(1)}%; background:#0f62fe; height:100%;"></div>
          </div>
          <span style="width:45px; font-size:9px;">${(p.prob * 100).toFixed(1)}%</span>
        </div>
      `).join('');

      genBox.innerHTML = `
        <div style="padding:14px; background:var(--paper); border:1px solid var(--line);">
          <div style="font-weight:bold; margin-bottom:10px; font-size:11px;">Autoregressive Next-Token Probability Distribution:</div>
          ${bars}
        </div>
      `;
      output.diagram.append(genBox);
    } else {
      // Default: attention_masking
      output.metrics.innerHTML = `
        <div class="metric-card"><span class="label">Block Type:</span> <strong>${result.blockType.toUpperCase()}</strong></div>
        <div class="metric-card"><span class="label">Masking Mode:</span> <strong>${result.maskType.toUpperCase()}</strong></div>
        <div class="metric-card"><span class="label">Scaling Factor:</span> <strong>sqrt(${result.dModel}) = ${result.scaleFactor.toFixed(1)}</strong></div>
        <div class="metric-card"><span class="label">Autoregressive Safe:</span> <strong style="color:${result.valid ? '#24a148' : '#da1e28'}">${result.valid ? "Yes" : "Information Leak"}</strong></div>
      `;

      // Draw SVG attention matrix heatmap
      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 320 200");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "200");
      svg.style.background = "#fff";
      svg.style.borderRadius = "4px";
      svg.style.border = "1px solid #e0e0e0";

      let cells = "";
      const tokens = result.tokens;
      const cellDim = 28;
      const startX = 90, startY = 35;

      for (let i = 0; i < tokens.length; i++) {
        cells += `<text x="${startX - 6}" y="${startY + i * cellDim + 18}" font-size="9" text-anchor="end" fill="#525252">${tokens[i]}</text>`;
        cells += `<text x="${startX + i * cellDim + 14}" y="${startY - 6}" font-size="9" text-anchor="middle" fill="#525252">${tokens[i]}</text>`;

        for (let j = 0; j < tokens.length; j++) {
          const val = result.matrix[i][j];
          const isMasked = result.maskType === "causal" && j > i;
          const fill = isMasked ? "#f4f4f4" : "#0f62fe";
          const opacity = isMasked ? 0.3 : Math.max(0.1, val);
          cells += `
            <rect x="${startX + j * cellDim}" y="${startY + i * cellDim}" width="${cellDim - 2}" height="${cellDim - 2}" fill="${fill}" fill-opacity="${opacity}" rx="2"/>
            <text x="${startX + j * cellDim + 13}" y="${startY + i * cellDim + 17}" font-size="8" text-anchor="middle" fill="${isMasked ? '#999' : '#fff'}" font-weight="bold">${isMasked ? '0' : val.toFixed(2)}</text>
          `;
        }
      }

      svg.innerHTML = `
        <text x="15" y="18" font-size="10" font-weight="bold" fill="#0f62fe">Attention Softmax Weights (Row: Query, Col: Key)</text>
        ${cells}
      `;
      output.diagram.append(svg);
    }

    output.explanation.textContent = result.explanation;
    output.challenge.textContent = result.challengeComplete
      ? "Challenge complete: configuration matches the target design."
      : "Challenge in progress: adjust controls to satisfy the challenge.";

    summary = `${output.status.textContent}. ${result.explanation} ${output.challenge.textContent}`;
  }

  return {
    mount(container, lessonSpec) {
      if (!container?.ownerDocument || !lessonSpec?.controls) throw new TypeError("DOM container and LessonSpec required.");
      if (root) this.destroy();
      spec = lessonSpec;
      state = Object.fromEntries(spec.controls.map((c) => [c.id, String(c.default)]));
      inputs = {};
      const doc = container.ownerDocument;

      root = make(doc, "div", "transformer-architecture-lab lab-container");
      root.setAttribute("data-transformer-architecture-lab", "");

      const note = make(doc, "p", "lab-note", "Transformer Architecture Lab — inspect Self-Attention mechanisms, Causal Look-Ahead masks, Multi-Head splitting, and Vision Transformer patch representations.");
      root.append(note);

      const controlsWrapper = make(doc, "div", "controls-panel");
      for (const control of spec.controls) {
        const group = make(doc, "div", "control-group");
        const label = make(doc, "label", "", control.label);
        const id = `trans-arch-${control.id}`;
        label.setAttribute("for", id);
        let input;

        if (control.type === "select") {
          input = make(doc, "select");
          input.id = id;
          input.setAttribute("data-control", control.id);
          for (const opt of control.options) {
            const optEl = make(doc, "option", "", opt.label);
            optEl.value = opt.value;
            if (String(opt.value) === String(control.default)) optEl.selected = true;
            input.append(optEl);
          }
        } else {
          input = make(doc, "input");
          input.id = id;
          input.type = control.type;
          input.setAttribute("data-control", control.id);
          if (control.min !== undefined) input.min = String(control.min);
          if (control.max !== undefined) input.max = String(control.max);
          if (control.step !== undefined) input.step = String(control.step);
          input.value = String(control.default);
        }

        input.addEventListener("input", (e) => {
          state[control.id] = e.target.value;
          render();
        });

        inputs[control.id] = input;
        group.append(label, input);
        controlsWrapper.append(group);
      }
      root.append(controlsWrapper);

      const display = make(doc, "div", "trans-arch-display");
      const status = make(doc, "div", "trans-arch-status");
      const metrics = make(doc, "div", "trans-arch-metrics metrics-row");
      const diagram = make(doc, "div", "trans-arch-diagram chart-wrapper");
      const explanation = make(doc, "p", "trans-arch-explanation");
      const challenge = make(doc, "div", "trans-arch-challenge");

      display.append(status, metrics, diagram, explanation, challenge);
      root.append(display);

      output = { status, metrics, diagram, explanation, challenge };
      container.append(root);
      render();
    },
    update() {
      render();
    },
    reset() {
      if (!spec) return;
      for (const c of spec.controls) {
        state[c.id] = String(c.default);
        if (inputs[c.id]) inputs[c.id].value = String(c.default);
      }
      render();
    },
    getAccessibleSummary() {
      return summary || "Interactive Transformer Architecture Workbench.";
    },
    destroy() {
      if (root) {
        root.replaceChildren();
        root.remove();
      }
      root = null;
      spec = null;
      state = null;
      inputs = null;
      output = null;
    }
  };
}

