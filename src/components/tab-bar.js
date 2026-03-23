import { navigate } from '../router.js';

const ns = 'http://www.w3.org/2000/svg';

/** Helper: create an SVG element with attributes. */
function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
}

/** Helper: create an SVG <path> */
function path(d) {
    return svgEl('path', { d });
}

/** Helper: create an SVG <line> */
function line(x1, y1, x2, y2) {
    return svgEl('line', { x1, y1, x2, y2 });
}

/** Helper: create an SVG <polyline> */
function polyline(points) {
    return svgEl('polyline', { points });
}

/** Wrapper: build a Lucide-style SVG icon (24x24, 2px stroke, round caps). */
function buildIcon(...children) {
    const svg = svgEl('svg', {
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
    });
    children.forEach((c) => svg.appendChild(c));
    return svg;
}

/** Filled/active icon variants */

function buildHomeIconActive() {
    return buildIcon(
        path('M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z'),
        // filled interior
        Object.assign(svgEl('polyline', { points: '9 22 9 12 15 12 15 22', fill: 'currentColor', stroke: 'none' })),
    );
}

function buildHomeIconOutline() {
    const svg = buildIcon(
        path('M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z'),
        polyline('9 22 9 12 15 12 15 22'),
    );
    return svg;
}

function buildEffectsIconActive() {
    // Sparkles (3 stars): filled
    const s = buildIcon(
        // Large star
        Object.assign(path('M12 2l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 11.1l-3.75 2.6 1.5-4.5L6 6.5h4.5L12 2z'), { fill: 'currentColor' }),
        // Small top-right star
        Object.assign(path('M18 2l.75 2.25H21l-1.875 1.35.75 2.25L18 6.55l-1.875 1.3.75-2.25L15 4.25h2.25L18 2z'), { fill: 'currentColor', stroke: 'none' }),
        // Small bottom-left star
        Object.assign(path('M6 14l.75 2.25H9l-1.875 1.35.75 2.25L6 18.55l-1.875 1.3.75-2.25L3 16.25h2.25L6 14z'), { fill: 'currentColor', stroke: 'none' }),
    );
    return s;
}

function buildEffectsIconOutline() {
    return buildIcon(
        // Large star outline
        path('M12 2l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 11.1l-3.75 2.6 1.5-4.5L6 6.5h4.5L12 2z'),
        // Small top-right star
        path('M18 2l.75 2.25H21l-1.875 1.35.75 2.25L18 6.55l-1.875 1.3.75-2.25L15 4.25h2.25L18 2z'),
        // Small bottom-left star
        path('M6 14l.75 2.25H9l-1.875 1.35.75 2.25L6 18.55l-1.875 1.3.75-2.25L3 16.25h2.25L6 14z'),
    );
}

function buildMotionIconActive() {
    return buildIcon(
        Object.assign(
            path('M5 3l14 9-14 9V3z'),
            { fill: 'currentColor' }
        ),
    );
}

function buildMotionIconOutline() {
    return buildIcon(
        path('M5 3l14 9-14 9V3z'),
    );
}

function buildSignUpIconActive() {
    // User-plus icon — filled body circle
    return buildIcon(
        Object.assign(path('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'), {}),
        Object.assign(svgEl('circle', { cx: '9', cy: '7', r: '4', fill: 'currentColor' }), {}),
        line('19', '8', '19', '14'),
        line('22', '11', '16', '11'),
    );
}

function buildSignUpIconOutline() {
    return buildIcon(
        path('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'),
        svgEl('circle', { cx: '9', cy: '7', r: '4' }),
        line('19', '8', '19', '14'),
        line('22', '11', '16', '11'),
    );
}

const TABS = [
    {
        hash: '#home',
        label: 'Home',
        iconActive: buildHomeIconActive,
        iconOutline: buildHomeIconOutline,
    },
    {
        hash: '#vfx',
        label: 'VFX',
        iconActive: buildEffectsIconActive,
        iconOutline: buildEffectsIconOutline,
    },
    {
        hash: '#motion',
        label: 'Motion',
        iconActive: buildMotionIconActive,
        iconOutline: buildMotionIconOutline,
    },
    {
        hash: '#sign-up',
        label: 'Sign Up',
        iconActive: buildSignUpIconActive,
        iconOutline: buildSignUpIconOutline,
    },
];

/** Map from hash to button element for fast updates */
const tabButtonMap = new Map();

/**
 * Build and return the tab bar element.
 * @returns {HTMLElement}
 */
export function renderTabBar() {
    const nav = document.createElement('nav');
    nav.className = 'tab-bar';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Main navigation');

    TABS.forEach(({ hash, label, iconOutline }) => {
        const btn = document.createElement('button');
        btn.className = 'tab-item';
        btn.setAttribute('type', 'button');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', label);
        btn.setAttribute('data-route', hash);

        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'tab-icon';
        iconWrapper.appendChild(iconOutline());

        const labelEl = document.createElement('span');
        labelEl.className = 'tab-label';
        labelEl.textContent = label;

        btn.appendChild(iconWrapper);
        btn.appendChild(labelEl);

        btn.addEventListener('click', () => navigate(hash));

        tabButtonMap.set(hash, btn);
        nav.appendChild(btn);
    });

    return nav;
}

/**
 * Update the visual active state of all tab buttons.
 * Called by the router on every navigation.
 * @param {string} activeHash — e.g. '#home'
 */
export function updateActiveTab(activeHash) {
    TABS.forEach(({ hash, iconActive, iconOutline }) => {
        const btn = tabButtonMap.get(hash);
        if (!btn) return;

        const isActive = hash === activeHash;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));

        // Swap icon
        const iconWrapper = btn.querySelector('.tab-icon');
        if (iconWrapper) {
            iconWrapper.replaceChildren(isActive ? iconActive() : iconOutline());
        }
    });
}
