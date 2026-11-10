/**
 * Writing page: filter the archive by title or subtitle as you type.
 * Year groups with no matches hide themselves.
 */
(function () {
  'use strict';

  const input = document.getElementById('story-search');
  const status = document.getElementById('search-status');
  const wrap = document.querySelector('.writing-archive');
  if (!input || !wrap) return;

  const cards = Array.from(wrap.querySelectorAll('.story-card'));
  const groups = Array.from(wrap.querySelectorAll('.year-group'));
  const total = cards.length + 1; // + the featured latest edition
  const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const text = cards.map((c) => norm(c.textContent));
  const feature = wrap.querySelector('.feature');
  const featureText = feature ? norm(feature.textContent) : '';

  const run = () => {
    const words = norm(input.value).split(/\s+/).filter(Boolean);
    const searching = words.length > 0;
    let shown = 0;
    cards.forEach((c, i) => {
      const hit = words.every((w) => text[i].includes(w));
      c.hidden = !hit;
      if (hit) shown++;
    });
    groups.forEach((g) => {
      g.hidden = !g.querySelector('.story-card:not([hidden])');
    });
    if (feature) {
      const hit = words.every((w) => featureText.includes(w));
      feature.hidden = searching && !hit;
      if (searching && hit) shown++;
    }
    if (!searching) status.textContent = '';
    else if (shown === 0) status.textContent = `No editions match “${input.value.trim()}”. Try a company, sector or one word from a title.`;
    else status.textContent = `${shown} of ${total} editions`;
  };

  input.addEventListener('input', run);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { input.value = ''; run(); }
  });
  run();
})();
