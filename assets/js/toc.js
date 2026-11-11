// Inhaltsverzeichnis der Artikel:
// 1. Auf breiten Bildschirmen als mitlaufende Seitenspalte geöffnet,
//    auf schmalen als zugeklappte Aufklappliste.
// 2. Der Abschnitt, der gerade gelesen wird, ist im Verzeichnis hervorgehoben.
document.addEventListener('DOMContentLoaded', () => {
  const toc = document.querySelector('article > details.toc');
  if (!toc) return;

  const wide = window.matchMedia('(min-width: 1100px)');
  const sync = () => { toc.open = wide.matches; };
  sync();
  wide.addEventListener('change', sync);

  // Verweise des Verzeichnisses und die Abschnitte, auf die sie zeigen
  const entries = [];
  toc.querySelectorAll('a[href^="#"]').forEach(link => {
    const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
    if (target) entries.push({ link, target });
  });
  if (entries.length === 0) return;

  let current = null;
  const mark = () => {
    // Aktuell ist der letzte Abschnitt, dessen Anfang die Lesehöhe erreicht hat
    const line = window.innerHeight * 0.3;
    let found = null;
    for (const e of entries) {
      if (e.target.getBoundingClientRect().top <= line) found = e;
    }
    if (found === current) return;
    if (current) {
      current.link.classList.remove('is-current');
      current.link.removeAttribute('aria-current');
    }
    if (found) {
      found.link.classList.add('is-current');
      found.link.setAttribute('aria-current', 'location');
    }
    current = found;
  };

  window.addEventListener('scroll', mark, { passive: true });
  window.addEventListener('resize', mark);
  window.addEventListener('load', mark);
  mark();
});
