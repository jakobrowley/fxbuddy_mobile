/**
 * Motion Graphics Tab — FXBuddy
 * All 58 templates with video previews served locally
 */

import '../styles/motion.css';
import { navigate } from '../router.js';

// ─── All 58 Templates (matching the real plugin) ──────────────────────────────

const templates = [
  // Social Media
  { name: 'Instagram Post',    category: 'Social Media',   file: 'InstagramPost' },
  { name: 'TikTok Overlay',    category: 'Social Media',   file: 'TikTokOverlay' },
  { name: 'iMessage Chat',     category: 'Social Media',   file: 'IMessageChat' },
  { name: 'iMessage Close-Up', category: 'Social Media',   file: 'IMessageCloseUp' },
  { name: 'iOS Notification',  category: 'Social Media',   file: 'IOSNotification' },
  { name: 'Twitter/X Post',    category: 'Social Media',   file: 'TwitterXPost' },
  { name: 'Twitter Follow',    category: 'Social Media',   file: 'TwitterFollow' },
  { name: 'Instagram Follow',  category: 'Social Media',   file: 'InstagramFollow' },
  { name: 'TikTok Follow',     category: 'Social Media',   file: 'TikTokFollow' },
  { name: 'YouTube Subscribe', category: 'Social Media',   file: 'YouTubeSubscribe' },
  { name: 'YouTube Comment',   category: 'Social Media',   file: 'YouTubeComment' },

  // Text & Titles
  { name: 'Title Slam',        category: 'Text & Titles',  file: 'TitleSlam' },
  { name: 'Lower Third',       category: 'Text & Titles',  file: 'LowerThird' },
  { name: 'Kinetic Type',      category: 'Text & Titles',  file: 'KineticType' },
  { name: 'Logo Reveal',       category: 'Text & Titles',  file: 'LogoReveal' },
  { name: 'Word Reveal',       category: 'Text & Titles',  file: 'WordReveal' },

  // Data & Charts
  { name: 'Number Counter',    category: 'Data & Charts',  file: 'NumberCounter' },
  { name: 'Bar Chart',         category: 'Data & Charts',  file: 'BarChartComparison' },
  { name: 'Animated Line Chart', category: 'Data & Charts', file: 'AnimatedLineChart' },
  { name: 'Stock Ticker',      category: 'Data & Charts',  file: 'StockTicker' },
  { name: 'Cost Breakdown',    category: 'Data & Charts',  file: 'CostBreakdown' },
  { name: 'Before & After',    category: 'Data & Charts',  file: 'BeforeAfterSplit' },
  { name: 'Percentage Circle', category: 'Data & Charts',  file: 'PercentageCircle' },

  // Documentary
  { name: 'Doc Callout',       category: 'Documentary',    file: 'DocCallout' },
  { name: 'Doc Lower Third',   category: 'Documentary',    file: 'DocLowerThird' },
  { name: 'Fact Card',         category: 'Documentary',    file: 'FactCard' },
  { name: 'Doc Timeline',      category: 'Documentary',    file: 'DocTimeline' },
  { name: 'Quote Card',        category: 'Documentary',    file: 'QuoteCard' },
  { name: 'Location Tag',      category: 'Documentary',    file: 'LocationTag' },
  { name: 'Comparison Table',  category: 'Documentary',    file: 'ComparisonTable' },
  { name: 'Newspaper',         category: 'Documentary',    file: 'NewspaperHeadline' },

  // SaaS & Product
  { name: 'Feature Card',      category: 'SaaS & Product', file: 'FeatureCard' },
  { name: 'Pricing Tier',      category: 'SaaS & Product', file: 'PricingTier' },
  { name: 'Testimonial',       category: 'SaaS & Product', file: 'TestimonialCard' },
  { name: 'Metrics Dashboard', category: 'SaaS & Product', file: 'MetricsDashboard' },
  { name: 'Command Palette',   category: 'SaaS & Product', file: 'CommandPalette' },
  { name: 'Toast Notification', category: 'SaaS & Product', file: 'NotificationToast' },
  { name: 'Workflow',          category: 'SaaS & Product', file: 'Workflow' },
  { name: 'Dashboard Widget',  category: 'SaaS & Product', file: 'DashboardWidget' },
  { name: 'Alert Banner',      category: 'SaaS & Product', file: 'AlertBanner' },
  { name: 'Toggle Feature',    category: 'SaaS & Product', file: 'ToggleFeature' },

  // Product / E-commerce
  { name: 'Product Card',      category: 'Product',        file: 'ProductCard' },
  { name: 'Review Stars',      category: 'Product',        file: 'ReviewStars' },
  { name: 'Shipping Tracker',  category: 'Product',        file: 'ShippingTracker' },
  { name: 'Coupon Code',       category: 'Product',        file: 'CouponCode' },
  { name: 'Cart Summary',      category: 'Product',        file: 'CartSummary' },
  { name: 'Flash Sale',        category: 'Product',        file: 'FlashSale' },
  { name: 'Loyalty Card',      category: 'Product',        file: 'LoyaltyCard' },
  { name: 'Size Guide',        category: 'Product',        file: 'SizeGuide' },
  { name: 'Wishlist Heart',    category: 'Product',        file: 'WishlistHeart' },
  { name: 'Promo Tag',         category: 'Product',        file: 'PromoTag' },

  // Universal
  { name: 'Progress Bar',      category: 'Universal',      file: 'ProgressBar' },
  { name: 'Rating Display',    category: 'Universal',      file: 'RatingDisplay' },
  { name: 'Split Screen',      category: 'Universal',      file: 'SplitScreen' },
  { name: 'End Screen',        category: 'Universal',      file: 'EndScreen' },
  { name: 'Countdown',         category: 'Universal',      file: 'CountdownTimer' },
  { name: 'Loading Spinner',   category: 'Universal',      file: 'LoadingSpinner' },
  { name: 'Simple Transition', category: 'Universal',      file: 'SimpleTransition' },
];

const categories = ['All', 'Social Media', 'Text & Titles', 'Data & Charts', 'Documentary', 'SaaS & Product', 'Product', 'Universal'];

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
          src="templates/${escAttr(t.file)}.mp4"
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
      <p class="section-subtitle">57+ ready-made templates for titles, social media, data viz, and more. Fill in the fields, hit generate.</p>

      <div class="how-it-works-steps">
        <div class="step-card">
          <span class="step-number">1</span>
          <p class="step-title">Pick a template</p>
          <p class="step-desc">Browse the categories below</p>
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
