/**
 * Vignesh Pai K — Personal Site
 * Editorial Design System — Interactive Enhancements
 */

(function () {
  'use strict';

  // ============================================================================
  // Intersection Observer — Reveal Animations
  // ============================================================================

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all reveal elements
  const revealElements = document.querySelectorAll(
    '.section, .hero-card, .hero-text, .stagger-children'
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ============================================================================
  // Header — Scroll State Management
  // ============================================================================

  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = 0;
  let ticking = false;

  const updateHeaderState = () => {
    if (!siteHeader) return;

    const scrollY = window.scrollY;
    const shouldShrink = scrollY > 30;

    siteHeader.classList.toggle('is-scrolled', shouldShrink);

    lastScrollY = scrollY;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };

  // Initialize header state
  updateHeaderState();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ============================================================================
  // Back to Top Button
  // ============================================================================

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
        // Trigger stagger animation after revealing
        requestAnimationFrame(() => {
          moreLinks.classList.add('is-visible');
        });
        moreToggle.textContent = 'Less writing';
      } else {
        moreLinks.classList.remove('is-visible');
        // Wait for animation to complete before hiding
        setTimeout(() => {
          moreLinks.setAttribute('hidden', '');
        }, 400);
        moreToggle.textContent = 'More writing';
      }
    });
  }

  // ============================================================================
  // Smooth Hover Effects — Cards
  // ============================================================================

  const cards = document.querySelectorAll('.story-card, .timeline-item');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });

    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });

  // ============================================================================
  // Navigation — Active State (for single page navigation)
  // ============================================================================

  const navLinks = document.querySelectorAll('.nav a');
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href');

    // Check if this is the current page
    if (linkPath === currentPath ||
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });

  // ============================================================================
  // Performance — Reduce motion for users who prefer it
  // ============================================================================

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--duration-fast', '0s');
    document.documentElement.style.setProperty('--duration-normal', '0s');
    document.documentElement.style.setProperty('--duration-slow', '0s');

    // Make all reveal elements immediately visible
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  }
})();
