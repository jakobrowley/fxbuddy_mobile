/**
 * Home Tab — FXBuddy
 * Sections: Hero, Demo Video, Social Proof Carousel, Value Props, Cost Comparison
 */

import '../styles/home.css';
import { navigate } from '../router.js';
import { initStickyCta, destroyStickyCta } from '../components/sticky-cta.js';
import { Mascot } from '../mascot.js';

// ─── Render ──────────────────────────────────────────────────────────────────

export function render() {
  return `
    <!-- ── Hero ── -->
    <section class="home-hero" id="home-hero-section">
      <div class="mascot-container" id="home-mascot" aria-hidden="true">
        <div class="mascot-body">
          <div class="mascot-glare"></div>
          <div class="mascot-face">
            <div class="eyes">
              <svg class="eye left-eye" width="26" height="34" viewBox="0 0 18 24">
                <path class="eye-path" d="M 2 12 Q 9 12 16 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 0;" />
                <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" />
              </svg>
              <svg class="eye right-eye" width="26" height="34" viewBox="0 0 18 24">
                <path class="eye-path" d="M 2 12 Q 9 12 16 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 0;" />
                <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" />
              </svg>
            </div>
          </div>
        </div>
        <div class="mascot-shadow"></div>
      </div>

      <h1>Your new favorite editing sidekick</h1>
      <p class="subtitle">AI VFX for <img class="app-icon-inline" src="premiere-pro-logo.png" alt="Pr"> Premiere Pro &amp; <img class="app-icon-inline" src="after-effects-logo.png" alt="Ae"> After Effects</p>

      <div class="hero-buttons">
        <button type="button" class="btn-secondary" id="btn-watch-demo">Watch Demo</button>
        <button type="button" class="btn-primary" id="btn-see-effects">See Effects</button>
      </div>
    </section>

    <!-- ── Demo Videos Carousel ── -->
    <section class="demo-section">
      <h2 class="section-title">See it in action</h2>
      <div class="demo-carousel" id="demo-carousel">
        <div class="demo-video-container">
          <video src="effects/demo.mp4" autoplay muted loop playsinline aria-label="FXbuddy demo reel"></video>
          <span class="demo-label">Demo Reel</span>
        </div>
        <div class="demo-video-container">
          <video src="effects/set-on-fire-after.mp4" muted loop playsinline preload="metadata" aria-label="Set on fire effect"></video>
          <span class="demo-label">Set on Fire</span>
        </div>
        <div class="demo-video-container">
          <video src="effects/car-explode-after.mp4" muted loop playsinline preload="metadata" aria-label="Car explosion effect"></video>
          <span class="demo-label">Car Explosion</span>
        </div>
        <div class="demo-video-container">
          <video src="effects/lighting-after.mp4" muted loop playsinline preload="metadata" aria-label="Lightning effect"></video>
          <span class="demo-label">Lightning Strike</span>
        </div>
        <div class="demo-video-container">
          <video src="effects/twitter.mp4" muted loop playsinline preload="metadata" aria-label="Twitter post effect"></video>
          <span class="demo-label">Twitter Post</span>
        </div>
      </div>
      <div class="scroll-dots" id="demo-dots" aria-hidden="true">
        <span class="scroll-dot active" data-index="0"></span>
        <span class="scroll-dot" data-index="1"></span>
        <span class="scroll-dot" data-index="2"></span>
        <span class="scroll-dot" data-index="3"></span>
        <span class="scroll-dot" data-index="4"></span>
      </div>
    </section>

    <!-- ── Social Proof Carousel ── -->
    <section class="proof-section">
      <h2 class="section-title">Editors love Buddy</h2>
      <div class="testimonial-scroll" id="testimonial-scroll" role="list">
        <article class="card testimonial-card" role="listitem">
          <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
          <p class="testimonial-quote">"I used to charge $2K per music video. After I started adding VFX with FXbuddy, I raised my rate to $5K — and nobody flinched."</p>
          <p class="testimonial-name">Alex R.</p>
          <p class="testimonial-role">Music Video Editor, LA</p>
        </article>
        <article class="card testimonial-card" role="listitem">
          <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
          <p class="testimonial-quote">"The artist posted my edit on his story and tagged me. I got 14 DMs that week from other artists wanting to book me."</p>
          <p class="testimonial-name">Marcus T.</p>
          <p class="testimonial-role">Freelance Editor, Atlanta</p>
        </article>
        <article class="card testimonial-card" role="listitem">
          <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
          <p class="testimonial-quote">"Another editor in my city hit me up asking how I'm doing my VFX. FXbuddy is my unfair advantage."</p>
          <p class="testimonial-name">Priya K.</p>
          <p class="testimonial-role">Music Video Editor, London</p>
        </article>
      </div>
      <div class="scroll-dots" id="scroll-dots" aria-hidden="true">
        <span class="scroll-dot active" data-index="0"></span>
        <span class="scroll-dot" data-index="1"></span>
        <span class="scroll-dot" data-index="2"></span>
      </div>
    </section>

    <!-- ── Value Props ── -->
    <section class="value-section">
      <h2 class="section-title">Why editors switch to Buddy</h2>
      <div class="value-cards-list">
        <div class="card value-card">
          <div>
            <p class="value-title">30-Second VFX</p>
            <p class="value-desc">Type what you see. Buddy handles the rest.</p>
          </div>
        </div>
        <div class="card value-card">
          <div>
            <p class="value-title">Inside Your Timeline</p>
            <p class="value-desc">Works right inside Premiere Pro &amp; After Effects.</p>
          </div>
        </div>
        <div class="card value-card">
          <div>
            <p class="value-title">No VFX Skills Needed</p>
            <p class="value-desc">If you can describe it, you can create it.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Cost Comparison ── -->
    <section class="cost-section">
      <h2 class="section-title">Stop overpaying for VFX</h2>

      <div class="card cost-card">
        <p class="cost-label">VFX Freelancer</p>
        <ul class="cost-details">
          <li>1–2 week turnaround</li>
          <li>Limited revisions</li>
          <li>Schedule conflicts</li>
          <li>Expensive per project</li>
        </ul>
      </div>

      <div class="card cost-card highlighted">
        <p class="cost-label">FXbuddy</p>
        <ul class="cost-details">
          <li>30-second turnaround</li>
          <li>Unlimited generations</li>
          <li>Available 24/7</li>
          <li>A fraction of the cost</li>
        </ul>
      </div>

      <button type="button" class="btn-primary" id="btn-get-started-cost">
        Get Started
      </button>
    </section>

    <!-- ── YouTube Demo Bottom Sheet ── -->
    <div class="bottom-sheet-overlay" id="demo-sheet-overlay" role="dialog" aria-modal="true" aria-label="Watch demo video">
      <div class="bottom-sheet" id="demo-sheet">
        <div class="bottom-sheet-handle"></div>
        <h3 class="bottom-sheet-title">Watch the Demo</h3>
        <div class="youtube-sheet">
          <iframe
            id="demo-iframe"
            src=""
            data-src="https://www.youtube-nocookie.com/embed/61-6aqr-N3U?autoplay=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="FXbuddy demo video"
          ></iframe>
        </div>
      </div>
    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function init(container) {
  // ── Mascot ─────────────────────────────────────────────────────────────────
  const mascotContainer = container.querySelector('#home-mascot');
  if (mascotContainer) {
    window.homeMascot = new Mascot({
      container: mascotContainer,
      eyesSelector: '.eyes',
      eyeOvalSelector: '.eye-oval',
      eyePathSelector: '.eye-path',
      hasZzz: false,
      hasPhysicsBody: true,
      bodySelector: '.mascot-body',
      maxMove: 8,
      springStiffness: 0.07,
      damping: 0.8,
    });
  }

  // Hero buttons
  const btnWatchDemo = container.querySelector('#btn-watch-demo');
  const btnSeeEffects = container.querySelector('#btn-see-effects');

  btnSeeEffects && btnSeeEffects.addEventListener('click', () => navigate('#effects'));

  // ── Demo video carousel — autoplay visible, dot indicators ─────────────────
  const demoCarousel = container.querySelector('#demo-carousel');
  const demoDots = container.querySelectorAll('#demo-dots .scroll-dot');
  let demoObserver = null;

  if (demoCarousel) {
    const demoVideos = demoCarousel.querySelectorAll('video');

    // Autoplay videos when they scroll into view
    demoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { root: demoCarousel, threshold: 0.6 }
    );
    demoVideos.forEach((v) => demoObserver.observe(v));

    // Update dot indicators on scroll
    if (demoDots.length) {
      const cards = demoCarousel.querySelectorAll('.demo-video-container');
      const updateDemoDots = () => {
        if (!cards.length) return;
        const cardWidth = cards[0].offsetWidth + 12; // width + gap
        const idx = Math.min(
          Math.round(demoCarousel.scrollLeft / cardWidth),
          demoDots.length - 1
        );
        demoDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
      };
      demoCarousel.addEventListener('scroll', updateDemoDots, { passive: true });
    }
  }

  // ── Bottom sheet — Watch Demo ───────────────────────────────────────────────
  const overlay = container.querySelector('#demo-sheet-overlay');
  const sheet = container.querySelector('#demo-sheet');
  const iframe = container.querySelector('#demo-iframe');

  function openDemoSheet() {
    if (!overlay || !sheet || !iframe) return;
    // Lazy-load YouTube iframe only on first open
    if (!iframe.src || iframe.src === window.location.href) {
      iframe.src = iframe.dataset.src;
    }
    overlay.classList.add('visible');
    sheet.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDemoSheet() {
    if (!overlay || !sheet || !iframe) return;
    overlay.classList.remove('visible');
    sheet.classList.remove('open');
    document.body.style.overflow = '';
    // Stop YouTube playback by resetting src
    iframe.src = '';
  }

  btnWatchDemo && btnWatchDemo.addEventListener('click', openDemoSheet);

  overlay && overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDemoSheet();
  });

  // Swipe-down gesture to close bottom sheet
  let touchStartY = 0;
  if (sheet) {
    sheet.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    sheet.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientY - touchStartY;
      if (delta > 80) closeDemoSheet();
    }, { passive: true });
  }

  // ── Get Started button ──────────────────────────────────────────────────────
  const btnGetStarted = container.querySelector('#btn-get-started-cost');
  btnGetStarted && btnGetStarted.addEventListener('click', () => navigate('#get-started'));

  // ── Testimonial scroll dot indicators ──────────────────────────────────────
  const scrollEl = container.querySelector('#testimonial-scroll');
  const dots = container.querySelectorAll('#scroll-dots .scroll-dot');

  if (scrollEl && dots.length) {
    const cards = scrollEl.querySelectorAll('.testimonial-card');

    const updateDots = () => {
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 12; // width + gap
      const activeIndex = Math.min(
        Math.round(scrollEl.scrollLeft / cardWidth),
        dots.length - 1
      );
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    };

    scrollEl.addEventListener('scroll', updateDots, { passive: true });
  }

  // ── Value card touch feedback ───────────────────────────────────────────────
  container.querySelectorAll('.value-card').forEach((card) => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    }, { passive: true });
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    }, { passive: true });
    card.addEventListener('touchcancel', () => {
      card.style.transform = '';
    }, { passive: true });
  });

  // ── Sticky CTA ──────────────────────────────────────────────────────────────
  initStickyCta(container);
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  destroyStickyCta();
  document.body.style.overflow = '';
}
