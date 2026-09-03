-- Run against the migrated database with psql -v ON_ERROR_STOP=1 -f this_file.sql
-- or execute the whole file in the SQL editor. Everything rolls back.
-- The real search body is tested against temporary fixtures, never live products.
begin;

create temporary table search_fixtures (
  source_key text not null,
  id bigint not null,
  name text not null,
  brand text not null default 'Atlas',
  current_price numeric not null,
  list_price numeric,
  currency text default 'DKK',
  color text,
  color_group text,
  category text,
  product_type text,
  description text default '',
  materials text[] default '{}',
  fit text,
  tags text[] default '{}',
  images text[] default '{}',
  aarhus_total_stock integer default 1,
  aarhus_available boolean default true,
  first_seen_at timestamptz default now(),
  publication_status text default 'active',
  store_name text default 'Test Store'
);

insert into search_fixtures
  (source_key, id, name, current_price, color, color_group, category, product_type)
values
  ('kaufmann', 1, 'Plain One', 100, 'White', 'White', 'Pants', 'Pants'),
  ('stoy', 2, 'Plain Two', 200, 'Hvid', 'Hvid', 'Bukser', 'Bukser'),
  ('kaufmann', 3, 'Plain Three', 300, 'Hvid White', 'White', 'Bukser Pants', 'Pants'),
  ('kaufmann', 4, 'Plain Four', 90, 'Black', 'Black', 'Pants', 'Pants'),
  ('kaufmann', 5, 'Plain Five', 80, 'White', 'White', 'Shirts', 'Shirts'),
  ('kaufmann', 6, 'Plain Six', 70, 'Beige', 'Beige', 'Pants', 'Pants'),
  ('kaufmann', 7, 'Plain Seven', 60, 'Black', 'Black', 'Pants', 'Pants'),
  ('kaufmann', 8, 'Plain Eight', 50, 'White', 'White', 'Jeans', 'Jeans'),
  ('kaufmann', 9, 'Plain Nine', 40, 'Black', 'Black', 'T-shirts', 'T-shirts'),
  ('kaufmann', 10, 'Plain Ten', 30, 'Sort', 'Sort', 'Skjorter', 'Skjorter'),
  ('kaufmann', 11, 'Plain Eleven', 20, 'Black', 'Black', 'Sneakers', 'Sneakers'),
  ('stoy', 12, 'Plain Twelve', 400, null, 'White', null, 'Trousers'),
  ('kaufmann', 13, 'Falcon', 10, 'Black', 'Black', 'Pants', 'Pants');

update search_fixtures set brand = 'Beta' where id = 2;
update search_fixtures set brand = 'Off-White' where id = 7;
update search_fixtures set brand = 'Adidas' where id = 11;
update search_fixtures set fit = 'Regular' where id in (1, 12);
update search_fixtures set list_price = current_price + 50 where id in (1, 3);
update search_fixtures set publication_status = 'inactive' where id = 3;
update search_fixtures set first_seen_at = now() - interval '30 days' where id = 12;

create temporary table test_search_synonyms as
  select * from public.search_synonym_groups;
-- Test that vocabulary changes take effect without altering the search function.
update test_search_synonyms
  set terms = terms || array['snehvid', 'white']
  where kind = 'color' and group_key = 'white';

grant select on pg_temp.search_fixtures, pg_temp.test_search_synonyms to authenticated;

do $fixture_function$
declare
  function_body text;
  definition text;
  fixture_body text;
begin
  select prosrc, pg_get_functiondef(oid)
    into function_body, definition
    from pg_proc
    where oid = 'public.search_products_ranked(text,text[],text[],text[],text[],text[],numeric,numeric,boolean,boolean,text,integer,integer)'::regprocedure;

  if function_body not like '%filtered as materialized (%' then
    raise exception 'Search structure changed; update the fixture setup before running tests.';
  end if;

  fixture_body := 'with catalog as materialized (select * from pg_temp.search_fixtures), filtered as materialized ('
    || split_part(function_body, 'filtered as materialized (', 2);
  fixture_body := replace(fixture_body, 'public.search_synonym_groups', 'pg_temp.test_search_synonyms');
  definition := replace(definition, function_body, fixture_body);
  definition := replace(definition, 'FUNCTION public.search_products_ranked(', 'FUNCTION pg_temp.search_products_ranked(');
  execute definition;
end;
$fixture_function$;

grant execute on function pg_temp.search_products_ranked(
  text, text[], text[], text[], text[], text[], numeric, numeric,
  boolean, boolean, text, integer, integer
) to authenticated;

set local role authenticated;

do $tests$
declare
  query text;
  actual bigint[];
  expected bigint[] := array[1, 2, 3, 12]::bigint[];
  min_score real;
  max_score real;
