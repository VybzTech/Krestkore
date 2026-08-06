# Krestkore Solutions — Angular 17 Website v1.1

## Quick Start
```bash
npm install
ng serve
# → http://localhost:4200
```

## What's New in v1.1
- **Brand Marquee** — Infinite auto-scrolling brand slider (HP, Dell, Lenovo, Apple, Samsung, Sony, Cisco, Huawei, Acer, ASUS, Microsoft, Logitech). Pauses on hover.
- **Testimonials Section** — Auto-advancing carousel with real client testimonials (Oluwafemi, Adeyemi, Nifemi, Peace). Includes dot indicators, prev/next controls, and thumbnail row.
- **Kris the Chat Agent** — Animated mascot in the bottom-right corner. Bounces to attract attention, opens a chat widget with quick-action service shortcuts.
- **Formspree Integration** — Contact form POSTs to `https://formspree.io/f/xeewealy` via Angular HttpClient. Shows loading spinner, success state, and error fallback.
- **Updated Contact Info** — Email: info@krestkore.com | Phone: 0705 045 8935
- **Live Social Links** — Instagram, Twitter/X, Facebook, LinkedIn, TikTok all link to @krestkore pages.

## Project Structure
```
src/
├── assets/
│   ├── Animated_Krestkore_Agent.png    ← Kris mascot
│   ├── testimonial-adeyemi.jpeg
│   ├── testimonial-nifemi.jpeg
│   ├── testimonial-oluwafemi.jpeg
│   └── testimonial-peace.jpeg
├── app/
│   ├── components/
│   │   ├── navbar/
│   │   ├── hero/
│   │   ├── marquee/          ← NEW: Brand logo slider
│   │   ├── services/
│   │   ├── testimonials/     ← NEW: Client carousel
│   │   ├── about/
│   │   ├── contact/          ← UPDATED: Formspree + real info
│   │   ├── chat-agent/       ← NEW: Kris mascot chat
│   │   └── footer/           ← UPDATED: Live social links
│   ├── app.component.ts
│   └── app.config.ts         ← provideHttpClient() added
└── styles.css
```

## Formspree
Update the endpoint in `contact.component.ts` when ready:
```typescript
this.http.post('https://formspree.io/f/YOUR_FORM_ID', payload, { headers })
```

## Socials
All social links are in `footer.component.ts` → `socials` array and `links` array.
