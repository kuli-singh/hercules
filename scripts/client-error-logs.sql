-- Run in Supabase SQL editor

create table if not exists public.client_error_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  feature text not null,
  stage text not null,
  message text not null,
  error_name text,
  error_stack text,
  context jsonb not null default '{}'::jsonb
);

create index if not exists idx_client_error_logs_created_at
  on public.client_error_logs(created_at desc);

create index if not exists idx_client_error_logs_feature_stage
  on public.client_error_logs(feature, stage, created_at desc);

alter table public.client_error_logs enable row level security;

drop policy if exists "client_error_logs_insert_anon" on public.client_error_logs;
create policy "client_error_logs_insert_anon"
  on public.client_error_logs
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "client_error_logs_read_none" on public.client_error_logs;
create policy "client_error_logs_read_none"
  on public.client_error_logs
  for select
  to anon, authenticated
  using (false);
