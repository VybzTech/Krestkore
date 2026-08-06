# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm start            # ng serve → http://localhost:4200
npm run build        # production build (default config) → dist/krestkore-solutions
npm run watch        # development build, rebuilds on change
```

There is no test runner, linter, or e2e setup in this project — no `ng test`/`ng lint` targets exist in [angular.json](angular.json), and no testing packages are installed. Don't suggest `npm test`; it will fail. Verification is done by building and viewing the page.

Production builds enforce budgets: **1 MB error** on the initial bundle and **8 KB error per component style block** (4 KB warning). Since every component keeps its CSS inline in the `styles: []` array, a large style addition to a single component can break the production build while `npm run watch` (development) stays green. Run `npm run build` after adding substantial CSS.

## Architecture

Angular 17 single-page marketing site for Krestkore Solutions Limited (IT services company, Lagos, Nigeria). **No router pages, no services layer, no state management, no backend of its own.** The whole site is one scrolling page.

- **Fully standalone components.** No NgModules anywhere. `bootstrapApplication` in [src/main.ts](src/main.ts) → `AppComponent` with providers from [src/app/app.config.ts](src/app/app.config.ts) (`provideRouter([])` — an empty route table kept only so the router is available; `provideHttpClient()` for the contact form).
- **[app.component.ts](src/app/app.component.ts) is the page layout.** It imports all nine components and lays them out in fixed order: navbar → hero → marquee → services → testimonials → about → contact → footer → chat-agent. Adding a section means creating the component, importing it there, and placing its tag. Ordering on the page is decided in this one file.
- **Single-file components.** Each component is one `.ts` with an inline `template` and inline `styles` — there are no separate `.html` or `.css` files, and no `.spec.ts`. Follow that convention for new components (it's also enforced by the `@schematics/angular:component` defaults in angular.json: `style: css`, `standalone: true`).
- **Content lives in class-property arrays**, rendered with `*ngFor`. Copy, service listings, brand logos, testimonials, and links are data, not markup — edit the array, not the template. Key arrays: `services` (services), `pillars` (about), `stats` (hero), `testimonials` (testimonials), `brands` (marquee), `socials` and `links` (footer), `quickLinks` and `infoItems` (chat-agent, contact).
- **Signals for all local UI state** (`signal`, `computed`, `.update()`) — e.g. `scrolled`/`menuOpen` in navbar, `activeIndex` in testimonials, `status` in contact, `chatOpen` in chat-agent. There is no shared/global state; components never talk to each other.

### Navigation is anchor-based

All links are `href="#..."` fragments against section ids rendered by the components: `#home` (hero), `#services`, `#testimonials`, `#about` and `#edge` (both inside about.component), `#contact`. `html { scroll-behavior: smooth }` in styles.css does the scrolling. If you rename or remove a section id, fix the corresponding links in [navbar.component.ts](src/app/components/navbar/navbar.component.ts) and the `links` array in [footer.component.ts](src/app/components/footer/footer.component.ts).

### Styling system

[src/styles.css](src/styles.css) is the only global stylesheet and is the single source of truth for two things component styles depend on:

1. **CSS custom properties on `:root`** — the dark/teal palette (`--teal`, `--navy`, `--dark`, `--surface`, `--muted`, `--border`, `--teal-glow`), fonts (`--font-display` Syne, `--font-body` DM Sans, both loaded from Google Fonts in [src/index.html](src/index.html)), and `--ease-out-expo`. Component CSS references these vars rather than hard-coding colors.
2. **Shared `@keyframes`** — `fadeUp`, `fadeIn`, `gridPulse`, `floatBall`, `scanLine`, `borderGlow`, `spinSlow`, `marqueeScroll`, `agentBounce`, `chatPop`, `pulse`. Components use them by name from their own scoped styles. Note that keyframes are *not* scoped by Angular's emulated encapsulation, so any new animation shared by more than one component belongs here; a component that redefines a global keyframe name (as marquee does with `marqueeScroll`) shadows it.

Two shared utility classes also live there and are used across components: `.container` (max-width 1200px page gutter) and `.section-label` (the small teal uppercase eyebrow with a leading rule).

### Icons and `bypassSecurityTrustHtml`

Brand and social icons are raw SVG strings held in component data arrays and rendered via `[innerHTML]`. Because Angular strips SVG from `innerHTML` by default, `MarqueeComponent` and `FooterComponent` inject `DomSanitizer` and map their arrays through `bypassSecurityTrustHtml()` in `ngOnInit`. This is safe only because the SVGs are hard-coded literals in the source — never route user input, form values, or remote data through that path. Icons elsewhere (navbar brand mark, contact form arrow, service cards) are plain inline `<svg>` in the template, which needs no sanitizer.

### The only network call

`ContactComponent.onSubmit()` POSTs the form to a hard-coded Formspree endpoint, `https://formspree.io/f/xeewealy`, with `Accept: application/json`. The `status` signal (`'idle' | 'sending' | 'success' | 'error'`) drives the spinner, success card, and error banner in the template. There is no other API, environment file, or config indirection in the project — changing the form destination means editing that URL in [contact.component.ts](src/app/components/contact/contact.component.ts).

## TypeScript strictness

`strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, and `noImplicitOverride` are all on. `strictTemplates` in particular will reject loosely-typed `*ngFor` data, so give new content arrays explicit element types when the shape isn't obvious from the literal.

## Repo caveats

- This directory is **not a git repository** — there is no commit history to consult, and file state is the only record.
- [README.md](README.md) is partly stale: it lists `testimonial-*.jpeg` assets that no longer exist. The testimonial photos are actually `assets/alec-whitten.jfif`, `alisa-hester.jfif`, `kari-rasmussen.jfif`, `nala-goins.jfif` (referenced from the `testimonials` array). Verify against [src/assets/](src/assets/) rather than trusting the README's tree.
- `src/assets/gen_favicon.py` and `generate_favicon.py` are one-off Pillow (PIL) scripts that drew the checked-in favicon raster files (the navy circle + double-chevron mark, matching the navbar SVG). They are not part of the build and never run during `ng build` — the generated images are checked in, and Pillow is not a project dependency.
