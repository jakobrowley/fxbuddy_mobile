const STORAGE_KEY = 'fxbuddy-dark-mode';

/**
 * Build an SVG element from a static definition.
 * All content is hard-coded — no user input touches this path.
 */
function buildSunIcon() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '5');
    svg.appendChild(circle);

    const lines = [
        [12, 1, 12, 3],
        [12, 21, 12, 23],
        [1, 12, 3, 12],
        [21, 12, 23, 12],
        [4.22, 4.22, 5.64, 5.64],
        [18.36, 18.36, 19.78, 19.78],
        [4.22, 19.78, 5.64, 18.36],
        [18.36, 5.64, 19.78, 4.22],
    ];
    lines.forEach(([x1, y1, x2, y2]) => {
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', String(x1));
        line.setAttribute('y1', String(y1));
        line.setAttribute('x2', String(x2));
        line.setAttribute('y2', String(y2));
        svg.appendChild(line);
    });

    return svg;
}

function buildMoonIcon() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    svg.appendChild(path);

    return svg;
}

/**
 * Returns whether dark mode is currently active.
 */
export function isDarkMode() {
    return document.documentElement.classList.contains('dark');
}

/**
 * Update the toggle button icon to reflect the current mode.
 */
function syncToggleButton() {
    const btn = document.querySelector('.dark-mode-toggle');
    if (!btn) return;
    const dark = isDarkMode();
    // Replace icon
    btn.replaceChildren(dark ? buildSunIcon() : buildMoonIcon());
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

/**
 * Apply a specific dark mode state and persist it.
 */
function applyDarkMode(dark) {
    if (dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    try {
        localStorage.setItem(STORAGE_KEY, String(dark));
    } catch (e) {
        // localStorage unavailable — silently ignore
    }
    syncToggleButton();
}

/**
 * Initialise dark mode on app boot. Reads from localStorage (already applied
 * to <html> by the inline script in index.html — this just wires up the toggle).
 */
export function initDarkMode() {
    // The inline script in index.html already toggled the class before paint.
    // We only need to sync the button icon once the DOM is ready.
    syncToggleButton();

    // Wire up the toggle button
    const btn = document.querySelector('.dark-mode-toggle');
    if (btn) {
        btn.addEventListener('click', toggleDarkMode);
    }
}

/**
 * Toggle dark mode on/off.
 */
export function toggleDarkMode() {
    applyDarkMode(!isDarkMode());
}
