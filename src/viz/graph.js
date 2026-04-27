// ── Viz type: graph (SVG node-edge diagram) ───────────────────────────────────
// spec.nodes — [{ id, label, x, y }]  x/y are 0–100 (% of SVG viewport)
// spec.edges — [{ from, to, weight?, label?, directed? }]
//   directed defaults to true; set false for undirected edges
//
// step.highlight      — [id, ...] node ids to tint blue
// step.active         — single node id, bright accent
// step.highlightEdges — [[from,to], ...] edges to highlight
// step.nodeLabels     — { id: "text" } override display label per node
// step.label          — explanation text
// step.note           — green success note
window.VizGraph = {
  build(spec, stepIdx) {
    const step       = spec.steps[stepIdx] || {};
    const hlNodes    = step.highlight       || [];
    const activeNode = step.active          || null;
    const hlEdges    = step.highlightEdges  || [];
    const nodeLabels = step.nodeLabels      || {};
    const label      = step.label           || '';
    const note       = step.note            || '';

    const gNodes = spec.nodes || [];
    const gEdges = spec.edges || [];

    const SVG_W = 520, SVG_H = 280, R = 20;

    // Build id → pixel position map
    const posMap = {};
    gNodes.forEach(n => {
      posMap[n.id] = { x: n.x * SVG_W / 100, y: n.y * SVG_H / 100 };
    });

    const isEdgeHL = (from, to) =>
      hlEdges.some(([f, t]) => (f === from && t === to) || (f === to && t === from));

    // ── Edges ──
    let edgesHTML = '';
    gEdges.forEach(e => {
      const p1 = posMap[e.from];
      const p2 = posMap[e.to];
      if (!p1 || !p2) return;

      // Shorten line so it doesn't overlap node circles
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist, uy = dy / dist;
      const x1 = p1.x + ux * R,       y1 = p1.y + uy * R;
      const x2 = p2.x - ux * (R + 6), y2 = p2.y - uy * (R + 6);

      const hl     = isEdgeHL(e.from, e.to);
      const cls    = hl ? 'viz-graph-edge viz-graph-edge-hl' : 'viz-graph-edge';
      const marker = e.directed !== false ? 'url(#viz-arrow)' : '';

      edgesHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
        class="${cls}" marker-end="${marker}" />`;

      // Weight / label on edge midpoint
      if (e.weight !== undefined || e.label) {
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const text = e.weight !== undefined ? e.weight : e.label;
        edgesHTML += `<text x="${mx}" y="${my - 6}" class="viz-graph-edge-label">${text}</text>`;
      }
    });

    // ── Nodes ──
    let nodesHTML = '';
    gNodes.forEach(n => {
      const pos = posMap[n.id];
      if (!pos) return;

      const isAct = activeNode === n.id;
      const isHL  = hlNodes.includes(n.id);
      let cls = 'viz-graph-node';
      if (isAct)      cls += ' viz-graph-node-active';
      else if (isHL)  cls += ' viz-graph-node-hl';

      const display = nodeLabels[n.id] !== undefined ? nodeLabels[n.id] : n.label;
      nodesHTML += `
        <g class="${cls}">
          <circle cx="${pos.x}" cy="${pos.y}" r="${R}" />
          <text x="${pos.x}" y="${pos.y}" class="viz-graph-text"
                dominant-baseline="central" text-anchor="middle">${display}</text>
        </g>`;
    });

    const svg = `
      <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="viz-graph-svg">
        <defs>
          <marker id="viz-arrow" markerWidth="8" markerHeight="6"
                  refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" class="viz-graph-arrow" />
          </marker>
        </defs>
        <g>${edgesHTML}</g>
        <g>${nodesHTML}</g>
      </svg>`;

    return `
      <div class="viz-graph-area">${svg}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
