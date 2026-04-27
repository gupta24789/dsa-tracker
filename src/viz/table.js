// ── Viz type: table (DP grids) ────────────────────────────────────────────────
// spec.rows  — row header labels,  e.g. ["item 0", "item 1", ...]
// spec.cols  — col header labels,  e.g. ["w=0", "w=1", ...]
// spec.cells — 2D array of initial cell values (can be overridden per step)
//
// step.cells     — override the full cell grid for this step
// step.highlight — [[r,c], ...] cells to tint blue
// step.active    — [r,c] the cell currently being computed (bright accent)
// step.label     — explanation text
// step.note      — green success note
window.VizTable = {
  build(spec, stepIdx) {
    const step = spec.steps[stepIdx] || {};
    const highlights = step.highlight || [];
    const active     = step.active    || null;
    const label      = step.label     || '';
    const note       = step.note      || '';
    const rows       = spec.rows      || [];
    const cols       = spec.cols      || [];
    const cells      = step.cells     || spec.cells || [];

    const isHL     = (r, c) => highlights.some(([hr, hc]) => hr === r && hc === c);
    const isActive = (r, c) => active && active[0] === r && active[1] === c;

    let html = '<div class="viz-table-wrap"><table class="viz-table">';

    // Column header row
    if (cols.length) {
      html += '<thead><tr>';
      // corner cell (above row headers)
      html += `<th class="viz-th viz-th-corner">${cols[0]}</th>`;
      cols.slice(1).forEach(ch => {
        html += `<th class="viz-th">${ch}</th>`;
      });
      html += '</tr></thead>';
    }

    // Data rows
    html += '<tbody>';
    cells.forEach((row, r) => {
      html += '<tr>';
      if (rows.length) {
        html += `<th class="viz-th viz-th-row">${rows[r] || ''}</th>`;
      }
      row.forEach((val, c) => {
        let cls = 'viz-td';
        if (isActive(r, c))     cls += ' viz-td-active';
        else if (isHL(r, c))    cls += ' viz-td-highlight';
        const display = (val === null || val === undefined) ? '' : val;
        html += `<td class="${cls}">${display}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';

    html += `<div class="viz-step-label">${label}</div>`;
    if (note) html += `<div class="viz-step-note">${note}</div>`;
    return html;
  },
};
