# Brand assets

Drop files here and the site picks them up. Nothing to wire up in code.

| File | Used for | Notes |
| ---- | -------- | ----- |
| `logo.svg` | Navbar and footer mark | Square-ish or horizontal. Rendered at 30–36px tall, so it must stay legible small. SVG strongly preferred; `logo.png` works if you rename the reference in `src/components/ui/BrandMark.tsx`. |
| `og-image.png` | Link previews on WhatsApp, LinkedIn, X, Slack | Exactly 1200×630. Put the logo and a short line of text on a solid background; anything near the edges gets cropped by some platforms. |

Until `logo.svg` exists the site falls back to the built-in double-chevron, so
a missing file is never a broken header.

## Partner logos

Partner marks go in `public/assets/partners/`. After adding one, set its `logo`
field in [`src/data/partners.ts`](../../../src/data/partners.ts):

```ts
{ name: 'Kinlend', kind: 'Fintech', logo: '/assets/partners/kinlend.svg' }
```

Entries without a `logo` render as a typographic wordmark, which is the current
state for all five partners.

## Favicons

The existing favicons in `public/assets/` were generated from the chevron by
the Python scripts in `angular-legacy/src/assets/`. If the logo changes, those
need regenerating; they are not derived from `logo.svg` at build time.
