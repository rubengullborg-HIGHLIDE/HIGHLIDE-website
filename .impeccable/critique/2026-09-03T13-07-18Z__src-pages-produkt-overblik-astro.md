---
target: Product overview, product details, filter modal and Butikker
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-09-03T13-07-18Z
slug: src-pages-produkt-overblik-astro
---
Method: dual-agent (A: /root/design_review · B: /root/evidence_review)

# HIGHLIDE browsing and store-discovery review

Scope: product overview, product details, filter modal, and Butikker. Desktop and 390px mobile inspected. Recommendations only; no design changes applied to these surfaces.

## Overall impression and anti-pattern verdict

Keep the current visual direction. The burgundy/cream palette, product photography and familiar controls are coherent; this does not need a redesign. Repeated catalogue cards serve the shopping task. The biggest opportunity is getting visitors from a product to its stocked physical branch with less scrolling and less uncertainty.

The deterministic detector returned zero findings across all four files. Manual browser review nevertheless found a filter-state bug and a measured text-contrast issue. No detector false positives. The browser API is read-only, so no visual overlay was injected.

## What works

- Consistent colors, typography and familiar search/filter controls.
- Progressive disclosure, a persistent Apply action, result counts and generous touch targets in the filter modal.
- Branch-specific size/stock information with written status and a freshness timestamp; availability is not expressed through color alone.

## Priority improvements

1. **P1 — Cancelled filters appear applied.** Both reviewers independently reproduced selecting a store and closing the modal without Apply: the active-filter chip changes while URL and product results remain unfiltered. Keep draft selections within the modal and derive page chips from applied URL state; restore on dismissal. Source: ProductFilters.astro:472, :597, :769. Suggested command: `$impeccable harden`.

2. **P1 — Put the stocked branch’s action beside its availability.** In the sampled Kaufmann product, Bruuns Galleri has stock while two other branches do not. Directions are absent from those stock rows, and “Find Kaufmann” appears after eight recommendations. Add a restrained “Find vej” link beside the matching branch and place the store handoff above recommendations. Source: Produkt-detaljer.astro:282, :798, :1198. Suggested command: `$impeccable layout`.

3. **P2 — Give products more of the first screen.** Overview’s title, explanation and large “Zoom niveau” control delay the first products and prices on mobile. Keep zoom, but make it a compact “Visning” control beside sorting. On desktop details, keep name, price and key availability beside a sensibly sized gallery instead of below a photo that fills the first screen. Source: Produkt-overblik.astro:27–78; Produkt-detaljer.astro:12–42, :161. Suggested command: `$impeccable adapt`.

4. **P2 — Make Butikker easier to scan.** Nine long image-first sections have no compact store index. Add a small “Find butik” jump selector using existing section IDs, and show the store name/neighborhood before the imagery on mobile. Preserve the desktop visual layout and useful address/directions information. Source: Butiks-info.astro:27–72. Suggested command: `$impeccable adapt`.

5. **P2 — Darken small product metadata slightly.** The rendered 12px brand label measures 3.92:1 contrast, below 4.5:1. Crossed-out prices are also below that threshold. Use darker shades within the existing palette; no extra badges, borders or larger text are needed. Source: Produkt-overblik.astro:367, :414; Produkt-detaljer.astro:202. Suggested command: `$impeccable polish`.

## Design health

| Heuristic | Score / 4 | Main observation |
|---|---:|---|
| System status | 2 | Cancelled filters give false applied state |
| Real-world language | 3 | Natural labels; “Zoom niveau” is interface jargon |
| User control | 3 | Back, Escape and clear exist; dismissal bug remains |
| Consistency | 3 | Cohesive controls and visual language |
| Error prevention | 2 | Draft/applied state and branch context need work |
| Recognition over recall | 2 | Stocked branch must be remembered across pages |
| Efficiency | 3 | Useful quick filters; no store index |
| Minimalist design | 3 | Calm visuals; secondary controls consume space |
| Error recovery | 2 | Explanations lack direct retry actions |
| Help and guidance | 3 | Stock explanations and timestamps exist |
| **Total** | **26/40** | **Sound foundation with focused improvements needed** |

## Cognitive load, personas and emotional journey

Load is moderate. Hierarchy, remembering the stocked branch, and full size matrices for unavailable branches create unnecessary effort. Nine store choices inside one accordion are appropriate and do not need arbitrary reduction.

A distracted mobile shopper waits too long to see prices and directions. A first-time visitor can trust a cancelled filter chip incorrectly. A visitor recovering from a failed fetch lacks an obvious retry action.

Photography creates interest and concrete stock creates reassurance. Put the branch action at that moment; recommendations should follow the practical next step.

## Smaller follow-ups

- Add an explicit “Prøv igen” action for failed product/filter loads and a contextual clear action for empty results. These are source-backed recovery gaps, not failures reproduced during this review.
- Move the existing freshness timestamp nearer “Lager i Aarhus”; do not add another timestamp.
- Consider collapsing branches with no stock and shortening “Produkt overblik” to “Produkter”.

## Questions to guide later work

- Should the relevant store action sit alongside stock or immediately below it? Both preserve the existing design; alongside minimizes scrolling.
- For store discovery, would a compact jump selector or a short text index be more comfortable? A selector uses less mobile space.
