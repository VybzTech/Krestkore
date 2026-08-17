# Brand assets

Drop files here and the site picks them up. Nothing to wire up in code.

| File | Used for | Notes |
| ---- | -------- | ----- |
| `logo-icon.svg` | Navbar, footer, and the hero orbit core | **In use.** Applied as a CSS mask, so it is recoloured per theme from one file: brand teal on dark, deep navy on light. |
| `og-image.png` | Link previews on WhatsApp, LinkedIn, X, Slack | Not yet supplied. Exactly 1200×630. Anything near the edges gets cropped by some platforms. |

### If you replace `logo-icon.svg`

Two constraints, both because it is used as a mask:

1. **It must be a single colour.** A mask uses only the alpha channel, so any
   multi-colour artwork renders as one flat shape. The current file is one
   colour (`#13B7A5`) across three paths, which is why this works.
2. **It needs a `viewBox`.** The supplied file had width/height but no
   `viewBox`, so it could not scale; one was added. Without it the mark renders
   at a fixed size or vanishes.

Keep the filename free of spaces. The original was `Krestkore logo ICON.svg`
and was renamed, because spaces in a CSS `url()` need escaping and break
silently when they are not.

The file is ~50KB of high-precision path data. Running it through SVGO would
cut that substantially without any visible change, if you want the win.

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
