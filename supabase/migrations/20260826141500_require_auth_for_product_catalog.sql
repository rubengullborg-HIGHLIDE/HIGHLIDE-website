-- The beta catalogue is account-only. Keep product reads behind Supabase Auth
-- as well as the Astro page guard so the public API cannot bypass sign-in.

drop policy if exists "Alle kan se Kaufmann produkter i Aarhus"
  on public.kaufmann_products;
create policy "Authenticated users can read Kaufmann products"
  on public.kaufmann_products
  for select
  to authenticated
  using (true);
revoke select on table public.kaufmann_products from anon;
grant select on table public.kaufmann_products to authenticated;

drop policy if exists "Alle kan se Rømerhus produkter i Aarhus"
  on public.romerhus_products;
create policy "Authenticated users can read Romerhus products"
  on public.romerhus_products
  for select
  to authenticated
  using (true);
revoke select on table public.romerhus_products from anon;
grant select on table public.romerhus_products to authenticated;

drop policy if exists "Alle kan se LAKOR produkter i Aarhus"
  on public.lakor_products;
create policy "Authenticated users can read LAKOR products"
  on public.lakor_products
  for select
  to authenticated
  using (true);
revoke select on table public.lakor_products from anon;
grant select on table public.lakor_products to authenticated;

drop policy if exists "Alle kan se Rains produkter i Aarhus"
  on public.rains_products;
create policy "Authenticated users can read Rains products"
  on public.rains_products
  for select
  to authenticated
  using (true);
revoke select on table public.rains_products from anon;
grant select on table public.rains_products to authenticated;

drop policy if exists "Alle kan se STOY produkter i Aarhus"
  on public.stoy_products;
create policy "Authenticated users can read STOY products"
  on public.stoy_products
  for select
  to authenticated
  using (true);
revoke select on table public.stoy_products from anon;
grant select on table public.stoy_products to authenticated;

drop policy if exists "Alle kan se Shoe Chapter produkter i Aarhus"
  on public.shoechapter_products;
create policy "Authenticated users can read Shoe Chapter products"
  on public.shoechapter_products
  for select
  to authenticated
  using (true);
revoke select on table public.shoechapter_products from anon;
grant select on table public.shoechapter_products to authenticated;

drop policy if exists "Alle kan se Skagen Clothing produkter i Aarhus"
  on public.skagen_clothing_products;
create policy "Authenticated users can read Skagen Clothing products"
  on public.skagen_clothing_products
  for select
  to authenticated
  using (true);
revoke select on table public.skagen_clothing_products from anon;
grant select on table public.skagen_clothing_products to authenticated;

drop policy if exists "Public can read SuitClub product catalog"
  on public.suitclub_products;
create policy "Authenticated users can read SuitClub products"
  on public.suitclub_products
  for select
  to authenticated
  using (true);
revoke select on table public.suitclub_products from anon;
grant select on table public.suitclub_products to authenticated;

drop policy if exists "Public can read Cejf product catalog"
  on public.cejf_products;
create policy "Authenticated users can read Cejf products"
  on public.cejf_products
  for select
  to authenticated
  using (true);
revoke select on table public.cejf_products from anon;
grant select on table public.cejf_products to authenticated;
