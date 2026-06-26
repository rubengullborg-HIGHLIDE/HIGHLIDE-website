# HIGHLIDE Website

Frontend prototype for **HIGHLIDE** — a mobile-first platform for discovering clothes from **smaller local fashion stores**, starting in **Aarhus, Denmark**.

## Purpose
HIGHLIDE exists to help local stores and smaller brands stay visible in a market dominated by large chains. The long-term vision is to aggregate clothing and fashion products from independent/local retailers and make them easy for users to discover nearby.

This repository is the **v1 proof-of-concept website**.

## Current focus
- validate the concept with a lean first version
- prioritize **mobile-first UX**
- target users roughly **15–35 years old**
- keep the stack fast, modern, and simple
- avoid over-engineering while preserving room to scale later

## Tech stack
- **Astro 6**
- **Tailwind CSS 4**
- **Vite**
- **pnpm**

## Requirements
- **Node.js >= 22.12.0**
- **pnpm**

## Scripts
```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Project structure
```text
src/
  components/
    AboutUsSection.astro
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

## Current status
This repo is currently a **frontend prototype**.

### Implemented
- shared layout with header/footer
- homepage with search hero and about section
- product overview page with mock data and search filtering
- responsive Tailwind-based UI

### Not implemented yet / placeholder
- backend or API integration
- real authentication
- persistent favorites
- user profile flows
- real store data ingestion
- real product detail/store detail pages
- production content copy in all places

## Key routes
- `/` — homepage
- `/Produkt-overblik` — product listing/search results
- `/Produkt-detaljer` — placeholder
- `/Butiks-info` — placeholder
- `/Om-Highlide` — placeholder
- `/Hjaelp-kontakt` — placeholder
- `/Profil` — placeholder
- `/Gemte-produkter` — placeholder
- `/Rediger-personlige-informationer` — placeholder
- `/Auth` — placeholder

## Product direction
Build for:
- **mobile-first discovery**
- **fast browsing of nearby fashion items**
- **simple architecture in v1**
- future support for:
  - more cities
  - more local stores
  - external data feeds/integrations

## Notes for contributors
- UI and route naming are primarily in **Danish**
- code structure and some descriptions are in English
- keep solutions simple unless complexity is clearly justified
- prefer reusable Astro components for shared UI
- treat `dist/` as generated output, not source

## Documentation
Project-specific agent guidance lives in:
- `AGENTS.md`
