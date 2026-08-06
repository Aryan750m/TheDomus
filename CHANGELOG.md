# CHANGELOG — The Domus Website

All notable changes to this project are documented here.
Format: `[Version] — Date — Description`

---

## [3.0.0] — 2026-08-06 — White Luxury Redesign

### Added

**Design & Palette System**
- Complete visual transition to Scandinavian minimal / white luxury aesthetic.
- Color Tokens: Pure White (`#FFFFFF`) primary background, Warm White (`#FAFAF8`) secondary background, Warm Stone/Beige (`#F5F3EF`/`#EDEBE5`) accents/cards, Rich Charcoal (`#1C1C1E`) typography, and Warm Gold (`#B89A5C`) details.
- High-contrast editorial typography system: Cormorant Garamond for display headlines, DM Sans for high-readability body text.
- Thin borders (`rgba(28,28,30,0.08)`) and soft elevation shadows (`rgba(0,0,0,0.06)`) for a premium editorial print look.
- White-theme glassmorphism utility classes (`.glass`, `.glass-stone`) with light blur backdrops.

**Page & Layout Adjustments**
- Rebuilt `index.html` with a white split-hero layout, featuring an editorial headline on pure white background (left) and warm real photography (right) with customized floating caption metadata.
- Transformed `about.html` into a clean white magazine grid with gold accents and lime-plaster hero cover.
- Overhauled `projects.html` masonry grid with thin borders, clean gold category labels, and details preview.
- Upgraded `services.html` with alternating white/warm-white sections and gold numbering.
- Adapted `contact.html` with high-contrast form fields, floating label transforms, and clear FAQ items.

### Changed
- Film grain overlay set to multiply blend with reduced opacity (`0.018`) to seamlessly texture white background pages.
- Hero load animations orchestrated to show meta detail bars after loader fadeout.
- Integrated the `.hero-meta` tag to guarantee correct opacity transition timelines.
- **Asset Optimization**: Converted all project images (PNG/JPG) in `assets/images/` to WebP format at 92% quality.
- **Logo Resizing**: Resized massive 32,185px wide logo PNG files (`logo.png`, `logo-bnw.png`) down to a high-fidelity 4,096px width before WebP conversion, avoiding WebP dimension limitations.
- **Pre-converted WebP Compressions**: Re-compressed original bloated WebP assets to 92% quality, significantly shrinking the directory footprint.
- **References Updates**: Automatically replaced all Jpeg/Png references with `.webp` across `index.html`, `about.html`, `projects.html`, `services.html`, `contact.html`, and `css/style.css`.
- Removed original Jpeg and Png files to clean up project directory weight.

---

## [2.0.0] — 2026-08-06 — Apple-Level Luxury Upgrade

### Added

**Design System**
- Complete CSS design system overhaul with 50+ new tokens
- Film grain canvas overlay (`js/noise.js`) — 14fps animated grain
- Glass utility class (`.glass`, `.glass-light`) — backdrop-filter
- Spring easing curve (`--ease-spring`, `--ease-expo`, `--ease-circ`)
- Expanded border-radius scale (`--radius-sm`, `--radius-card`, `--radius-lg`, `--radius-pill`)
- Full shadow elevation scale (`--shadow-sm` → `--shadow-xl`, `--shadow-brass`)
- Shimmer sweep animation keyframe on buttons (`.btn::after`)
- Animated scroll progress bar with gradient fill
- Page transition overlay — bottom-up wipe between pages
- Marquee strip in hero with pause-on-hover

**JavaScript Modules**
- `js/noise.js` — canvas-based animated film grain (new module)
- `js/text-split.js` — word and character splitting engine with IO reveal (new module)
- Cursor v2 — adaptive lerp coefficient, context-aware label ('View', 'Zoom', 'Play', 'Drag'), input field cursor hiding, click scale feedback, window leave/enter fade
- Scroll v2 — smart header hide on scroll down, hero entrance orchestration (MutationObserver on loader), lazy image loading (`data-src` swap), horizontal scroll material reel, section progress CSS variable (`--sp`)
- Animations v2 — lightbox prev/next navigation, keyboard ← → arrows, touch swipe; gallery smooth CSS transitions; testimonial dots, touch swipe, autoplay; FAQ accordion; mobile nav stagger on open

**Homepage Sections (index.html)**
- Fullscreen video hero with `<video>` background, poster fallback, and scale animation on canplay
- Hero text lines with delayed `.revealed` class orchestration
- Marquee strip below hero with 16 items
- Awards & Recognition section (4-stat grid with counters)
- FAQ Accordion section (5 questions with smooth height animation)
- Materials Reel — horizontal scroll pinned section (4 material panels)
- Cinematic pull-quote section
- Real photography throughout (Cam 1–8 series, View 1–6 series)
- Gallery upgraded to 9 real images with lightbox prev/next
- Testimonial slider with dot indicators and touch swipe
- Full ARIA roles, `aria-label`, `aria-expanded`, `aria-controls`, `aria-live`

**Pages**
- `about.html` — page hero with real photo, 6-milestone timeline, values swatch board, pull quote
- `projects.html` — 8 real projects in masonry grid with category filters (All/Residential/Hospitality/Material Studies), captions, lightbox
- `services.html` — 3 alternating split-layout service showcases with real images and feature lists
- `contact.html` — hero, 5-field form, studio info panel, map placeholder, FAQ teaser, social links

**Assets**
- 40+ images copied from backup into `assets/images/`
- Hero video (`assets/videos/hero.mp4`) and alternate (`hero-alt.mp4`)
- SVG favicon (`assets/icons/favicon.svg`)

### Changed

**CSS**
- `css/style.css` — complete overhaul, backward compatible HTML structure preserved
- `css/animations.css` — 20+ keyframes added, stagger system extended to 16 items
- `css/responsive.css` — expanded from 4 to 7 breakpoints (375/480/768/1024/1200/1440/1920)
- Loader redesigned: word reveal + horizontal line grow + sub-label fade (3-phase animation)
- Mobile nav transitions from top-down to left-right slide; links animate with stagger on open
- Project grid redesigned from 2-column equal to 12-column editorial layout
- Swatch board `.swatch` elements gain bottom-border reveal on hover

**JavaScript**
- All existing JS modules upgraded (see Added above)

### Fixed

- Hero entrance now fires after loader hides (MutationObserver) instead of a fixed timeout
- Page transition overlay removed from browser history (fixed back-button jitter)
- Form status auto-clears after 6 seconds
- Mobile nav correctly closes on Escape key

---

## [1.0.0] — 2026-08-06 — Initial Build

- Five-page site scaffolded (index, about, projects, services, contact)
- CSS design token system (color, type, spacing)
- Basic animation system (IntersectionObserver reveals, counters, process dots)
- Custom cursor (dot + ring)
- Loader (single word reveal)
- Mobile navigation
- Gallery + lightbox (close only)
- Testimonial slider (autoplay, no touch)
- SEO scaffolding (meta, OG, Twitter, schema, robots, sitemap, canonical)
- robots.txt, sitemap.xml, README.md, LICENSE
