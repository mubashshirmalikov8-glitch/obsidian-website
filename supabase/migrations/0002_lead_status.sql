-- Phase 2 — Lead Management (2026-06-28)
-- Adds a status pipeline column to leads. Run once in the Supabase SQL editor.
-- (Idempotent. RLS stays deny-all; admin reads/writes go via the service role.)

alter table public.leads
  add column if not exists status text not null default 'new';

create index if not exists leads_status_idx on public.leads (status);
