const siteHeader = document.querySelector(".site-header");

const revealElements = document.querySelectorAll(".section, .hero-card, .hero-text");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const updateHeaderState = () => {
  if (!siteHeader) return;
  const shouldShrink = window.scrollY > 30;
  siteHeader.classList.toggle("is-scrolled", shouldShrink);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const moreToggle = document.querySelector(".more-toggle");
const moreLinks = document.querySelector(".more-links");

if (moreToggle && moreLinks) {
  moreToggle.addEventListener("click", () => {
    const isHidden = moreLinks.hasAttribute("hidden");
    if (isHidden) {
      moreLinks.removeAttribute("hidden");
      moreToggle.textContent = "Less writing";
    } else {
      moreLinks.setAttribute("hidden", "");
      moreToggle.textContent = "More writing";
    }
  });
}
