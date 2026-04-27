// ── Viz type: tree (binary tree SVG) ─────────────────────────────────────────
// spec.nodes — level-order array, 1-indexed (index 0 unused).
//   null = absent node.  e.g. [null, 4, 2, 6, 1, 3, 5, 7]
//
// step.highlight — [1, 3] node indices (1-indexed) to tint blue
// step.active    — single node index, bright accent (currently visiting)
// step.edge      — [from, to] highlight one edge
// step.labels    — { 2: "h=1" } overlay text on specific nodes
// step.label     — explanation text
// step.note      — green success note
window.VizTree = {
  build(spec, stepIdx) {
    const step       = spec.steps[stepIdx] || {};
    const highlights = step.highlight || [];
    const active     = step.active    || null;
    const edgeHL     = step.edge      || null;
    const nodeLabels = step.labels    || {};
    const label      = step.label     || '';
    const note       = step.note      || '';

    const nodes = spec.nodes || [];
    const n     = nodes.length;

    // Find max depth of present nodes
    let maxDepth = 0;
    for (let i = 1; i < n; i++) {
      if (nodes[i] !== null && nodes[i] !== undefined) {
        maxDepth = Math.max(maxDepth, Math.floor(Math.log2(i)));
      }
    }

    const SVG_W  = 560;
    const LEVEL_H = 72;
    const SVG_H  = (maxDepth + 1) * LEVEL_H + 24;
    const R      = 22;

    const nodeX = i => {
      const depth      = Math.floor(Math.log2(i));
      const levelStart = Math.pow(2, depth);
      const posInLevel = i - levelStart;
      const slotW      = SVG_W / Math.pow(2, depth);
      return slotW * posInLevel + slotW / 2;
    };
    const nodeY = i => Math.floor(Math.log2(i)) * LEVEL_H + R + 10;

    let edgesHTML = '';
    let nodesHTML = '';

    for (let i = 1; i < n; i++) {
      if (nodes[i] === null || nodes[i] === undefined) continue;

      const x = nodeX(i);
      const y = nodeY(i);

      // Edge to parent
      if (i > 1) {
        const parent = Math.floor(i / 2);
        if (nodes[parent] !== null && nodes[parent] !== undefined) {
          const px = nodeX(parent);
          const py = nodeY(parent);
          const hlEdge = edgeHL &&
            ((edgeHL[0] === parent && edgeHL[1] === i) ||
             (edgeHL[0] === i     && edgeHL[1] === parent));
          edgesHTML += `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}"
            class="viz-tree-edge ${hlEdge ? 'viz-tree-edge-hl' : ''}" />`;
        }
      }

      // Node circle + label
      const isActive = active === i;
      const isHL     = highlights.includes(i);
      let cls = 'viz-tree-node';
      if (isActive)   cls += ' viz-tree-node-active';
      else if (isHL)  cls += ' viz-tree-node-hl';

      const display = nodeLabels[i] !== undefined ? nodeLabels[i] : nodes[i];
      nodesHTML += `
        <g class="${cls}">
          <circle cx="${x}" cy="${y}" r="${R}" />
          <text x="${x}" y="${y}" class="viz-tree-text"
                dominant-baseline="central" text-anchor="middle">${display}</text>
        </g>`;
    }

    const svg = `
      <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="viz-tree-svg">
        <g class="viz-tree-edges">${edgesHTML}</g>
        <g class="viz-tree-nodes">${nodesHTML}</g>
      </svg>`;

    return `
      <div class="viz-tree-area">${svg}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
