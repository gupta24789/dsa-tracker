// ── Viz type: heap (binary heap tree, 0-indexed) ─────────────────────────────
// spec.nodes — 0-indexed complete-binary-tree array, e.g. [1, 3, 5, 7, 9]
//   parent(i) = (i-1)//2, left(i) = 2i+1, right(i) = 2i+2
//
// step.nodes     — override the array for this step (shows swaps/insert/pop)
// step.highlight — [i, ...] node indices to tint blue
// step.active    — single node index, bright accent (being compared/moved)
// step.swap      — [i, j] dashed highlight on the parent-child edge being swapped
// step.label / step.note — shared with other viz types
//
// spec.heaps / step.heaps — [{ label, nodes, highlight, active, swap }, ...]
// for two or more side-by-side heaps (e.g. two-heaps running median)
window.VizHeap = {
  _tree(cfg, svgW) {
    const nodes      = cfg.nodes     || [];
    const highlights = cfg.highlight || [];
    const active     = cfg.active !== undefined ? cfg.active : null;
    const swapPair    = cfg.swap      || null;
    const n           = nodes.length;

    let maxDepth = 0;
    for (let i = 0; i < n; i++) {
      maxDepth = Math.max(maxDepth, Math.floor(Math.log2(i + 1)));
    }

    const SVG_W   = svgW;
    const LEVEL_H = 64;
    const SVG_H   = (maxDepth + 1) * LEVEL_H + 24;
    const R       = 20;

    const nodeX = i => {
      const oneIdx     = i + 1;
      const depth      = Math.floor(Math.log2(oneIdx));
      const levelStart = Math.pow(2, depth);
      const posInLevel = oneIdx - levelStart;
      const slotW      = SVG_W / Math.pow(2, depth);
      return slotW * posInLevel + slotW / 2;
    };
    const nodeY = i => Math.floor(Math.log2(i + 1)) * LEVEL_H + R + 10;

    let edgesHTML = '';
    let nodesHTML = '';
    const isSwap = i => swapPair && (swapPair[0] === i || swapPair[1] === i);

    for (let i = 0; i < n; i++) {
      if (nodes[i] === null || nodes[i] === undefined) continue;
      const x = nodeX(i), y = nodeY(i);

      if (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (nodes[parent] !== null && nodes[parent] !== undefined) {
          const px = nodeX(parent), py = nodeY(parent);
          const edgeSwap = isSwap(i) && isSwap(parent);
          edgesHTML += `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}"
            class="viz-heap-edge ${edgeSwap ? 'viz-heap-edge-swap' : ''}" />`;
        }
      }

      const isActive = active === i;
      const isHL     = highlights.includes(i);
      const swapped  = isSwap(i);
      let cls = 'viz-heap-node';
      if (swapped)        cls += ' viz-heap-node-swap';
      else if (isActive)  cls += ' viz-heap-node-active';
      else if (isHL)      cls += ' viz-heap-node-hl';

      nodesHTML += `
        <g class="${cls}">
          <circle cx="${x}" cy="${y}" r="${R}" />
          <text x="${x}" y="${y}" class="viz-heap-text"
                dominant-baseline="central" text-anchor="middle">${nodes[i]}</text>
          <text x="${x}" y="${y + R + 12}" class="viz-heap-idx" text-anchor="middle">[${i}]</text>
        </g>`;
    }

    // Compact array strip underneath — heaps ARE stored as arrays, keep that link visible.
    let arrHTML = '<div class="viz-heap-array">';
    nodes.forEach((v, i) => {
      const cls = isSwap(i) ? 'viz-heap-arr-cell viz-heap-arr-cell-swap'
                : highlights.includes(i) ? 'viz-heap-arr-cell viz-heap-arr-cell-hl'
                : active === i ? 'viz-heap-arr-cell viz-heap-arr-cell-active'
                : 'viz-heap-arr-cell';
      arrHTML += `<div class="${cls}">${v}</div>`;
    });
    arrHTML += '</div>';

    return `
      <div class="viz-heap-col">
        ${cfg.label ? `<div class="viz-heap-col-label">${cfg.label}</div>` : ''}
        <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="viz-heap-svg">
          <g>${edgesHTML}</g>
          <g>${nodesHTML}</g>
        </svg>
        ${arrHTML}
      </div>`;
  },

  build(spec, stepIdx) {
    const step  = spec.steps[stepIdx] || {};
    const label = step.label || '';
    const note  = step.note  || '';

    const multi = step.heaps || spec.heaps;
    const bodyHTML = multi
      ? `<div class="viz-heap-multi">${multi.map(h => this._tree(h, 280)).join('')}</div>`
      : this._tree({
          nodes:     step.nodes || spec.nodes || [],
          highlight: step.highlight,
          active:    step.active,
          swap:      step.swap,
        }, 560);

    return `
      ${bodyHTML}
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
