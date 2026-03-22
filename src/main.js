// CSS — import order matters: tokens first, then reset, then layout, then components
import './styles/tokens.css';
import './styles/reset.css';
import './styles/app-shell.css';
import './styles/tab-bar.css';
import './styles/components.css';

import { initRouter } from './router.js';
import { renderTabBar } from './components/tab-bar.js';
import { initDarkMode } from './dark-mode.js';

/** Build the dark mode toggle button (icon injected by initDarkMode). */
function buildToggleButton() {
    const btn = document.createElement('button');
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Toggle dark mode');
    return btn;
}

/** Build the fixed app header. */
function buildHeader() {
    const header = document.createElement('header');
    header.className = 'app-header';

    const brand = document.createElement('span');
    brand.className = 'brand';
    brand.textContent = 'FXbuddy';

    header.appendChild(brand);
    header.appendChild(buildToggleButton());
    return header;
}

/** Build the scrollable page content container. */
function buildPageContainer() {
    const container = document.createElement('main');
    container.className = 'page-container';
    container.setAttribute('id', 'page-container');
    return container;
}

/** Render a notice for desktop visitors (viewport wider than 1024px). */
function renderDesktopNotice() {
    const overlay = document.createElement('div');
    overlay.className = 'desktop-notice';

    const card = document.createElement('div');
    card.className = 'desktop-notice-card';

    const brandEl = document.createElement('div');
    brandEl.className = 'brand';
    brandEl.textContent = 'FXbuddy';

    const msg = document.createElement('p');
    msg.textContent =
        'This experience is designed for mobile. Visit fxbuddy.app on your phone for the full experience.';

    const link = document.createElement('a');
    link.href = 'https://fxbuddy.app';
    link.textContent = 'fxbuddy.app';
    // Open in same tab — not a new tab, to avoid opener risks
    link.setAttribute('rel', 'noopener noreferrer');

    card.appendChild(brandEl);
    card.appendChild(msg);
    card.appendChild(link);
    overlay.appendChild(card);

    return overlay;
}

/** Bootstrap the entire app. */
function init() {
    const root = document.getElementById('app');
    if (!root) return;

    // Desktop notice — still show the app shell on narrower windows
    if (window.innerWidth > 1024) {
        root.appendChild(renderDesktopNotice());
        return;
    }

    // Build and mount the shell
    root.appendChild(buildHeader());
    root.appendChild(buildPageContainer());
    root.appendChild(renderTabBar());

    // Dark mode — must run after header is in DOM (needs the toggle button)
    initDarkMode();

    // Router — must run after page-container is in DOM
    initRouter();
}

document.addEventListener('DOMContentLoaded', init);
