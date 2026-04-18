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

    // ── 5. Intersection Observer for reveal animations ──────────
    // GSAP-MIGRATION: replaced by ScrollTrigger.batch in animations.js.
    // To revert: uncomment this block and remove the html.gsap-ready CSS guards.
    /*
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    */

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

    // ── 9. Hero headline reveal — word-mask slide-up ─────────────
    //    Each word is wrapped in an overflow-hidden mask and its
    //    inner span slides up from below the baseline into position.
    //    Distinct from the blur-up word reveal on pxlsafe.
    const headline = document.querySelector('.hero-headline');
    if (headline && !headline.dataset.wordSplit) {
        const text = headline.textContent.trim();
        const words = text.split(/\s+/);
        headline.dataset.wordSplit = '1';
        headline.textContent = '';
        words.forEach((word, i) => {
            const mask = document.createElement('span');
            mask.className = 'reveal-mask';
            const inner = document.createElement('span');
            inner.className = 'reveal-inner';
            inner.textContent = word;
            mask.appendChild(inner);
            headline.appendChild(mask);
            if (i < words.length - 1) headline.appendChild(document.createTextNode(' '));
        });
        requestAnimationFrame(() => {
            headline.querySelectorAll('.reveal-mask').forEach((mask, i) => {
                mask.querySelector('.reveal-inner').style.transitionDelay = (i * 75) + 'ms';
                mask.classList.add('is-in');
            });
        });
    }

});
