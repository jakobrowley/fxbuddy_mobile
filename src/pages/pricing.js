/**
 * Pricing Tab — FXBuddy
 * Sections: Header, Toggle, Carousel, Value Stack, Guarantee, Trust Bar, FAQ, Urgency
 */

import '../styles/pricing.css';
import { navigate } from '../router.js';

// ─── Plan Data ────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 23,
    credits: '100 credits/mo',
    perDay: '$0.97/day',
    features: [
      'All standard effects',
      'Premiere Pro & After Effects',
      'Timeline integration',
      'AI prompt enhancement',
      'HD output',
    ],
    cta: 'Get Started',
    badge: null,
    limited: null,
    featured: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 59,
    yearlyPrice: 47,
    credits: '750 credits/mo',
    perDay: '$1.97/day',
    features: [
      'Everything in Starter',
      'Early access to new effects',
      '1080p upscaling',
      'AI Compositing Masterclass',
      'Exclusive Pro Discord',
    ],
    cta: 'Get Started',
    badge: 'Most Popular',
    limited: null,
    featured: true,
  },
  {
    name: 'Studio',
    monthlyPrice: 149,
    yearlyPrice: 119,
    credits: '2,000 credits/mo',
    perDay: '$4.97/day',
    features: [
      'Everything in Pro',
      'Priority render queue',
      '4K upscaling',
      'Generate 4 clips at once',
      '1-on-1 Workflow Setup',
    ],
    cta: 'Get Started',
    badge: 'For Teams',
    limited: 'Only 10 new members/mo',
    featured: false,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 999,
    yearlyPrice: 799,
    credits: '8,000 credits/mo',
    perDay: '$33.30/day',
    features: [
      'Everything in Studio',
      'Beta tester access',
      'Dedicated onboarding',
      'Priority 24/7 support',
      'Custom integrations',
    ],
    cta: 'Contact Us',
    badge: 'White Glove',
    limited: 'Only 5 new members/mo',
    featured: false,
  },
];

const faqs = [
  {
    q: 'What are credits?',
    a: 'Credits are used each time you generate a VFX clip. Different effects cost different amounts. Unused credits don\'t expire and roll over each month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! Cancel with one click. No contracts, no hidden fees. Your account stays active until the end of your billing period.',
  },
  {
    q: 'What editors are supported?',
    a: 'FXbuddy works as a panel inside Adobe Premiere Pro and After Effects. We support the latest versions on both Mac and Windows.',
  },
  {
    q: 'Can I upgrade or downgrade?',
    a: 'Absolutely. Switch plans anytime from your account. Upgrades take effect immediately with prorated billing.',
  },
];

