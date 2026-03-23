/**
 * Motion Graphics Tab — FXBuddy
 * Sections: Intro, Category Filter, Template Grid with video previews, Bottom CTA
 */

import '../styles/motion.css';
import { navigate } from '../router.js';

// ─── Template Data (matching the real plugin) ─────────────────────────────────

const API_BASE = 'https://fxbuddy-production-eccd.up.railway.app/api/template-previews';

const templates = [
  { name: 'Instagram Post',    category: 'Social Media',   slug: 'instagram-post' },
  { name: 'TikTok Overlay',    category: 'Social Media',   slug: 'tiktok-overlay' },
  { name: 'iMessage Chat',     category: 'Social Media',   slug: 'imessage-chat' },
  { name: 'iOS Notification',  category: 'Social Media',   slug: 'ios-notification' },
  { name: 'Twitter/X Post',    category: 'Social Media',   slug: 'twitter-post' },
  { name: 'YouTube Subscribe', category: 'Social Media',   slug: 'youtube-subscribe' },
  { name: 'Title Slam',        category: 'Text & Titles',  slug: 'title-slam' },
  { name: 'Lower Third',       category: 'Text & Titles',  slug: 'lower-third' },
  { name: 'Logo Reveal',       category: 'Text & Titles',  slug: 'logo-reveal' },
  { name: 'Number Counter',    category: 'Data & Charts',  slug: 'number-counter' },
  { name: 'Bar Chart',         category: 'Data & Charts',  slug: 'bar-chart' },
  { name: 'Product Card',      category: 'SaaS & Product', slug: 'product-card' },
];

const categories = ['All', 'Social Media', 'Text & Titles', 'Data & Charts', 'SaaS & Product'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTemplateCard(t) {
  return `
    <div class="motion-card" data-cat="${escAttr(t.category)}">
      <div class="motion-card-video">
        <video
          src="${API_BASE}/${escAttr(t.slug)}.mp4"
          muted
          playsinline
          loop
          preload="metadata"
          aria-label="${escAttr(t.name)} preview"
        ></video>
      </div>
      <div class="motion-card-info">
        <span class="motion-card-name">${escHtml(t.name)}</span>
        <span class="motion-card-cat">${escHtml(t.category)}</span>
      </div>
    </div>
  `;
}

// ─── Render ──────────────────────────────────────────────────────────────────

export function render() {
  const pillsHtml = categories.map((cat) => `
    <button
      type="button"
      class="pill${cat === 'All' ? ' active' : ''}"
      data-cat="${escAttr(cat)}"
    >${escHtml(cat)}</button>
  `).join('');

  const gridHtml = templates.map(renderTemplateCard).join('');

  return `
    <!-- ── Motion Intro ── -->
    <section class="motion-intro">
      <h1 class="section-title">Motion Graphics</h1>
      <p class="section-subtitle">Ready-made templates for titles, social media, data viz, and more. Fill in the fields, hit generate.</p>

      <div class="how-it-works-steps">
        <div class="step-card">
          <span class="step-number">1</span>
          <p class="step-title">Pick a template</p>
          <p class="step-desc">Browse categories</p>
        </div>
        <div class="step-card">
          <span class="step-number">2</span>
          <p class="step-title">Fill in the fields</p>
          <p class="step-desc">Add your text, numbers, or brand</p>
        </div>
        <div class="step-card">
          <span class="step-number">3</span>
          <p class="step-title">Generate</p>
          <p class="step-desc">Animated graphic lands on your timeline</p>
        </div>
      </div>
    </section>

    <!-- ── Category Filter ── -->
    <div class="motion-filter" role="group" aria-label="Filter templates by category">
      ${pillsHtml}
    </div>

    <!-- ── Template Grid ── -->
    <div class="motion-grid" id="motion-grid">
      ${gridHtml}
    </div>

    <!-- ── Bottom CTA ── -->
    <div class="motion-cta-section">
      <p class="section-subtitle">Start creating motion graphics today</p>
      <button type="button" class="btn-primary" id="btn-motion-signup">Sign Up</button>
    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

let videoObserver = null;

export function init(container) {
  const pills = container.querySelectorAll('.motion-filter .pill');
  const grid = container.querySelector('#motion-grid');

  // ── Filter logic ──
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const selected = pill.dataset.cat;
      grid.querySelectorAll('.motion-card').forEach((card) => {
        const show = selected === 'All' || card.dataset.cat === selected;
        card.hidden = !show;
      });

      // Pause hidden videos
      grid.querySelectorAll('.motion-card[hidden] video').forEach((v) => v.pause());
    });
  });

  // ── Autoplay videos when visible ──
  if (videoObserver) videoObserver.disconnect();

  videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.3 }
  );

  grid.querySelectorAll('video').forEach((v) => videoObserver.observe(v));

  // ── Bottom CTA ──
  const btnSignup = container.querySelector('#btn-motion-signup');
  btnSignup && btnSignup.addEventListener('click', () => navigate('#sign-up'));
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  if (videoObserver) {
    videoObserver.disconnect();
    videoObserver = null;
  }
}
