/**
 * Founders Pricing — strikethrough was-prices on the Starter / Pro cards.
 *
 * Drop-in: <script src="founders-promo.js" defer></script>.
 *
 * REVERT (any of these works):
 *   1. Set CONFIG.enabled = false below — instant client-side disable.
 *   2. Remove the <script src="founders-promo.js"></script> tag from the page.
 *   3. `git revert <this commit>` — drops the file + the script tag in one go.
 */
(function () {
  'use strict';

  // ─── CONFIG ─────────────────────────────────────────────────────────────
  var CONFIG = {
    enabled: true,
    starterOriginal: 39,
    proOriginal: 79,
  };
  window.__FX_FOUNDERS_PROMO = CONFIG;

  // ─── Styles ─────────────────────────────────────────────────────────────
  // Strikethrough: deep red text, BLACK line crossing through the digit.
  // Same display font + weight as .pricing-amount so the "was $39" reads
  // as a real two-price comparison instead of a shrunken footnote.
  var STYLES = [
    '.founders-original{display:inline-block;color:#dc2626;',
    '  font-family:var(--font-display,inherit);font-weight:800;letter-spacing:-0.03em;',
    '  font-size:0.95em;line-height:1;margin-right:0.45em;vertical-align:baseline;',
    '  text-decoration:line-through;text-decoration-color:#000;',
    '  text-decoration-thickness:0.11em;text-decoration-skip-ink:none;}',
    '@media (max-width:560px){',
    '  .founders-original{font-size:0.88em;margin-right:0.38em}',
    '}',
    '@media (prefers-color-scheme:dark){',
    '  .founders-original{color:#ef4444;text-decoration-color:#fff}',
    '}',
  ].join('');

  function injectStyles() {
    if (document.getElementById('founders-promo-styles')) return;
    var s = document.createElement('style');
    s.id = 'founders-promo-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  // ─── Strikethrough on the .pricing-amount ───────────────────────────────
  function addStrikethroughToCard(tier, originalAmount) {
    var card = document.querySelector('.pricing-card[data-tier="' + tier + '"]');
    if (!card) return;
    var priceEl = card.querySelector('.pricing-price');
    if (!priceEl) return;

    var existing = priceEl.querySelector('.founders-original');
    if (existing) {
      existing.textContent = '$' + originalAmount;
      return;
    }
    var span = document.createElement('span');
    span.className = 'founders-original';
    span.textContent = '$' + originalAmount;
    priceEl.insertBefore(span, priceEl.firstChild);
  }

  function removeStrikethroughs() {
    document.querySelectorAll('.founders-original').forEach(function (el) {
      el.parentNode && el.parentNode.removeChild(el);
    });
  }

  function applyStrikethroughs() {
    addStrikethroughToCard('starter', CONFIG.starterOriginal);
    addStrikethroughToCard('pro', CONFIG.proOriginal);
  }

  // The site's main.js replaces .pricing-amount text on monthly/yearly toggle.
  // Our span is a sibling so it survives — but we re-apply after toggle so a
  // future refactor can't accidentally wipe it.
  function hookToggle() {
    var toggleSwitch = document.getElementById('pricing-toggle-switch');
    if (!toggleSwitch || toggleSwitch.dataset.foundersHooked) return;
    toggleSwitch.dataset.foundersHooked = '1';
    toggleSwitch.addEventListener('click', function () {
      setTimeout(applyStrikethroughs, 30);
    });
  }

  // ─── Init ───────────────────────────────────────────────────────────────
  function init() {
    if (!CONFIG.enabled) {
      removeStrikethroughs();
      return;
    }
    injectStyles();
    applyStrikethroughs();
    hookToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
