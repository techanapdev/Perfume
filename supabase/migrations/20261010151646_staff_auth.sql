-- ADR 0003: staff authority for the admin area. Applied to mpzsrprdvvmhormesrva on 2026-10-10 as migration "staff_auth".
create schema if not exists private;

create table private.staff_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role = 'admin'),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- No policies on purpose: only the owner-run security definer function below reads it.
alter table private.staff_members enable row level security;
revoke all on table private.staff_members from public, anon, authenticated;

drop function if exists public.is_active_staff();
create function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.staff_members
    where user_id = (select auth.uid()) and is_active
  );
$$;

revoke execute on function public.is_active_staff() from public, anon;
grant execute on function public.is_active_staff() to authenticated;
