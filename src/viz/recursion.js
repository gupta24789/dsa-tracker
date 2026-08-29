// ── Viz type: recursion (call tree / call stack SVG) ─────────────────────────
// spec.calls — [{ id, label, parent, x, y }]  x/y are 0–100 (% of viewport).
//   parent = id of the calling frame (undefined/null for the root call).
//   Build the full tree of calls that will ever appear across all steps;
//   each step reveals/updates a subset via `visible`.
//
// step.visible   — [id, ...] call ids drawn so far (grows as calls happen)
// step.active    — id of the frame currently executing (bright accent)
// step.returned  — { id: "text" } show a return value under a finished frame
// step.highlight — [id, ...] frames to tint blue (e.g. current path to root)
// step.label     — explanation text
// step.note      — green success note
window.VizRecursion = {
  build(spec, stepIdx) {
    const step       = spec.steps[stepIdx] || {};
    const visible    = step.visible   || [];
    const active     = step.active    || null;
    const returned   = step.returned  || {};
    const highlights = step.highlight || [];
    const label      = step.label     || '';
    const note       = step.note      || '';

    const calls = spec.calls || [];
    const byId  = {};
    calls.forEach(c => { byId[c.id] = c; });

    const SVG_W = 560, SVG_H = 320, R = 26;

    const visibleSet = new Set(visible);
    const shown = calls.filter(c => visibleSet.has(c.id));

    // ── Edges (call → child call), only when both ends are visible ──
    let edgesHTML = '';
    shown.forEach(c => {
      if (c.parent === undefined || c.parent === null) return;
      const parent = byId[c.parent];
      if (!parent || !visibleSet.has(parent.id)) return;
      const p1x = parent.x * SVG_W / 100, p1y = parent.y * SVG_H / 100;
      const p2x = c.x * SVG_W / 100,      p2y = c.y * SVG_H / 100;
      edgesHTML += `<line x1="${p1x}" y1="${p1y}" x2="${p2x}" y2="${p2y}" class="viz-rec-edge" />`;
    });

    // ── Frames (nodes) ──
    let nodesHTML = '';
    shown.forEach(c => {
      const x = c.x * SVG_W / 100, y = c.y * SVG_H / 100;
      const isActive = active === c.id;
      const isHL     = highlights.includes(c.id);
      let cls = 'viz-rec-node';
      if (isActive)   cls += ' viz-rec-node-active';
      else if (isHL)  cls += ' viz-rec-node-hl';

      const retVal = returned[c.id];
      const retHTML = retVal !== undefined
        ? `<text x="${x}" y="${y + R + 14}" class="viz-rec-ret" text-anchor="middle">↩ ${retVal}</text>`
        : '';

      nodesHTML += `
        <g class="${cls}">
          <rect x="${x - R}" y="${y - R * 0.6}" width="${R * 2}" height="${R * 1.2}" rx="8" />
          <text x="${x}" y="${y}" class="viz-rec-text" dominant-baseline="central" text-anchor="middle">${c.label}</text>
        </g>
        ${retHTML}`;
    });

    const svg = `
      <svg viewBox="0 0 ${SVG_W} ${SVG_H}" class="viz-rec-svg">
        <g>${edgesHTML}</g>
        <g>${nodesHTML}</g>
      </svg>`;

    return `
      <div class="viz-rec-area">${svg}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
