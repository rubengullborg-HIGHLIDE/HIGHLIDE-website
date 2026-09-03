# Project learnings

- The shared drawer starts inert, isolates header/main/footer while open, wraps keyboard focus, and restores it on close. Crossing the desktop breakpoint closes it and restores focus to the visible logo.
- The catalogue search input is `product-search`; its URL query is rendered on the server and reused by the client form/zoom wiring.
- The homepage hero source is `src/assets/walking-people.webp` (the former `.jpg` was WebP content). Astro Picture generates AVIF/WebP sizes; its `sizes` accounts for the width needed by object-cover in the tall hero.

- `LiveProductTicker.astro` uses native horizontal scrolling with CSS scroll snap below 768px. Mobile disables the duplicated animation group and autoplay; desktop keeps the seamless animated ticker and pause control.
- `ProductFilters.astro` mirrors URL state into an active-filter summary both below the overview search controls and at the top of the modal. Clearing overview filters preserves the search query while removing filter and sort parameters.
- The public changelog is a typed Astro content collection. Add one dated Markdown release in `src/content/changelog/`; `/Changelog` sorts entries newest first and the footer is its only global link.
