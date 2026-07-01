-- Auth v2 — Google OAuth + admins allowlist (2026-06-28)
-- Run once in the Supabase SQL editor. RLS deny-all: only the service role
-- (server-side, after session verification) reads this table.

create table if not exists public.admins (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,           -- always stored lowercased
  role       text not null default 'admin' check (role in ('owner', 'admin')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;  -- no policies => service-role only

-- Seed the first owner (data, not hardcoded in app code).
insert into public.admins (email, role)
values ('mubashshirmalikov8@gmail.com', 'owner')
on conflict (email) do nothing;
