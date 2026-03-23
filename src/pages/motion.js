/**
 * Motion Graphics Tab — FXBuddy
 * Sections: Intro, Category Filter, Template Grid, Bottom CTA
 */

import '../styles/motion.css';
import { navigate } from '../router.js';

// ─── Template Data ─────────────────────────────────────────────────────────────

const templates = [
  { name: 'Instagram Post',    category: 'Social Media' },
  { name: 'TikTok Overlay',    category: 'Social Media' },
  { name: 'iMessage Chat',     category: 'Social Media' },
  { name: 'Twitter/X Post',    category: 'Social Media' },
  { name: 'YouTube Subscribe', category: 'Social Media' },
  { name: 'iOS Notification',  category: 'Social Media' },
  { name: 'Title Slam',        category: 'Text & Titles' },
  { name: 'Lower Third',       category: 'Text & Titles' },
  { name: 'Logo Reveal',       category: 'Text & Titles' },
  { name: 'Number Counter',    category: 'Data & Charts' },
  { name: 'Bar Chart',         category: 'Data & Charts' },
  { name: 'Product Card',      category: 'Documentary' },
];

const categories = ['All', 'Social Media', 'Text & Titles', 'Data & Charts', 'Documentary'];

// ─── Category Icons ────────────────────────────────────────────────────────────

function getCategoryIcon(category) {
  switch (category) {
    case 'Social Media':
      // Heart icon
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>`;
    case 'Text & Titles':
      // Type/text icon
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>`;
    case 'Data & Charts':
      // Bar chart icon
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>`;
    case 'Documentary':
      // Film icon
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
        <line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="7" x2="7" y2="7"/>
        <line x1="2" y1="17" x2="7" y2="17"/>
        <line x1="17" y1="17" x2="22" y2="17"/>
        <line x1="17" y1="7" x2="22" y2="7"/>
      </svg>`;
    default:
      // Grid icon fallback
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTemplateCard(template) {
  return `
    <div class="motion-card" data-cat="${escAttr(template.category)}">
      <div class="motion-card-icon">
        ${getCategoryIcon(template.category)}
      </div>
      <p class="motion-card-name">${escHtml(template.name)}</p>
      <p class="motion-card-cat">${escHtml(template.category)}</p>
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
      <p class="section-subtitle">57+ ready-made templates for titles, social media, data viz, and more. Fill in the fields, hit generate.</p>

      <div class="how-it-works-steps">
        <div class="step-card">
          <span class="step-number">1</span>
          <p class="step-title">Pick a template</p>
          <p class="step-desc">Browse 57+ categories</p>
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

export function init(container) {
  const pills = container.querySelectorAll('.motion-filter .pill');
  const grid = container.querySelector('#motion-grid');

  // ── Filter logic ────────────────────────────────────────────────────────────
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const selected = pill.dataset.cat;

      grid.querySelectorAll('.motion-card').forEach((card) => {
        const show = selected === 'All' || card.dataset.cat === selected;
        card.hidden = !show;
      });
    });
  });

  // ── Bottom CTA ────────────────────────────────────────────────────────────────
  const btnSignup = container.querySelector('#btn-motion-signup');
  btnSignup && btnSignup.addEventListener('click', () => navigate('#sign-up'));
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  // No persistent side effects to clean up
}
