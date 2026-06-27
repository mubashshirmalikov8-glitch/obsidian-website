-- OBSIDIAN — lead capture table (onboarding gate).
-- Run this in the Supabase SQL editor (or via `supabase db query`) once.
--
-- Inserts happen exclusively from the server using the service-role key, which
-- bypasses RLS. We enable RLS and add NO public policies, so the table is not
-- readable/writable through the public Data API by anon/authenticated roles.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text        not null,
  phone       text        not null,
  gender      text        not null,
  age         text        not null,
  locale      text,
  source      text        default 'onboarding',
  user_agent  text
);

-- Lock the table down: RLS on, no policies => only the service role can touch it.
alter table public.leads enable row level security;

-- Helpful index for reviewing recent leads.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
