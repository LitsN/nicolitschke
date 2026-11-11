document.addEventListener('DOMContentLoaded', () => {
  (function () {
    // Die Kacheln stehen fest im HTML. Dieses Skript filtert sie nur.
    const CANONICAL = new Set([
      "safety-risiko", "engineering", "systemik", "fuehren-managen"
    ]);
    // Frühere Kategorien, die in "Projektmanagement" aufgegangen sind
    const LEGACY = { "mastery-lernen": "fuehren-managen", "skills-tools": "fuehren-managen" };

    const grid = document.getElementById('card-grid');
    const noMsg = document.getElementById('no-results-message');
    const tagButtons = document.querySelectorAll('.filter-button');
    const andFilterToggle = document.getElementById('and-filter-toggle');

    if (!grid) return;

    let activeTags = [];

    // Aufruf aus einem Artikel heraus: texte.html?tag=systemik
    function checkUrlForFilters() {
      const params = new URLSearchParams(window.location.search);
      let tag = params.get('tag');
      if (tag && LEGACY[tag]) tag = LEGACY[tag];
      if (tag && CANONICAL.has(tag)) {
        activeTags = [tag];
      }
    }

    function articleMatchesFilter(articleEl) {
      if (activeTags.length === 0) return true;
      const articleTags = (articleEl.getAttribute('data-tags') || '')
        .split(',').map(s => s.trim()).filter(Boolean);
      const useAnd = andFilterToggle && andFilterToggle.checked;
      return useAnd
        ? activeTags.every(t => articleTags.includes(t))
        : activeTags.some(t => articleTags.includes(t));
    }

    function applyFilter() {
      const cards = grid.querySelectorAll('.card');
      let any = false;
      cards.forEach(card => {
        const vis = articleMatchesFilter(card);
        card.style.display = vis ? '' : 'none'; // '' lässt CSS Grid entscheiden
        if (vis) any = true;
      });
      if (noMsg) noMsg.style.display = any ? 'none' : 'block';
      if (activeTags.length > 0) {
        window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
      }
    }

    function syncFilterButtons() {
      tagButtons.forEach(btn => {
        const t = btn.dataset.tag;
        const on = t === '__all' ? activeTags.length === 0 : activeTags.includes(t);
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function wireFilters() {
      tagButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tag = button.dataset.tag;
          if (tag === '__all') {
            activeTags = [];
          } else {
            if (activeTags.includes(tag)) activeTags = activeTags.filter(t => t !== tag);
            else activeTags.push(tag);
          }
          syncFilterButtons();
          applyFilter();
        });
      });
      if (andFilterToggle) andFilterToggle.addEventListener('change', applyFilter);
    }

    checkUrlForFilters();
    wireFilters();
    syncFilterButtons();
    applyFilter();
  })();
});
