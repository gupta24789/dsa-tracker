// ── Viz type: linkedlist ──────────────────────────────────────────────────────
// spec.nodes    — array of node values  e.g. [1, 2, 3, 4, 5]
// spec.cycleBack — (optional) index the last node points back to (shows ↩ arrow)
//
// step.highlight  — [0, 2] node indices to tint blue
// step.active     — single node index, bright accent
// step.pointers   — { S:0, F:2 } pointer badges below nodes
// step.cycleBack  — override cycleBack for this step
// step.label      — explanation text
// step.note       — green success note
window.VizLinkedList = {
  build(spec, stepIdx) {
    const step       = spec.steps[stepIdx] || {};
    const highlights = step.highlight || [];
    const active     = step.active    || null;
    const pointers   = step.pointers  || {};
    const label      = step.label     || '';
    const note       = step.note      || '';
    const nodes      = step.nodes || spec.nodes     || [];
    const cycleBack  = step.cycleBack !== undefined
      ? step.cycleBack
      : spec.cycleBack;

    // Map node index → pointer names
    const nodePointers = {};
    Object.entries(pointers).forEach(([name, idx]) => {
      if (!nodePointers[idx]) nodePointers[idx] = [];
      nodePointers[idx].push(name);
    });

    let nodesHTML = '';
    nodes.forEach((val, i) => {
      const isHL  = highlights.includes(i);
      const isAct = active === i;
      let cls = 'viz-ll-node';
      if (isAct)      cls += ' viz-ll-node-active';
      else if (isHL)  cls += ' viz-ll-node-hl';

      const isLast = i === nodes.length - 1;
      const arrowHTML = !isLast
        ? `<div class="viz-ll-arrow">→</div>`
        : cycleBack !== undefined
          ? `<div class="viz-ll-arrow viz-ll-arrow-cycle">↩</div>`
          : `<div class="viz-ll-arrow viz-ll-arrow-null">∅</div>`;

      const names  = nodePointers[i] || [];
      const badges = names.map(n => VizColors.badge(n)).join('');

      nodesHTML += `
        <div class="viz-ll-item">
          <div class="${cls}">
            <span class="viz-ll-val">${val}</span>
            <span class="viz-ll-idx">${i}</span>
          </div>
          ${arrowHTML}
          <div class="viz-ll-ptrs">${badges}</div>
        </div>`;
    });

    const cycleNote = cycleBack !== undefined
      ? `<div class="viz-ll-cycle-label">↩ last node → node[${cycleBack}] (cycle)</div>`
      : '';

    return `
      <div class="viz-ll-area">${nodesHTML}</div>
      ${cycleNote}
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
