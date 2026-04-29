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
  // Aesthetic: founders pill mirrors the SearchBuddy green pill — same shape,
  // same vertical rhythm — but black/red urgency styling. Both pills get a
  // matched whole-pill pulse so they read as a coordinated row.
  var STYLES = [
    // Sit beside the green sb-info-pill in the same section-header. The
    // sb-info-pill has margin-top:14px applied in styles.css, so we match it
    // with the same margin between the green pill and the founders pill so
    // the gap reads as equal vertical rhythm.
    '.founders-promo-banner-row{display:flex;justify-content:center;width:100%;margin-top:14px}',
    // Black pill, white text, red urgency glow. Whole pill pulses softly.
    '.founders-promo-banner{',
    '  display:inline-flex;align-items:center;justify-content:center;gap:8px;',
    '  padding:10px 18px;border-radius:999px;background:#0a0a0a;color:#fff;',
    '  font-family:var(--font-body,"Inter",sans-serif);',
    '  font-size:13px;font-weight:600;line-height:1;letter-spacing:-0.01em;',
    '  border:1px solid rgba(239,68,68,0.45);',
    '  box-shadow:0 6px 22px rgba(239,68,68,0.22),0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06);',
    '  animation:founders-pill-breathe 2.4s ease-in-out infinite;',
    '  position:relative;z-index:2;',
    '}',
    // Whole-pill breathing pulse — gentle scale + outer red glow oscillation.
    '@keyframes founders-pill-breathe{',
    '  0%,100%{transform:scale(1);box-shadow:0 6px 22px rgba(239,68,68,0.22),0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06)}',
    '  50%{transform:scale(1.025);box-shadow:0 10px 32px rgba(239,68,68,0.42),0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06)}',
    '}',
    // Dot pulse — independent ring expansion mirrors .sb-pill-dot rhythm.
    '.founders-promo-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;flex-shrink:0;',
    '  box-shadow:0 0 0 0 rgba(239,68,68,0.6);animation:founders-dot-flash 1.6s ease-out infinite}',
    '@keyframes founders-dot-flash{',
    '  0%{box-shadow:0 0 0 0 rgba(239,68,68,0.65);transform:scale(1)}',
    '  70%{box-shadow:0 0 0 9px rgba(239,68,68,0);transform:scale(.9)}',
    '  100%{box-shadow:0 0 0 0 rgba(239,68,68,0);transform:scale(1)}',
    '}',
    '.founders-promo-label{opacity:.95}',
    '.founders-promo-countdown{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";',
    '  font-weight:800;letter-spacing:.02em;color:#fff;background:rgba(239,68,68,0.22);',
    '  padding:3px 8px;border-radius:6px;border:1px solid rgba(239,68,68,0.45)}',
    '.founders-promo-countdown.expired{opacity:.45;background:transparent;border-color:transparent;animation:none}',
    // Match the green pill so both have the same whole-pill breathing pulse.
    '.sb-info-pill{animation:founders-pill-breathe-green 2.4s ease-in-out infinite}',
    '@keyframes founders-pill-breathe-green{',
    '  0%,100%{transform:scale(1);box-shadow:0 6px 22px rgba(40,200,64,0.18),0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06)}',
    '  50%{transform:scale(1.025);box-shadow:0 10px 32px rgba(40,200,64,0.34),0 2px 6px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06)}',
    '}',
    // Strikethrough — full-size, deep red, same display font + weight as the
    // live price so the comparison reads "$39  $29" as two equally-loud
    // numbers, with a thick red line gutting the old one.
    '.founders-original{display:inline-block;color:#dc2626;',
    '  font-family:var(--font-display,inherit);font-weight:800;letter-spacing:-0.03em;',
    '  font-size:0.95em;line-height:1;margin-right:0.45em;vertical-align:baseline;',
    '  text-decoration:line-through;text-decoration-color:#dc2626;',
    '  text-decoration-thickness:0.11em;text-decoration-skip-ink:none;',
    '}',
    '@media (max-width:560px){',
    '  .founders-promo-banner{font-size:12px;padding:9px 16px;gap:7px}',
    '  .founders-original{font-size:0.88em;margin-right:0.38em}',
    '}',
    // Dark-mode override — keep founders pill black-with-red-edge; bump green
    // pill glow slightly so the pulse stays visible against dark page bg.
    '@media (prefers-color-scheme:dark){',
    '  .founders-promo-banner{background:#0f0f0f}',
    '  .founders-original{color:#ef4444;text-decoration-color:#ef4444}',
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

    // Place the founders pill IMMEDIATELY AFTER the green sb-info-pill so
    // both pills sit in the same section-header row, separated by an equal
    // 14px margin (matched to the green pill's own margin-top in styles.css).
    // Falls back to "above the pricing toggle" if the green pill isn't on
    // this page (e.g. a future pricing-only page without it).
    var greenPill = document.getElementById('sb-pill-pricing')
      || document.querySelector('.sb-info-pill');
    if (greenPill && greenPill.parentNode) {
      // insertAdjacentElement('afterend', row) — works in all evergreen browsers.
      greenPill.parentNode.insertBefore(row, greenPill.nextSibling);
      return row;
    }
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
