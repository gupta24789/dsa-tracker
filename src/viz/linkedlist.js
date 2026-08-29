// ── Viz type: linkedlist (SVG node-edge diagram, unified like tree/graph) ────
// Single-chain spec:
//   spec.nodes     — array of node values  e.g. [1, 2, 3, 4, 5]
//   spec.cycleBack — (optional) index the last node points back to (curved arrow)
//
// Per-step (single chain):
//   step.nodes     — override node values for this step
//   step.highlight — [0, 2] node indices to tint blue
//   step.active    — single node index, bright accent
//   step.pointers  — { S:0, F:2 } pointer badges drawn under nodes
//   step.arrows    — { "0": "back" } override the arrow AFTER node i:
//                    "forward" (default →), "back" (←, flipped link),
//                    "none" (severed, ∅). Lets reversal/rewiring show the
//                    .next pointer actually changing direction.
//   step.cycleBack — override cycleBack for this step
//
// Multi-list spec (two or more chains stacked), for merge / intersection:
//   step.lists (or spec.lists) — [ { label, nodes, highlight, active,
//                                    pointers, arrows, cycleBack }, ... ]
//
// Shared per-step: step.label, step.note
window.VizLinkedList = {
  R: 24,
  SPACING: 92,

  _row(cfg, rowIdx) {
    const R = this.R, SPACING = this.SPACING;
    const nodes      = cfg.nodes     || [];
    const highlights = cfg.highlight || [];
    const active     = cfg.active;
    const pointers    = cfg.pointers  || {};
    const arrows      = cfg.arrows    || {};
    const cycleBack   = cfg.cycleBack;
    const n            = nodes.length;

    if (!n) {
      return `
        <div class="viz-ll-line">
          ${cfg.label ? `<div class="viz-ll-row-label">${cfg.label}</div>` : ''}
          <div class="viz-ll-empty-row">∅ empty</div>
        </div>`;
    }

    const nodeX = i => 50 + i * SPACING;
    const rowY   = 46;
    const ptrY0  = rowY + R + 22;
    const SVG_W  = nodeX(n - 1) + 60;
    const SVG_H  = 118;

    // Map node index → pointer names at that index
    const nodePointers = {};
    Object.entries(pointers).forEach(([name, idx]) => {
      if (!nodePointers[idx]) nodePointers[idx] = [];
      nodePointers[idx].push(name);
    });

    const uid = `ll${rowIdx}`; // unique marker id suffix so multiple rows don't collide

    let defsHTML = `
      <marker id="${uid}-fwd" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" class="viz-ll-marker-fwd" />
      </marker>
      <marker id="${uid}-back" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" class="viz-ll-marker-back" />
      </marker>
      <marker id="${uid}-cycle" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" class="viz-ll-marker-cycle" />
      </marker>`;

    // ── Edges between consecutive nodes ──
    let edgesHTML = '';
    for (let i = 0; i < n - 1; i++) {
      const dir = arrows[i] || 'forward';
      const x1 = nodeX(i), x2 = nodeX(i + 1);

      if (dir === 'none') {
        edgesHTML += `<text x="${x1 + R + 10}" y="${rowY + 4}" class="viz-ll-null-text">∅</text>`;
        continue;
      }
      if (dir === 'back') {
        edgesHTML += `<line x1="${x2 - R}" y1="${rowY}" x2="${x1 + R}" y2="${rowY}"
          class="viz-ll-edge viz-ll-edge-back" marker-end="url(#${uid}-back)" />`;
      } else {
        edgesHTML += `<line x1="${x1 + R}" y1="${rowY}" x2="${x2 - R}" y2="${rowY}"
          class="viz-ll-edge viz-ll-edge-fwd" marker-end="url(#${uid}-fwd)" />`;
      }
    }

    // ── Tail: null terminator or cycle-back curve ──
    const lastIdx  = n - 1;
    const lastDir  = arrows[lastIdx];
    const lastX    = nodeX(lastIdx);
    if (cycleBack !== undefined && lastDir !== 'none') {
      const targetX = nodeX(cycleBack);
      const dipY = rowY + 58;
      edgesHTML += `<path d="M ${lastX} ${rowY + R} C ${lastX} ${dipY}, ${targetX} ${dipY}, ${targetX} ${rowY + R}"
        class="viz-ll-edge viz-ll-edge-cycle" marker-end="url(#${uid}-cycle)" />`;
    } else if (lastDir !== 'back') {
      edgesHTML += `<text x="${lastX + R + 10}" y="${rowY + 4}" class="viz-ll-null-text">∅</text>`;
    }

    // ── Nodes ──
    let nodesHTML = '';
    nodes.forEach((val, i) => {
      const x = nodeX(i);
      const isHL  = highlights.includes(i);
      const isAct = active === i;
      let cls = 'viz-ll-node';
      if (isAct)      cls += ' viz-ll-node-active';
      else if (isHL)  cls += ' viz-ll-node-hl';

      nodesHTML += `
        <g class="${cls}">
          <circle cx="${x}" cy="${rowY}" r="${R}" />
          <text x="${x}" y="${rowY}" class="viz-ll-text" dominant-baseline="central" text-anchor="middle">${val}</text>
          <text x="${x}" y="${rowY - R - 8}" class="viz-ll-idx">${i}</text>
        </g>`;

      const names = nodePointers[i] || [];
      names.forEach((name, k) => {
        const c = VizColors.get(name);
        const by = ptrY0 + k * 20;
        nodesHTML += `
          <g class="viz-ll-badge">
            <rect x="${x - 13}" y="${by - 10}" width="26" height="18" rx="4" fill="${c.bg}" />
            <text x="${x}" y="${by - 1}" fill="${c.label}" class="viz-ll-badge-text" text-anchor="middle" dominant-baseline="central">${name}</text>
          </g>`;
      });
    });

    const cycleNote = cycleBack !== undefined
      ? `<div class="viz-ll-cycle-label">↩ last node → node[${cycleBack}] (cycle)</div>`
      : '';

    const svg = `
      <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="viz-ll-svg">
        <defs>${defsHTML}</defs>
        <g>${edgesHTML}</g>
        <g>${nodesHTML}</g>
      </svg>`;

    return `
      <div class="viz-ll-line">
        ${cfg.label ? `<div class="viz-ll-row-label">${cfg.label}</div>` : ''}
        <div class="viz-ll-area">${svg}</div>
        ${cycleNote}
      </div>`;
  },

  build(spec, stepIdx) {
    const step  = spec.steps[stepIdx] || {};
    const label = step.label || '';
    const note  = step.note  || '';

    const lists = step.lists || spec.lists;
    let bodyHTML;

    if (lists) {
      bodyHTML = `<div class="viz-ll-multi">` +
        lists.map((l, idx) => this._row(l, idx)).join('') +
        `</div>`;
    } else {
      const cycleBack = step.cycleBack !== undefined ? step.cycleBack : spec.cycleBack;
      bodyHTML = this._row({
        nodes:     step.nodes || spec.nodes || [],
        highlight: step.highlight,
        active:    step.active,
        pointers:  step.pointers,
        arrows:    step.arrows,
        cycleBack: cycleBack,
      }, 0);
    }

    return `
      ${bodyHTML}
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
