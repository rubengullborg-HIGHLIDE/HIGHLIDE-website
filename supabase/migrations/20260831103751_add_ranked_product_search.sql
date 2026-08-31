-- Rank natural multi-word searches across the existing store catalogues.
-- This deliberately avoids a separate search index or hard-coded taxonomy:
-- every query token may match any useful product attribute, with field weights
-- and pg_trgm providing typo tolerance.
create or replace function public.search_products_ranked(
  p_search_query text,
  p_store_keys text[] default '{}'::text[],
  p_types text[] default '{}'::text[],
  p_brands text[] default '{}'::text[],
  p_colors text[] default '{}'::text[],
  p_fits text[] default '{}'::text[],
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_on_sale boolean default false,
  p_new_products boolean default false,
  p_sort text default 'standard',
  p_limit integer default 12,
  p_offset integer default 0
)
returns table (
  source_key text,
  id bigint,
  name text,
  brand text,
  current_price numeric,
  list_price numeric,
  currency text,
  color text,
  category text,
  images text[],
  aarhus_total_stock integer,
  aarhus_available boolean,
  first_seen_at timestamptz,
  relevance real,
  total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $function$
with catalog as materialized (
  select
    'kaufmann'::text as source_key,
    p.id::bigint,
    p.name,
    p.brand,
    p.current_price,
    p.list_price,
    p.currency,
    p.color,
    p.color_group,
    p.category,
    null::text as product_type,
    p.description,
    p.materials,
    p.fit,
    '{}'::text[] as tags,
    p.images,
    p.aarhus_total_stock,
    p.aarhus_available,
    p.first_seen_at,
    p.publication_status,
    'Kaufmann'::text as store_name
  from public.kaufmann_products as p
  where p.aarhus_available

  union all

  select
    'romerhus', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    null::text, p.description, p.materials, p.fit, '{}'::text[],
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'Rømerhus'
  from public.romerhus_products as p
  where p.aarhus_available

  union all

  select
    'lakor', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    null::text, p.description, p.materials, p.fit, '{}'::text[],
    p.images,
    case
      when (p.local_inventory #>> '{stores,lakor-aarhus,total_stock}') ~ '^[0-9]+$'
        then nullif(
          (p.local_inventory #>> '{stores,lakor-aarhus,total_stock}')::integer,
          case when p.aarhus_available then 0 else -1 end
        )
      else null
    end,
    p.aarhus_available, p.first_seen_at,
    p.publication_status, 'LAKOR'
  from public.lakor_products as p
  where p.aarhus_available

  union all

  select
    'rains', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    p.product_type, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'Rains'
  from public.rains_products as p
  where p.aarhus_available

  union all

  select
    'stoy', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    p.product_type, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'STOY'
  from public.stoy_products as p
  where p.aarhus_available

  union all

  select
    'shoechapter', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    p.product_type, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'Shoe Chapter'
  from public.shoechapter_products as p
  where p.aarhus_available

  union all

  select
    'skagen-clothing', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    p.product_type, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'Skagen Clothing'
  from public.skagen_clothing_products as p
  where p.aarhus_available

  union all

  select
    'suitclub', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    p.product_type, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'SUIT CLUB'
  from public.suitclub_products as p
  where p.aarhus_available

  union all

  select
    'cejf', p.id::bigint, p.name, p.brand, p.current_price,
    p.list_price, p.currency, p.color, p.color_group, p.category,
    null::text, p.description, p.materials, p.fit, p.tags,
    p.images, p.aarhus_total_stock, p.aarhus_available, p.first_seen_at,
    p.publication_status, 'Ćejf'
  from public.cejf_products as p
  where p.aarhus_available
),
filtered as materialized (
  select c.*
  from catalog as c
  where
    (coalesce(cardinality(p_store_keys), 0) = 0 or c.source_key = any(p_store_keys))
    and (coalesce(cardinality(p_brands), 0) = 0 or c.brand = any(p_brands))
    and (coalesce(cardinality(p_colors), 0) = 0 or c.color_group = any(p_colors))
    and (coalesce(cardinality(p_fits), 0) = 0 or c.fit = any(p_fits))
    and (p_min_price is null or c.current_price >= p_min_price)
    and (p_max_price is null or c.current_price <= p_max_price)
    and (not p_on_sale or c.list_price is not null)
    and (
      not p_new_products
      or (
        c.publication_status = 'active'
        and c.first_seen_at >= now() - interval '14 days'
      )
    )
    and (
      coalesce(cardinality(p_types), 0) = 0
      or exists (
        select 1
        from unnest(p_types) as selected(type_key)
        where
          (selected.type_key = 't-shirts' and (
            c.category ilike '%T-Shirt%' or c.name ilike '%T-Shirt%'
          ))
          or (selected.type_key = 'skjorter' and (
            c.category ilike 'Shirt'
            or c.category ilike 'Shirts'
            or c.name ilike '% Shirt%'
          ))
          or (selected.type_key = 'poloer' and (
            c.category ilike '%Polo%' or c.name ilike '%Polo%'
          ))
          or (selected.type_key = 'strik' and (
            c.category ilike '%Pullover%'
            or c.name ilike '%Pullover%'
            or c.name ilike '%Knit%'
          ))
          or (selected.type_key = 'sweatshirts' and (
            c.category ilike '%Sweat%'
            or c.name ilike '%Sweat%'
            or c.name ilike '%Hoodie%'
          ))
          or (selected.type_key = 'jakker' and (
            c.category ilike '%Jacket%' or c.name ilike '%Jacket%'
          ))
          or (selected.type_key = 'blazere' and (
            c.category ilike '%Blazer%' or c.name ilike '%Blazer%'
          ))
          or (selected.type_key = 'bukser' and (
            c.category ilike 'Pants'
            or c.category ilike 'Trousers'
            or c.name ilike '%Pants%'
            or c.name ilike '%Trousers%'
          ))
          or (selected.type_key = 'jeans' and (
            c.category ilike 'Jeans' or c.name ilike '%Jeans%'
          ))
          or (selected.type_key = 'shorts' and (
            c.category ilike 'Shorts' or c.name ilike '%Shorts%'
          ))
          or (selected.type_key = 'veste' and (
            c.category ilike 'Waistcoat'
            or c.name ilike '%Waistcoat%'
            or c.name ilike '%Vest%'
          ))
          or (selected.type_key = 'sko' and (
            c.category ilike '%Shoe%'
            or c.category ilike '%Sneaker%'
            or c.category ilike '%Boot%'
            or c.name ilike '%Shoe%'
            or c.name ilike '%Sneaker%'
            or c.name ilike '%Boot%'
          ))
      )
    )
),
query_input as (
  select lower(
    regexp_replace(
      left(btrim(coalesce(p_search_query, '')), 120),
      '[^[:alnum:]æøå]+',
      ' ',
      'g'
    )
  ) as phrase
),
tokens as materialized (
  select distinct parts.token
  from query_input
  cross join lateral regexp_split_to_table(query_input.phrase, '\s+') as parts(token)
  where parts.token <> ''
  limit 12
),
normalized as materialized (
  select
    f.*,
    lower(coalesce(f.name, '')) as name_text,
    lower(coalesce(f.brand, '')) as brand_text,
    lower(coalesce(f.color, '') || ' ' || coalesce(f.color_group, '')) as color_text,
    lower(coalesce(f.category, '') || ' ' || coalesce(f.product_type, '')) as category_text,
    lower(coalesce(f.fit, '')) as fit_text,
    lower(coalesce(array_to_string(f.materials, ' '), '')) as materials_text,
    lower(coalesce(array_to_string(f.tags, ' '), '')) as tags_text,
    lower(coalesce(f.description, '')) as description_text,
    lower(coalesce(f.store_name, '')) as store_text
  from filtered as f
),
token_scores as materialized (
  select
    n.source_key,
    n.id,
    t.token,
    greatest(
      case
        when n.name_text = t.token then 12.0
        when position(' ' || t.token || ' ' in ' ' || n.name_text || ' ') > 0 then 9.0
        when position(t.token in n.name_text) > 0 then 6.0
        else 0.0
      end,
      case
        when n.brand_text = t.token then 11.0
        when position(' ' || t.token || ' ' in ' ' || n.brand_text || ' ') > 0 then 8.0
        when position(t.token in n.brand_text) > 0 then 5.0
        else 0.0
      end,
      case
        when n.category_text = t.token then 9.0
        when position(' ' || t.token || ' ' in ' ' || n.category_text || ' ') > 0 then 7.0
        when position(t.token in n.category_text) > 0 then 4.5
        else 0.0
      end,
      case
        when n.color_text = t.token then 8.0
        when position(' ' || t.token || ' ' in ' ' || n.color_text || ' ') > 0 then 6.0
        when position(t.token in n.color_text) > 0 then 4.0
        else 0.0
      end,
      case
        when position(' ' || t.token || ' ' in ' ' || n.store_text || ' ') > 0 then 6.0
        when position(t.token in n.store_text) > 0 then 3.5
        else 0.0
      end,
      case
        when position(' ' || t.token || ' ' in ' ' || n.fit_text || ' ') > 0 then 4.0
        when position(t.token in n.fit_text) > 0 then 2.5
        else 0.0
      end,
      case
        when position(t.token in n.materials_text) > 0 then 2.0
        when position(t.token in n.tags_text) > 0 then 2.0
        when position(t.token in n.description_text) > 0 then 1.5
        else 0.0
      end,
      case
        when char_length(t.token) >= 4 then greatest(
          case
            when public.strict_word_similarity(t.token, n.name_text) >= 0.55
              then public.strict_word_similarity(t.token, n.name_text) * 5.0
            else 0.0
          end,
          case
            when public.strict_word_similarity(t.token, n.brand_text) >= 0.55
              then public.strict_word_similarity(t.token, n.brand_text) * 4.5
            else 0.0
          end,
          case
            when public.strict_word_similarity(t.token, n.category_text) >= 0.55
              then public.strict_word_similarity(t.token, n.category_text) * 4.0
            else 0.0
          end,
          case
            when public.strict_word_similarity(t.token, n.color_text) >= 0.55
              then public.strict_word_similarity(t.token, n.color_text) * 3.5
            else 0.0
          end,
          case
            when public.strict_word_similarity(t.token, n.store_text) >= 0.55
              then public.strict_word_similarity(t.token, n.store_text) * 3.0
            else 0.0
          end
        )
        else 0.0
      end
    ) as token_score
  from normalized as n
  cross join tokens as t
),
product_scores as materialized (
  select
    n.*,
    count(*) filter (where ts.token_score > 0)::integer as matched_tokens,
    count(*)::integer as token_count,
    sum(ts.token_score) filter (where ts.token_score > 0) as token_score,
    case
      when n.name_text = q.phrase then 30.0
      when n.brand_text = q.phrase then 26.0
      when position(q.phrase in n.name_text) > 0 then 18.0
      when position(q.phrase in n.brand_text) > 0 then 15.0
      when position(q.phrase in n.category_text) > 0 then 12.0
      when position(q.phrase in n.color_text) > 0 then 10.0
      else 0.0
    end as phrase_score
  from normalized as n
  cross join query_input as q
  join token_scores as ts
    on ts.source_key = n.source_key
    and ts.id = n.id
  group by
    n.source_key, n.id, n.name, n.brand, n.current_price, n.list_price,
    n.currency, n.color, n.color_group, n.category, n.product_type,
    n.description, n.materials, n.fit, n.tags, n.images,
    n.aarhus_total_stock, n.aarhus_available, n.first_seen_at,
    n.publication_status, n.store_name, n.name_text, n.brand_text,
    n.color_text, n.category_text, n.fit_text, n.materials_text,
    n.tags_text, n.description_text, n.store_text, q.phrase
),
ranked as materialized (
  select
    ps.*,
    max(ps.matched_tokens) over () as best_matched_tokens,
    (
      ps.phrase_score
      + coalesce(ps.token_score, 0)
      + (10.0 * ps.matched_tokens / greatest(ps.token_count, 1))
    )::real as relevance
  from product_scores as ps
  where ps.matched_tokens > 0
),
eligible as (
  select r.*
  from ranked as r
  where r.matched_tokens = r.best_matched_tokens
),
counted as (
  select e.*, count(*) over () as total_count
  from eligible as e
)
select
  c.source_key,
  c.id,
  c.name,
  c.brand,
  c.current_price,
  c.list_price,
  c.currency,
  c.color,
  coalesce(c.category, c.product_type) as category,
  c.images,
  case
    when c.aarhus_total_stock = 0 and c.aarhus_available then null
    else c.aarhus_total_stock
  end as aarhus_total_stock,
  c.aarhus_available,
  c.first_seen_at,
  c.relevance,
  c.total_count
from counted as c
order by
  case when p_new_products then c.first_seen_at end desc nulls last,
  case when not p_new_products and p_sort = 'price-asc' then c.current_price end asc nulls last,
  case when not p_new_products and p_sort = 'price-desc' then c.current_price end desc nulls last,
  case when not p_new_products and p_sort = 'name-asc' then lower(c.name) end asc nulls last,
  case when not p_new_products and p_sort = 'brand-asc' then lower(c.brand) end asc nulls last,
  case when not p_new_products and p_sort = 'standard' then c.relevance end desc nulls last,
  lower(c.brand),
  lower(c.name),
  c.source_key,
  c.id
limit least(greatest(coalesce(p_limit, 12), 1), 50)
offset greatest(coalesce(p_offset, 0), 0);
$function$;

comment on function public.search_products_ranked(
  text, text[], text[], text[], text[], text[], numeric, numeric,
  boolean, boolean, text, integer, integer
) is
  'Ranks multi-word product searches across existing store catalogues using generic field weights and pg_trgm typo tolerance.';

revoke execute on function public.search_products_ranked(
  text, text[], text[], text[], text[], text[], numeric, numeric,
  boolean, boolean, text, integer, integer
) from public, anon;

grant execute on function public.search_products_ranked(
  text, text[], text[], text[], text[], text[], numeric, numeric,
  boolean, boolean, text, integer, integer
) to authenticated;
