document.addEventListener("DOMContentLoaded", () => {
  const SOLVED_KEY = 'dsa_tracker_solved_problems';
  let solvedProblems = new Set();

  function loadSolvedProblems() {
    try {
      const saved = localStorage.getItem(SOLVED_KEY);
      if (saved) solvedProblems = new Set(JSON.parse(saved));
    } catch (_) { solvedProblems = new Set(); }
  }

  function saveSolvedProblems() {
    try { localStorage.setItem(SOLVED_KEY, JSON.stringify([...solvedProblems])); } catch (_) {}
  }

  function saveCheckboxState(id, checked) {
    checked ? solvedProblems.add(id) : solvedProblems.delete(id);
    saveSolvedProblems();
  }

  // ── Spaced-review data layer (keyed by problem URL, SM-2-lite) ────────────
  const REVIEW_KEY = 'dsa_tracker_review';
  const REVIEW_CFG_KEY = 'dsa_tracker_review_cfg';
  let reviewData = {};        // url -> { interval, reps, ease, last, due }
  const DAY_MS = 86400000;

  // User-configurable review settings (everyone has their own pace).
  // hardDays/goodDays/easyDays = base "days until due" applied when you rate;
  // repeat correct reviews then grow the interval by the ease factor.
  const DEFAULT_CFG = { dailyCap: 15, retireOnEasy: true, hardDays: 1, goodDays: 3, easyDays: 7 };
  let reviewCfg = { ...DEFAULT_CFG };

  function loadReviewData() {
    try {
      const saved = localStorage.getItem(REVIEW_KEY);
      if (saved) reviewData = JSON.parse(saved);
    } catch (_) { reviewData = {}; }
    try {
      const cfg = localStorage.getItem(REVIEW_CFG_KEY);
      if (cfg) reviewCfg = { ...DEFAULT_CFG, ...JSON.parse(cfg) };
    } catch (_) { reviewCfg = { ...DEFAULT_CFG }; }
  }
  function saveReviewData() {
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify(reviewData)); } catch (_) {}
  }
  function saveReviewCfg() {
    try { localStorage.setItem(REVIEW_CFG_KEY, JSON.stringify(reviewCfg)); } catch (_) {}
  }

  // ── Per-problem notes (keyed by problem URL) ──────────────────────────────
  const NOTES_KEY = 'dsa_tracker_notes';
  let notesData = {};   // url -> string

  function loadNotes() {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) notesData = JSON.parse(saved);
    } catch (_) { notesData = {}; }
  }
  function saveNote(url, text) {
    if (text && text.trim()) notesData[url] = text;
    else delete notesData[url];
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notesData)); } catch (_) {}
  }
  function hasNote(url) { return !!(notesData[url] && notesData[url].trim()); }

  const RETIRE_DAYS = 3650;   // "don't show me again" ~ 10 years out

  // Rate a problem and compute its next due date. rating: again|hard|good|easy
  function scheduleReview(url, rating) {
    const r = reviewData[url] || { interval: 0, reps: 0, ease: 2.5 };
    if (rating === 'again') {
      r.reps = 0;
      r.interval = 0;                       // due again today
      r.retired = false;
    } else if (rating === 'easy' && reviewCfg.retireOnEasy) {
      // Easy effectively retires the problem so the queue stays your weak spots.
      r.reps += 1;
      r.interval = RETIRE_DAYS;
      r.retired = true;
    } else {
      r.reps += 1;
      r.retired = false;
      const baseDays = rating === 'hard' ? reviewCfg.hardDays
                     : rating === 'easy' ? reviewCfg.easyDays
                     : reviewCfg.goodDays;
      if (rating === 'hard') r.ease = Math.max(1.3, r.ease - 0.15);
      if (rating === 'easy') r.ease = r.ease + 0.15;
      if (r.reps === 1) {
        r.interval = baseDays;                              // first review: your configured days
      } else {
        // Subsequent correct reviews grow, but never shorter than your base days.
        const grown = Math.round(r.interval * (rating === 'hard' ? 1.2 : r.ease));
        r.interval = Math.max(baseDays, grown);
      }
    }
    r.last = Date.now();
    r.due  = Date.now() + r.interval * DAY_MS;
    reviewData[url] = r;
    saveReviewData();
  }

  function isDue(url) {
    const r = reviewData[url];
    return r && !r.retired && r.due <= Date.now();
  }
  // Total problems actually due (uncapped) — for the badge.
  function dueCount() {
    return Object.keys(reviewData).filter(isDue).length;
  }
  // Due URLs sorted most-overdue first (used by the capped Review view).
  function dueUrlsByPriority() {
    return Object.keys(reviewData)
      .filter(isDue)
      .sort((a, b) => {
        const ra = reviewData[a], rb = reviewData[b];
        if (ra.due !== rb.due) return ra.due - rb.due;   // most overdue first
        return (ra.ease || 2.5) - (rb.ease || 2.5);       // then hardest first
      });
  }
  // Human-readable "next review" label for a scheduled problem.
  function nextReviewLabel(url) {
    const r = reviewData[url];
    if (!r) return '';
    const days = Math.round((r.due - Date.now()) / DAY_MS);
    if (r.due <= Date.now()) return 'due now';
    if (days <= 0) return 'due today';
    if (days === 1) return 'in 1 day';
    return `in ${days} days`;
  }

  function updateStats() {
    const all  = document.querySelectorAll('input[type="checkbox"]');
    const done = document.querySelectorAll('input[type="checkbox"]:checked');
    const pct  = all.length > 0 ? Math.round((done.length / all.length) * 100) : 0;
    document.getElementById('totalProblems').textContent     = all.length;
    document.getElementById('completedProblems').textContent = done.length;
    const el  = document.getElementById('progressPercentage');
    const bar = document.getElementById('progressBar');
    el.textContent = `${pct}%`;
    el.style.color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444';
    if (bar) {
      bar.style.width = `${pct}%`;
      bar.style.background = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444';
    }
    // Record this topic's total so the sidebar badge can show it, then refresh.
    if (currentTab === 'problems') topicTotals[currentTopic] = all.length;
    refreshSidebarProgress();
  }

  // Topics that have a problems file
  const PROBLEMS_TOPICS = new Set([
    "array", "binarySearch", "linkedList", "stackAndQueue", "heaps",
    "recursion", "tree", "graphs", "dp", "greedy", "tries", "string", "bits"
  ]);

  // Topics that have a concepts file
  const CONCEPTS_TOPICS = new Set([
    "array", "binarySearch", "linkedList", "stackAndQueue", "heaps",
    "recursion", "tree", "graphs", "dp", "greedy", "tries", "string", "bits"
  ]);

  const ALL_TOPICS = ["array", "binarySearch", "linkedList", "stackAndQueue", "heaps",
    "recursion", "tree", "graphs", "dp", "greedy", "tries", "string", "bits"];

  const topicNav       = document.getElementById("topicNav");
  const topicTitle     = document.getElementById("topicTitle");
  const content        = document.getElementById("content");
  const resetButton    = document.getElementById("resetButton");
  const tabsRow        = document.getElementById("tabsRow");
  const conceptsTab    = document.getElementById("conceptsTab");
  const problemsTab    = document.getElementById("problemsTab");
  const topbarStats    = document.getElementById("topbarStats");
  const menuToggle     = document.getElementById("menuToggle");
  const sidebar        = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const appShell       = document.getElementById("appShell");

  let currentTopic = "array";
  let currentTab   = "concepts"; // "concepts" | "problems"
  let currentView  = "topic";    // "topic" | "review"

  // ── Per-topic progress (for sidebar badges) ───────────────────────────────
  // Cache of total problem counts per topic, filled lazily as files load.
  const topicTotals = {};

  // ── Hints: lazy per-topic cache ────────────────────────────────────────────
  // hintsCache[topic] = { [url]: { brute?, better?, optimal? } } | null (none)
  const hintsCache = {};

  async function loadHints(topic) {
    if (topic in hintsCache) return hintsCache[topic];
    try {
      const res = await fetch(`src/hints/${topic}.json?t=${Date.now()}`, { cache: 'no-store' });
      hintsCache[topic] = res.ok ? await res.json() : null;
    } catch (_) {
      hintsCache[topic] = null;
    }
    return hintsCache[topic];
  }

  // Build the collapsible hint panel markup for one problem's hint object.
  function buildHintPanel(hint) {
    const tiers = [
      ['brute',   'Brute'],
      ['better',  'Better'],
      ['optimal', 'Optimal']
    ];
    const rows = tiers
      .filter(([k]) => hint[k])
      .map(([k, label]) => {
        const t = hint[k];
        return `<div class="hint-tier hint-${k}">
          <span class="hint-tier-label">${label}</span>
          <span class="hint-tier-idea">${t.idea}</span>
          <span class="hint-tier-cx">Time ${t.time} · Space ${t.space}</span>
        </div>`;
      })
      .join('');
    return `<div class="hint-panel">${rows}</div>`;
  }

  function topicProgress(topic) {
    // done count comes from solvedProblems ids prefixed with `${topic}-`
    let done = 0;
    solvedProblems.forEach(id => { if (id.startsWith(topic + '-')) done++; });
    const total = topicTotals[topic];
    return { done, total };
  }

  // ── Build the left sidebar navigation ─────────────────────────────────────
  function buildSidebar() {
    topicNav.innerHTML = '';

    // Review (due today) entry sits at the top, above the topic list.
    const reviewItem = document.createElement('button');
    reviewItem.className = 'topic-item review-nav';
    reviewItem.id = 'reviewNavItem';
    const rname = document.createElement('span');
    rname.className = 'topic-name';
    rname.textContent = '⟳ Review';
    const rbadge = document.createElement('span');
    rbadge.className = 'topic-progress review-due-badge';
    rbadge.id = 'nav-review-due';
    reviewItem.appendChild(rname);
    reviewItem.appendChild(rbadge);
    reviewItem.addEventListener('click', () => {
      currentView = 'review';
      renderReview();
      highlightActiveTopic();
      closeSidebarMobile();
    });
    topicNav.appendChild(reviewItem);

    const divider = document.createElement('div');
    divider.className = 'sidebar-divider';
    topicNav.appendChild(divider);

    ALL_TOPICS.forEach(t => {
      const item = document.createElement('button');
      item.className = 'topic-item';
      item.dataset.topic = t;

      const name = document.createElement('span');
      name.className = 'topic-name';
      name.textContent = formatName(t);

      const badge = document.createElement('span');
      badge.className = 'topic-progress';
      badge.id = `nav-progress-${t}`;

      item.appendChild(name);
      item.appendChild(badge);
      item.addEventListener('click', () => {
        currentTopic = t;
        currentView = 'topic';
        syncTabs();
        render();
        highlightActiveTopic();
        closeSidebarMobile();
      });
      topicNav.appendChild(item);
    });
    highlightActiveTopic();
    refreshSidebarProgress();
  }

  function highlightActiveTopic() {
    topicNav.querySelectorAll('.topic-item').forEach(el => {
      el.classList.toggle('active',
        currentView === 'topic' ? el.dataset.topic === currentTopic
                                : el.id === 'reviewNavItem');
    });
  }

  function refreshSidebarProgress() {
    ALL_TOPICS.forEach(t => {
      const el = document.getElementById(`nav-progress-${t}`);
      if (!el) return;
      const { done, total } = topicProgress(t);
      if (total == null) { el.textContent = ''; return; }
      el.textContent = `${done}/${total}`;
      el.classList.toggle('all-done', total > 0 && done === total);
    });
    // Review due-count badge
    const rb = document.getElementById('nav-review-due');
    if (rb) {
      const n = dueCount();
      rb.textContent = n > 0 ? String(n) : '';
      rb.classList.toggle('has-due', n > 0);
    }
  }

  // ── Mobile sidebar toggle ──────────────────────────────────────────────────
  function openSidebarMobile()  { sidebar.classList.add('open'); sidebarBackdrop.classList.add('show'); }
  function closeSidebarMobile() { sidebar.classList.remove('open'); sidebarBackdrop.classList.remove('show'); }

  function formatName(t) {
    return t
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  // ── Sync tab visibility based on current topic ────────────────────────────
  function syncTabs() {
    const hasConcepts = CONCEPTS_TOPICS.has(currentTopic);
    const hasProblems = PROBLEMS_TOPICS.has(currentTopic);

    conceptsTab.style.display = hasConcepts ? '' : 'none';
    problemsTab.style.display = hasProblems ? '' : 'none';

    // If current tab isn't available for this topic, switch to one that is
    if (currentTab === 'concepts' && !hasConcepts) currentTab = 'problems';
    if (currentTab === 'problems' && !hasProblems) currentTab = 'concepts';

    conceptsTab.classList.toggle('active', currentTab === 'concepts');
    problemsTab.classList.toggle('active', currentTab === 'problems');

    // Topbar title
    topicTitle.textContent = formatName(currentTopic);

    // Stats + reset only for problems tab
    const showStats = currentTab === 'problems';
    topbarStats.style.visibility = showStats ? 'visible' : 'hidden';
    resetButton.style.display    = showStats ? 'inline-block' : 'none';
  }

  // ── Menu toggle ────────────────────────────────────────────────────────────
  // On mobile (≤860px) the sidebar is an off-canvas drawer → open/close it.
  // On desktop it collapses inline to reclaim horizontal space.
  const MOBILE_BP = 860;
  menuToggle.addEventListener("click", () => {
    if (window.innerWidth <= MOBILE_BP) {
      sidebar.classList.contains('open') ? closeSidebarMobile() : openSidebarMobile();
    } else {
      appShell.classList.toggle('sidebar-collapsed');
    }
  });
  sidebarBackdrop.addEventListener("click", closeSidebarMobile);

  // ── Event: tab clicks ─────────────────────────────────────────────────────
  conceptsTab.addEventListener('click', () => {
    currentTab = 'concepts';
    syncTabs();
    render();
  });

  problemsTab.addEventListener('click', () => {
    currentTab = 'problems';
    syncTabs();
    render();
  });

  // ── Reset button ──────────────────────────────────────────────────────────
  resetButton.addEventListener("click", () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      saveCheckboxState(cb.dataset.id, false);
      cb.closest('li')?.classList.remove('completed');
    });
    // Also update any section badges that are currently rendered
    document.querySelectorAll('.section-badge').forEach(b => b.classList.remove('all-done'));
    updateStats();
    render();
  });

  // ── Export / Import all user data ──────────────────────────────────────────
  const exportButton = document.getElementById("exportButton");
  const importButton = document.getElementById("importButton");
  const importFile   = document.getElementById("importFile");

  exportButton.addEventListener("click", () => {
    const payload = {
      type: 'dsa-tracker-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      solved: [...solvedProblems],
      review: reviewData,
      reviewCfg: reviewCfg,
      notes: notesData
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  importButton.addEventListener("click", () => importFile.click());

  importFile.addEventListener("change", () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.type !== 'dsa-tracker-backup') {
          alert('That does not look like a DSA Tracker backup file.');
          return;
        }
        const counts = {
          solved: (data.solved || []).length,
          review: Object.keys(data.review || {}).length,
          notes:  Object.keys(data.notes || {}).length
        };
        if (!confirm(`Import this backup and merge it into your current data?\n\n` +
                     `• ${counts.solved} solved problems\n` +
                     `• ${counts.review} review schedules\n` +
                     `• ${counts.notes} notes`)) return;

        // Merge (imported data wins on conflicts).
        (data.solved || []).forEach(id => solvedProblems.add(id));
        saveSolvedProblems();
        Object.assign(reviewData, data.review || {});
        saveReviewData();
        Object.assign(notesData, data.notes || {});
        try { localStorage.setItem(NOTES_KEY, JSON.stringify(notesData)); } catch (_) {}
        if (data.reviewCfg) { reviewCfg = { ...DEFAULT_CFG, ...data.reviewCfg }; saveReviewCfg(); }

        refreshSidebarProgress();
        // Re-render current view to reflect imported state.
        currentView === 'review' ? renderReview() : render();
        alert('Backup imported successfully.');
      } catch (err) {
        alert('Could not read that file — it may be corrupted or not a valid backup.');
      } finally {
        importFile.value = '';   // allow re-importing the same file later
      }
    };
    reader.readAsText(file);
  });

  // ── Make mermaid diagrams pannable and zoomable ───────────────────────────
  function makeDiagramInteractive(wrapper) {
    const inner = wrapper.querySelector('.mermaid-inner');
    const svg = inner.querySelector('svg');
    
    if (!svg) {
      console.error('No SVG found in wrapper');
      return;
    }
    
    let scale = 1, tx = 0, ty = 0;
    let dragging = false, startX = 0, startY = 0;

    function applyTransform() {
      inner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      const label = wrapper.querySelector('.zoom-label');
      if (label) label.textContent = Math.round(scale * 100) + '%';
    }

    function centerDiagram() {
      inner.style.transform = 'none';
      
      const viewBox = svg.getAttribute('viewBox');
      let naturalW, naturalH;
      
      if (viewBox) {
        const [, , w, h] = viewBox.split(' ').map(Number);
        naturalW = w;
        naturalH = h;
      } else {
        const bbox = svg.getBBox();
        naturalW = bbox.width;
        naturalH = bbox.height;
      }
      
      const wrapW = wrapper.clientWidth;
      const wrapH = wrapper.clientHeight;
      const scaleX = (wrapW - 40) / naturalW;
      const scaleY = (wrapH - 80) / naturalH;
      scale = Math.min(1, scaleX, scaleY);
      tx = (wrapW - naturalW * scale) / 2;
      ty = (wrapH - naturalH * scale) / 2;
      applyTransform();
    }

    // Zoom on scroll
    wrapper.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      const rect = wrapper.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(5, Math.max(0.1, scale * factor));
      tx = mx - (mx - tx) * (newScale / scale);
      ty = my - (my - ty) * (newScale / scale);
      scale = newScale;
      applyTransform();
    }, { passive: false });

    // Pan on drag
    wrapper.addEventListener('mousedown', e => {
      if (e.target.closest('.mermaid-controls')) return;
      dragging = true;
      startX = e.clientX - tx;
      startY = e.clientY - ty;
      e.preventDefault();
    });
    wrapper.addEventListener('mousemove', e => {
      if (!dragging) return;
      tx = e.clientX - startX;
      ty = e.clientY - startY;
      applyTransform();
    });
    wrapper.addEventListener('mouseup',    () => { dragging = false; });
    wrapper.addEventListener('mouseleave', () => { dragging = false; });

    // Touch support
    let lastTouchDist = null;
    wrapper.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        dragging = true;
        startX = e.touches[0].clientX - tx;
        startY = e.touches[0].clientY - ty;
      }
    }, { passive: true });
    wrapper.addEventListener('touchmove', e => {
      e.preventDefault();
      if (e.touches.length === 1 && dragging) {
        tx = e.touches[0].clientX - startX;
        ty = e.touches[0].clientY - startY;
        applyTransform();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastTouchDist) {
          scale = Math.min(5, Math.max(0.1, scale * (dist / lastTouchDist)));
          applyTransform();
        }
        lastTouchDist = dist;
      }
    }, { passive: false });
    wrapper.addEventListener('touchend', () => { dragging = false; lastTouchDist = null; });

    // Zoom buttons — zoom toward center of wrapper
    wrapper.querySelector('.btn-zoom-in').addEventListener('click', () => {
      const cx = wrapper.clientWidth / 2, cy = wrapper.clientHeight / 2;
      const f = 1.3;
      scale = Math.min(5, scale * f);
      tx = cx - (cx - tx) * f;
      ty = cy - (cy - ty) * f;
      applyTransform();
    });
    wrapper.querySelector('.btn-zoom-out').addEventListener('click', () => {
      const cx = wrapper.clientWidth / 2, cy = wrapper.clientHeight / 2;
      const f = 1.3;
      scale = Math.max(0.1, scale / f);
      tx = cx - (cx - tx) / f;
      ty = cy - (cy - ty) / f;
      applyTransform();
    });
    wrapper.querySelector('.btn-reset').addEventListener('click', () => centerDiagram());

    // Fullscreen button
    wrapper.querySelector('.btn-fullscreen').addEventListener('click', () => {
      openDiagramModal(svg, wrapper);
    });

    // Center immediately and after a short delay
    centerDiagram();
    setTimeout(centerDiagram, 100);
    setTimeout(centerDiagram, 300);
  }

  // ── Fullscreen modal ──────────────────────────────────────────────────────
  function openDiagramModal(svg, sourceWrapper) {
    const modal     = document.getElementById('diagramModal');
    const modalBody = document.getElementById('modalBody');
    const controls  = document.getElementById('modalControls');

    // Clone SVG into modal
    modalBody.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'mermaid-inner';
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    const clonedSvg = svg.cloneNode(true);
    clonedSvg.removeAttribute('width');
    clonedSvg.removeAttribute('height');
    clonedSvg.style.width  = 'max-content';
    clonedSvg.style.height = 'max-content';
    mermaidDiv.appendChild(clonedSvg);
    inner.appendChild(mermaidDiv);
    modalBody.appendChild(inner);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Pan/zoom state for modal
    let scale = 1, tx = 0, ty = 0, dragging = false, startX = 0, startY = 0;

    function applyTransform() {
      inner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      controls.querySelector('.zoom-label').textContent = Math.round(scale * 100) + '%';
    }

    function centerModal() {
      inner.style.transform = 'none';
      const svgRect = clonedSvg.getBoundingClientRect();
      const naturalW = svgRect.width  || 800;
      const naturalH = svgRect.height || 500;
      const bW = modalBody.clientWidth;
      const bH = modalBody.clientHeight;
      scale = Math.min(1, (bW - 60) / naturalW, (bH - 60) / naturalH);
      tx = (bW - naturalW * scale) / 2;
      ty = (bH - naturalH * scale) / 2;
      applyTransform();
    }

    setTimeout(centerModal, 50);

    // Wheel zoom
    modalBody.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = modalBody.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const f = e.deltaY > 0 ? 0.9 : 1.1;
      const ns = Math.min(5, Math.max(0.1, scale * f));
      tx = mx - (mx - tx) * (ns / scale);
      ty = my - (my - ty) * (ns / scale);
      scale = ns;
      applyTransform();
    }, { passive: false });

    // Drag
    modalBody.addEventListener('mousedown', e => { dragging = true; startX = e.clientX - tx; startY = e.clientY - ty; e.preventDefault(); });
    modalBody.addEventListener('mousemove', e => { if (!dragging) return; tx = e.clientX - startX; ty = e.clientY - startY; applyTransform(); });
    modalBody.addEventListener('mouseup',   () => { dragging = false; });

    // Controls
    controls.querySelector('.btn-zoom-in').onclick  = () => { const f=1.3, cx=modalBody.clientWidth/2, cy=modalBody.clientHeight/2; scale=Math.min(5,scale*f); tx=cx-(cx-tx)*f; ty=cy-(cy-ty)*f; applyTransform(); };
    controls.querySelector('.btn-zoom-out').onclick = () => { const f=1.3, cx=modalBody.clientWidth/2, cy=modalBody.clientHeight/2; scale=Math.max(0.1,scale/f); tx=cx-(cx-tx)/f; ty=cy-(cy-ty)/f; applyTransform(); };
    controls.querySelector('.btn-reset').onclick    = () => centerModal();

    // Close
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      modalBody.innerHTML = '';
    };
    document.getElementById('modalClose').onclick = closeModal;
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }

  // ── Parse a problems .md into [{title, url, badge}] entries ───────────────
  // Title may itself contain [brackets] (e.g. "Reverse a LinkedList [Iterative]"),
  // so match lazily up to the "](http…)" link boundary rather than [^\]]+.
  function parseProblemsMarkdown(md) {
    const out = [];
    const re = /^\s*\d+\.\s*\[(.+?)\]\((https?:\/\/[^)]+)\)\s*(?:`([^`]+)`)?/gm;
    let m;
    while ((m = re.exec(md)) !== null) {
      out.push({ title: m[1].trim(), url: m[2].trim(), badge: (m[3] || '').split(' ')[0] });
    }
    return out;
  }

  // Cache of parsed problem metadata per topic (for the review view).
  const problemMeta = {};   // topic -> [{title,url,badge}]
  async function loadProblemMeta(topic) {
    if (topic in problemMeta) return problemMeta[topic];
    try {
      const res = await fetch(`src/problems/${topic}.md?t=${Date.now()}`, { cache: 'no-store' });
      problemMeta[topic] = res.ok ? parseProblemsMarkdown(await res.text()) : [];
    } catch (_) { problemMeta[topic] = []; }
    return problemMeta[topic];
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Render the Review (due today) view ────────────────────────────────────
  async function renderReview() {
    currentView = 'review';
    topicTitle.textContent = 'Review';
    topbarStats.style.visibility = 'hidden';
    resetButton.style.display = 'none';
    conceptsTab.parentElement.style.display = 'none';   // hide the tab group
    content.innerHTML = '<p style="color:#64748b">Loading review…</p>';

    // All due, most-overdue first; then apply the user's daily cap.
    const allDue = dueUrlsByPriority();
    const totalDue = allDue.length;
    const cap = reviewCfg.dailyCap > 0 ? reviewCfg.dailyCap : totalDue;
    const cappedUrls = allDue.slice(0, cap);

    // Build a URL → metadata map from all topic files (so we can show titles).
    const metas = await Promise.all(ALL_TOPICS.map(loadProblemMeta));
    const byUrl = {};
    ALL_TOPICS.forEach((t, i) => metas[i].forEach(p => { byUrl[p.url] = { ...p, topic: t }; }));

    // Readable fallback title from a problem URL slug (last non-empty path part).
    function titleFromUrl(u) {
      try {
        const parts = new URL(u).pathname.split('/').filter(Boolean);
        const slug = parts.reverse().find(s => s && !/^\d+$/.test(s) && s !== 'description') || u;
        return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      } catch (_) { return u; }
    }

    // Never drop a due problem: fall back to a URL-derived title if metadata is missing.
    const items = shuffle(cappedUrls.map(u => {
      const meta = byUrl[u];
      if (meta && meta.title) return meta;
      return { url: u, title: (meta && meta.title) || titleFromUrl(u), badge: (meta && meta.badge) || '' };
    }));

    const div = document.createElement('div');
    div.className = 'markdown-content practice-md review-view';

    const shownNote = totalDue > items.length
      ? `<span class="review-cap-note">showing ${items.length} of ${totalDue} due (daily cap)</span>`
      : '';
    const header = document.createElement('div');
    header.className = 'review-header';
    header.innerHTML = `
      <div class="review-header-top">
        <h2>Due for review — <span id="reviewDueCount">${items.length}</span></h2>
        <button class="review-settings-btn" id="reviewSettingsBtn" title="Review settings">⚙ Settings</button>
      </div>
      <p class="review-sub">Mixed across topics, pattern labels hidden. Identify the approach cold, then rate your recall. ${shownNote}</p>
      <div class="review-settings" id="reviewSettings" hidden>
        <label>Daily review cap
          <input type="number" id="cfgDailyCap" min="0" step="1" value="${reviewCfg.dailyCap}">
          <span class="cfg-hint">(0 = no limit)</span>
        </label>
        <div class="cfg-days">
          <span class="cfg-days-title">Days until due (first review):</span>
          <label class="cfg-day"><span class="cfg-hard">Hard</span>
            <input type="number" id="cfgHardDays" min="0" step="1" value="${reviewCfg.hardDays}"></label>
          <label class="cfg-day"><span class="cfg-good">Good</span>
            <input type="number" id="cfgGoodDays" min="0" step="1" value="${reviewCfg.goodDays}"></label>
          <label class="cfg-day"><span class="cfg-easy">Easy</span>
            <input type="number" id="cfgEasyDays" min="0" step="1" value="${reviewCfg.easyDays}" ${reviewCfg.retireOnEasy ? 'disabled' : ''}></label>
          <span class="cfg-hint">Again is always today. Later reviews grow automatically.</span>
        </div>
        <label class="cfg-check">
          <input type="checkbox" id="cfgRetire" ${reviewCfg.retireOnEasy ? 'checked' : ''}>
          Rating <b>Easy</b> retires a problem (stops reviewing it)
        </label>
      </div>`;
    div.appendChild(header);

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'review-empty';
      empty.innerHTML = totalDue === 0
        ? '🎉 Nothing due right now. Solve problems and rate them to build your review queue.'
        : '✅ Daily cap reached — you\'re caught up for today. Raise the cap in Settings to do more.';
      div.appendChild(empty);
      content.innerHTML = '';
      content.appendChild(div);
      wireReviewSettings(div);
      return;
    }

    // Reuse the exact problems-list layout: .section-body.open > ol > li.
    const body = document.createElement('div');
    body.className = 'section-body open';
    const ol = document.createElement('ol');
    items.forEach(p => {
      const li = document.createElement('li');
      li.dataset.reviewRow = '1';
      const item = document.createElement('span');
      item.className = 'practice-item';
      // Guarantee a visible title even if metadata was missing/empty.
      const displayTitle = (p && p.title && p.title.trim()) ? p.title : titleFromUrl(p && p.url);
      // No pattern/section shown — just title + (difficulty) to force cold recall.
      item.innerHTML = `<a href="${p.url}" target="_blank" rel="noopener" class="problem-link">${displayTitle}</a>
        ${p.badge ? `<span class="problem-category ${p.badge}">${p.badge}</span>` : ''}`;
      li.appendChild(item);
      attachReviewControls(item, p.url);
      attachNoteControl(item, p.url);
      ol.appendChild(li);
    });
    body.appendChild(ol);
    div.appendChild(body);

    content.innerHTML = '';
    content.appendChild(div);
    wireReviewSettings(div);
  }

  // Wire the collapsible review-settings panel (cap + due-days + retire-on-easy).
  function wireReviewSettings(root) {
    const btn   = root.querySelector('#reviewSettingsBtn');
    const panel = root.querySelector('#reviewSettings');
    const cap   = root.querySelector('#cfgDailyCap');
    const retire= root.querySelector('#cfgRetire');
    const hard  = root.querySelector('#cfgHardDays');
    const good  = root.querySelector('#cfgGoodDays');
    const easy  = root.querySelector('#cfgEasyDays');
    if (!btn || !panel) return;

    // Keep the panel open across the re-render triggered by a cap change.
    let keepOpen = panel.dataset.open === '1';
    if (keepOpen) panel.hidden = false;

    btn.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      panel.dataset.open = panel.hidden ? '0' : '1';
    });

    cap.addEventListener('change', () => {
      reviewCfg.dailyCap = Math.max(0, parseInt(cap.value, 10) || 0);
      saveReviewCfg();
      panel.dataset.open = '1';
      renderReview();          // re-render with the new cap
    });
    retire.addEventListener('change', () => {
      reviewCfg.retireOnEasy = retire.checked;
      easy.disabled = retire.checked;   // easy-days irrelevant when retiring
      saveReviewCfg();
    });
    [['hardDays', hard], ['goodDays', good], ['easyDays', easy]].forEach(([key, el]) => {
      el.addEventListener('change', () => {
        reviewCfg[key] = Math.max(0, parseInt(el.value, 10) || 0);
        saveReviewCfg();
      });
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  async function render() {
    // Leaving review view → restore the tab group for topic views.
    conceptsTab.parentElement.style.display = '';
    content.innerHTML = '';
    try {
      if (currentTab === 'concepts') {
        const div = await loadMarkdown('concepts', currentTopic);
        content.appendChild(div);

        // Make each ## section collapsible + add a pattern jump-list
        enhanceConceptSections(div);

        // Collect mermaid nodes BEFORE mermaid.run() replaces them
        const mermaidNodes = [...content.querySelectorAll('.mermaid')];
        
        if (mermaidNodes.length > 0) {
          // Wrap each in interactive container first
          mermaidNodes.forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-wrapper';
            const inner = document.createElement('div');
            inner.className = 'mermaid-inner';
            const hint = document.createElement('div');
            hint.className = 'mermaid-hint';
            hint.textContent = 'Scroll to zoom · Drag to pan';
            const controls = document.createElement('div');
            controls.className = 'mermaid-controls';
            controls.innerHTML = `
              <button class="btn-zoom-out" title="Zoom out">−</button>
              <span class="zoom-label">100%</span>
              <button class="btn-zoom-in" title="Zoom in">+</button>
              <div class="ctrl-divider"></div>
              <button class="btn-reset" title="Fit to screen">⊡</button>
              <div class="ctrl-divider"></div>
              <button class="btn-fullscreen" title="Full screen">⛶</button>`;
            el.parentNode.insertBefore(wrapper, el);
            inner.appendChild(el);
            wrapper.appendChild(inner);
            wrapper.appendChild(hint);
            wrapper.appendChild(controls);
          });
          
          // Let mermaid render all .mermaid divs
          try {
            await mermaid.run({ nodes: content.querySelectorAll('.mermaid') });
          } catch (err) {
            console.error('Mermaid rendering error:', err);
          }
          
          // Wire up interactivity after SVG is rendered
          setTimeout(() => {
            content.querySelectorAll('.mermaid-wrapper').forEach(wrapper => {
              makeDiagramInteractive(wrapper);
            });
          }, 300);
        }
      } else {
        content.appendChild(await loadPracticeMarkdown(currentTopic));
        updateStats();
      }
    } catch (err) {
      console.error(err);
      content.innerHTML = `<p class="error-message">Error loading content.</p>`;
    }
  }

  // ── Viz rendering — delegated to src/viz/ ────────────────────────────────
  // VizEngine is loaded via src/viz/index.js before main.js.
  function renderViz(container, specText) {
    VizEngine.render(container, specText);
  }

  // ── Make concept ## sections collapsible + build a pattern jump-list ──────
  function enhanceConceptSections(root) {
    const h2s = [...root.querySelectorAll('h2')];
    if (h2s.length < 2) return;  // nothing worth sectioning

    const toc = [];  // { id, title, setOpen, isOpen }

    h2s.forEach((h2, idx) => {
      // Collect siblings until the next h2
      const body = document.createElement('div');
      body.className = 'concept-body open';
      const siblings = [];
      let el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') { siblings.push(el); el = el.nextElementSibling; }
      h2.after(body);
      siblings.forEach(s => body.appendChild(s));

      const id = `concept-sec-${idx}`;
      h2.id = id;
      h2.classList.add('concept-heading');

      const chevron = document.createElement('span');
      chevron.className = 'concept-chevron';
      chevron.textContent = '▾';
      h2.appendChild(chevron);

      function setOpen(open) {
        body.classList.toggle('open', open);
        chevron.style.transform = open ? '' : 'rotate(-90deg)';
      }
      h2.addEventListener('click', () => setOpen(!body.classList.contains('open')));

      toc.push({ id, title: h2.textContent.replace('▾', '').trim(), setOpen,
                 isOpen: () => body.classList.contains('open') });
    });

    // Build the jump-list + expand/collapse-all toolbar at the very top
    const nav = document.createElement('div');
    nav.className = 'concept-toc';

    const chips = document.createElement('div');
    chips.className = 'concept-toc-chips';
    toc.forEach(t => {
      const chip = document.createElement('button');
      chip.className = 'concept-toc-chip';
      chip.textContent = t.title;
      chip.addEventListener('click', () => {
        t.setOpen(true);
        document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      chips.appendChild(chip);
    });

    const toggleAll = document.createElement('button');
    toggleAll.className = 'concept-toc-toggle';
    function syncToggle() {
      toggleAll.textContent = toc.some(t => t.isOpen()) ? 'Collapse all' : 'Expand all';
    }
    toggleAll.addEventListener('click', () => {
      const anyOpen = toc.some(t => t.isOpen());
      toc.forEach(t => t.setOpen(!anyOpen));
      syncToggle();
    });
    syncToggle();

    nav.appendChild(chips);
    nav.appendChild(toggleAll);
    root.insertBefore(nav, root.firstChild);
  }

  // ── Concepts markdown (full markdown render) ─────────────────────────────
  async function loadMarkdown(folder, topic) {
    const res = await fetch(`src/${folder}/${topic}.md?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    const renderer = new marked.Renderer();
    
    renderer.link = function(href, title, text) {
      return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    };
    
    renderer.code = function(code, language) {
      if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
      }
      if (language === 'viz') {
        const id = 'viz-' + Math.random().toString(36).slice(2, 9);
        // Store spec for post-processing
        window.__vizQueue = window.__vizQueue || [];
        window.__vizQueue.push({ id, spec: code });
        return `<div class="viz-container" id="${id}"></div>`;
      }
      const highlighted = language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language }).value
        : hljs.highlightAuto(code).value;
      return `<pre><code class="language-${language || ''}">${highlighted}</code></pre>`;
    };

    const div = document.createElement('div');
    div.className = 'markdown-content';
    div.innerHTML = marked.parse(md, { renderer, breaks: true, gfm: true });

    // Render any viz blocks
    if (window.__vizQueue && window.__vizQueue.length) {
      window.__vizQueue.forEach(({ id, spec }) => {
        const el = div.querySelector(`#${id}`);
        if (el) renderViz(el, spec);
      });
      window.__vizQueue = [];
    }
    return div;
  }

  // ── Review rating control (added to each problem row) ─────────────────────
  const RATINGS = [
    ['again', 'Again'],
    ['hard',  'Hard'],
    ['good',  'Good'],
    ['easy',  'Easy']
  ];

  function attachReviewControls(item, url, opts = {}) {
    const wrap = document.createElement('span');
    wrap.className = 'review-controls';

    const status = document.createElement('span');
    status.className = 'review-status';

    // Gating: in topic view, only reveal the rating buttons once the problem
    // is solved or already has a review schedule.
    const gateCb = opts.gatedBy || null;
    function shouldShow() {
      if (!gateCb) return true;              // review view or ungated
      return gateCb.checked || !!reviewData[url];
    }
    function applyVisibility() {
      wrap.style.display = shouldShow() ? 'inline-flex' : 'none';
    }

    function refreshStatus() {
      if (reviewData[url]) {
        status.textContent = nextReviewLabel(url);
        status.classList.toggle('due', isDue(url));
      } else {
        status.textContent = '';
      }
    }

    RATINGS.forEach(([key, label]) => {
      const b = document.createElement('button');
      b.className = `review-btn review-${key}`;
      b.type = 'button';
      b.textContent = label;
      b.title = `Rate recall: ${label}`;
      b.addEventListener('click', () => {
        scheduleReview(url, key);
        refreshStatus();
        refreshSidebarProgress();
        // If we're inside the Review view, drop the row once rated (no longer due).
        const li = item.closest('li');
        if (li && li.dataset.reviewRow === '1' && !isDue(url)) {
          li.classList.add('review-cleared');
          setTimeout(() => { li.remove(); updateReviewHeaderCount(); }, 250);
        }
      });
      wrap.appendChild(b);
    });

    wrap.appendChild(status);
    item.appendChild(wrap);
    refreshStatus();
    applyVisibility();
    if (gateCb) gateCb.addEventListener('change', applyVisibility);
  }

  function updateReviewHeaderCount() {
    const el = document.getElementById('reviewDueCount');
    if (el) el.textContent = dueCount();
  }

  // ── Per-problem note control (button + collapsible editor) ────────────────
  function attachNoteControl(item, url) {
    const btn = document.createElement('button');
    btn.className = 'note-btn';
    btn.type = 'button';
    btn.textContent = 'Note';
    btn.title = 'Add a personal note for this problem';
    function markState() { btn.classList.toggle('has-note', hasNote(url)); }
    markState();

    const li = item.closest('li');
    const panel = document.createElement('div');
    panel.className = 'note-panel-wrap';
    const ta = document.createElement('textarea');
    ta.className = 'note-textarea';
    ta.placeholder = 'Your notes: the key insight, gotchas, a cleaner approach…';
    ta.value = notesData[url] || '';
    const savedMsg = document.createElement('span');
    savedMsg.className = 'note-saved';
    panel.appendChild(ta);
    panel.appendChild(savedMsg);

    let saveTimer = null;
    ta.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveNote(url, ta.value);
        markState();
        savedMsg.textContent = 'saved';
        setTimeout(() => { savedMsg.textContent = ''; }, 1200);
      }, 400);
    });

    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      btn.classList.toggle('active', open);
      if (open) ta.focus();
    });

    item.appendChild(btn);
    li.appendChild(panel);
  }

  // ── Practice markdown (with checkboxes) ───────────────────────────────────
  async function loadPracticeMarkdown(topic) {
    const res = await fetch(`src/problems/${topic}.md?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    let itemIndex = 0;

    const instance = new marked.Marked({
      breaks: true,
      gfm: true,
      renderer: {
        link(href, title, rawText) {
          const cleanText = (rawText || '').replace(/\s*`[^`]+`\s*$/, '');
          const badgeMatch = (rawText || '').match(/`([^`]+)`\s*$/);
          const badge = badgeMatch ? badgeMatch[1].split(' ')[0] : '';
          itemIndex++;
          const id = `${topic}-${itemIndex}`;
          const checked = solvedProblems.has(id) ? 'checked' : '';
          return `<span class="practice-item">
            <label class="checkbox-container">
              <input type="checkbox" data-id="${id}" ${checked}>
              <span class="checkmark"></span>
            </label>
            <a href="${href}" target="_blank" rel="noopener" class="problem-link">${cleanText}</a>
            ${badge ? `<span class="problem-category ${badge}">${badge}</span>` : ''}
          </span>`;
        }
      }
    });

    const div = document.createElement('div');
    div.className = 'markdown-content practice-md';
    div.innerHTML = instance.parse(md);

    div.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      const id = cb.dataset.id;
      const li = cb.closest('li');
      if (solvedProblems.has(id)) li?.classList.add('completed');
      cb.addEventListener('change', e => {
        saveCheckboxState(id, e.target.checked);
        li?.classList.toggle('completed', e.target.checked);
        updateStats();
      });
    });

    // ── Attach spaced-review rating controls to each problem row ──────────
    // In topic view, controls reveal once the problem is solved or already
    // scheduled (keeps unsolved rows clean); always shown in the Review view.
    div.querySelectorAll('.practice-item').forEach(item => {
      const link = item.querySelector('.problem-link');
      if (!link) return;
      const url = link.getAttribute('href');
      const cb = item.querySelector('input[type="checkbox"]');
      attachReviewControls(item, url, { gatedBy: cb });
      attachNoteControl(item, url);
    });

    // ── Inject hint buttons for problems that have hints ──────────────────
    const hints = await loadHints(topic);
    if (hints) {
      div.querySelectorAll('.practice-item').forEach(item => {
        const link = item.querySelector('.problem-link');
        const hint = link && hints[link.getAttribute('href')];
        if (!hint) return;

        const btn = document.createElement('button');
        btn.className = 'hint-btn';
        btn.type = 'button';
        btn.textContent = 'Hint';
        btn.title = 'Show Brute / Better / Optimal approaches';

        const panel = document.createElement('div');
        panel.className = 'hint-panel-wrap';
        panel.innerHTML = buildHintPanel(hint);

        btn.addEventListener('click', () => {
          const open = panel.classList.toggle('open');
          btn.classList.toggle('active', open);
        });

        // Button sits in the row; panel goes below the row (full width)
        item.appendChild(btn);
        item.closest('li').appendChild(panel);
      });
    }

    // Track every section so the toolbar can expand/collapse all at once.
    const sectionToggles = [];  // { open(), close(), isOpen() }

    // ── Fold/unfold each ## section ───────────────────────────────────────
    div.querySelectorAll('h2').forEach(h2 => {
      // Collect all sibling nodes until the next h2
      const siblings = [];
      let el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') {
        siblings.push(el);
        el = el.nextElementSibling;
      }
      if (!siblings.length) return;

      // Wrap siblings in a collapsible body div
      const body = document.createElement('div');
      body.className = 'section-body open';
      h2.after(body);
      siblings.forEach(s => body.appendChild(s));

      // Count problems and completed in this section
      function sectionStats() {
        const total = body.querySelectorAll('input[type="checkbox"]').length;
        const done  = body.querySelectorAll('input[type="checkbox"]:checked').length;
        return { total, done };
      }

      // Build header
      const { total, done } = sectionStats();
      const chevron = document.createElement('span');
      chevron.className = 'section-chevron';
      chevron.textContent = '▾';

      const badge = document.createElement('span');
      badge.className = 'section-badge';
      badge.textContent = `${done}/${total}`;

      h2.classList.add('section-heading');
      h2.appendChild(badge);
      h2.appendChild(chevron);

      // Update badge when checkboxes change
      body.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          const s = sectionStats();
          badge.textContent = `${s.done}/${s.total}`;
          badge.classList.toggle('all-done', s.done === s.total);
        });
      });

      // Section open/close helpers (shared with the toolbar)
      function setOpen(open) {
        body.classList.toggle('open', open);
        chevron.style.transform = open ? '' : 'rotate(-90deg)';
      }
      sectionToggles.push({
        setOpen,
        isOpen: () => body.classList.contains('open')
      });

      // Toggle on click
      h2.addEventListener('click', () => setOpen(!body.classList.contains('open')));
    });

    // ── Expand all / Collapse all toggle ──────────────────────────────────
    if (sectionToggles.length > 1) {
      const bar = document.createElement('div');
      bar.className = 'practice-toolbar';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'practice-tool-btn';

      // Label reflects the action that will happen next: if any section is
      // open, the button collapses all; otherwise it expands all.
      function syncLabel() {
        const anyOpen = sectionToggles.some(s => s.isOpen());
        toggleBtn.textContent = anyOpen ? 'Collapse all' : 'Expand all';
      }

      toggleBtn.addEventListener('click', () => {
        const anyOpen = sectionToggles.some(s => s.isOpen());
        sectionToggles.forEach(s => s.setOpen(!anyOpen));
        syncLabel();
      });

      syncLabel();
      bar.appendChild(toggleBtn);
      div.insertBefore(bar, div.firstChild);
    }

    return div;
  }

  // ── Preload problem totals for all topics (fills sidebar badges) ───────────
  async function preloadTopicTotals() {
    await Promise.all(ALL_TOPICS.map(async (t) => {
      if (!PROBLEMS_TOPICS.has(t)) return;
      try {
        const res = await fetch(`src/problems/${t}.md?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const md = await res.text();
        const matches = md.match(/^\s*\d+\.\s+\[/gm);
        topicTotals[t] = matches ? matches.length : 0;
      } catch (_) { /* ignore */ }
    }));
    refreshSidebarProgress();
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  loadSolvedProblems();
  loadReviewData();
  loadNotes();
  buildSidebar();
  syncTabs();
  render();
  preloadTopicTotals();
});
