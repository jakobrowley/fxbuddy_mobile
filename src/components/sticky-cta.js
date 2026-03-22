/**
 * Sticky CTA component
 * Floats above the tab bar, appears when the hero section scrolls out of view.
 */

let ctaEl = null;
let observer = null;

export function initStickyCta(pageContainer) {
  destroyStickyCta();

  ctaEl = document.createElement('button');
  ctaEl.className = 'sticky-cta btn-primary hidden';
  ctaEl.textContent = 'Get Started';
  ctaEl.setAttribute('type', 'button');
  ctaEl.setAttribute('aria-label', 'Get started with FXbuddy');
  document.body.appendChild(ctaEl);

  ctaEl.addEventListener('click', () => {
    window.location.hash = '#get-started';
  });

  // Watch the hero section — show CTA when hero leaves viewport
  const hero = pageContainer.querySelector('.home-hero');
  if (!hero) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (ctaEl) {
        ctaEl.classList.toggle('hidden', entry.isIntersecting);
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

export function destroyStickyCta() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (ctaEl && ctaEl.parentNode) {
    ctaEl.parentNode.removeChild(ctaEl);
    ctaEl = null;
  }
}
