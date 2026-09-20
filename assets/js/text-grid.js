document.addEventListener('DOMContentLoaded', () => {
  (function () {
    // Die Kacheln stehen fest im HTML. Dieses Skript filtert sie nur.
    const CANONICAL = new Set([
      "engineering", "fuehren-managen", "mastery-lernen",
      "safety-risiko", "skills-tools", "systemik"
    ]);

    const grid = document.getElementById('card-grid');
    const noMsg = document.getElementById('no-results-message');
    const tagButtons = document.querySelectorAll('.filter-button');
    const andFilterToggle = document.getElementById('and-filter-toggle');

    if (!grid) return;

    let activeTags = [];

    // Aufruf aus einem Artikel heraus: texte.html?tag=systemik
    function checkUrlForFilters() {
      const params = new URLSearchParams(window.location.search);
      const tag = params.get('tag');
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
        if (t === '__all') btn.classList.toggle('active', activeTags.length === 0);
        else btn.classList.toggle('active', activeTags.includes(t));
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
