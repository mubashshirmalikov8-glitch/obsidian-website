-- Phase 3 — Visitor Analytics Foundation (2026-06-28)
-- Run once in the Supabase SQL editor. RLS deny-all: only the service role
-- (server-side: /api/track upserts, /api/lead links, admin reads) touches it.

create table if not exists public.visitor_sessions (
  id              uuid primary key default gen_random_uuid(),
  session_id      text unique not null,          -- per-visit upsert key (client)
  visitor_id      text not null,                 -- persistent per browser (client)
  started_at      timestamptz not null default now(),
  last_seen       timestamptz not null default now(),
  current_page    text,
  current_section text,
  locale          text,
  device          text,                          -- server UA parse
  browser         text,                          -- server UA parse
  os              text,                           -- server UA parse
  referrer        text,                          -- first-touch
  source          text,                          -- utm_source / referrer host
  became_lead     boolean not null default false,
  lead_id         uuid references public.leads(id) on delete set null
);

alter table public.visitor_sessions enable row level security;  -- no policies => service-role only

create index if not exists visitor_sessions_last_seen_idx  on public.visitor_sessions (last_seen desc);
create index if not exists visitor_sessions_started_at_idx on public.visitor_sessions (started_at);
create index if not exists visitor_sessions_visitor_id_idx on public.visitor_sessions (visitor_id);
