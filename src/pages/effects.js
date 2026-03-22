/**
 * Effects Tab — FXBuddy
 * Sections: Filter Pills, Video Feed, Bottom CTA
 */

import '../styles/effects.css';
import { navigate } from '../router.js';

// ─── Data ─────────────────────────────────────────────────────────────────────

const effects = [
  { name: 'Set on Fire',    src: 'effects/set-on-fire-after.mp4', category: 'Fire & Explosions' },
  { name: 'Car Explosion',  src: 'effects/car-explode-after.mp4',  category: 'Fire & Explosions' },
  { name: 'Lightning Strike', src: 'effects/lighting-after.mp4',  category: 'Lightning' },
  { name: 'Twitter Post',   src: 'effects/twitter.mp4',            category: 'Social Media' },
  { name: 'iMessage Bubble', src: 'effects/imessage.mp4',          category: 'Social Media' },
];

const categories = ['All', 'Fire & Explosions', 'Lightning', 'Social Media', 'Motion Graphics'];

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
    <!-- ── Filter Pills ── -->
    <div class="effects-filter" role="group" aria-label="Filter effects by category">
      ${pillsHtml}
    </div>

    <!-- ── Video Feed ── -->
    <div class="effects-feed" id="effects-feed">
      ${feedHtml}

      <!-- Motion Graphics placeholder (hidden until that pill is active) -->
      <div class="effects-placeholder" id="motion-placeholder" hidden>
        <p class="section-title" style="margin-bottom:12px">57+ Motion Templates</p>
        <p class="section-subtitle" style="margin-bottom:24px">
          57+ motion templates available.<br>Sign up to explore them all.
        </p>
        <button type="button" class="btn-primary" id="btn-motion-cta">
          Get Started
        </button>
      </div>
    </div>

    <!-- ── Bottom CTA ── -->
    <div class="effects-more">
      <p class="section-subtitle" style="margin-bottom:16px">
        FXbuddy has hundreds of effects and 57+ motion templates.<br>Start creating today.
      </p>
      <button type="button" class="btn-primary" id="btn-effects-get-started">
        Get Started
      </button>
    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

let videoObserver = null;

export function init(container) {
  const pills = container.querySelectorAll('.effects-filter .pill');
  const feed = container.querySelector('#effects-feed');
  const motionPlaceholder = container.querySelector('#motion-placeholder');

  // ── Filter logic ────────────────────────────────────────────────────────────
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const selected = pill.dataset.category;
      const isMotion = selected === 'Motion Graphics';

      // Show/hide motion placeholder
      if (motionPlaceholder) {
        motionPlaceholder.hidden = !isMotion;
      }

      // Show/hide effect cards
      feed.querySelectorAll('.effect-card').forEach((card) => {
        const show = selected === 'All' || card.dataset.category === selected;
        card.hidden = !show || isMotion;
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
    if (cta) navigate('#get-started');
  });

  // ── Motion placeholder CTA ───────────────────────────────────────────────────
  const btnMotionCta = container.querySelector('#btn-motion-cta');
  btnMotionCta && btnMotionCta.addEventListener('click', () => navigate('#get-started'));

  // ── Bottom CTA ────────────────────────────────────────────────────────────────
  const btnGetStarted = container.querySelector('#btn-effects-get-started');
  btnGetStarted && btnGetStarted.addEventListener('click', () => navigate('#get-started'));
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  if (videoObserver) {
    videoObserver.disconnect();
    videoObserver = null;
  }
}
