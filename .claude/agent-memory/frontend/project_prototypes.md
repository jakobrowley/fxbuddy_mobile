---
name: FXBuddy Landing Page Prototypes
description: Notes on the prototype files in /prototypes/ — pure vanilla HTML/CSS/JS, no build tools
type: project
---

## Prototype Directory

Location: `/Users/jakob/Documents/FXBUDDY FINAL GITHUB/prototypes/`

The prototypes are standalone `index.html` + `styles.css` + `main.js` files. No build tools — edit directly.

## Approach C: Smart Nav (`/prototypes/approach-c/`)

Key implementation patterns:
- **Banner**: Fixed `.prototype-banner` at `top: 0`, 28px tall; nav pushed to `top: 28px` via `!important`
- **Nav text-to-button morph**: Two CSS classes `nav-cta--text-link` and `nav-cta--button` toggled by JS on scroll. CSS `transition` on background/padding/border-radius gives smooth morph (~0.3s)
- **Scroll indicator**: Removed `mobile-only-indicator` class. ID `hero-scroll-indicator`. Hidden with `.indicator-hidden` class (opacity: 0)
- **Origin peek**: `story-hero` height reduced from `500vh` to `calc(500vh - 80px)` so origin heading peeks at last scene
- **Mock auth**: Document-level `capture` event listener intercepts `.open-signup` clicks before other handlers, sets `localStorage` items, updates nav to "Pricing" button

## Stack Notes

- Pure vanilla JS — no framework, no modules
- CSS: neumorphic design with CSS custom properties (`--bg-base`, `--shadow-raised`, etc.)
- Fonts: Syne (display/headings), Inter (body)
- Dark mode: `dark` class on `<html>` toggled by localStorage
- Scroll jacking: scroll-snap on `<html>` with invisible `.story-snap-point` divs
- Auth state: `fxbuddy-access-token` in localStorage
