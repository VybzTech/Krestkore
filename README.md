# Krestkore Solutions — Website v2

Marketing site for Krestkore Solutions Limited (IT services, Lagos, Nigeria).
React 19 + TypeScript + Vite, ported from the Angular 17 v1.1 build.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Dev server with HMR                  |
| `npm run build`     | Typecheck, then production build      |
| `npm run preview`   | Serve the production build locally   |
| `npm run typecheck` | Types only                           |
| `npm run lint`      | ESLint                               |
| `npm test`          | Vitest (single run)                  |
| `npm run test:watch`| Vitest in watch mode                 |
| `npm run design-check` | Playwright visual + a11y sweep (needs `npm run preview` running) |

## Where things live

```
src/
├── components/          one folder per section: Component.tsx + Component.module.css
│   └── ui/              BrandMark, Glyph, ThemeToggle
├── data/                site details, services, testimonials, brands, socials
├── hooks/               useReveal, usePrefersReducedMotion
├── styles/              tokens.css, global.css, keyframes.css
└── theme/               ThemeProvider, useTheme
```

Content is data, not markup. To change a service, testimonial, brand, or social
link, edit the array in `src/data/` rather than the JSX.

Company details (email, phone, address, **Formspree endpoint**) all live in one
place: [`src/data/site.ts`](src/data/site.ts).

## Theming

Two themes. Dark reproduces the original Angular palette exactly; light is
derived from the same brand hue and re-tuned for contrast.

- Tokens are defined per theme in [`src/styles/tokens.css`](src/styles/tokens.css)
  under `[data-theme='dark']` / `[data-theme='light']`.
- The theme is applied to `<html data-theme>` by an inline script in
  `index.html` **before first paint**, so there is no flash on load.
- Order of preference: saved choice → OS `prefers-color-scheme` → dark.
  Until the visitor picks explicitly, the site follows the OS live.
- Component CSS should use the semantic tokens (`--bg`, `--surface`, `--text`,
  `--muted`, `--accent`, `--accent-ink`, `--on-accent`, `--border`) and build
  brand washes from `rgb(var(--accent-rgb) / <alpha>)`. Hard-coded colours will
  not follow the theme.

`--accent` and `--accent-ink` are deliberately different values in light mode:
the raw brand teal only reaches ~2.1:1 as text on a white background.

## Contact form

Posts JSON to Formspree (`https://formspree.io/f/mkjwnyeo`). The form validates
client-side before sending, reports Formspree's own error text on a 4xx,
distinguishes a network failure from a rejection, and carries a `_gotcha`
honeypot for spam. Validation rules are unit-tested in
`src/components/Contact/validation.test.ts`.

## Gotcha: keyframes and CSS Modules

CSS Modules rewrites every `animation-name` it sees to a hashed, file-local
name. A `*.module.css` file that references a keyframe declared in a global
stylesheet therefore compiles to a name that matches nothing, and the animation
silently never runs.

**Any module that animates must `@import '../../styles/keyframes.css'`.** That
gives the module its own scoped copy of the keyframes so the reference
resolves. Do not move the keyframes back into `global.css`.

## Design check

`scripts/design-check.mjs` drives a real browser over both themes at three
viewports, exercises hover/focus/menu/chat states, and fails loudly on console
errors, viewport overflow, clipped hover targets, broken hand-off, and WCAG AA
contrast misses.

```bash
npm run build && npm run preview      # one shell
npm run design-check                  # another
```

It deliberately opens the mobile menu **after scrolling**, because the header
only gains `backdrop-filter` once scrolled and that is what previously caused
the drawer scrim to collapse to the height of the header.

## Deploying

`main` → Netlify preview, `prod` → the live domain. Full setup, including the
Whogohost DNS step, is in [DEPLOYMENT.md](DEPLOYMENT.md).

## Legacy

The original Angular 17 project is preserved unchanged in
[`angular-legacy/`](angular-legacy/) for reference. It is not built, linted, or
deployed, and is excluded from the ESLint config. It has its own `package.json`
if you ever need to run it (`cd angular-legacy && npm install && npx ng serve`).
