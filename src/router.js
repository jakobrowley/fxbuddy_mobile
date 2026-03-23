import { updateActiveTab } from './components/tab-bar.js';

/** @type {Map<string, { render: () => string, init: (el: HTMLElement) => void }>} */
const moduleCache = new Map();

/** @type {Map<string, number>} — scroll position per route */
const scrollPositions = new Map();

/** The currently visible route hash (e.g. '#home') */
let currentHash = null;

const ROUTES = {
    '#home': () => import('./pages/home.js'),
    '#vfx': () => import('./pages/vfx.js'),
    '#motion': () => import('./pages/motion.js'),
    '#sign-up': () => import('./pages/sign-up.js'),
    '#pricing': () => import('./pages/pricing.js'),
};

const DEFAULT_ROUTE = '#home';

/** The scrollable page container element. */
function getContainer() {
    return document.querySelector('.page-container');
}

/**
 * Lazily import a page module, returning it from cache on subsequent calls.
 * @param {string} hash
 * @returns {Promise<{ render: () => string, init: (el: HTMLElement) => void }>}
 */
async function loadModule(hash) {
    if (moduleCache.has(hash)) {
        return moduleCache.get(hash);
    }
    const loader = ROUTES[hash];
    if (!loader) throw new Error(`No route registered for ${hash}`);
    const mod = await loader();
    moduleCache.set(hash, mod);
    return mod;
}

/**
 * Build a page DOM element from the module's render() string.
 * Uses a <template> element which parses HTML inertly (scripts don't execute).
 * Page modules only emit static, project-owned markup — no user content.
 * @param {string} htmlString
 * @returns {HTMLElement}
 */
function buildPageElement(htmlString) {
    const wrapper = document.createElement('div');
    wrapper.className = 'page entering';
    const tmpl = document.createElement('template');
    // nosec: static project-controlled markup only, parsed inertly
    tmpl.innerHTML = htmlString;
    wrapper.appendChild(tmpl.content.cloneNode(true));
    return wrapper;
}

/**
 * Perform the page transition: fade out old, swap content, fade in new.
 * @param {string} hash
 */
async function transitionTo(hash) {
    const container = getContainer();
    if (!container) return;

    const prevHash = currentHash;

    // Save scroll position of the page we're leaving
    if (prevHash) {
        scrollPositions.set(prevHash, container.scrollTop);
    }

    // Find existing page element
    const prevPage = container.querySelector('.page');

    // Load the new module while the exit animation plays in parallel
    const [mod] = await Promise.all([
        loadModule(hash),
        new Promise((resolve) => {
            if (!prevPage) return resolve();
            prevPage.classList.remove('active');
            prevPage.classList.add('exiting');
            // 150ms matches the CSS transition duration
            setTimeout(resolve, 150);
        }),
    ]);

    // Build new page element
    const newPage = buildPageElement(mod.render());
    newPage.setAttribute('data-route', hash);

    // Swap DOM
    if (prevPage) {
        container.removeChild(prevPage);
    }
    container.appendChild(newPage);

    // Restore scroll position
    container.scrollTop = scrollPositions.get(hash) || 0;

    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            newPage.classList.remove('entering');
            newPage.classList.add('active');
        });
    });

    currentHash = hash;

    // Update tab bar active state
    updateActiveTab(hash);

    // Run page's init() to attach event listeners after DOM is live
    if (typeof mod.init === 'function') {
        mod.init(newPage);
    }
}

/**
 * Resolve the current location hash to a known route, falling back to default.
 * @returns {string}
 */
function resolveHash() {
    const hash = window.location.hash || DEFAULT_ROUTE;
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

/**
 * Navigate to a route programmatically.
 * @param {string} hash — e.g. '#effects'
 */
export function navigate(hash) {
    if (!ROUTES[hash]) {
        console.warn(`[router] Unknown route: ${hash}`);
        hash = DEFAULT_ROUTE;
    }
    if (hash === currentHash) return;
    history.pushState(null, '', hash);
    transitionTo(hash);
}

/**
 * Initialise the router — call once after the page container is in the DOM.
 */
export function initRouter() {
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        transitionTo(resolveHash());
    });

    // Also handle direct hash link clicks (anchor tags)
    window.addEventListener('hashchange', () => {
        const hash = resolveHash();
        if (hash !== currentHash) {
            transitionTo(hash);
        }
    });

    // Navigate to the initial route
    transitionTo(resolveHash());
}
