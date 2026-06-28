-- Pass B1 — Lead Intent Plumbing (2026-06-28)
-- Adds the course-intent columns to an existing `leads` table.
-- Run once in the Supabase SQL editor (idempotent).

alter table public.leads add column if not exists format text; -- online | offline
alter table public.leads add column if not exists tariff text; -- start | pro | premium