begin
  foreach query in array array[
    'hvide bukser', 'hvidt buks', 'HVIDE, BUKSER!', 'snehvid bukser'
  ] loop
    select array_agg(id order by id) into actual
      from pg_temp.search_products_ranked(query, p_limit => 50);
    if actual is distinct from expected then
      raise exception 'Cross-language match failed for %: %', query, actual;
    end if;
  end loop;

  -- The English original still matches the existing Off-White brand search;
  -- Danish color expansion above must NOT create that brand match.
  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('white pants', p_limit => 50);
  if actual is distinct from array[1, 2, 3, 7, 12]::bigint[] then
    raise exception 'Reverse translation or original brand matching regressed: %', actual;
  end if;

  select min(relevance), max(relevance) into min_score, max_score
    from pg_temp.search_products_ranked('hvide bukser', p_limit => 50);
  if min_score <> max_score or min_score <> 23 then
    raise exception 'Synonyms inflated scores or penalized translations: %..%', min_score, max_score;
  end if;

  if exists (
    select 1 from pg_temp.search_products_ranked('hvide bukser', p_limit => 50)
    where total_count <> 4
  ) then
    raise exception 'Synonym alternatives inflated the result count.';
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('skjorter', p_limit => 50);
  if actual is distinct from array[5, 10]::bigint[] then
    raise exception 'Shirt translations matched a T-shirt or missed a shirt: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('sorte t-shirts', p_limit => 50);
  if actual is distinct from array[9]::bigint[] then
    raise exception 'Hyphenated category was not preserved: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide', p_limit => 50);
  if actual is distinct from array[1, 2, 3, 5, 8, 12]::bigint[] then
    raise exception 'Color-only search incorrectly required a category: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('bukser', p_limit => 50);
  if actual is distinct from array[1, 2, 3, 4, 6, 7, 12, 13]::bigint[] then
    raise exception 'Category-only search merged jeans or required a color: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('beige bukser', p_limit => 50);
  if actual is distinct from array[6]::bigint[] then
    raise exception 'Separate shades were merged: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_store_keys => array['stoy']);
  if actual is distinct from array[2, 12]::bigint[] then
    raise exception 'Store filter failed: %', actual;
  end if;

  -- Preserve the existing type-filter predicates (not synonym-expanded).
  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_types => array['bukser']);
  if actual is distinct from array[1]::bigint[] then
    raise exception 'Existing type filter changed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_brands => array['Beta']);
  if actual is distinct from array[2]::bigint[] then
    raise exception 'Brand filter failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_colors => array['White']);
  if actual is distinct from array[1, 3, 12]::bigint[] then
    raise exception 'Color filter failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_fits => array['Regular']);
  if actual is distinct from array[1, 12]::bigint[] then
    raise exception 'Fit filter failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_min_price => 150, p_max_price => 250);
  if actual is distinct from array[2]::bigint[] then
    raise exception 'Price filter failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_on_sale => true);
  if actual is distinct from array[1, 3]::bigint[] then
    raise exception 'Sale filter failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_new_products => true);
  if actual is distinct from array[1, 2]::bigint[] then
    raise exception 'New-products filter failed: %', actual;
  end if;

  select array_agg(id order by current_price desc) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_sort => 'price-desc', p_limit => 2);
  if actual is distinct from array[12, 3]::bigint[] then
    raise exception 'Sorting before pagination failed: %', actual;
  end if;

  select array_agg(id order by current_price desc) into actual
    from pg_temp.search_products_ranked('hvide bukser', p_sort => 'price-desc', p_limit => 2, p_offset => 2);
  if actual is distinct from array[2, 1]::bigint[] then
    raise exception 'Second result page failed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('addidas sneakers');
  if actual is distinct from array[11]::bigint[] then
    raise exception 'Existing brand typo tolerance regressed: %', actual;
  end if;

  select array_agg(id order by id) into actual
    from pg_temp.search_products_ranked('Falcon');
  if actual is distinct from array[13]::bigint[] then
    raise exception 'Unmapped name search regressed: %', actual;
  end if;

  foreach query in array array['', '   ', '!!!', 'zxqv984xyz'] loop
    if exists (select 1 from pg_temp.search_products_ranked(query)) then
      raise exception 'Empty/unmatched query unexpectedly returned products: %', query;
    end if;
  end loop;

  if not has_table_privilege('authenticated', 'public.search_synonym_groups', 'select')
    or has_table_privilege('authenticated', 'public.search_synonym_groups', 'insert,update,delete,truncate')
    or has_table_privilege('anon', 'public.search_synonym_groups', 'select,insert,update,delete,truncate') then
    raise exception 'Lookup permissions are not authenticated read-only.';
  end if;

  if not (select relrowsecurity from pg_class where oid = 'public.search_synonym_groups'::regclass)
    or (select prosecdef from pg_proc where oid = 'public.search_products_ranked(text,text[],text[],text[],text[],text[],numeric,numeric,boolean,boolean,text,integer,integer)'::regprocedure)
    or has_function_privilege('anon', 'public.search_products_ranked(text,text[],text[],text[],text[],text[],numeric,numeric,boolean,boolean,text,integer,integer)', 'execute') then
    raise exception 'Search RLS or RPC access controls regressed.';
  end if;
end;
$tests$;

select 'Bilingual search regression checks passed' as result;
rollback;
