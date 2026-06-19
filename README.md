# Mahadev APF — Premium Industrial Brand Website

A luxury, institutional-grade marketing site for **Mahadev APF**, positioned as a
premium industrial / manufacturing / infrastructure brand. Built to match the
cinematic, dark + gold aesthetic of high-end corporate sites (Apple / Stripe /
Blackstone-style).

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **Framer Motion** (scroll reveals, parallax, counters, transitions)

## Premium effects implemented

- Cinematic loading / preloader screen
- Glassmorphism navigation that solidifies on scroll
- Cinematic video hero (drop-in `/public/hero.mp4`) with animated fallback,
  parallax + text-mask line reveals and a gold light-streak
- Custom animated cursor with magnetic ring
- Magnetic buttons
- Premium scroll-progress bar
- Reveal-on-scroll across every section
- Animated number counters
- Split-screen About with image-reveal (clip-path)
- 3D-tilt + hover-glow product cards with category filtering
- Animated industries grid
- Glass "why choose us" cards with icon animation
- Testimonials carousel
- Contact section with working form state, WhatsApp + booking CTAs
- Reduced-motion friendly, responsive, accessible

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm run start
```

## Customising

All copy, products, stats, industries and testimonials live in
[`lib/data.ts`](lib/data.ts) — edit there to re-brand the entire site without
touching components. Design tokens (colours, fonts, shadows) live in the
`@theme` block of [`app/globals.css`](app/globals.css).

### Adding the hero video

Place a drone/cinematic clip at `public/hero.mp4`. Until then an animated grid +
gold-streak fallback renders automatically.

## Scope note

This repository implements the **cinematic marketing front-end** — the visual
core shown in the reference. The broader enterprise platform from the original
brief (full e-commerce, admin panel, CRM, lead management, ERP integrations,
multi-vendor, AI chatbot, etc.) is intentionally out of scope for this first
iteration and can be layered on top of this foundation in subsequent phases.
