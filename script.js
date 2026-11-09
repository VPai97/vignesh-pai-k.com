/**
 * Vignesh Pai K — personal site
 * Home hero "Under the lamp": the pointer is a desk lamp; clippings near it light up.
 */
(function () {
  'use strict';

  const hero = document.querySelector('[data-lamp]');
  if (!hero) return;

  const clips = Array.from(hero.querySelectorAll('.clip'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    clips.forEach((c) => c.style.setProperty('--lit', '0.8'));
    return;
  }

  let centers = [];
  let box = hero.getBoundingClientRect();
  let radius = 260;

  const measure = () => {
    box = hero.getBoundingClientRect();
    radius = box.width < 700 ? 170 : 270;
    centers = clips.map((c) => {
      if (c.offsetParent === null) return null; // hidden on this screen size
      const r = c.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
  };

  let lampX = 0;
  let lampY = 0;

  const light = (x, y) => {
    lampX = x;
    lampY = y;
    hero.style.setProperty('--lx', x + 'px');
    hero.style.setProperty('--ly', y + 'px');
    for (let i = 0; i < clips.length; i++) {
      const c = centers[i];
      if (!c) continue;
      const d = Math.hypot(c.x - x, c.y - y) / radius;
      const lit = d >= 1 ? 0 : 1 - d * d;
      clips[i].style.setProperty('--lit', lit.toFixed(3));
    }
  };

  // Idle: the lamp drifts slowly across the desk until someone takes over.
  let userControl = false;
  let resumeTimer = null;
  let visible = true;
  let t0 = performance.now();

  const drift = (now) => {
    if (!userControl && visible) {
      const t = (now - t0) / 1000;
      const w = box.width;
      const h = box.height;
      const cx = w < 700 ? w * 0.5 : w * 0.66;
      const ax = w < 700 ? w * 0.32 : w * 0.28;
      light(cx + Math.sin(t * 0.23) * ax, h * (w < 700 ? 0.3 : 0.5) + Math.sin(t * 0.37 + 1) * h * (w < 700 ? 0.2 : 0.32));
    }
    requestAnimationFrame(drift);
  };

  const takeOver = (x, y) => {
    userControl = true;
    clearTimeout(resumeTimer);
    light(x, y);
  };

  const releaseSoon = () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      userControl = false;
      t0 = performance.now() - 0; // restart the drift smoothly from its start
    }, 3000);
  };

  hero.addEventListener('pointermove', (e) => {
    takeOver(e.clientX - box.left, e.clientY - box.top);
  });
  hero.addEventListener('pointerdown', (e) => {
    takeOver(e.clientX - box.left, e.clientY - box.top);
  });
  hero.addEventListener('pointerleave', releaseSoon);
  hero.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') releaseSoon();
  });

  // Keyboard: focusing a clipping brings the lamp to it.
  clips.forEach((c, i) => {
    c.addEventListener('focus', () => {
      if (centers[i]) takeOver(centers[i].x, centers[i].y);
    });
    c.addEventListener('blur', releaseSoon);
  });

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }).observe(hero);

  window.addEventListener('resize', () => {
    measure();
    light(lampX, lampY);
  });
  window.addEventListener('scroll', () => {
    box = hero.getBoundingClientRect();
  }, { passive: true });

  measure();
  requestAnimationFrame(drift);
})();
