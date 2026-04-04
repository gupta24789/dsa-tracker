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

  const topicFilter    = document.getElementById("topicFilter");
  const content        = document.getElementById("content");
  const resetButton    = document.getElementById("resetButton");
  const tabsRow        = document.getElementById("tabsRow");
  const conceptsTab    = document.getElementById("conceptsTab");
  const problemsTab    = document.getElementById("problemsTab");
  const statsContainer = document.querySelector('.stats-container');

  let currentTopic = "array";
  let currentTab   = "concepts"; // "concepts" | "problems"

  // ── Populate topic dropdown ───────────────────────────────────────────────
  function populateTopicDropdown() {
    ALL_TOPICS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = formatName(t);
      topicFilter.appendChild(opt);
    });
  }

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

    // Stats + reset only for problems tab
    const showStats = currentTab === 'problems';
    statsContainer.style.display = showStats ? 'flex' : 'none';
    resetButton.style.display    = showStats ? 'inline-block' : 'none';
  }

  // ── Event: topic change ───────────────────────────────────────────────────
  topicFilter.addEventListener("change", () => {
    currentTopic = topicFilter.value;
    syncTabs();
    render();
  });

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
    updateStats();
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

  // ── Render ────────────────────────────────────────────────────────────────
  async function render() {
    content.innerHTML = '';
    try {
      if (currentTab === 'concepts') {
        const div = await loadMarkdown('concepts', currentTopic);
        content.appendChild(div);
        
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
      const highlighted = language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language }).value
        : hljs.highlightAuto(code).value;
      return `<pre><code class="language-${language || ''}">${highlighted}</code></pre>`;
    };

    const div = document.createElement('div');
    div.className = 'markdown-content';
    div.innerHTML = marked.parse(md, { renderer, breaks: true, gfm: true });
    return div;
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

      // Toggle on click
      h2.addEventListener('click', () => {
        const isOpen = body.classList.toggle('open');
        chevron.style.transform = isOpen ? '' : 'rotate(-90deg)';
      });
    });

    return div;
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  loadSolvedProblems();
  populateTopicDropdown();
  topicFilter.value = currentTopic;
  syncTabs();
  render();
});
