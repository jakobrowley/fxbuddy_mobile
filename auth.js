/* ============================================
   auth.js — FXbuddy Authentication, Billing & Profile Module
   Extracted from main.js. Standalone IIFE, no build tools required.
   ============================================ */

(function () {
    'use strict';

    /* ── Constants ── */
    var API_BASE = 'https://fxbuddy-production-eccd.up.railway.app';

    /* ── Token Refresh Lock ──
       Prevents concurrent 401 responses from each spawning their own
       refresh request. All callers share a single in-flight promise. */
    var _refreshPromise = null;

    function refreshAccessToken() {
        if (_refreshPromise) return _refreshPromise;
        _refreshPromise = new Promise(function (resolve) {
            var refreshToken = localStorage.getItem('fxbuddy-refresh-token');
            if (!refreshToken) { resolve(null); return; }
            fetch(API_BASE + '/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: refreshToken })
            }).then(function (refreshRes) {
                if (!refreshRes.ok) { resolve(null); return; }
                return refreshRes.json();
            }).then(function (data) {
                if (data && data.accessToken) {
                    localStorage.setItem('fxbuddy-access-token', data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem('fxbuddy-refresh-token', data.refreshToken);
                    }
                    resolve(data.accessToken);
                } else {
                    resolve(null);
                }
            }).catch(function () { resolve(null); });
        }).finally(function () { _refreshPromise = null; });
        return _refreshPromise;
    }

    /* ── Auth-Aware Fetch ──
       Attaches Bearer token to every request. On 401, attempts a token
       refresh once, retries the original request, then clears local state
       if the refresh also fails. */
    function fetchWithAuth(url, options) {
        options = options || {};
        options.headers = options.headers || {};
        var token = localStorage.getItem('fxbuddy-access-token');
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        if (!options.headers['Content-Type'] && options.method === 'POST') {
            options.headers['Content-Type'] = 'application/json';
        }
        return fetch(url, options).then(function (res) {
            if (res.status === 401) {
                return refreshAccessToken().then(function (newToken) {
                    if (newToken) {
                        options.headers['Authorization'] = 'Bearer ' + newToken;
                        return fetch(url, options);
                    }
                    localStorage.removeItem('fxbuddy-access-token');
                    localStorage.removeItem('fxbuddy-refresh-token');
                    localStorage.removeItem('fxbuddy-user-email');
                    updateProfileState();
                    throw new Error('Session expired');
                });
            }
            return res;
        });
    }

    /* ── Auth State Helper ── */
    function isLoggedIn() {
        return !!localStorage.getItem('fxbuddy-access-token');
    }

    /* ── Nav / CTA State ──
       Toggles the nav CTA between "Get Started" (logged out) and "View Plans"
       (logged in). Also updates hero CTAs. */
    function setNavCtaLabel(btn, text) {
        if (!btn) return;
        var label = btn.querySelector('.nav-cta-label');
        if (label) {
            label.textContent = text;
        } else {
            btn.textContent = text;
        }
    }
    function updateProfileState() {
        var getStartedBtn = document.querySelector('.nav-cta.open-signup');
        if (isLoggedIn()) {
            var email = localStorage.getItem('fxbuddy-user-email')
                     || localStorage.getItem('fxbuddy-signup-email')
                     || '';
            var profileEmailEl = document.getElementById('profile-email');
            if (profileEmailEl) profileEmailEl.textContent = email;

            if (getStartedBtn) {
                setNavCtaLabel(getStartedBtn, 'View Plans');
                getStartedBtn.href = '/pricing.html';
                getStartedBtn.onclick = null;
                getStartedBtn.removeAttribute('onclick');
                getStartedBtn.style.display = '';
            }
            document.querySelectorAll('.hero-cta-button.open-signup').forEach(function (b) {
                b.textContent = 'View Plans';
                b.href = '/pricing.html';
                b.removeAttribute('onclick');
            });
        } else {
            if (getStartedBtn) {
                setNavCtaLabel(getStartedBtn, 'Get Started');
                getStartedBtn.href = '#';
                getStartedBtn.style.display = '';
            }
            document.querySelectorAll('.hero-cta-button.open-signup').forEach(function (b) {
                b.textContent = 'Get Started';
                b.href = '#';
            });
        }
    }

    /* ── Profile State ──
       Coordinates /api/credits/balance + /api/auth/me into a single refresh.
       Paid-only sections (.profile-paid-only) are hidden until the user has
       an active plan, so brand-new accounts never see a license key, credit
       packs, auto-charge toggle, or manage-subscription button. */
    function setPaidOnlyVisible(visible) {
        var nodes = document.querySelectorAll('.profile-paid-only');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.display = visible ? '' : 'none';
        }
    }

    function setUpgradeLabel(text) {
        var upgradeBtn = document.getElementById('profile-upgrade-btn');
        if (!upgradeBtn) return;
        var label = upgradeBtn.querySelector('.profile-action-label');
        if (label) label.textContent = text;
    }

    function refreshProfileData() {
        // Hide paid-only sections while we fetch — prevents a flash of
        // credit packs / license / manage-sub for free users on first open.
        setPaidOnlyVisible(false);

        var balancePromise = fetchWithAuth(API_BASE + '/api/credits/balance')
            .then(function (res) { return res.ok ? res.json() : null; })
            .catch(function () { return null; });

        var mePromise = fetchWithAuth(API_BASE + '/api/auth/me')
            .then(function (res) { return res.ok ? res.json() : null; })
            .catch(function () { return null; });

        return Promise.all([balancePromise, mePromise]).then(function (results) {
            var balance = results[0];
            var me      = results[1];
            // Explicit allowlist of paid plan slugs — defaults to "not paid" for
            // null / unknown / malformed plan values so we never accidentally
            // expose a license key or manage-sub button to a free account.
            var PAID_PLANS = ['starter', 'pro', 'studio', 'team', 'enterprise'];
            var plan    = (balance && balance.plan) || 'free';
            var hasActivePlan = PAID_PLANS.indexOf(String(plan).toLowerCase()) !== -1;

            setPaidOnlyVisible(hasActivePlan);
            setUpgradeLabel(hasActivePlan ? 'Upgrade Plan' : 'Choose a Plan');

            // Admin button (independent of plan status)
            var adminBtn = document.getElementById('profile-admin-btn');
            if (adminBtn) {
                adminBtn.style.display = (me && me.is_admin) ? '' : 'none';
            }

            if (!hasActivePlan) return;

            // License key — only populated when the user has an active plan
            var profileLicenseBar = document.getElementById('profile-license-bar');
            var profileLicenseKey = document.getElementById('profile-license-key');
            if (me && me.licenseKey) {
                if (profileLicenseBar) profileLicenseBar.style.display = '';
                if (profileLicenseKey) profileLicenseKey.textContent = me.licenseKey;
            } else if (profileLicenseBar) {
                profileLicenseBar.style.display = 'none';
            }

            if (!balance) return;

            // Credits, plan badge, autobuy
            var profileCreditsTotal  = document.getElementById('profile-credits-total');
            var profileCreditsDetail = document.getElementById('profile-credits-detail');
            var profilePlanBadge     = document.getElementById('profile-plan-badge');
            var profileAutobuyToggle = document.getElementById('profile-autobuy-toggle');

            if (profileCreditsTotal) profileCreditsTotal.textContent = balance.total;
            if (profileCreditsDetail) {
                profileCreditsDetail.textContent = balance.subscription + ' plan + ' + balance.topup + ' extra';
            }
            if (profilePlanBadge) {
                profilePlanBadge.style.display = '';
                profilePlanBadge.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
                profilePlanBadge.setAttribute('data-plan', plan);
            }
            if (profileAutobuyToggle) {
                profileAutobuyToggle.classList.toggle('active', !!balance.autoBuyEnabled);
            }
        });
    }

    /* Back-compat shims — older call sites still reference these names. */
    function fetchLicenseKey()     { return refreshProfileData(); }
    function fetchProfileBalance() { return refreshProfileData(); }

    /* ── Profile Dropdown ──
       Toggles open/closed. Refreshes all profile data on open. */
    var _profileIsOpen = false;

    function toggleProfileDropdown() {
        var profileDropdown = document.getElementById('profile-dropdown');
        _profileIsOpen = !_profileIsOpen;
        if (profileDropdown) {
            profileDropdown.style.display = _profileIsOpen ? '' : 'none';
            if (_profileIsOpen) {
                refreshProfileData();
            }
        }
    }

    /* ── Signup Modal ── */
    var _signupMascot = null;

    function openSignupModal() {
        var signupModal = document.getElementById('signup-modal');
        var step1       = document.getElementById('signup-step-1');
        var step2       = document.getElementById('signup-step-2');
        var signupError = document.getElementById('signup-error');
        if (signupModal) {
            signupModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (step1) step1.style.display = '';
            if (step2) step2.style.display = 'none';
            if (signupError) signupError.style.display = 'none';

            // Initialize the mascot with mouse tracking + blinking (like the plugin UI one)
            if (!_signupMascot && typeof Mascot !== 'undefined') {
                _signupMascot = new Mascot({
                    container: document.getElementById('signup-mascot'),
                    hasZzz: false,
                    hasPhysicsBody: true,
                });
                _signupMascot.setStatus('idle');
            }
        }
    }

    function closeSignupModal() {
        var signupModal = document.getElementById('signup-modal');
        if (signupModal) {
            signupModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /* ── Step 2 Transition ──
       Called after successful registration: hides step 1, shows step 2
       with the registered email displayed. The access token is held in
       closure so modal-plan-btn handlers can use it. */
    var _storedAccessToken = null;

    function showStep2(email, accessToken) {
        _storedAccessToken = accessToken;
        var userEmailDisplay = document.getElementById('signup-user-email');
        var step1            = document.getElementById('signup-step-1');
        var step2            = document.getElementById('signup-step-2');
        if (userEmailDisplay) userEmailDisplay.textContent = email;
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = '';
    }

    /* ── Copy SVG Icon Helpers (safe DOM construction, no innerHTML) ── */
    function makeCopySVG() {
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
        var rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', '9'); rect.setAttribute('y', '9');
        rect.setAttribute('width', '13'); rect.setAttribute('height', '13');
        rect.setAttribute('rx', '2'); rect.setAttribute('ry', '2');
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
        svg.appendChild(rect); svg.appendChild(path);
        return svg;
    }

    function makeCheckSVG() {
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#4ade80'); svg.setAttribute('stroke-width', '2.5');
        svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
        var poly = document.createElementNS(NS, 'polyline');
        poly.setAttribute('points', '20 6 9 17 4 12');
        svg.appendChild(poly);
        return svg;
    }

    /* ============================================
       INIT — wires up all event listeners
       ============================================ */
    function init() {

        /* ── Profile Icon Click ──
           Logged out → open signup modal.
           Logged in  → toggle profile dropdown. */
        var profileIcon = document.getElementById('profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!isLoggedIn()) {
                    openSignupModal();
                    return;
                }
                toggleProfileDropdown();
            });
        }

        /* ── Close Dropdown on Outside Click ── */
        document.addEventListener('click', function (e) {
            var profileDropdown = document.getElementById('profile-dropdown');
            var icon            = document.getElementById('profile-icon');
            if (_profileIsOpen && profileDropdown && !profileDropdown.contains(e.target) && e.target !== icon) {
                _profileIsOpen = false;
                profileDropdown.style.display = 'none';
            }
        });

        /* ── Logout ──
           Clears all stored tokens and restores the "Get Started" nav state. */
        var profileLogoutBtn = document.getElementById('profile-logout-btn');
        if (profileLogoutBtn) {
            profileLogoutBtn.addEventListener('click', function () {
                localStorage.removeItem('fxbuddy-access-token');
                localStorage.removeItem('fxbuddy-refresh-token');
                localStorage.removeItem('fxbuddy-user-email');
                localStorage.removeItem('fxbuddy-signup-name');
                localStorage.removeItem('fxbuddy-demo-mode');
                _profileIsOpen = false;
                var profileDropdown = document.getElementById('profile-dropdown');
                if (profileDropdown) profileDropdown.style.display = 'none';
                updateProfileState();
            });
        }

        /* ── Credit Pack Purchase ──
           POST /api/billing/create-checkout-session with type: 'topup' */
        document.querySelectorAll('.profile-pack').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var packSize = btn.dataset.pack;
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.6';
                fetchWithAuth(API_BASE + '/api/billing/create-checkout-session', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'topup', packSize: packSize })
                }).then(function (res) { return res.json(); })
                  .then(function (data) {
                    if (data.url) window.location.href = data.url;
                }).catch(function () {
                    alert('Could not start checkout. Please try again.');
                }).finally(function () {
                    btn.style.pointerEvents = '';
                    btn.style.opacity = '';
                });
            });
        });

        /* ── Auto-Buy Toggle ──
           Optimistic update with rollback on API failure.
           POST /api/credits/auto-buy */
        var profileAutobuyToggle = document.getElementById('profile-autobuy-toggle');
        if (profileAutobuyToggle) {
            profileAutobuyToggle.addEventListener('click', function () {
                var isActive = profileAutobuyToggle.classList.contains('active');
                var newState = !isActive;
                profileAutobuyToggle.classList.toggle('active', newState);
                fetchWithAuth(API_BASE + '/api/credits/auto-buy', {
                    method: 'POST',
                    body: JSON.stringify({ enabled: newState })
                }).then(function (res) { return res.json(); })
                  .then(function (data) {
                    if (data.success) {
                        profileAutobuyToggle.classList.toggle('active', data.autoBuyEnabled);
                    }
                }).catch(function () {
                    profileAutobuyToggle.classList.toggle('active', isActive);
                });
            });
        }

        /* ── Manage Subscription ──
           Opens the cancel flow modal instead of going directly to Stripe portal.
           The final cancellation step in cancelFlow calls create-portal-session. */
        var profileManageBtn = document.getElementById('profile-manage-btn');
        if (profileManageBtn) {
            profileManageBtn.addEventListener('click', function () {
                _profileIsOpen = false;
                var profileDropdown = document.getElementById('profile-dropdown');
                if (profileDropdown) profileDropdown.style.display = 'none';
                profileManageBtn.disabled = true;
                profileManageBtn.style.opacity = '0.6';
                fetchWithAuth(API_BASE + '/api/billing/create-portal-session', { method: 'POST' })
                    .then(function (res) {
                        if (!res || !res.ok) throw new Error('Portal request failed');
                        return res.json();
                    }).then(function (data) {
                        if (data && data.url) window.location.href = data.url;
                    }).catch(function () {
                        profileManageBtn.disabled = false;
                        profileManageBtn.style.opacity = '';
                    });
            });
        }

        /* ── Upgrade Plan Button ──
           Closes dropdown and navigates to the pricing page. */
        var profileUpgradeBtn = document.getElementById('profile-upgrade-btn');
        if (profileUpgradeBtn) {
            profileUpgradeBtn.addEventListener('click', function () {
                _profileIsOpen = false;
                var profileDropdown = document.getElementById('profile-dropdown');
                if (profileDropdown) profileDropdown.style.display = 'none';
                window.location.href = '/pricing.html';
            });
        }

        /* ── License Key Copy to Clipboard ──
           Swaps the copy icon for a green check on success, restores after 1.5 s. */
        var profileLicenseCopy = document.getElementById('profile-license-copy');
        if (profileLicenseCopy) {
            profileLicenseCopy.addEventListener('click', function () {
                var profileLicenseKey = document.getElementById('profile-license-key');
                var key = profileLicenseKey ? profileLicenseKey.textContent : '';
                if (!key) return;
                navigator.clipboard.writeText(key).then(function () {
                    while (profileLicenseCopy.firstChild) profileLicenseCopy.removeChild(profileLicenseCopy.firstChild);
                    profileLicenseCopy.appendChild(makeCheckSVG());
                    setTimeout(function () {
                        while (profileLicenseCopy.firstChild) profileLicenseCopy.removeChild(profileLicenseCopy.firstChild);
                        profileLicenseCopy.appendChild(makeCopySVG());
                    }, 1500);
                });
            });
        }

        /* ── Signup Modal: Open on .open-signup Elements ──
           If logged in, redirect to pricing instead of opening the modal. */
        document.querySelectorAll('.open-signup').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (isLoggedIn()) {
                    window.location.href = '/pricing.html';
                    return;
                }
                openSignupModal();
            });
        });

        /* ── Signup Modal: Close ── */
        document.querySelectorAll('.signup-modal-close').forEach(function (btn) {
            btn.addEventListener('click', closeSignupModal);
        });

        var signupModal = document.getElementById('signup-modal');
        if (signupModal) {
            signupModal.addEventListener('click', function (e) {
                if (e.target === signupModal) closeSignupModal();
            });
        }

        /* ── Login / Signup mode toggle ──
           The modal flips between register and login in place. Mode is held
           on #signup-form[data-mode]; the form submit branches on that. */
        function setModalMode(mode) {
            var form       = document.getElementById('signup-form');
            if (!form) return;
            form.setAttribute('data-mode', mode);

            var title    = document.getElementById('signup-modal-title');
            var subtitle = document.getElementById('signup-modal-subtitle');
            var pwInput  = document.getElementById('signup-password');
            var submit   = document.getElementById('signup-submit-btn');
            var btnText  = submit && submit.querySelector('.signup-btn-text');
            var question = document.getElementById('signup-mode-toggle-question');
            var toggle   = document.getElementById('signup-login-link');
            var googleBl = document.getElementById('signup-google-label');

            if (mode === 'login') {
                if (title)    title.textContent    = 'Welcome back';
                if (subtitle) subtitle.textContent = 'Log in to your FXbuddy account';
                if (pwInput)  pwInput.setAttribute('autocomplete', 'current-password');
                if (btnText)  btnText.textContent  = 'Log In';
                if (question) question.textContent = "Don't have an account?";
                if (toggle)   toggle.textContent   = 'Sign up';
                if (googleBl) googleBl.textContent = 'Log in with Google';
            } else {
                if (title)    title.textContent    = 'Create your account';
                if (subtitle) subtitle.textContent = 'Get started with FXbuddy in seconds';
                if (pwInput)  pwInput.setAttribute('autocomplete', 'new-password');
                if (btnText)  btnText.textContent  = 'Create Account';
                if (question) question.textContent = 'Already have an account?';
                if (toggle)   toggle.textContent   = 'Log in';
                if (googleBl) googleBl.textContent = 'Continue with Google';
            }

            var errEl = document.getElementById('signup-error');
            if (errEl) errEl.style.display = 'none';
        }

        var loginRedirect = document.getElementById('signup-login-link');
        if (loginRedirect) {
            loginRedirect.addEventListener('click', function (e) {
                e.preventDefault();
                var form = document.getElementById('signup-form');
                var currentMode = form && form.getAttribute('data-mode');
                setModalMode(currentMode === 'login' ? 'signup' : 'login');
            });
        }

        /* ── Google OAuth Button ──
           POST /api/auth/google → redirect to Google consent URL. */
        var googleBtn = document.getElementById('signup-google-btn');
        if (googleBtn) {
            googleBtn.addEventListener('click', function () {
                var signupError = document.getElementById('signup-error');
                googleBtn.disabled = true;
                if (signupError) signupError.style.display = 'none';

                fetch(API_BASE + '/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ origin: window.location.origin })
                }).then(function (res) {
                    return res.json().then(function (data) {
                        if (!res.ok) throw new Error(data.error || 'Google sign-in failed');
                        return data;
                    });
                }).then(function (data) {
                    window.location.href = data.url;
                }).catch(function (err) {
                    var errEl = document.getElementById('signup-error');
                    if (errEl) {
                        errEl.textContent = err.message;
                        errEl.style.display = 'block';
                    }
                }).finally(function () {
                    googleBtn.disabled = false;
                });
            });
        }

        /* ── Email/Password Registration ──
           POST /api/auth/register → stores tokens → closes modal → updates nav CTA. */
        var signupForm   = document.getElementById('signup-form');
        var signupSubmit = document.getElementById('signup-submit-btn');

        if (signupForm) {
            signupForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var signupErrorEl = document.getElementById('signup-error');
                if (signupErrorEl) signupErrorEl.style.display = 'none';

                var mode       = signupForm.getAttribute('data-mode') === 'login' ? 'login' : 'signup';
                var nameEl     = document.getElementById('signup-name');
                var emailEl    = document.getElementById('signup-email');
                var passwordEl = document.getElementById('signup-password');

                var firstName = nameEl     ? nameEl.value.trim()     : '';
                var email     = emailEl    ? emailEl.value.trim()    : '';
                var password  = passwordEl ? passwordEl.value         : '';

                // Client-side validation mirrors backend error messages
                if (!email || !password) {
                    if (signupErrorEl) {
                        signupErrorEl.textContent = 'Email and password are required';
                        signupErrorEl.style.display = 'block';
                    }
                    return;
                }
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email.toLowerCase())) {
                    if (signupErrorEl) {
                        signupErrorEl.textContent = 'Invalid email address';
                        signupErrorEl.style.display = 'block';
                    }
                    return;
                }
                // Signup has a min-length requirement; login accepts whatever
                // the backend stored (older accounts may have had 6-char pw).
                if (mode === 'signup' && password.length < 8) {
                    if (signupErrorEl) {
                        signupErrorEl.textContent = 'Password must be at least 8 characters';
                        signupErrorEl.style.display = 'block';
                    }
                    return;
                }

                if (signupSubmit) {
                    signupSubmit.disabled = true;
                    var btnText    = signupSubmit.querySelector('.signup-btn-text');
                    var btnSpinner = signupSubmit.querySelector('.signup-btn-spinner');
                    if (btnText)    btnText.style.display    = 'none';
                    if (btnSpinner) btnSpinner.style.display = 'inline-flex';
                }

                var endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
                var payload  = mode === 'login'
                    ? { email: email, password: password }
                    : { name: firstName, email: email, password: password };

                // Persist email early so the onboarding flow can pick it up on signup.
                if (mode === 'signup') {
                    localStorage.setItem('fxbuddy-signup-name',  firstName);
                    localStorage.setItem('fxbuddy-signup-email', email);
                }

                fetch(API_BASE + endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(function (regRes) {
                    return regRes.json().then(function (regData) {
                        if (!regRes.ok) {
                            var msg = regData.error
                                   || (mode === 'login' ? 'Invalid email or password' : 'Registration failed');
                            throw new Error(msg);
                        }
                        return regData;
                    });
                }).then(function (regData) {
                    localStorage.setItem('fxbuddy-access-token', regData.accessToken);
                    if (regData.refreshToken) {
                        localStorage.setItem('fxbuddy-refresh-token', regData.refreshToken);
                    }
                    localStorage.setItem('fxbuddy-user-email', email);
                    closeSignupModal();
                    updateProfileState();
                }).catch(function (err) {
                    var errEl = document.getElementById('signup-error');
                    if (errEl) {
                        var fallback = mode === 'login' ? 'Login failed — please try again' : 'Registration failed';
                        errEl.textContent = (err && err.message) ? err.message : fallback;
                        errEl.style.display = 'block';
                    }
                    if (signupSubmit) {
                        signupSubmit.disabled = false;
                        var btnText    = signupSubmit.querySelector('.signup-btn-text');
                        var btnSpinner = signupSubmit.querySelector('.signup-btn-spinner');
                        if (btnText)    btnText.style.display    = 'inline';
                        if (btnSpinner) btnSpinner.style.display = 'none';
                    }
                });
            });
        }

        /* ── Pricing CTA Buttons (.pricing-cta-btn) ──
           Logged in  → POST /api/billing/create-checkout-session with the card's
                        data-tier attribute + window.isYearly billing period.
           Logged out → open signup modal, pre-selecting the relevant tier. */
        document.querySelectorAll('.pricing-cta-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var card        = btn.closest('[data-tier]');
                var tier        = card ? card.dataset.tier : null;
                var accessToken = localStorage.getItem('fxbuddy-access-token');

                btn.style.pointerEvents = 'none';
                btn.textContent = 'Loading...';

                function restoreBtn() {
                    btn.style.pointerEvents = '';
                    btn.textContent = 'Get Started';
                }

                if (accessToken && tier) {
                    fetch(API_BASE + '/api/billing/create-checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            type: 'subscription',
                            plan: tier,
                            billing: window.isYearly ? 'yearly' : 'monthly'
                        })
                    }).then(function (res) {
                        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
                    }).then(function (r) {
                        if (r.ok && r.data.url) {
                            window.location.href = r.data.url;
                            return;
                        }
                        restoreBtn();
                        openSignupModal();
                    }).catch(function () {
                        restoreBtn();
                        openSignupModal();
                    });
                } else {
                    // Pre-select the tier inside the modal if plan cards are present
                    var modal = document.getElementById('signup-modal');
                    if (modal && tier) {
                        modal.querySelectorAll('.modal-pricing-card, .pricing-card').forEach(function (c) {
                            c.classList.toggle('selected', c.dataset.tier === tier);
                        });
                    }
                    openSignupModal();
                    restoreBtn();
                }
            });
        });

        /* ── Signup Step 2: Plan Selection ──
           .modal-plan-btn → POST /api/billing/create-checkout-session → Stripe. */
        document.querySelectorAll('.modal-plan-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                // Read both data-plan (current HTML) and data-tier (legacy) so
                // we don't send plan: undefined when the markup uses data-plan.
                var tier = btn.dataset.plan || btn.dataset.tier;
                btn.disabled = true;
                btn.textContent = 'Loading...';

                fetch(API_BASE + '/api/billing/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + _storedAccessToken
                    },
                    body: JSON.stringify({
                        type: 'subscription',
                        plan: tier,
                        billing: window.isYearly ? 'yearly' : 'monthly'
                    })
                }).then(function (checkoutRes) {
                    return checkoutRes.json().then(function (checkoutData) {
                        if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Failed to start checkout');
                        return checkoutData;
                    });
                }).then(function (checkoutData) {
                    window.location.href = checkoutData.url;
                }).catch(function (err) {
                    alert(err.message);
                    btn.disabled = false;
                    btn.textContent = 'Select';
                });
            });
        });

        /* ── Initial State ── */
        updateProfileState();

        // Fetch balance on load if already logged in
        if (isLoggedIn()) {
            fetchProfileBalance();
        }
    }

    /* ── Public API ── */
    window.FXAuth = {
        init:               init,
        isLoggedIn:         isLoggedIn,
        fetchWithAuth:      fetchWithAuth,
        API_BASE:           API_BASE,
        updateProfileState: updateProfileState,
        openSignupModal:    openSignupModal,
        closeSignupModal:   closeSignupModal
    };

    /* ── Auto-Init ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
