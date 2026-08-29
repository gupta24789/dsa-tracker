// ── Viz type: stack ────────────────────────────────────────────────────────
// spec.stack (or step.stack) — current stack contents, bottom → top order
// spec.stacks / step.stacks  — [{ label, values, flash }, ...] for side-by-side
//                              stacks (e.g. main stack + min-tracker stack)
// step.flash — { type: "push"|"pop", value } small badge under the column
//              showing the operation that just happened
// step.label / step.note — shared with other viz types
window.VizStack = {
  _column(cfg) {
    const values = cfg.values || [];
    const flash  = cfg.flash;
    const display = values.slice().reverse(); // top of stack first in DOM

    let itemsHTML = '';
    if (!display.length) {
      itemsHTML = `<div class="viz-stk-empty">empty</div>`;
    } else {
      display.forEach((val, i) => {
        const isTop = i === 0;
        itemsHTML += `<div class="viz-stk-item ${isTop ? 'viz-stk-item-top' : ''}">${val}</div>`;
      });
    }

    const flashHTML = flash
      ? `<div class="viz-stk-flash viz-stk-flash-${flash.type}">${flash.type} → ${flash.value}</div>`
      : '';

    return `
      <div class="viz-stk-col">
        ${cfg.label ? `<div class="viz-stk-col-label">${cfg.label}</div>` : ''}
        <div class="viz-stk-items">${itemsHTML}</div>
        <div class="viz-stk-base"></div>
        ${flashHTML}
      </div>`;
  },

  build(spec, stepIdx) {
    const step   = spec.steps[stepIdx] || {};
    const label  = step.label || '';
    const note   = step.note  || '';
    const cols   = step.stacks || spec.stacks ||
      [{ label: null, values: step.stack || spec.stack || [], flash: step.flash }];

    const colsHTML = cols.map(c => this._column(c)).join('');

    return `
      <div class="viz-stk-area">${colsHTML}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};

// ── Viz type: queue ────────────────────────────────────────────────────────
// spec.queue (or step.queue) — current contents, front → back order
// spec.queues / step.queues  — [{ label, values, flash }, ...] for multiple rows
// step.flash — { type, value } e.g. "pushBack" / "popFront" / "pushFront" /
//              "popBack" — badge colored by whether it's an add or a remove
window.VizQueue = {
  _row(cfg) {
    const values = cfg.values || [];
    const flash  = cfg.flash;

    let itemsHTML = '';
    if (!values.length) {
      itemsHTML = `<div class="viz-q-empty">empty</div>`;
    } else {
      values.forEach((val, i) => {
        const isFront = i === 0;
        const isBack  = i === values.length - 1;
        let cls = 'viz-q-item';
        if (isFront) cls += ' viz-q-item-front';
        if (isBack)  cls += ' viz-q-item-back';
        itemsHTML += `<div class="${cls}"><span class="viz-q-val">${val}</span></div>`;
      });
    }

    const isAdd = flash && /push|enqueue/i.test(flash.type);
    const flashHTML = flash
      ? `<div class="viz-q-flash ${isAdd ? 'viz-q-flash-add' : 'viz-q-flash-remove'}">${flash.type} → ${flash.value}</div>`
      : '';

    return `
      <div class="viz-q-line">
        ${cfg.label ? `<div class="viz-q-row-label">${cfg.label}</div>` : ''}
        <div class="viz-q-row">
          ${values.length ? '<div class="viz-q-endlabel viz-q-front-label">FRONT</div>' : ''}
          <div class="viz-q-items">${itemsHTML}</div>
          ${values.length ? '<div class="viz-q-endlabel viz-q-back-label">BACK</div>' : ''}
        </div>
        ${flashHTML}
      </div>`;
  },

  build(spec, stepIdx) {
    const step   = spec.steps[stepIdx] || {};
    const label  = step.label || '';
    const note   = step.note  || '';
    const rows   = step.queues || spec.queues ||
      [{ label: null, values: step.queue || spec.queue || [], flash: step.flash }];

    const rowsHTML = rows.map(r => this._row(r)).join('');

    return `
      <div class="viz-q-wrap">${rowsHTML}</div>
      <div class="viz-step-label">${label}</div>
      ${note ? `<div class="viz-step-note">${note}</div>` : ''}
    `;
  },
};
