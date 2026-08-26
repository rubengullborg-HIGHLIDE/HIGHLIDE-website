-- Extend the existing beta profile model and add append-only analytics consent.
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists postal_code text,
  add column if not exists age_confirmed_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

alter table public.profiles
  drop constraint if exists profiles_first_name_length,
  add constraint profiles_first_name_length
    check (first_name is null or char_length(btrim(first_name)) between 1 and 80),
  drop constraint if exists profiles_postal_code_format,
  add constraint profiles_postal_code_format
    check (postal_code is null or postal_code ~ '^[0-9]{4}$');

alter table public.profiles enable row level security;

drop policy if exists "Enable all for users based on id" on public.profiles;
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can create their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select, insert, update on table public.profiles to authenticated;

create table if not exists public.consent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null default 'product_analytics',
  status text not null,
  policy_version text not null,
  source text not null,
  occurred_at timestamptz not null default now(),
  constraint consent_events_purpose_check
    check (purpose = 'product_analytics'),
  constraint consent_events_status_check
    check (status in ('granted', 'declined', 'withdrawn')),
  constraint consent_events_policy_version_length
    check (char_length(policy_version) between 1 and 40),
  constraint consent_events_source_check
    check (source in ('signup', 'profile_settings', 'privacy_settings'))
);

create index if not exists consent_events_user_latest_idx
  on public.consent_events (user_id, occurred_at desc, id desc);

alter table public.consent_events enable row level security;

drop policy if exists "Users can read their own consent history" on public.consent_events;
drop policy if exists "Users can append their own consent choices" on public.consent_events;

create policy "Users can read their own consent history"
  on public.consent_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can append their own consent choices"
  on public.consent_events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public.consent_events from anon;
revoke all on table public.consent_events from authenticated;
grant select, insert on table public.consent_events to authenticated;
grant usage, select on sequence public.consent_events_id_seq to authenticated;

comment on table public.consent_events is
  'Append-only history of user choices for optional product analytics.';
comment on column public.consent_events.policy_version is
  'Version of the privacy information shown when the choice was made.';
