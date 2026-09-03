# Product search

Non-empty searches use `public.search_products_ranked`. Each original query word
is scored across the existing product attributes, with typo tolerance and the
existing filters, sorting and pagination. Browsing without a query is unchanged.

## Danish/English vocabulary

`public.search_synonym_groups` is the editable lookup table:

- `kind`: `color` or `category`.
- `group_key`: a stable label such as `white` or `trousers`.
- `terms`: 2–20 lowercase, single-word equivalents, including common inflections.

For example, the `white` group contains `hvid`, `hvidt`, `hvide`, `white`.
The `trousers` group contains `buks`, `bukser`, `pant`, `pants`, `trouser`, `trousers`.
Any term in a group can find the other terms, in either language.

Edit the array in the Supabase table editor to extend a group. Add a row for a
new group. Changes apply to subsequent searches; no product reimport, reindex,
or frontend deployment is needed. Record deliberate vocabulary changes in a
migration as well so they survive a database rebuild.

Only administrators/database maintenance can edit the table. Signed-in users
have read-only access, matching the existing catalogue access rules. The RPC
remains `SECURITY INVOKER` and respects RLS.

## Matching rules and limits

- Translations match whole words in `color`/`color_group` or
  `category`/`product_type`, depending on `kind`.
- Alternatives count once per original query word, not as extra required words
  or extra ranking points. Their score is the existing word-match weight for
  that attribute.
- Hyphenated words stay intact: `t-shirts` is not translated as `shirts`.
- The original query still searches names, brands and descriptions as before.
  Translations do not broaden those fields. For example, a brand containing
  `White` can still match an English search, but the lookup does not turn that
  brand into a Danish `hvide` color match.
- Keep shades and subcategories separate. Do not put `cream` in `white` or
  `jeans` in `trousers`. Beige and orange already use the same spelling in both
  languages and need no translation group.
- This is not general translation: multi-word phrases, unknown vendor shade
  names, compound words, and absent/mislabelled attributes can still be missed.
  Equivalent queries can therefore have different results outside these fields.
- Filter dropdown values and their existing predicates are not translated.
- Frontend queries and PostHog `search_performed`, `product_clicked`, and
  `search_result_clicked` events are unchanged; analytics keeps the original text.

## Verification

Run `pnpm test` and `pnpm build` for the application checks.
Run `supabase/tests/ranked_product_search_synonyms.sql` against the migrated
database with `psql -v ON_ERROR_STOP=1 -f <path>` or the SQL editor. It clones the
actual search function into the temporary schema, substitutes controlled product
fixtures, and checks translations, scoring, exclusions, filters, pagination,
typos and permissions. All changes roll back; live product records are untouched.
