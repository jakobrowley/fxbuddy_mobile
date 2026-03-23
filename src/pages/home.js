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

    <!-- ── Try the Plugin ── -->
    <section class="plugin-section">
      <h2 class="section-title">Try it yourself</h2>
      <p class="section-subtitle" style="margin-top:-8px">Tap the prompt box and pick a preset to see FXbuddy in action. In your editor, you'd type your own prompt and the effect lands right on your timeline.</p>

      <div class="plugin-replica">
        <!-- Tabs -->
        <div class="pr-tabs">
          <button type="button" class="pr-tab">Motion</button>
          <button type="button" class="pr-tab active">Home</button>
          <button type="button" class="pr-tab">Effects</button>
        </div>

        <!-- Mini mascot -->
        <div class="pr-mascot-row">
          <div class="pr-mini-mascot">
            <div class="pr-mini-glare"></div>
            <div class="pr-mini-eyes">
              <svg width="14" height="18" viewBox="0 0 18 24">
                <ellipse cx="9" cy="12" rx="7" ry="9" fill="var(--mascot-face)" />
              </svg>
              <svg width="14" height="18" viewBox="0 0 18 24">
                <ellipse cx="9" cy="12" rx="7" ry="9" fill="var(--mascot-face)" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Heading -->
        <p class="pr-title">What do you want to create?</p>

        <!-- Textarea with dropdown presets -->
        <div class="pr-input-area">
          <textarea class="pr-textarea" id="pr-prompt-input" placeholder="Describe the VFX you want..." rows="3" readonly></textarea>
          <div class="pr-dropdown" id="pr-dropdown">
            <button type="button" class="pr-dropdown-item" data-prompt="Set on fire">Set on fire</button>
            <button type="button" class="pr-dropdown-item" data-prompt="Make the car explode">Make the car explode</button>
            <button type="button" class="pr-dropdown-item" data-prompt="Add lightning storm">Add lightning storm</button>
            <button type="button" class="pr-dropdown-item" data-prompt="Add a glitch transition">Add a glitch transition</button>
            <button type="button" class="pr-dropdown-item" data-prompt="Create smoke effect">Create smoke effect</button>
          </div>
        </div>

        <!-- Duration row -->
        <div class="pr-duration-row">
          <span class="pr-dur-label">Duration</span>
          <div class="pr-dur-toggle">
            <button type="button" class="pr-dur-btn" data-dur="3">3s</button>
            <button type="button" class="pr-dur-btn active" data-dur="5">5s</button>
          </div>
        </div>

        <!-- Generate button -->
        <div class="pr-gen-row">
          <button type="button" class="pr-reset-btn" aria-label="Reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button type="button" class="pr-generate-btn" id="pr-gen-btn" disabled>GENERATE</button>
          <button type="button" class="pr-settings-btn" aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>

        <!-- Progress bar (hidden by default, shown during "generate") -->
        <div class="pr-progress" id="pr-progress" style="display:none">
          <div class="pr-progress-track">
            <div class="pr-progress-fill" id="pr-progress-fill"></div>
          </div>
          <p class="pr-progress-text" id="pr-progress-text">Generating...</p>
        </div>

        <!-- Result video (hidden until generation completes) -->
        <div class="pr-result" id="pr-result" style="display:none">
          <div class="pr-result-header">
            <span class="pr-result-badge">Result</span>
            <span class="pr-result-prompt" id="pr-result-prompt"></span>
          </div>
          <div class="pr-result-video">
            <video id="pr-result-video" muted playsinline loop></video>
          </div>
        </div>

        <!-- Footer -->
        <div class="pr-footer">
          <span>FXbuddy</span>
          <span>v1.0</span>
        </div>
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

  btnSeeEffects && btnSeeEffects.addEventListener('click', () => navigate('#vfx'));

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
  btnGetStarted && btnGetStarted.addEventListener('click', () => navigate('#sign-up'));

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

  // ── Plugin replica interactivity ─────────────────────────────────────────
  const promptInput = container.querySelector('#pr-prompt-input');
  const genBtn = container.querySelector('#pr-gen-btn');
  const progressEl = container.querySelector('#pr-progress');
  const progressFill = container.querySelector('#pr-progress-fill');
  const progressText = container.querySelector('#pr-progress-text');
  const resultEl = container.querySelector('#pr-result');
  const resultVideo = container.querySelector('#pr-result-video');
  const resultPrompt = container.querySelector('#pr-result-prompt');

  // Map prompts to preset effect videos
  const effectLibrary = {
    'set on fire':          'effects/set-on-fire-after.mp4',
    'make the car explode': 'effects/car-explode-after.mp4',
    'add lightning storm':  'effects/lighting-after.mp4',
    'add a glitch transition': 'effects/twitter.mp4',
    'create smoke effect':  'effects/imessage.mp4',
  };

  function findEffectVideo(prompt) {
    const lower = prompt.toLowerCase().trim();
    // Exact match first
    if (effectLibrary[lower]) return effectLibrary[lower];
    // Keyword match
    if (lower.includes('fire') || lower.includes('burn')) return effectLibrary['set on fire'];
    if (lower.includes('explod') || lower.includes('car')) return effectLibrary['make the car explode'];
    if (lower.includes('lightning') || lower.includes('storm') || lower.includes('electric')) return effectLibrary['add lightning storm'];
    if (lower.includes('glitch') || lower.includes('transition')) return effectLibrary['add a glitch transition'];
    if (lower.includes('smoke') || lower.includes('fog')) return effectLibrary['create smoke effect'];
    // Fallback — pick a random one
    const keys = Object.keys(effectLibrary);
    return effectLibrary[keys[Math.floor(Math.random() * keys.length)]];
  }

  // Dropdown preset logic
  const dropdown = container.querySelector('#pr-dropdown');

  // Show dropdown on textarea tap
  if (promptInput && dropdown) {
    promptInput.addEventListener('click', () => {
      dropdown.classList.toggle('open');
    });

    // Pick a preset from the dropdown
    container.querySelectorAll('.pr-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        promptInput.value = item.dataset.prompt;
        if (genBtn) genBtn.disabled = false;
        dropdown.classList.remove('open');
      });
    });

    // Close dropdown when tapping outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.pr-input-area')) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Duration toggle
  container.querySelectorAll('.pr-dur-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.pr-dur-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Tab switching (visual only)
  container.querySelectorAll('.pr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.pr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Generate button — fake generation, then show preset effect video
  if (genBtn) {
    genBtn.addEventListener('click', () => {
      if (!promptInput || !promptInput.value.trim()) return;
      const prompt = promptInput.value.trim();
      genBtn.disabled = true;
      genBtn.textContent = 'GENERATING...';
      if (progressEl) progressEl.style.display = 'block';
      if (progressFill) progressFill.style.width = '0%';
      if (progressText) progressText.textContent = 'Generating...';
      if (resultEl) resultEl.style.display = 'none';

      // Animate progress bar
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 90) {
          clearInterval(interval);
          progress = 90;
        }
        if (progressFill) progressFill.style.width = progress + '%';
      }, 300);

      // Complete — show the result video
      setTimeout(() => {
        clearInterval(interval);
        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Done! Effect added to timeline.';
        genBtn.textContent = 'GENERATE';
        genBtn.disabled = false;

        // Show result video
        const videoSrc = findEffectVideo(prompt);
        if (resultEl && resultVideo) {
          resultVideo.src = videoSrc;
          resultVideo.play().catch(() => {});
          if (resultPrompt) resultPrompt.textContent = '"' + prompt + '"';
          resultEl.style.display = 'block';
        }

        // Hide progress after a moment
        setTimeout(() => {
          if (progressEl) progressEl.style.display = 'none';
          if (progressFill) progressFill.style.width = '0%';
          if (progressText) progressText.textContent = 'Generating...';
        }, 1500);
      }, 2000);
    });
  }

  // Reset button
  const resetBtn = container.querySelector('.pr-reset-btn');
  if (resetBtn && promptInput) {
    resetBtn.addEventListener('click', () => {
      promptInput.value = '';
      if (genBtn) genBtn.disabled = true;
      if (progressEl) progressEl.style.display = 'none';
      if (progressFill) progressFill.style.width = '0%';
      if (resultEl) resultEl.style.display = 'none';
      if (resultVideo) { resultVideo.pause(); resultVideo.src = ''; }
    });
  }

  // ── Sticky CTA ──────────────────────────────────────────────────────────────
  initStickyCta(container);
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  destroyStickyCta();
  document.body.style.overflow = '';
}
