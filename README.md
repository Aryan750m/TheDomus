# The Domus

A five-page marketing site for **The Domus**, a fictional luxury interior-architecture
studio. Built with hand-written HTML5, CSS3 and vanilla JavaScript — no frameworks,
no build step.

The experience (transparent-to-solid sticky nav, cinematic hero reveal, scroll-triggered
section reveals, magnetic buttons, custom cursor, masonry gallery with lightbox, and a
material-swatch "Why Us" section) is an original interpretation of the *quality bar* set
by contemporary luxury real-estate sites — none of their assets, copy, code, or specific
layouts were copied. See `progress.md` for the full development log.

## Structure

```
Domus/
├── index.html          Homepage — all core sections
├── about.html           Studio history, timeline, team
├── projects.html        Full project grid with filtering
├── services.html         Three service pillars + process
├── contact.html          Enquiry form + studio details
├── css/
│   ├── style.css        Design tokens, layout, components
│   ├── animations.css   Keyframes & motion utilities
│   └── responsive.css   Breakpoints (mobile → large monitor)
├── js/
│   ├── main.js          Loader, mobile nav, page transitions, forms
│   ├── animations.js    Magnetic buttons, ripple, gallery filter/lightbox, slider
│   ├── cursor.js         Custom cursor follower
│   └── scroll.js         Reveal-on-scroll, counters, progress bar
├── assets/               images / videos / icons / fonts (placeholders)
├── robots.txt
├── sitemap.xml
└── progress.md            Development journal (see Rules inside)
```

## Running it

No build step. Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## What's still a placeholder

This was generated without access to real studio photography, so every image is a
CSS gradient block standing in for a photo (`.media-block`, `.ph`, `.project-card .media`,
etc. — all styled via the `--plate` custom property). Swap these for real `<img>`/`<video>`
elements in `assets/images` and `assets/videos` before shipping. The contact form currently
shows a client-side success message only — wire `js/main.js`'s `data-form` submit handler
to Formspree, Web3Forms, or your backend of choice.

## Design notes

- **Palette:** ink black, warm limewash plaster, aged brass, walnut, muted sage — named
  after real interior materials rather than generic "dark theme" tokens.
- **Type:** Fraunces (display) + Inter (body) + Space Mono (labels/data), loaded from
  Google Fonts.
- **Signature element:** the "material swatch board" in the Why Domus section, echoing an
  interior designer's physical swatch board rather than a generic icon grid.
- Motion respects `prefers-reduced-motion`; focus states are visible; layout is responsive
  from large monitors down to small mobile.
