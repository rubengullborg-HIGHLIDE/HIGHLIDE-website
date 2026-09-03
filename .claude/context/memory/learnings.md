# Project learnings

- `LiveProductTicker.astro` uses native horizontal scrolling with CSS scroll snap below 768px. Mobile disables the duplicated animation group and autoplay; desktop keeps the seamless animated ticker and pause control.
- `ProductFilters.astro` mirrors URL state into an active-filter summary both below the overview search controls and at the top of the modal. Clearing overview filters preserves the search query while removing filter and sort parameters.
- The public changelog is a typed Astro content collection. Add one dated Markdown release in `src/content/changelog/`; `/Changelog` sorts entries newest first and the footer is its only global link.
