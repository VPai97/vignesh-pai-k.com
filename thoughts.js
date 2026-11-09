/**
 * Thoughts page: lists posts from Vignesh's Substack.
 * Data comes from /api/thoughts (functions/api/thoughts.js), which reads the Substack feed.
 * All text is HTML-escaped; only https links and images are used.
 */
(function () {
  'use strict';

  const feed = document.getElementById('feed');
  if (!feed) return;

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const https = (u) => (/^https:\/\//i.test(u || '') ? u : '');
  const fmtDate = (d) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || '');
    return m ? `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]} ${m[1]}` : '';
  };

  const subscribe = (src) =>
    https(src)
      ? `<a class="button primary" href="${esc(src)}/subscribe" target="_blank" rel="noopener">Subscribe on Substack</a>`
      : '';

  const render = ({ posts = [], source = '', error }) => {
    if (error) throw new Error(error);
    if (!posts.length) {
      feed.innerHTML = `<div class="feed-empty-block"><p class="feed-empty">No posts yet. New ones show up here a few minutes after they're published on Substack.</p>${subscribe(source)}</div>`;
      return;
    }
    const rows = posts
      .map((p) => {
        const url = https(p.url);
        if (!url) return '';
        const img = https(p.image);
        return `<a class="thought" href="${esc(url)}" target="_blank" rel="noopener">
          <div class="thought-text">
            <p class="post-date">${esc(fmtDate(p.date))}</p>
            <h2 class="thought-title">${esc(p.title)}</h2>
            ${p.subtitle ? `<p class="thought-sub">${esc(p.subtitle)}</p>` : ''}
          </div>
          ${img ? `<img class="thought-img" src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ''}
        </a>`;
      })
      .join('');
    feed.innerHTML = `<div class="thought-list">${rows}</div><div class="feed-subscribe">${subscribe(source)}</div>`;
  };

  fetch('/api/thoughts')
    .then((r) => r.json())
    .then(render)
    .catch(() => {
      feed.innerHTML = '<p class="feed-empty">The posts couldn’t be loaded. Refresh the page to try again.</p>';
    });
})();
