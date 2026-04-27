// ── Viz type: array (default) ─────────────────────────────────────────────────
// spec.array   — values to display
// step.pointers  — { L:0, R:4 } pointer badges below cells
// step.highlight — [0, 4] cell indices to highlight (blue lift)
// step.label     — explanation text
// step.note      — green success note
window.VizArray = {
  build(spec, stepIdx) {
    const CELL_W = 52, CELL_H = 44;
    const arr  = spec.array || [];
    const step = spec.steps[stepIdx] || {};
    const pointers   = step.pointers  || {};
    const highlights = step.highlight || [];
    const label = step.label || '';
    const note  = step.note  || '';

    // Map cell index → pointer names
    const cellPointers = {};
    Object.entries(pointers).forEach(([name, idx]) => {
      if (!cellPointers[idx]) cellPointers[idx] = [];
      cellPointers[idx].push(name);
    });

    let cellsHTML = '';
    arr.forEach((val, i) => {
      const isHL  = highlights.includes(i);
      const hasPtr = !!cellPointers[i];
      cellsHTML += `
        <div class="viz-cell ${isHL ? 'viz-cell-highlight' : ''} ${hasPtr ? 'viz-cell-pointed' : ''}"
             style="width:${CELL_W}px;height:${CELL_H}px;">
          <span class="viz-cell-val">${val}</span>
          <span class="viz-cell-idx">${i}</span>
        </div>`;
    });

    let ptrsHTML = '';
    arr.forEach((_, i) => {
      const names  = cellPointers[i] || [];
      const badges = names.map(n => VizColors.badge(n)).join('');
      ptrsHTML += `<div class="viz-ptr-cell" style="width:${CELL_W}px">${badges}</div>`;
    });

    return `
      <div class="viz-array-row">${cellsHTML}</div>
      <div class="viz-ptr-row">${ptrsHTML}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
