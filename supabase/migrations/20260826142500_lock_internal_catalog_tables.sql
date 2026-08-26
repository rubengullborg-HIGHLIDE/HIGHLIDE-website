-- Internal and legacy catalogue tables are not part of the browser Data API.
-- Scraper jobs use the service role and do not need grants to anon or users.

alter table public.products_old enable row level security;
alter table public.product_inventory_snapshots enable row level security;

revoke all on table public.products_old from anon, authenticated;
revoke all on table public.product_inventory_snapshots from anon, authenticated;
revoke all on table public.kaufmann_inventory_snapshots from anon, authenticated;
revoke all on table public.store_inventory_snapshots from anon, authenticated;
