// ── Viz engine entry point ────────────────────────────────────────────────────
// Dispatches to the correct renderer based on spec.type, then wires up
// the shared playback controls (prev / play / next / reset + progress bar).
//
// Depends on (loaded before this file):
//   src/viz/colors.js      → window.VizColors
//   src/viz/array.js       → window.VizArray
//   src/viz/table.js       → window.VizTable
//   src/viz/tree.js        → window.VizTree
//   src/viz/linkedlist.js  → window.VizLinkedList
//   src/viz/graph.js       → window.VizGraph
//   src/viz/stackqueue.js  → window.VizStack, window.VizQueue
//   src/viz/recursion.js   → window.VizRecursion
//   src/viz/heap.js        → window.VizHeap

window.VizEngine = {
  // Map type string → renderer object (must have a .build(spec, stepIdx) method)
  renderers: {
    array:      () => window.VizArray,
    table:      () => window.VizTable,
    tree:       () => window.VizTree,
    linkedlist: () => window.VizLinkedList,
    graph:      () => window.VizGraph,
    stack:      () => window.VizStack,
    queue:      () => window.VizQueue,
    recursion:  () => window.VizRecursion,
    heap:       () => window.VizHeap,
  },

  render(container, specText) {
    let spec;
    try {
      spec = JSON.parse(specText);
    } catch (e) {
      container.innerHTML = `<div class="viz-error">Invalid viz JSON: ${e.message}</div>`;
      return;
    }

    const type    = spec.type  || 'array';
    const steps   = spec.steps || [];
    const title   = spec.title || '';
    const desc    = spec.description || '';
    const speed   = spec.speed || 900;

    const getRenderer = this.renderers[type];
    if (!getRenderer) {
      container.innerHTML = `<div class="viz-error">Unknown viz type: "${type}"</div>`;
      return;
    }
    const renderer = getRenderer();

    let currentStep = 0;
    let playing     = false;
    let timer       = null;

    // ── Build shell DOM ──────────────────────────────────────────────────────
    container.className = 'viz-container';
    container.innerHTML = `
      ${title ? `<div class="viz-title">${title}</div>` : ''}
      ${desc   ? `<div class="viz-desc">${desc}</div>`   : ''}
      <div class="viz-area"></div>
      <div class="viz-progress-track"><div class="viz-progress-fill"></div></div>
      <div class="viz-controls">
        <button class="viz-btn" id="vbPrev">◀</button>
        <button class="viz-btn viz-btn-play" id="vbPlay">▶</button>
        <button class="viz-btn" id="vbNext">▶|</button>
        <span class="viz-step-counter"></span>
        <button class="viz-btn viz-btn-reset" id="vbReset">↺</button>
      </div>
    `;

    const vizArea     = container.querySelector('.viz-area');
    const btnPrev     = container.querySelector('#vbPrev');
    const btnPlay     = container.querySelector('#vbPlay');
    const btnNext     = container.querySelector('#vbNext');
    const btnReset    = container.querySelector('#vbReset');
    const stepCounter = container.querySelector('.viz-step-counter');
    const progressBar = container.querySelector('.viz-progress-fill');

    // ── Render one step ──────────────────────────────────────────────────────
    function renderStep() {
      vizArea.innerHTML = renderer.build(spec, currentStep);
      stepCounter.textContent = `Step ${currentStep + 1} / ${steps.length}`;
      btnPrev.disabled = currentStep === 0;
      btnNext.disabled = currentStep === steps.length - 1;
      progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    }

    function stepTo(idx) {
      currentStep = Math.max(0, Math.min(steps.length - 1, idx));
      renderStep();
    }

    function togglePlay() {
      playing = !playing;
      btnPlay.textContent = playing ? '⏸' : '▶';
      if (playing) {
        timer = setInterval(() => {
          if (currentStep >= steps.length - 1) {
            playing = false;
            btnPlay.textContent = '▶';
            clearInterval(timer);
            return;
          }
          stepTo(currentStep + 1);
        }, speed);
      } else {
        clearInterval(timer);
      }
    }

    // ── Wire controls ────────────────────────────────────────────────────────
    btnPrev.addEventListener('click',  () => { if (playing) togglePlay(); stepTo(currentStep - 1); });
    btnNext.addEventListener('click',  () => { if (playing) togglePlay(); stepTo(currentStep + 1); });
    btnPlay.addEventListener('click',  () => togglePlay());
    btnReset.addEventListener('click', () => { if (playing) togglePlay(); stepTo(0); });

    renderStep();
  },
};
