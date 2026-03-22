/**
 * Bottom Sheet component
 * Dynamically creates and manages a slide-up bottom sheet modal.
 *
 * SECURITY NOTE: contentHTML must only ever be passed from trusted,
 * project-controlled page modules — never from user input or external data.
 */

let overlayEl = null;
let sheetEl = null;
let contentEl = null;

/**
 * Opens a bottom sheet with the given HTML content.
 * @param {string} contentHTML - Trusted, project-controlled HTML string (no user data)
 */
export function openBottomSheet(contentHTML) {
  // Remove any existing sheet first
  closeBottomSheet();

  // Create overlay
  overlayEl = document.createElement('div');
  overlayEl.className = 'bottom-sheet-overlay';
  overlayEl.setAttribute('aria-hidden', 'true');

  // Create sheet
  sheetEl = document.createElement('div');
  sheetEl.className = 'bottom-sheet';
  sheetEl.setAttribute('role', 'dialog');
  sheetEl.setAttribute('aria-modal', 'true');

  // Drag handle
  const handle = document.createElement('div');
  handle.className = 'bottom-sheet-handle';

  // Content wrapper — content is static, project-controlled markup only (no user input)
  contentEl = document.createElement('div');
  contentEl.innerHTML = contentHTML; /* nosec: project-controlled static HTML */

  sheetEl.appendChild(handle);
  sheetEl.appendChild(contentEl);

  document.body.appendChild(overlayEl);
  document.body.appendChild(sheetEl);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Trigger transitions on next frame
  requestAnimationFrame(() => {
    overlayEl.classList.add('visible');
    sheetEl.classList.add('open');
  });

  // Close on overlay click
  overlayEl.addEventListener('click', closeBottomSheet);

  // Swipe-down to close
  let touchStartY = 0;
  sheetEl.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  sheetEl.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientY - touchStartY;
    if (delta > 80) closeBottomSheet();
  }, { passive: true });
}

/**
 * Slides the sheet down and removes it from the DOM after the transition.
 */
export function closeBottomSheet() {
  if (!sheetEl && !overlayEl) return;

  if (overlayEl) overlayEl.classList.remove('visible');
  if (sheetEl) sheetEl.classList.remove('open');

  document.body.style.overflow = '';

  const cleanup = () => {
    if (overlayEl && overlayEl.parentNode) {
      overlayEl.parentNode.removeChild(overlayEl);
    }
    if (sheetEl && sheetEl.parentNode) {
      sheetEl.parentNode.removeChild(sheetEl);
    }
    overlayEl = null;
    sheetEl = null;
    contentEl = null;
  };

  // Wait for slide-down transition (300ms) before removing
  setTimeout(cleanup, 320);
}
