# AGENTS.md

## Project
- **Name:** HIGHLIDE website
- **Type:** Astro + Tailwind marketing/prototype site
- **Stage:** **v1.0 proof of concept**
- **Package manager:** `pnpm`
- **Node:** `>=22.12.0`

## Business context
HIGHLIDE is building a platform that helps users discover clothes from **smaller local fashion stores** instead of only buying from large chains. The bigger mission is to support local brands and stores so they can stay visible and competitive.

### Initial market
- Starting city: **Aarhus, Denmark**
- Long-term goal: expand into **other cities** later
- Current focus: validate the concept with a simpler first version before building a larger platform

## Product vision
The product should become a scalable clothing discovery platform that can:
- aggregate products from multiple local stores
- help users find nearby fashion items quickly
- support future city expansion
- stay flexible enough to integrate with other systems and external data sources later

## Current product strategy
- **Mobile-first** is the main design priority
- Target audience is roughly **15–35 years old**
- Prefer **fast, modern, simple UX** over heavy feature complexity
- Avoid over-engineering in v1
- Build with future scalability in mind, but keep the current implementation lean

## Tech stack
- **Astro 6**
- **Tailwind CSS 4** via `@tailwindcss/vite`
- Mostly static `.astro` pages
- Minimal inline client-side JavaScript where needed

## Commands
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm preview`

## Project structure
```text
src/
  components/
  layouts/
  pages/
  styles/
  public/
```

## Current implementation status
This repo is currently a **frontend prototype**, not a full platform.

### What exists now
- Shared site layout with header/footer: `src/layouts/SiteLayout.astro`
- Homepage with hero search + about section: `src/pages/index.astro`
- Product overview page with:
  - mock product dataset
  - query filtering via `?q=`
  - zoom-level grid modes
  - load-more behavior
- Static assets for logo, icons, and clothing imagery

### What is still placeholder / incomplete
Most non-home pages are currently stubs or nearly empty:
- `Auth.astro`
- `Butiks-info.astro`
- `Gemte-produkter.astro`
- `Hjaelp-kontakt.astro`
- `Om-Highlide.astro`
- `Produkt-detaljer.astro`
- `Profil.astro`
- `Rediger-personlige-informationer.astro`

Also, current copy contains some **Lorem ipsum** placeholder text that should later be replaced with real brand/product messaging.

## Key UX and design notes
- The visual direction is clean, fashion-oriented, and modern
- Mobile usage is the primary assumption
- Performance and simplicity matter
- The product overview page is currently the most developed page and is the clearest reference for interaction style
- Header drawer code exists in `SiteLayout.astro`, but `isMenuEnabled` is currently set to `false`, so the menu button is intentionally disabled/hidden

## Important routes
- `/` — homepage
- `/Produkt-overblik` — product overview/search results
- `/Produkt-detaljer` — product details placeholder
- `/Butiks-info` — store info placeholder
- `/Om-Highlide` — about placeholder
- `/Hjaelp-kontakt` — help/contact placeholder
- `/Profil` — profile placeholder
- `/Gemte-produkter` — saved products placeholder
- `/Rediger-personlige-informationer` — edit profile placeholder
- `/Auth` — login/signup placeholder

## Reusable components
### `src/layouts/SiteLayout.astro`
Use this as the shared page shell.
- imports global styles
- renders sticky header and footer
- contains nav structure
- contains drawer/open-close script

## Data state
There is **no backend** connected yet.

Current product data is hardcoded in:
- `src/pages/Produkt-overblik.astro`

This means:
- no CMS
- no product API
- no auth system
- no persistence for favorites/profile
- no real store integrations yet

## Recommended development mindset for future agents
When making changes, optimize for:
1. **mobile-first UX**
2. **clarity and speed**
3. **simple architecture**
4. **future scalability** without premature complexity
5. ability to later support:
   - more cities
   - more stores
   - external integrations / data feeds

## Content and language notes
- Route names and UI labels are primarily in **Danish**
- Some code/comments/descriptions are in English
- Keep naming consistent with the existing route structure unless there is a deliberate refactor

## Known realities of the repo
- `README.md` is still the default Astro starter README and does **not** describe the actual project
- `dist/` exists but is generated output, not source of truth
- `global.css` currently only imports Tailwind
- Styling is mostly done inline with Tailwind utility classes directly in `.astro` files

## Summary for new agents
This is a **mobile-first Astro/Tailwind frontend prototype** for HIGHLIDE, a fashion discovery platform focused on surfacing products from **small local clothing stores**, starting in **Aarhus**. The current repo is intentionally lean and mostly static, with the **product overview page** being the most developed feature. The codebase should evolve carefully: keep it simple for v1, but shape decisions so the platform can later scale across cities and integrate real store/product data.
