---
name: FXBuddy Mobile — project stack & conventions
description: Framework, file layout, component patterns, CSS conventions for the fxbuddy_mobile Vite app
type: project
---

## Stack
- **Vite + Vanilla JS** (no framework), ES modules (`"type": "module"`)
- **No dependencies** — zero runtime libraries, everything is vanilla DOM
- `npm run dev` / `npm run build` / `npm run preview`

## Directory layout
```
src/
  main.js            — entry: CSS imports, app shell render, initRouter, initDarkMode
  router.js          — hash-based SPA router, lazy-loads page modules
  dark-mode.js       — localStorage dark mode, builds SVG icons with createElementNS
  styles/
    tokens.css       — CSS custom properties (light + .dark overrides)
    reset.css        — mobile-first base reset
    app-shell.css    — header, page-container, page transitions, desktop notice
    tab-bar.css      — tab bar layout + active states
    components.css   — .card, .btn-primary/secondary, .bottom-sheet, .pill, .badge
    home.css         — Home page styles
    effects.css      — Effects page styles
    pricing.css      — Pricing page styles
    get-started.css  — Auth / Account page styles
  pages/
    home.js          — render() + init(container) + destroy()
    effects.js       — render() + init(container) + destroy()
    pricing.js       — render() + init(container) + destroy()
    get-started.js   — render() + init(container) + destroy()
  components/
    tab-bar.js       — renderTabBar(), updateActiveTab(hash)
    sticky-cta.js    — initStickyCta(), destroyStickyCta()
public/
  effects/           — video files (MP4)
  favicon.svg
  icons.svg
```

## Key conventions

### Page module contract
Every page exports:
- `render()` → HTML string (static, project-controlled only)
- `init(container)` → attaches event listeners after DOM is live
- `destroy()` (optional) → clean up IntersectionObservers, timers, etc.

### innerHTML / security hook
The project has a security hook that blocks `innerHTML` when it sees it.
- Use `document.createElement` / `createElementNS` for component JS
- Page render() strings are safe (project-owned), parsed via `<template>` in router.js
- Always add `// nosec: static project-controlled markup only` comment when `template.innerHTML` is unavoidable

### Dark mode
- Flash prevention: inline `<script>` in `index.html` adds `.dark` to `<html>` before paint
- `initDarkMode()` syncs toggle button icon, wires click handler
- SVG icons built with `createElementNS` to avoid innerHTML hook

### CSS tokens (light / dark)
All colors, shadows, fonts are CSS custom properties in `tokens.css`.
- `--bg-base`, `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--accent` = black in light, white in dark
- `--shadow-raised` / `--shadow-pressed` / `--shadow-button` / `--shadow-button-active` (neumorphic)
- `--font-display: 'Syne'` (800 weight only), `--font-body: 'Inter'`

### Tab bar
- `renderTabBar()` returns a `<nav>` element (DOM, not HTML string)
- Icons built with `createElementNS` — active variant uses filled paths
- `updateActiveTab(hash)` swaps icon and `.active` class; called by router

### Router
- Hash-based: `#home`, `#effects`, `#pricing`, `#get-started`
- Lazy imports pages on first visit, caches modules in Map
- Page transition: exit (opacity 0, translateY -8px) parallel with module load → swap → enter animation
- Saves scroll position per tab in Map
- `navigate(hash)` for programmatic navigation

**Why:** Scroll preservation is per-tab, not per-route — restores to 0 if never visited.
