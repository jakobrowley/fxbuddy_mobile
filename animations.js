// ============================================================
// FXBUDDY GSAP ANIMATIONS
// ------------------------------------------------------------
// TO DISABLE ALL GSAP ANIMATIONS:
//   1. Flip GSAP_ENABLED to false below, OR
//   2. Append ?gsap=0 to any URL, OR
//   3. Delete this file + its <script> tag in index.html
// All existing CSS keyframes + IntersectionObserver reveals
// will resume working automatically.
// ============================================================

(function () {
  const GSAP_ENABLED = true;

  const urlDisabled = new URLSearchParams(window.location.search).get('gsap') === '0';
  if (!GSAP_ENABLED || urlDisabled) return;

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('[fxbuddy] GSAP not loaded — falling back to CSS animations.');
    return;
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power2.out', duration: 0.8 });

    document.documentElement.classList.add('gsap-ready');

    // Hero intro runs immediately (not inside matchMedia) so items don't flash
    // before the timeline takes over. It is idempotent and respects reduced motion.
    initHeroIntro();

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions;

      // ── Baseline reveal system (same visual behavior as original IntersectionObserver) ──
      const revealDuration = reduceMotion ? 0.01 : 0.8;
      const stepSelector = '.step-card';
      const revealSelector = reduceMotion
        ? '.reveal:not(.reveal-stagger)'
        : '.reveal:not(.reveal-stagger):not(' + stepSelector + ')';

      gsap.set(revealSelector, { y: 30, autoAlpha: 0 });
      gsap.utils.toArray('.reveal-stagger').forEach((parent) => {
        gsap.set(parent.children, { y: 30, autoAlpha: 0 });
      });

      ScrollTrigger.batch(revealSelector, {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
          y: 0, autoAlpha: 1, stagger: 0.08, duration: revealDuration, overwrite: true
        })
      });

      ScrollTrigger.batch('.reveal-stagger', {
        start: 'top 80%',
        onEnter: (batch) => {
          batch.forEach((parent) => {
            gsap.to(parent.children, {
              y: 0, autoAlpha: 1, stagger: 0.1, duration: revealDuration, overwrite: true
            });
          });
        }
      });

      if (!reduceMotion) {
        initSteps();
        if (isDesktop) {
          initCardTilt('.pricing-card', '.pricing-grid');
          initCardTilt('.step-card', '.steps-grid');
          initCardTilt('.demo-review', '.demo-reviews');
        }
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Hero intro — plugin slide-up + item burst from plugin center
  // Replaces the CSS @keyframes cannon-* and plugin-slide-up animations.
  // Items' start positions are computed from the live plugin frame
  // rect so the burst origin is pixel-accurate at any viewport size.
  // ──────────────────────────────────────────────────────────────
  function initHeroIntro() {
    const pluginFrame = document.querySelector('.plugin-frame');
    const items = gsap.utils.toArray('.hero .float-pill, .hero .float-gif');
    if (!pluginFrame || !items.length) return;

    // Bail on mobile — the plugin-showcase and floating items are display:none
    // there, so their getBoundingClientRect() returns 0s and the float loops
    // would run forever on hidden elements.
    if (pluginFrame.offsetParent === null || window.innerWidth < 768) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hide everything via inline styles (beats CSS class rules).
    gsap.set(items, { autoAlpha: 0 });
    gsap.set(pluginFrame, { y: reduceMotion ? 0 : 80, scale: reduceMotion ? 1 : 0.94, autoAlpha: 0 });

    // Move items to their final layout positions. Base CSS hides them (.float-*
    // has opacity: 0) and .dispersed sets the final top/left. Inline autoAlpha: 0
    // keeps them invisible while we measure.
    items.forEach(el => el.classList.add('dispersed'));

    // Read all positions in one pass to avoid layout thrash.
    const build = () => {
      // Measure plugin at its FINAL resting position, not its initial animated
      // state. Base CSS has `transform: translateY(80px)` and our gsap.set adds
      // y: 80. We temporarily override the transform to read the real layout
      // rect, then restore. No paint happens between these lines.
      const savedInline = pluginFrame.style.transform;
      pluginFrame.style.transform = 'none';
      const pr = pluginFrame.getBoundingClientRect();
      pluginFrame.style.transform = savedInline;

      const cx = pr.left + pr.width  / 2;
      const cy = pr.top  + pr.height / 2;

      const data = items.map(el => {
        const r = el.getBoundingClientRect();
        return {
          el,
          fromX: cx - (r.left + r.width  / 2),
          fromY: cy - (r.top  + r.height / 2)
        };
      });

      if (reduceMotion) {
        gsap.set(pluginFrame, { autoAlpha: 1 });
        gsap.set(items, { autoAlpha: 1 });
        document.querySelectorAll('.hero .float-gif video').forEach(v => v.play().catch(() => {}));
        return;
      }

      const tl = gsap.timeline({ delay: 0.15 });

      // 1) Plugin slides up from below with a gentle overshoot.
      tl.to(pluginFrame, {
        y: 0, scale: 1, autoAlpha: 1,
        duration: 0.95,
        ease: 'back.out(1.4)',
        clearProps: 'transform,opacity,visibility'
      });

      // 2) Items burst from plugin center to their dispersed positions.
      tl.fromTo(items,
        {
          x: (i) => data[i].fromX,
          y: (i) => data[i].fromY,
          scale: 0.28,
          autoAlpha: 0
        },
        {
          x: 0, y: 0, scale: 1, autoAlpha: 1,
          duration: 0.95,
          ease: 'back.out(1.25)',
          stagger: { amount: 0.45, from: 'random' }
        },
        '-=0.55'
      );

      // 3) Once burst completes, start gentle float loops + play videos.
      tl.call(() => {
        items.forEach(el => {
          gsap.to(el, {
            y: gsap.utils.random(-14, -6),
            duration: gsap.utils.random(3.5, 5.5),
            delay: gsap.utils.random(0, 0.4),
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
          });
        });
        document.querySelectorAll('.hero .float-gif video').forEach(v => v.play().catch(() => {}));
      });
    };

    // Wait a frame so layout is settled after .dispersed classes apply.
    requestAnimationFrame(() => requestAnimationFrame(build));
  }

  // ──────────────────────────────────────────────────────────────
  // How It Works step cards — slide in from left + smooth number pop
  // ──────────────────────────────────────────────────────────────
  function initSteps() {
    const stepCards = gsap.utils.toArray('.step-card');
    if (!stepCards.length) return;

    gsap.set(stepCards, { x: -40, autoAlpha: 0 });
    gsap.utils.toArray('.step-card .step-number').forEach(num => {
      gsap.set(num, { autoAlpha: 0, scale: 0.4 });
    });

    ScrollTrigger.create({
      trigger: '.steps-grid',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        stepCards.forEach((card, i) => {
          gsap.to(card, {
            x: 0, autoAlpha: 1,
            duration: 0.7, delay: i * 0.15,
            ease: 'power3.out'
          });
          const num = card.querySelector('.step-number');
          if (num) {
            gsap.to(num, {
              autoAlpha: 1, scale: 1,
              duration: 0.55, delay: i * 0.15 + 0.25,
              ease: 'back.out(1.7)'
            });
          }
        });
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Reusable 3D tilt — applied to pricing, step, and review cards
  // ──────────────────────────────────────────────────────────────
  function initCardTilt(cardSelector, parentSelector) {
    const cards = document.querySelectorAll(cardSelector);
    if (!cards.length) return;

    if (parentSelector) {
      document.querySelectorAll(parentSelector).forEach(el => {
        gsap.set(el, { perspective: 1000 });
      });
    }

    cards.forEach(card => {
      const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top)  / rect.height;
        rotY((px - 0.5) * 8);
        rotX((0.5 - py) * 8);
      });

      card.addEventListener('mouseleave', () => {
        rotX(0);
        rotY(0);
      });
    });
  }

})();
