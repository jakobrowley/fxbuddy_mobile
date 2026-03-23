/**
 * VFX Tab — FXBuddy
 * Sections: How It Works Intro, Filter Pills, Video Feed, Bottom CTA
 */

import '../styles/vfx.css';
import { navigate } from '../router.js';

// ─── Data ─────────────────────────────────────────────────────────────────────

const effects = [
  { name: 'Set on Fire',    src: 'effects/set-on-fire-after.mp4', category: 'Fire & Explosions' },
  { name: 'Car Explosion',  src: 'effects/car-explode-after.mp4',  category: 'Fire & Explosions' },
  { name: 'Lightning Strike', src: 'effects/lighting-after.mp4',  category: 'Lightning' },
  { name: 'Twitter Post',   src: 'effects/twitter.mp4',            category: 'Social Media' },
  { name: 'iMessage Bubble', src: 'effects/imessage.mp4',          category: 'Social Media' },
];

const categories = ['All', 'Fire & Explosions', 'Lightning', 'Social Media'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderEffectCard(effect) {
  return `
    <div class="effect-card" data-category="${escAttr(effect.category)}">
      <div class="effect-video-wrapper">
        <video
          src="${escAttr(effect.src)}"
          muted
          playsinline
          loop
          preload="metadata"
          aria-label="${escAttr(effect.name)} effect preview"
        ></video>
        <div class="effect-overlay">
          <span class="effect-name pill">${escHtml(effect.name)}</span>
        </div>
      </div>
    </div>
  `;
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Render ──────────────────────────────────────────────────────────────────

export function render() {
  const pillsHtml = categories.map((cat) => `
    <button
      type="button"
      class="pill${cat === 'All' ? ' active' : ''}"
      data-category="${escAttr(cat)}"
    >${escHtml(cat)}</button>
  `).join('');

  const feedHtml = effects.map(renderEffectCard).join('');

  return `
    <!-- ── VFX Intro ── -->
    <section class="vfx-intro">
      <h1 class="section-title">AI-Powered VFX</h1>
      <p class="section-subtitle">Describe any visual effect and FXbuddy creates it from your footage in 30 seconds. No VFX skills needed.</p>

      <div class="how-it-works-steps">
        <div class="step-card">
          <span class="step-number">1</span>
          <p class="step-title">Select your clip</p>
          <p class="step-desc">Pick any video from your timeline</p>
        </div>
        <div class="step-card">
          <span class="step-number">2</span>
          <p class="step-title">Describe the effect</p>
          <p class="step-desc">Type "set on fire" or "add lightning"</p>
        </div>
        <div class="step-card">
          <span class="step-number">3</span>
          <p class="step-title">It appears on your timeline</p>
          <p class="step-desc">Your effect renders in 30 seconds</p>
        </div>
      </div>
    </section>

    <!-- ── Filter Pills ── -->
    <div class="effects-filter" role="group" aria-label="Filter effects by category">
      ${pillsHtml}
    </div>

    <!-- ── Video Feed ── -->
    <div class="effects-feed" id="effects-feed">
      ${feedHtml}
    </div>

    <!-- ── Bottom CTA ── -->
    <div class="vfx-cta-section">
      <p class="section-subtitle">Ready to add VFX to your edits?</p>
      <button type="button" class="btn-primary" id="btn-vfx-signup">Sign Up</button>
    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

let videoObserver = null;

export function init(container) {
  const pills = container.querySelectorAll('.effects-filter .pill');
  const feed = container.querySelector('#effects-feed');

  // ── Filter logic ────────────────────────────────────────────────────────────
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const selected = pill.dataset.category;

      // Show/hide effect cards
      feed.querySelectorAll('.effect-card').forEach((card) => {
        const show = selected === 'All' || card.dataset.category === selected;
        card.hidden = !show;
      });

      // Pause all videos that are now hidden
      feed.querySelectorAll('.effect-card[hidden] video').forEach((v) => {
        v.pause();
      });
    });
  });

  // ── IntersectionObserver: autoplay visible videos ────────────────────────────
  if (videoObserver) videoObserver.disconnect();

  videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay blocked — silently ignore
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  feed.querySelectorAll('video').forEach((video) => {
    videoObserver.observe(video);
  });

  // ── "Try this effect" CTAs ───────────────────────────────────────────────────
  feed.addEventListener('click', (e) => {
    const cta = e.target.closest('.effect-cta');
    if (cta) navigate('#sign-up');
  });

  // ── Bottom CTA ────────────────────────────────────────────────────────────────
  const btnSignup = container.querySelector('#btn-vfx-signup');
  btnSignup && btnSignup.addEventListener('click', () => navigate('#sign-up'));
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  if (videoObserver) {
    videoObserver.disconnect();
    videoObserver = null;
  }
}
