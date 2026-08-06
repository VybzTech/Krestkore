# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm run build        # tsc -b && vite build  → dist/
npm run preview      # serve the production build
npm run typecheck    # types only
npm run lint         # eslint
npm test             # vitest, single run
npm run test:watch   # vitest watch
npx vitest run src/components/Contact/validation.test.ts   # one test file
npx vitest run -t "rejects malformed email"                # one test by name
```

`npm run build` runs `tsc -b` first, so a type error fails the build before Vite starts.

## Architecture

React 19 + TypeScript + Vite marketing site for Krestkore Solutions Limited (IT services, Lagos, Nigeria). Single scrolling page, no router, no backend of its own. Ported from an Angular 17 build that is preserved in [angular-legacy/](angular-legacy/) — that directory is reference only: it is not built, not linted (excluded in [eslint.config.js](eslint.config.js)), and not deployed.

- **[src/App.tsx](src/App.tsx) is the page.** It composes the sections in fixed order: Navbar → Hero → Marquee → Services → Testimonials → About → Contact → Footer → ChatAgent. Adding a section means creating the component and placing it there.
- **One folder per section** under [src/components/](src/components/), each holding `Component.tsx` + `Component.module.css`. Shared primitives (`BrandMark`, `Glyph`, `ThemeToggle`) live in [src/components/ui/](src/components/ui/).
- **Content is data, not markup.** Services, testimonials, brands, socials, nav links, and all company details live in [src/data/](src/data/) and render through `.map()`. Change the array, not the JSX. Company contact details and the Formspree endpoint are centralised in [src/data/site.ts](src/data/site.ts).
- **CSS Modules, not a utility framework.** The design is hand-written CSS. Modules matter here because several components independently define `.title`, `.card`, `.section` etc. with different values; global classes would collide.
- **Local state only.** `useState` inside components. The one cross-cutting concern is theme, via context in [src/theme/](src/theme/). Components never talk to each other.

### Theming (the part that constrains most CSS work)

Two themes driven by `<html data-theme="dark|light">`. Dark reproduces the original Angular palette exactly; light is derived and re-tuned.

- Tokens live in [src/styles/tokens.css](src/styles/tokens.css), defined twice — once per `[data-theme=...]` block.
- An inline script in [index.html](index.html) sets `data-theme` **before first paint** to avoid a flash. [src/theme/theme-context.ts](src/theme/theme-context.ts) reads back whatever that script committed to, so React's first render agrees with the DOM. If you change the storage key or the resolution order, change it in both places.
- Preference order: saved choice → OS `prefers-color-scheme` → dark. The provider follows OS changes live only while the visitor has not chosen explicitly (`isSystem`).
- Component CSS must use semantic tokens (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--accent-ink`, `--on-accent`, `--border`) and derive brand washes from `rgb(var(--accent-rgb) / <alpha>)`. Hard-coded colours will not follow the theme.
- `--accent` (fills) and `--accent-ink` (text/icons on the page) are **different values in light mode** on purpose: the raw brand teal `#14B8A6` only reaches ~2.1:1 as text on white. Both light values were measured against WCAG AA before being committed. If you retune them, re-measure.

### Keyframes and CSS Modules — read before adding an animation

CSS Modules rewrites every `animation-name` to a hashed, file-local name. A `*.module.css` that references a keyframe declared in a global stylesheet compiles to a name matching nothing, and **the animation silently never runs** — no error, and it only becomes visible if something also sets `opacity: 0` waiting for that animation.

**Any module that animates must `@import '../../styles/keyframes.css'`**, which gives it a scoped copy so the reference resolves. Keyframes deliberately do *not* live in [src/styles/global.css](src/styles/global.css); do not move them back. `:global(name)` in an animation value is a PostCSS syntax error, not a workaround.

### Motion and reveal

- Entrance animations are tied to viewport entry via [src/hooks/useReveal.ts](src/hooks/useReveal.ts) (the Angular build fired them all on page load, so below-the-fold content had finished animating before it was scrolled to).
- `useReveal` puts a `revealed` class on a *container*; children animate from it, with per-item stagger passed down as the inherited custom property `--reveal-delay`. Note `animation-delay` does not inherit but custom properties do — that is why the stagger is a variable.
- Never hide a container that paints a background behind the reveal. Services fades the card *contents*, not the cards, so an unrevealed grid reads as an empty card grid rather than a solid slab.
- Reduced motion is honoured globally in [src/styles/global.css](src/styles/global.css), and in JS where CSS cannot reach (the testimonial auto-advance timer) via `usePrefersReducedMotion`.

### Icons

- UI icons come from `lucide-react`. It is **v1.x**, which removed the old aliases: use `CodeXml`, `ChartColumn`, `ChartLine`, `LoaderCircle`, `TriangleAlert` — not `Code2`, `BarChart3`, `LineChart`, `Loader2`, `AlertTriangle`.
- Brand and social marks are official Simple Icons paths stored as data in [src/data/brands.ts](src/data/brands.ts) / [src/data/socials.ts](src/data/socials.ts) and rendered through [`Glyph`](src/components/ui/Glyph.tsx). Simple Icons has withdrawn some marks (Logitech, LinkedIn, Microsoft); entries without a path fall back to a wordmark. Do not invent a path to fill a gap — the Angular build shipped several invented ones that did not render the real logo.

### Contact form

[src/components/Contact/Contact.tsx](src/components/Contact/Contact.tsx) POSTs JSON to the Formspree endpoint in `site.formspreeEndpoint`. It validates before sending (rules and unit tests in [validation.ts](src/components/Contact/validation.ts) / `validation.test.ts`), checks `response.ok`, surfaces Formspree's own error message on a 4xx, distinguishes network failure from rejection, and carries a `_gotcha` honeypot. This is the site's primary conversion path — preserve the error handling when changing it.

## Conventions

- TypeScript is strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. Indexing an array gives `T | undefined`; handle it rather than asserting.
- `verbatimModuleSyntax` is on: use `import type` for type-only imports.
- Prefer semantic elements and real labels; several components rely on that for their tests (`getByRole`, `getByLabelText`).
