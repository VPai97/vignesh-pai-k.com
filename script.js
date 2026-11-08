/**
 * Vignesh Pai K — Personal Site
 * Ledger Design System — Interactive Enhancements
 */

(function () {
  'use strict';

  // ============================================================================
  // Header — Scroll State
  // ============================================================================

  const siteHeader = document.querySelector('.site-header');
  let ticking = false;

  const updateHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 30);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ============================================================================
  // Back to Top Button
  // ============================================================================

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================================
  // Writing Page — Toggle More Articles
  // ============================================================================

  const moreToggle = document.querySelector('.more-toggle');
  const moreLinks = document.querySelector('.more-links');

  if (moreToggle && moreLinks) {
    moreToggle.addEventListener('click', () => {
      const isHidden = moreLinks.hasAttribute('hidden');

      if (isHidden) {
        moreLinks.removeAttribute('hidden');
        moreToggle.textContent = 'Less writing';
      } else {
        moreLinks.setAttribute('hidden', '');
        moreToggle.textContent = 'More writing';
      }
    });
  }

  // ============================================================================
  // Navigation — Active State
  // ============================================================================

  const navLinks = document.querySelectorAll('.nav a');
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
})();
