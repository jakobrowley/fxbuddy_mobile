/**
 * Get Started / Account Tab — FXBuddy
 * Logged-out: registration form with Google OAuth button + name/email/password fields
 * Logged-in: account dashboard (enabled when fxbuddy-access-token is present in localStorage)
 */

import '../styles/get-started.css';
import { navigate } from '../router.js';
import { Mascot } from '../mascot.js';

// ─── Mascot HTML ──────────────────────────────────────────────────────────────

const mascotHTML = `
  <div class="mascot-container mascot-small" id="auth-mascot" aria-hidden="true">
    <div class="mascot-body">
      <div class="mascot-glare"></div>
      <div class="mascot-face">
        <div class="eyes">
          <svg class="eye left-eye" width="18" height="24" viewBox="0 0 18 24">
            <path class="eye-path" d="M 2 12 Q 9 12 16 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 0;" />
            <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" />
          </svg>
          <svg class="eye right-eye" width="18" height="24" viewBox="0 0 18 24">
            <path class="eye-path" d="M 2 12 Q 9 12 16 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" style="opacity: 0;" />
            <ellipse class="eye-oval" cx="9" cy="12" rx="7" ry="9" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  </div>
`;

// ─── Google Icon SVG ──────────────────────────────────────────────────────────

const googleIconSVG = `
  <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
`;

// ─── Logged-Out View ──────────────────────────────────────────────────────────

function renderLoggedOut() {
  return `
    <div class="auth-page">
      <!-- Speech bubble + Mascot -->
      <div class="auth-mascot">
        <div class="speech-bubble">Let's go!</div>
        <div class="auth-mascot-inner">
          ${mascotHTML}
        </div>
      </div>

      <!-- Header -->
      <h1 class="section-title auth-title">Create your account</h1>
      <p class="auth-subtitle">Get started with FXbuddy</p>

      <!-- Google Sign In -->
      <button type="button" class="google-btn" id="btn-google">
        ${googleIconSVG}
        Continue with Google
      </button>

      <!-- Divider -->
      <div class="auth-divider">or</div>

      <!-- Email / Password Form -->
      <form class="auth-form" id="signup-form" novalidate>
        <div class="auth-input-wrap">
          <input
            type="text"
            id="input-name"
            class="auth-input"
            placeholder="Your name"
            autocomplete="name"
            autocapitalize="words"
            spellcheck="false"
            aria-label="Your name"
          >
          <span class="input-error" id="error-name" role="alert" aria-live="polite"></span>
        </div>

        <div class="auth-input-wrap">
          <input
            type="email"
            id="input-email"
            class="auth-input"
            placeholder="Email address"
            autocomplete="email"
            inputmode="email"
            spellcheck="false"
            aria-label="Email address"
          >
          <span class="input-error" id="error-email" role="alert" aria-live="polite"></span>
        </div>

        <div class="auth-input-wrap">
          <input
            type="password"
            id="input-password"
            class="auth-input"
            placeholder="Create password"
            autocomplete="new-password"
            minlength="8"
            aria-label="Create password"
          >
          <span class="input-error" id="error-password" role="alert" aria-live="polite"></span>
        </div>

        <div class="auth-submit">
          <button type="submit" class="btn-primary" id="btn-signup">
            Sign Up
          </button>
        </div>
      </form>

      <p class="auth-terms">By signing up you agree to our Terms of Service</p>

      <p class="auth-switch">
        Already have an account?
        <a href="#" id="link-login">Log in</a>
      </p>
    </div>
  `;
}

// ─── Logged-In View ───────────────────────────────────────────────────────────
// Uncomment the renderLoggedIn call in render() and pass user data to enable.

/*
function renderLoggedIn(user) {
  const initial = (user.email || 'U')[0].toUpperCase();
  const maskedKey = user.licenseKey
    ? user.licenseKey.slice(0, 8) + '••••••••••••••••' + user.licenseKey.slice(-4)
    : '••••-••••-••••-••••';

  return `
    <div class="account-page">
      <div class="account-profile">
        <div class="account-avatar">${initial}</div>
        <div class="account-info">
          <p class="account-email">${user.email || ''}</p>
          <span class="account-plan-badge">${user.plan || 'Pro'}</span>
        </div>
      </div>

      <div class="card account-credits-card">
        <p class="account-credits-number">${user.credits ?? 0}</p>
        <p class="account-credits-label">credits remaining</p>
      </div>

      <div class="card license-card">
        <p class="license-label">License Key</p>
        <div class="license-row">
          <div class="license-key">${maskedKey}</div>
          <button type="button" class="license-copy-btn" id="btn-copy-key">Copy</button>
        </div>
      </div>

      <p class="credit-packs-title">Top up credits</p>
      <div class="credit-packs-row">
        <div class="card credit-pack-card" data-pack="12">
          <p class="credit-pack-price">$12</p>
          <p class="credit-pack-credits">50 credits</p>
        </div>
        <div class="card credit-pack-card" data-pack="30">
          <p class="credit-pack-price">$30</p>
          <p class="credit-pack-credits">150 credits</p>
        </div>
        <div class="card credit-pack-card" data-pack="50">
          <p class="credit-pack-price">$50</p>
          <p class="credit-pack-credits">300 credits</p>
        </div>
      </div>

      <div class="account-actions">
        <button type="button" class="btn-secondary" id="btn-manage-sub">Manage Subscription</button>
        <button type="button" class="btn-logout" id="btn-logout">Log Out</button>
      </div>
    </div>
  `;
}
*/

