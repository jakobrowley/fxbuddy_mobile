/**
 * Founders Pricing Promo — strikethrough Starter/Pro prices + countdown badge.
 *
 * SELF-CONTAINED. Drop-in: include via <script src="founders-promo.js" defer></script>.
 *
 * REVERT (any of these works):
 *   1. Set CONFIG.enabled = false below — instant client-side disable.
 *   2. Remove the <script src="founders-promo.js"></script> tag from the page.
 *   3. `git revert <this commit>` — drops the file + the script tag in one go.
 *
 * Once the deadline passes, the script auto-disables (countdown hits 0 and
 * everything reverts to plain prices) — no action needed from you.
 */
(function () {
  'use strict';

  // ─── CONFIG (edit these to tune the promo) ──────────────────────────────
  var CONFIG = {
    enabled: true,
    // Deadline: epoch ms. Computed at commit time as ~21h46m38s after deploy
    // so the page reads "21:46:38" on first load and counts down. Edit to
    // extend or end the promo early.
    endsAt: 1777549430871, // 2026-04-30T11:43:50.871Z
    starterOriginal: 39,
    proOriginal: 79,
    badgeText: 'Founders pricing',
    badgeSubtext: 'ends in',
  };

  // Expose for console inspection / one-off disabling without redeploying:
  //   __FX_FOUNDERS_PROMO.enabled = false; location.reload();
  window.__FX_FOUNDERS_PROMO = CONFIG;

  function isActive() {
    return CONFIG.enabled && Date.now() < CONFIG.endsAt;
  }

  // ─── Styles (injected once, no styles.css edits needed) ─────────────────
  // Aesthetic: solid-black accent banner (matches .nav-cta), red price
  // strikethrough (#ef4444 — already the brand error/urgency red).
  var STYLES = [
    // Banner: black pill, white text — same accent treatment as nav-cta. Adds
    // a soft red glow so it pops against the light neumorphism page.
    '.founders-promo-banner{',
    '  display:inline-flex;align-items:center;justify-content:center;gap:0.625rem;',
    '  margin:0 auto 1.75rem auto;padding:0.75rem 1.25rem;',
    '  border-radius:999px;background:#0a0a0a;color:#fff;',
    '  font-size:0.875rem;font-weight:600;letter-spacing:-0.01em;',
    '  box-shadow:0 6px 20px rgba(239,68,68,0.18),0 2px 6px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08);',
    '  position:relative;z-index:2;',
    '}',
    '.founders-promo-banner-row{display:flex;justify-content:center;width:100%;margin:0 0 1.5rem 0}',
    '.founders-promo-dot{width:9px;height:9px;border-radius:50%;background:#ef4444;flex-shrink:0;',
    '  box-shadow:0 0 0 0 rgba(239,68,68,0.55);animation:founders-promo-pulse 1.6s ease-out infinite}',
    '@keyframes founders-promo-pulse{',
    '  0%{box-shadow:0 0 0 0 rgba(239,68,68,0.6);transform:scale(1)}',
    '  70%{box-shadow:0 0 0 8px rgba(239,68,68,0);transform:scale(.92)}',
    '  100%{box-shadow:0 0 0 0 rgba(239,68,68,0);transform:scale(1)}',
    '}',
    '.founders-promo-label{opacity:.92;font-weight:600}',
    '.founders-promo-countdown{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";',
    '  font-weight:800;letter-spacing:.02em;color:#fff;background:rgba(239,68,68,0.18);',
    '  padding:.18rem .55rem;border-radius:.5rem;border:1px solid rgba(239,68,68,0.35)}',
    '.founders-promo-countdown.expired{opacity:.45;background:transparent;border-color:transparent}',
    // Strikethrough: red, sits on the SAME baseline as the live price (no
    // float-up superscript) so it reads as a single comparison line. Sized
    // big enough to feel like an actual was-price, not a footnote.
    '.founders-original{display:inline-block;color:#ef4444;font-weight:700;',
    '  font-size:0.78em;line-height:1;margin-right:.42em;vertical-align:baseline;letter-spacing:-.02em;',
    '  text-decoration:line-through;text-decoration-color:#ef4444;text-decoration-thickness:0.14em;',
    '  text-decoration-skip-ink:none;',
    '  font-family:inherit;',
    '  text-shadow:0 1px 0 rgba(255,255,255,0.6);',
    '}',
    '@media (max-width:560px){',
    '  .founders-promo-banner{font-size:0.78125rem;padding:0.625rem 1rem;gap:0.5rem}',
    '  .founders-original{font-size:0.72em;margin-right:.36em}',
    '}',
    // Dark-mode override (browser pref): keep red red, but make banner softer
    // against a dark page so it doesn't look like a black-on-black blob.
    '@media (prefers-color-scheme:dark){',
    '  .founders-promo-banner{background:#171717;color:#fff;',
    '    box-shadow:0 8px 24px rgba(239,68,68,0.22),inset 0 1px 0 rgba(255,255,255,0.06)}',
    '  .founders-original{text-shadow:0 1px 0 rgba(0,0,0,0.5)}',
    '}',
  ].join('');

  function injectStyles() {
    if (document.getElementById('founders-promo-styles')) return;
    var s = document.createElement('style');
    s.id = 'founders-promo-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  // ─── Strikethrough on the pricing-amount ────────────────────────────────
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
    // Insert as the first child so the original price reads visually before the actual price
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

  // ─── Countdown badge above the pricing grid ─────────────────────────────
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function fmtRemaining(ms) {
    if (ms <= 0) return '00:00:00';
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return pad(h) + ':' + pad(m) + ':' + pad(sec);
  }

  function injectBanner() {
    var grid = document.getElementById('pricing-grid');
    if (!grid) return null;

    var existing = document.getElementById('founders-promo-banner');
    if (existing) return existing;

    // Build with createElement / textContent — no innerHTML, no XSS surface.
    // Outer wrapper centers the inline-flex pill on the page.
    var row = document.createElement('div');
    row.id = 'founders-promo-banner';
    row.className = 'founders-promo-banner-row';

    var banner = document.createElement('div');
    banner.className = 'founders-promo-banner';

    var dot = document.createElement('span');
    dot.className = 'founders-promo-dot';
    dot.setAttribute('aria-hidden', 'true');

    var label = document.createElement('span');
    label.className = 'founders-promo-label';
    label.textContent = CONFIG.badgeText + ' · ' + CONFIG.badgeSubtext;

    var time = document.createElement('span');
    time.className = 'founders-promo-countdown';
    time.id = 'founders-promo-countdown';
    time.textContent = '--:--:--';

    banner.appendChild(dot);
    banner.appendChild(label);
    banner.appendChild(time);
    row.appendChild(banner);

    // Insert above the pricing-toggle if present, otherwise above the grid.
    var toggle = document.getElementById('pricing-toggle');
    var anchor = toggle || grid;
    anchor.parentNode.insertBefore(row, anchor);
    return row;
  }

  function tickCountdown() {
    var el = document.getElementById('founders-promo-countdown');
    if (!el) return false;
    var ms = CONFIG.endsAt - Date.now();
    if (ms <= 0) {
      el.textContent = '00:00:00';
      el.classList.add('expired');
      return false; // signal to caller to stop ticking
    }
    el.textContent = fmtRemaining(ms);
    return true;
  }

  // ─── Hook into the existing monthly/yearly toggle ───────────────────────
  // The site's main.js replaces the .pricing-amount text on toggle. Our
  // strikethrough lives in the same .pricing-price container as a sibling,
  // so toggling doesn't wipe it — but we still re-apply after toggle in case
  // a future refactor changes that.
  function hookToggle() {
    var toggleSwitch = document.getElementById('pricing-toggle-switch');
    if (!toggleSwitch || toggleSwitch.dataset.foundersHooked) return;
    toggleSwitch.dataset.foundersHooked = '1';
    toggleSwitch.addEventListener('click', function () {
      // Run after the existing handler so we re-attach if needed.
      setTimeout(applyStrikethroughs, 30);
    });
  }

  // ─── End-of-promo cleanup ───────────────────────────────────────────────
  function deactivate() {
    removeStrikethroughs();
    var banner = document.getElementById('founders-promo-banner');
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

  // ─── Init ───────────────────────────────────────────────────────────────
  function init() {
    if (!isActive()) {
      // Promo over — clean up any leftovers if a stale cached bundle loaded.
      deactivate();
      return;
    }
    injectStyles();
    applyStrikethroughs();
    injectBanner();
    hookToggle();

    // Tick once immediately so the countdown isn't dashes for the first second.
    tickCountdown();
    var iv = setInterval(function () {
      var stillTicking = tickCountdown();
      if (!stillTicking) {
        clearInterval(iv);
        // When the deadline passes, fade out the strikethroughs gracefully
        // after a moment so the user sees the "ends" hit zero.
        setTimeout(deactivate, 2500);
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