const chevronSVG = `<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderCard(plan, isYearly) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  return `
    <div class="pricing-card${plan.featured ? ' featured' : ''}" data-plan="${plan.name}">
      ${plan.badge ? `<div class="pricing-badge">${plan.badge}</div>` : ''}
      <p class="pricing-plan-name">${plan.name}</p>
      <div class="pricing-price">$<span class="price-amount">${price}</span><span class="price-period">/mo</span></div>
      <p class="pricing-per-day">Just ${plan.perDay}</p>
      <p class="pricing-credits">${plan.credits}</p>
      <hr class="pricing-divider">
      <ul class="pricing-features">
        ${plan.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      ${plan.limited ? `<span class="pricing-limited">${plan.limited}</span>` : ''}
      <button type="button" class="btn-primary pricing-cta" data-plan="${plan.name}">${plan.cta}</button>
    </div>
  `;
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderLoginGate() {
  return `
    <div class="pricing-gate">
      <div class="mascot-container mascot-small" aria-hidden="true">
        <div class="mascot-body">
          <div class="mascot-glare"></div>
          <div class="mascot-face">
            <div class="eyes">
              <svg class="eye left-eye" width="18" height="24" viewBox="0 0 18 24">
                <path class="eye-path" d="M 3 12 Q 9 0 15 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 1;" />
                <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" style="opacity: 0;" />
              </svg>
              <svg class="eye right-eye" width="18" height="24" viewBox="0 0 18 24">
                <path class="eye-path" d="M 3 12 Q 9 0 15 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 1;" />
                <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" style="opacity: 0;" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <h1 class="section-title" style="text-align:center">See Our Plans</h1>
      <p class="pricing-gate-subtitle">Create an account to continue.</p>
      <button type="button" class="btn-primary" id="btn-gate-signup">Create Account</button>
      <p class="pricing-gate-login">Already have an account? <a href="#" id="link-gate-login">Log in</a></p>
    </div>
  `;
}

export function render() {
  const token = localStorage.getItem('fxbuddy-access-token');
  if (!token) return renderLoginGate();

  const cardsHTML = plans.map(p => renderCard(p, false)).join('');
  const dotsHTML = plans.map((_, i) => `<span class="scroll-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('');
  const faqHTML = faqs.map((item, i) => `
    <div class="faq-item">
      <button type="button" class="faq-question${i === 0 ? ' open' : ''}" data-faq="${i}" aria-expanded="${i === 0}">
        <span>${item.q}</span>
        ${chevronSVG}
      </button>
      <div class="faq-answer${i === 0 ? ' open' : ''}" id="faq-answer-${i}">
        ${item.a}
      </div>
    </div>
  `).join('');

  return `
    <!-- ── Header ── -->
    <div class="pricing-header">
      <h1 class="section-title">Choose Your Plan</h1>
      <p class="pricing-subtitle">Lock in early access pricing before it goes up</p>
    </div>

    <!-- ── Toggle ── -->
    <div class="pricing-toggle">
      <span class="toggle-label active-label" id="label-monthly">Monthly</span>
      <button type="button" class="toggle-track" id="billing-toggle" aria-label="Toggle billing period" aria-pressed="false" role="switch">
        <span class="toggle-knob"></span>
      </button>
      <span class="toggle-label" id="label-yearly">Yearly</span>
      <span class="save-badge">Save 20%</span>
    </div>

    <!-- ── Pricing Carousel ── -->
    <div class="pricing-carousel" id="pricing-carousel" role="list">
      ${cardsHTML}
    </div>
    <div class="scroll-dots" id="pricing-dots" aria-hidden="true">
      ${dotsHTML}
    </div>

    <!-- ── Value Stack ── -->
    <div class="value-stack">
      <div class="card value-stack-card">
        <div class="value-stack-header" id="value-stack-header" role="button" tabindex="0" aria-expanded="false">
          <span class="value-stack-header-text">What you're really getting</span>
          ${chevronSVG}
        </div>
        <div class="value-stack-content" id="value-stack-content">
          <div class="value-item">
            <span class="value-item-name">AI Compositing Masterclass</span>
            <span class="value-item-price">$299 value</span>
          </div>
          <div class="value-item">
            <span class="value-item-name">Music Video Prompt Bible</span>
            <span class="value-item-price">$99 value</span>
          </div>
          <div class="value-item">
            <span class="value-item-name">'Sell Your AI VFX' Guide</span>
            <span class="value-item-price">$97 value</span>
          </div>
          <div class="value-item">
            <span class="value-item-name">Exclusive Pro Discord</span>
            <span class="value-item-price">$168/yr value</span>
          </div>
          <div class="value-item">
            <span class="value-item-name">FXbuddy Pro</span>
            <span class="value-item-price">$708/yr value</span>
          </div>
          <div class="value-total-row">
            <p class="value-total">Total Value: $1,371</p>
            <p class="value-your-price">Your Price: $47/mo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Guarantee ── -->
    <div class="card guarantee-card">
      <span class="guarantee-icon" aria-hidden="true"></span>
      <p class="guarantee-title">Money-Back Guarantee</p>
      <p class="guarantee-body">Try FXbuddy risk-free. If it's not for you, we'll refund every penny. No questions asked.</p>
    </div>

    <!-- ── Trust Bar ── -->
    <div class="trust-bar" aria-label="Security and payment information">
      <span class="trust-item">256-bit encrypted</span>
      <span class="trust-item">Powered by Stripe</span>
      <span class="trust-item">Cancel anytime</span>
    </div>

    <!-- ── FAQ ── -->
    <section class="faq-section" aria-label="Frequently asked questions">
      <h2 class="section-title">Common Questions</h2>
      ${faqHTML}
    </section>

    <!-- ── Urgency ── -->
    <div class="urgency-section">
      <div class="card urgency-card">
        <h2 class="section-title">Early Access Pricing</h2>
        <p class="urgency-label">87 of 100 founding member spots claimed</p>
        <div class="urgency-bar" role="progressbar" aria-valuenow="87" aria-valuemin="0" aria-valuemax="100" aria-label="87% of founding member spots claimed">
          <div class="urgency-fill" id="urgency-fill"></div>
        </div>
        <p class="urgency-subtext">Lock in your rate before prices go up</p>
        <button type="button" class="btn-primary" id="btn-claim-spot">Claim Your Spot</button>
      </div>
    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function init(container) {
  // ── Login gate ──
  const gateSignup = container.querySelector('#btn-gate-signup');
  const gateLogin = container.querySelector('#link-gate-login');
  if (gateSignup) {
    gateSignup.addEventListener('click', () => navigate('#sign-up'));
  }
  if (gateLogin) {
    gateLogin.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('#sign-up');
    });
  }


  let isYearly = false;

  // ── Billing Toggle ──
  const toggle = container.querySelector('#billing-toggle');
  const labelMonthly = container.querySelector('#label-monthly');
  const labelYearly = container.querySelector('#label-yearly');
  const carousel = container.querySelector('#pricing-carousel');

  toggle && toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('active', isYearly);
    toggle.setAttribute('aria-pressed', String(isYearly));

    labelMonthly.classList.toggle('active-label', !isYearly);
    labelYearly.classList.toggle('active-label', isYearly);

    // Update all price amounts in the carousel
    const cards = carousel.querySelectorAll('.pricing-card');
    cards.forEach((card, i) => {
      const plan = plans[i];
      const priceEl = card.querySelector('.price-amount');
      if (priceEl && plan) {
        priceEl.textContent = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
      }
    });
  });

  // ── Carousel Scroll Dots ──
  const dots = container.querySelectorAll('#pricing-dots .scroll-dot');
  if (carousel && dots.length) {
    const updateDots = () => {
      const cardWidth = carousel.scrollWidth / plans.length;
      const activeIndex = Math.min(
        Math.round(carousel.scrollLeft / cardWidth),
        plans.length - 1
      );
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    };
    carousel.addEventListener('scroll', updateDots, { passive: true });
  }

  // ── CTA Buttons ──
  container.querySelectorAll('.pricing-cta').forEach(btn => {
    btn.addEventListener('click', () => navigate('#sign-up'));
  });

  const claimBtn = container.querySelector('#btn-claim-spot');
  claimBtn && claimBtn.addEventListener('click', () => navigate('#sign-up'));

  // ── Value Stack Accordion ──
  const valueHeader = container.querySelector('#value-stack-header');
  const valueContent = container.querySelector('#value-stack-content');

  valueHeader && valueHeader.addEventListener('click', () => {
    const isOpen = valueContent.classList.contains('open');
    valueContent.classList.toggle('open', !isOpen);
    valueHeader.classList.toggle('open', !isOpen);
    valueHeader.setAttribute('aria-expanded', String(!isOpen));
  });

  valueHeader && valueHeader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      valueHeader.click();
    }
  });

  // ── FAQ Accordion ──
  container.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.faq;
      const answer = container.querySelector(`#faq-answer-${index}`);
      const isOpen = btn.classList.contains('open');

      // Close all
      container.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
      });
      container.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));

      // Open clicked (if it wasn't already open)
      if (!isOpen && answer) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ── Urgency Bar animation ──
  const urgencyFill = container.querySelector('#urgency-fill');
  if (urgencyFill) {
    // Animate in after a short delay so the transition fires
    requestAnimationFrame(() => {
      setTimeout(() => {
        urgencyFill.style.width = '87%';
      }, 150);
    });
  }
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  // No persistent side effects to clean up
}
