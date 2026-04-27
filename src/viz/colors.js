// ── Shared pointer color palette ─────────────────────────────────────────────
window.VizColors = {
  palette: {
    L:    { bg: '#3b82f6', label: '#fff' },
    R:    { bg: '#ef4444', label: '#fff' },
    M:    { bg: '#a855f7', label: '#fff' },
    S:    { bg: '#22c55e', label: '#fff' },
    F:    { bg: '#f97316', label: '#fff' },
    i:    { bg: '#eab308', label: '#000' },
    j:    { bg: '#06b6d4', label: '#fff' },
    curr: { bg: '#ec4899', label: '#fff' },
    p:    { bg: '#3b82f6', label: '#fff' },
    q:    { bg: '#ef4444', label: '#fff' },
  },

  get(name) {
    return this.palette[name] || { bg: '#6366f1', label: '#fff' };
  },

  badge(name) {
    const c = this.get(name);
    return `<span class="viz-ptr-badge" style="background:${c.bg};color:${c.label}">${name}</span>`;
  },
};
