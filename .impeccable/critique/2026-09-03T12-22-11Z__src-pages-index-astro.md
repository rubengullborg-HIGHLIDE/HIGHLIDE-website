---
target: HIGHLIDE homepage and product-to-store journey
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-09-03T12-22-11Z
slug: src-pages-index-astro
---
Method: dual-agent (A: /root/design_review · B: /root/technical_evidence)

# HIGHLIDE design and technical review

Scope: homepage and the search → product → local-store journey. Independently reviewed in the browser at desktop and 390×844 mobile, with source inspection. No site changes. Scores are qualitative review judgments, not Lighthouse scores or accessibility certification.

The strongest improvement is to shorten the path from discovering clothing to reaching the exact shop that has it. Keep the existing identity and prioritize task completion before decorative polish.

## Design health

| Heuristic | Score / 4 | Main finding |
|---|---:|---|
| System status | 3 | Skeletons, counts and stock labels; freshness could sit beside stock. |
| Real-world language | 3 | Clear Danish; grid “zoom” receives excessive prominence. |
| User control | 3 | Filters reset/close well; drawer focus does not. |
| Consistency | 3 | Cohesive visual language; illustrative sizes resemble real controls. |
| Error prevention | 2 | Store handoff loses the stocked branch. |
| Recognition over recall | 2 | Users must remember branch availability between pages. |
| Efficiency | 3 | Useful filters, sorting and density options. |
| Minimalist design | 3 | Calm appearance, but secondary controls delay merchandise. |
| Error recovery | 2 | No direct retry; detail conflates missing data and fetch failure. |
| Help | 2 | Useful FAQ and stock caveats; limited contextual help. |
| **Total** | **26/40** | **Acceptable; meaningful improvements needed.** |

## Technical audit

| Dimension | Score / 4 | Main finding |
|---|---:|---|
| Accessibility | 2 | Drawer focus defect and low-contrast placeholders. |
| Performance | 2 | Responsive product imagery, but oversized mobile hero candidate. |
| Responsive design | 3 | Tested mobile wrapping and controls work; long path to directions. |
| Theming | 2 | Consistent colors, repeated inline values without semantic tokens. |
| Anti-patterns | 3 | Mostly coherent; automated warnings largely lack context. |
| **Total** | **12/20** | **Acceptable; significant work remains.** |

## Anti-pattern verdict and strengths

The site does not read as an obvious AI-generated template. Actual clothing, street photography, named stores and specific stock information provide credibility. Warm backgrounds, rounded panels and pill controls are familiar rather than distinctive, but changing the palette is not a priority.

The detector found three warnings across src: flat-type-hierarchy at SiteLayout.astro:206 and Auth.astro:47, and side-tab at Privatlivspolitik.astro:63. The first two do not establish a real page hierarchy problem: they assess compact navigation/SVG text while missing actual headings. The privacy border is real but outside the main journey. The legitimate shopping grid and numbered three-step sequence should not be treated as generic card-grid/numbered-section defects.

Preserve the clear Aarhus proposition and search action; familiar progressive filter controls; actual branch/size stock, text labels, timestamps and stock caveats. Mobile at 390px fits without horizontal overflow; filter dialog focus/Escape work. Product images already use responsive sources and lazy loading. The ticker has appropriate mobile and reduced-motion behavior.

## Five priorities

1. **[P1] Keep availability connected to the exact branch.** The inspected BOSS T-shirt had stock only at Bruuns Galleri, but “Find Kaufmann” opened a directory with three equally presented branches. Users must remember the right destination, risking a wasted visit. Add directions beside the stocked branch and carry branch/product context through any intermediate page. Put inventory freshness beside availability. Source: src/pages/Produkt-detaljer.astro:1198; src/pages/Butiks-info.astro:71. Suggested command: `$impeccable shape`.

2. **[P1] Fix keyboard access and placeholder contrast.** Mobile opening the drawer leaves focus on its opener; Tab reaches the logo behind the overlay. Closed translated content also retains focusable elements. Use a native dialog or complete inert/focus containment/restoration. Increase its 36px close target to the project's 44px standard. Catalogue placeholder contrast is 3.82:1; filter search is 3.71:1, below the 4.5:1 normal-text requirement. Darken those specific placeholders; homepage placeholder already passes. Source: src/layouts/SiteLayout.astro:259,357; src/components/SearchSection.astro:41; src/components/ProductFilters.astro:206. Suggested command: `$impeccable harden`.

3. **[P2] Show merchandise and visit decisions earlier.** Desktop overview initially exposes only the top of product imagery beneath search, introduction and a large zoom section. Detail opens with a dominant photo; the store handoff follows recommendations. Compress introduction/density controls, use a desktop image-and-decision layout, bound the mobile image, and place stock/directions before recommendations. On the homepage, move real products before the expansive explainer or substantially compress it. Source: src/pages/Produkt-overblik.astro:25; src/pages/Produkt-detaljer.astro:11,282; src/pages/index.astro:14. Suggested commands: `$impeccable layout`, `$impeccable distill`.

4. **[P2] Preserve search context and make recovery actionable.** Browser confirmed an empty search input despite a query shown in the result message. The component uses product-search while the page script queries frontpage-search. Correct the reference, including associated zoom form wiring. Add retry and clear-filter actions; distinguish missing products from network failure. Source: src/pages/Produkt-overblik.astro:167,114; src/pages/Produkt-detaljer.astro:1241. Suggested command: `$impeccable harden`.

5. **[P2] Measure and reduce avoidable loading costs.** The hero serves the same 2048×1153 JPEG, 707,490 bytes (~691 KiB), to phones and desktops. Add responsive WebP/AVIF variants while retaining high priority. Also assess conditional loading of PostHog: its import is unconditional although initialization is gated. Exact production savings are unmeasured. Compare production mobile LCP, transfer bytes and interaction responsiveness before/after; no LCP failure is established by this review. Source: src/components/SearchSection.astro:57; src/components/posthog.astro:15,46. Suggested command: `$impeccable optimize`.

Priority groups: 0 P0, 2 P1, 3 P2. These are grouped recommendations, not a count of every individual defect.

## Cognitive load, emotional journey and personas

Cognitive load is moderate: hierarchy, single-task focus and remembering the branch are the three main problems. Filter categories and size/color choices are meaningful; group them rather than applying an arbitrary limit to shopping options.

The homepage creates interest; explanatory content and catalogue controls delay the payoff. Detailed stock provides reassurance. Ending on a general retailer directory weakens that reassurance. End the journey with the exact stocked branch and directions.

- Jordan, first-time visitor: the homepage XS/S/M/L example resembles usable controls but consists of inert spans. Add a visible “Eksempel” label or use a real product.
- Casey, distracted mobile shopper: the visit action is far below the product image and recommendations, and branch context must be remembered.
- Sam, keyboard user: focus remains behind the drawer overlay; low-contrast placeholders further weaken navigation/search accessibility.

## Smaller observations

- “Produkt overblik” can become “Produktoversigt.”
- A mobile product titled “COMING SOON” displayed 18 units locally available. Clarify availability semantics before asserting this is a stock-data error.
- Keep timestamps but move them close to stock.
- Introduce a small set of shared color/state tokens; no large design-system rebuild is needed.
- No blanket claim that all contrast, keyboard behavior, or mobile layouts fail.

## Direction questions

Which outcome should the next pass prioritize: faster product discovery or directions to the exact stocked branch? The review favors treating the latter as the completion of the discovery journey.

Could an actual available product replace the homepage demonstration and explain the service more convincingly?

Finish functional and layout work before `$impeccable polish`; preserve the existing brand and successful interaction patterns.
