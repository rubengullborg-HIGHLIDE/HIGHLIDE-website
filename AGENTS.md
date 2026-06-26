# AGENTS.md

## Project snapshot
- **Project:** HIGHLIDE website
- **Stage:** v1.0 proof of concept
- **Stack:** Astro 6 + Tailwind CSS 4
- **Package manager:** `pnpm`
- **Node:** `>=22.12.0`

## What HIGHLIDE is
HIGHLIDE is building a platform that helps users discover clothes from **smaller local fashion stores** rather than defaulting to large chains. The broader goal is to help local stores and brands stay visible and competitive.

## Business direction
- Start in **Aarhus, Denmark**
- Expand to **other cities** later
- Build a lean first version to validate the concept
- Stay simple in v1, but make choices that support future scale and integrations

## Product strategy
- **Mobile-first** is the top priority
- Primary audience is roughly **15–35 years old**
- Prioritize **speed, clarity, and modern UX**
- Avoid over-engineering
- Design for future store/product aggregation and external data flows

## Tech and architecture
- Mostly static `.astro` pages
- Tailwind utility classes are the main styling approach
- Minimal inline JavaScript for lightweight interactions
- No backend, CMS, auth, or real data integrations yet

## Commands
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm preview`

## Important source structure
```text
src/
  components/
    Footer.astro
    SearchSection.astro
  layouts/
    SiteLayout.astro
  pages/
    index.astro
    Produkt-overblik.astro
    Produkt-detaljer.astro
    Butiks-info.astro
    Om-Highlide.astro
    Hjaelp-kontakt.astro
    Profil.astro
    Gemte-produkter.astro
    Rediger-personlige-informationer.astro
    Auth.astro
  styles/
    global.css
public/
  icons/
  images/
  HIGHLIDE_logo_dark.png
```

## Current implementation status
This repo is currently a **frontend prototype**.

### Most developed parts
- `src/layouts/SiteLayout.astro` — shared page shell with header/footer
- `src/pages/index.astro` — homepage with search hero and about section
- `src/pages/Produkt-overblik.astro` — main prototype page with:
  - mock product data
  - filtering via `?q=`
  - zoom-level grid behavior
  - load-more interaction

### Mostly placeholder pages
- `Auth.astro`
- `Butiks-info.astro`
- `Gemte-produkter.astro`
- `Hjaelp-kontakt.astro`
- `Om-Highlide.astro`
- `Produkt-detaljer.astro`
- `Profil.astro`
- `Rediger-personlige-informationer.astro`

### Current content state
- Some text is still placeholder / **Lorem ipsum**
- Product data is hardcoded in `src/pages/Produkt-overblik.astro`
- No persistence for favorites, profile, or auth flows

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

## Key UI notes
- Visual style is clean, fashion-oriented, and modern
- Mobile usage is the main assumption
- Performance and simplicity matter
- `Produkt-overblik` is the best reference for current interaction style
- In `SiteLayout.astro`, the drawer/menu logic exists, but `isMenuEnabled` is currently `false`, so the menu button is intentionally hidden/disabled

## Engineering conventions and style rules
- **Design mobile-first** and scale upward
- **Prefer simple Astro solutions** over unnecessary complexity
- **Keep client-side JS minimal** and only add it when HTML/CSS is not enough
- **Reuse components** instead of duplicating repeated UI patterns
- **Centralize shared mock data** if it starts being reused across pages
- **Keep naming consistent** with the current Danish route structure unless deliberately refactoring
- **Use Tailwind pragmatically:** inline utilities first, extraction only when repetition/readability justifies it
- **Maintain accessibility basics:** semantic HTML, labels, keyboard support, alt text
- **Do not over-engineer v1**
- **Never edit `dist/`**; only edit source files

## Content and language notes
- Routes and much of the UI are in **Danish**
- Some code and descriptions are in English
- Keep route naming and UI terminology consistent unless doing a deliberate cleanup/refactor

## Repo realities
- `README.md` contains the public project overview
- `AGENTS.md` is the internal quick-start handoff for future agents
- `global.css` currently only imports Tailwind
- `dist/` is generated output, not source of truth

## What future agents should optimize for
1. mobile-first UX
2. simple architecture
3. fast browsing experience
4. scalable city/store expansion later
5. easy future integration with real store/product data

## Short summary
This is a **mobile-first Astro/Tailwind frontend prototype** for HIGHLIDE, a platform for surfacing products from **small local clothing stores**, starting in **Aarhus**. Keep the codebase lean and practical for v1, while making decisions that can later support more cities, more stores, and real integrations.
