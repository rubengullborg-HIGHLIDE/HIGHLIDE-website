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
    PlaceholderPage.astro
    SearchSection.astro
  lib/
    supabaseClient.js
  layouts/
    SiteLayout.astro
  pages/
    index.astro
    Produkt-overblik.astro
    Produkt-detaljer.astro
    Changelog.astro
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
- product overview page with Supabase-backed product loading and search filtering
- product detail page with Supabase-backed product loading
- responsive Tailwind-based UI

### Not implemented yet / placeholder
- real authentication
- persistent favorites
- user profile flows
- real store data ingestion
- full store detail pages

## Environment variables
Product routes use the Supabase browser client. Use a publishable/anon key here, never a service-role key.

```bash
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Key routes
- `/` — homepage
- `/Produkt-overblik` — product listing/search results
- `/Produkt-detaljer` — product detail
- `/Changelog` — public release notes for production updates
- `/Butiks-info` — store overview placeholder
- `/Om-Highlide` — about page
- `/Hjaelp-kontakt` — help/contact placeholder
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
- add one dated Markdown file in `src/content/changelog/` for each production release; the changelog page shows the newest entry first

## Documentation
Project-specific agent guidance lives in:
- `AGENTS.md`
