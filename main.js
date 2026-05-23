// ── GSAP plugin dynamic loader ────────────────────────────────
// Idempotent: returns a cached Promise if the plugin was already requested.
// Usage: window.loadGsapPlugin('ScrollTrigger').then(() => { /* use it */ });
(function () {
    const GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/';
    const _promises = {};
    window.loadGsapPlugin = function (name) {
        if (_promises[name]) return _promises[name];
        // If already on window (e.g. static script tag still present), resolve immediately.
        if (window[name]) {
            _promises[name] = Promise.resolve(window[name]);
            return _promises[name];
        }
        _promises[name] = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = GSAP_CDN + name + '.min.js';
            s.onload = function () { resolve(window[name]); };
            s.onerror = function () { reject(new Error('Failed to load GSAP plugin: ' + name)); };
            document.head.appendChild(s);
        });
        return _promises[name];
    };
})();

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Theme toggle ──────────────────────────────────────────
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    toggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('fxbuddy-v2-theme', html.classList.contains('dark') ? 'dark' : 'light');
    });

    // ── 2. Nav scroll effect ──────────────────────────────────────
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    }, { passive: true });

    // ── 3. FAQ accordion ─────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('faq-open');
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-open'));
            // Toggle current
            if (!wasOpen) item.classList.add('faq-open');
        });
    });

    // ── 4. Pricing toggle (OG-style) ─────────────────────────────
    const toggleSwitch = document.getElementById('pricing-toggle-switch');
    const toggleLabels = document.querySelectorAll('.pricing-toggle-label');
    window.isYearly = false;

    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', () => {
            window.isYearly = !window.isYearly;
            toggleSwitch.classList.toggle('yearly', window.isYearly);

            // Update active label
            toggleLabels.forEach(l => {
                l.classList.toggle('active', l.dataset.period === (window.isYearly ? 'yearly' : 'monthly'));
            });

            // Update card prices
            document.querySelectorAll('.pricing-card[data-monthly]').forEach(card => {
                const monthly = card.dataset.monthly;
                const yearly = card.dataset.yearly;
                const dailyMonthly = card.dataset.dailyMonthly;
                const dailyYearly = card.dataset.dailyYearly;
                const amountEl = card.querySelector('.pricing-amount');
                const dailyEl = card.querySelector('.pricing-daily');
                if (amountEl) amountEl.textContent = '$' + (window.isYearly ? yearly : monthly);
                if (dailyEl) dailyEl.textContent = "That's just $" + (window.isYearly ? dailyYearly : dailyMonthly) + '/day';
            });
        });
    }

    // ── 5. IntersectionObserver fallback for reveal animations ──
    //    When GSAP is loaded, animations.js adds `html.gsap-ready` and
    //    the matching CSS guard neutralizes .reveal's initial opacity:0.
    //    If GSAP fails to load (CDN blocked / offline), the guard never
    //    applies — this observer adds `.revealed` so content still shows.
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── 5b. Lazy autoplay for B/A grid videos ───────────────────
    //    Videos use preload="none" + data-src + class="lazy-autoplay" so they
    //    don't download until they scroll into view. On intersect, src is
    //    assigned from data-src before play() is called (idempotent — once src
    //    is set, subsequent intersects skip the assignment).
    //
    //    For B/A sliders (.ba-slider), the before/after pair must start
    //    together. We observe the slider container, not the videos, so
    //    both get a single synchronous play() call inside one microtask.
    //    Any other .lazy-autoplay videos use the solo observer below.

    // Helper: assign src from data-src if not yet done.
    function loadVideoSrc(v) {
        if (!v.src && v.dataset.src) {
            v.src = v.dataset.src;
        }
    }

    if ('IntersectionObserver' in window) {
        // Stagger video start across sliders so we don't kick off 8 H.264 decoders
        // in the same frame on weak mobile CPUs. Each newly-intersecting card waits
        // an extra 120ms — the poster image covers the gap so it's visually invisible.
        let baStartDelay = 0;
        const baObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const vids = entry.target.querySelectorAll('video');
                if (entry.isIntersecting) {
                    const delay = baStartDelay;
                    baStartDelay += 120;
                    setTimeout(() => {
                        vids.forEach(v => {
                            loadVideoSrc(v);
                            try { v.currentTime = 0; } catch (_) {}
                        });
                        Promise.all(Array.from(vids).map(v => v.play().catch(() => {})));
                    }, delay);
                } else {
                    vids.forEach(v => v.pause());
                }
            });
        }, { rootMargin: '200px 0px' });
        document.querySelectorAll('.ba-slider').forEach(s => baObserver.observe(s));

        const soloVideos = document.querySelectorAll('video.lazy-autoplay:not(.ba-slider video)');
        if (soloVideos.length) {
            const soloObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadVideoSrc(entry.target);
                        entry.target.play().catch(() => {});
                    } else {
                        entry.target.pause();
                    }
                });
            }, { rootMargin: '200px 0px' });
            soloVideos.forEach(v => soloObserver.observe(v));
        }
    } else {
        // Fallback: load and play every lazy-autoplay video immediately.
        document.querySelectorAll('video.lazy-autoplay').forEach(v => {
            loadVideoSrc(v);
            v.play().catch(() => {});
        });
    }

    // ── 6. Mascot instances ──────────────────────────────────────
    window.heroMascot = new Mascot({
        container: document.getElementById('hero-mascot'),
        hasZzz: false,
        hasPhysicsBody: true,
    });

    window.ctaMascot = new Mascot({
        container: document.getElementById('cta-mascot'),
        eyesSelector: '.cta-eyes',
        eyeOvalSelector: '.cta-eye-oval',
        eyePathSelector: '.cta-eye-path',
        bodySelector: '.cta-mascot-body',
        hasZzz: false,
        hasPhysicsBody: true,
        maxMove: 5,
        springStiffness: 0.06,
        damping: 0.8,
    });

    // CTA mascot starts happy
    if (window.ctaMascot) window.ctaMascot.setStatus('success');

    // ── 7. Smooth scroll for anchor links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── 8. Hero mascot wiggle on hover ───────────────────────────
    const heroMascotEl = document.getElementById('hero-mascot');
    if (heroMascotEl) {
        heroMascotEl.addEventListener('mouseenter', () => {
            if (window.heroMascot) window.heroMascot.setStatus('anticipation');
        });
        heroMascotEl.addEventListener('mouseleave', () => {
            if (window.heroMascot) window.heroMascot.setStatus('idle');
        });
    }

    // ── 9. Hero headline reveal — letter scale-pop + blur ────────
    //    Each character starts scaled down, blurred, and transparent,
    //    then punches into place with a back-ease overshoot and a
    //    24 ms stagger. Letters of the same word are kept together
    //    so they never break across lines.
    const headline = document.querySelector('.hero-headline');
    if (headline && !headline.dataset.letterSplit) {
        const text = headline.textContent.trim();
        const words = text.split(/\s+/);
        headline.dataset.letterSplit = '1';
        headline.textContent = '';
        let letterIdx = 0;
        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'reveal-word';
            for (const ch of word) {
                const letter = document.createElement('span');
                letter.className = 'reveal-letter';
                letter.textContent = ch;
                letter.style.transitionDelay = (letterIdx * 22) + 'ms';
                wordSpan.appendChild(letter);
                letterIdx++;
            }
            headline.appendChild(wordSpan);
            if (wi < words.length - 1) {
                const space = document.createElement('span');
                space.className = 'reveal-space';
                headline.appendChild(space);
            }
        });
        requestAnimationFrame(() => {
            headline.querySelectorAll('.reveal-letter').forEach(l => l.classList.add('is-in'));
        });
    }

});