// ─── Render ──────────────────────────────────────────────────────────────────

export function render() {
  // Check for auth token — swap to logged-in view when auth is integrated
  const token = localStorage.getItem('fxbuddy-access-token');
  if (token) {
    // const user = JSON.parse(localStorage.getItem('fxbuddy-user') || '{}');
    // return renderLoggedIn(user);
  }
  return renderLoggedOut();
}

// ─── Validation Helpers ───────────────────────────────────────────────────────

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setFieldError(container, inputId, errorId, message) {
  const input = container.querySelector('#' + inputId);
  const errorEl = container.querySelector('#' + errorId);
  if (input) input.classList.toggle('error', !!message);
  if (errorEl) errorEl.textContent = message || '';
}

function clearAllErrors(container) {
  container.querySelectorAll('.auth-input').forEach(el => el.classList.remove('error'));
  container.querySelectorAll('.input-error').forEach(el => { el.textContent = ''; });
}

function validateForm(container) {
  clearAllErrors(container);
  let valid = true;

  const nameInput = container.querySelector('#input-name');
  const emailInput = container.querySelector('#input-email');
  const passwordInput = container.querySelector('#input-password');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!name) {
    setFieldError(container, 'input-name', 'error-name', 'Name is required.');
    valid = false;
  }

  if (!email) {
    setFieldError(container, 'input-email', 'error-email', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setFieldError(container, 'input-email', 'error-email', 'Enter a valid email address.');
    valid = false;
  }

  if (!password) {
    setFieldError(container, 'input-password', 'error-password', 'Password is required.');
    valid = false;
  } else if (password.length < 8) {
    setFieldError(container, 'input-password', 'error-password', 'Password must be at least 8 characters.');
    valid = false;
  }

  return valid;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function init(container) {
  // ── Mascot ─────────────────────────────────────────────────────────────────
  const mascotContainer = container.querySelector('#auth-mascot');
  if (mascotContainer) {
    window.authMascot = new Mascot({
      container: mascotContainer,
      eyesSelector: '.eyes',
      eyeOvalSelector: '.eye-oval',
      eyePathSelector: '.eye-path',
      hasZzz: false,
      hasPhysicsBody: true,
      bodySelector: '.mascot-body',
      maxMove: 5,
      springStiffness: 0.06,
      damping: 0.8,
    });
    // Start with happy eyes
    window.authMascot.setStatus('success');
  }

  // ── Google button ──
  const btnGoogle = container.querySelector('#btn-google');
  btnGoogle && btnGoogle.addEventListener('click', () => {
    // TODO: integrate Google OAuth
    navigate('#pricing');
  });

  // ── Signup form ──
  const form = container.querySelector('#signup-form');
  const btnSignup = container.querySelector('#btn-signup');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(container)) return;

      // Loading state
      if (btnSignup) {
        btnSignup.disabled = true;
        btnSignup.textContent = 'Creating account\u2026';
      }

      // TODO: wire up real auth API call here
      // On success: store token, navigate('#get-started') to show logged-in view
      setTimeout(() => {
        if (btnSignup) {
          btnSignup.disabled = false;
          btnSignup.textContent = 'Sign Up';
        }
        navigate('#pricing');
      }, 800);
    });
  }

  // Clear error inline as user types
  container.querySelectorAll('.auth-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const wrap = input.closest('.auth-input-wrap');
      const errorEl = wrap && wrap.querySelector('.input-error');
      if (errorEl) errorEl.textContent = '';
    });
  });

  // ── Log in link ──
  const loginLink = container.querySelector('#link-login');
  loginLink && loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: show login form / navigate to dedicated login page when built
    navigate('#pricing');
  });

  // ── Logged-in actions (wired when logged-in view is uncommented) ──
  const btnCopy = container.querySelector('#btn-copy-key');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const keyEl = container.querySelector('.license-key');
      const key = keyEl ? keyEl.textContent.trim() : '';
      if (key && navigator.clipboard) {
        navigator.clipboard.writeText(key).then(() => {
          btnCopy.textContent = 'Copied!';
          setTimeout(() => { btnCopy.textContent = 'Copy'; }, 2000);
        });
      }
    });
  }

  const btnManage = container.querySelector('#btn-manage-sub');
  btnManage && btnManage.addEventListener('click', () => navigate('#pricing'));

  const btnLogout = container.querySelector('#btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('fxbuddy-access-token');
      localStorage.removeItem('fxbuddy-user');
      navigate('#get-started');
    });
  }
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

export function destroy() {
  // No persistent side effects to clean up
}
