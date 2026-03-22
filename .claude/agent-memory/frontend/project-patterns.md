---
name: FXBuddy Mobile Page & Component Patterns
description: Conventions for page modules, CSS, and component structure in fxbuddy_mobile
type: project
---

# Page Module Contract

Every page at `src/pages/*.js` must export:
- `render()` — returns a static HTML string. No event listeners here.
- `init(container)` — `container` is the `.page` wrapper div (NOT `.page-container`). Attach all event listeners here.
- `destroy()` (optional) — clean up side effects (observers, body overflow locks, etc.)

# Router Behavior
- Router lazy-imports pages via dynamic `import()`
- Calls `mod.render()`, wraps result in `<div class="page entering">`, appends to `.page-container`
- Then calls `mod.init(newPage)` where `newPage` is that wrapper div
- Pages are cached after first load (module cache)

# Bottom Sheet Pattern
Toggle `.visible` on `.bottom-sheet-overlay` AND `.open` on `.bottom-sheet`.
CSS transitions handle the animation (300ms). Do NOT use the `hidden` attribute.

```js
function open() {
  overlay.classList.add('visible');
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function close() {
  overlay.classList.remove('visible');
  sheet.classList.remove('open');
  document.body.style.overflow = '';
}
```

# CSS Organization
- Each page has its own CSS file: `src/styles/home.css`, `src/styles/effects.css`, etc.
- Import CSS at the top of the page JS module: `import '../styles/home.css'`
- Shared styles live in `src/styles/components.css` (cards, buttons, pills, bottom sheets, typography)

# IntersectionObserver for Videos
Use threshold: 0.5 to autoplay when 50% visible, pause otherwise.
Always disconnect observer in `destroy()`.

# Scroll Dot Indicators
```js
const updateDots = () => {
  const cardWidth = cards[0].offsetWidth + gap;
  const activeIndex = Math.min(Math.round(scrollEl.scrollLeft / cardWidth), dots.length - 1);
  dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
};
scrollEl.addEventListener('scroll', updateDots, { passive: true });
```

# Escaping in render() strings
Always escape user-like data in HTML strings:
- `escAttr(str)` for attribute values
- `escHtml(str)` for text content
(Define these as local helpers in the page module.)

# Why: security hook will flag innerHTML — page HTML must be provably static/trusted
