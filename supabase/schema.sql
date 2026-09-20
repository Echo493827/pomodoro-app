-- ============================================================
-- Cafe Pomodoro - Supabase schema
-- Run this whole file once in your Supabase project:
--   Dashboard > SQL Editor > New query > paste > Run
-- It is safe to re-run (uses "if not exists" / "or replace").
-- ============================================================

-- ----- profiles -----
-- one row per user. total_study_minutes is the single source of
-- truth for which recipes are unlocked (recipes unlock by threshold).
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  display_name        text,
  total_study_minutes integer not null default 0,
  created_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- a user can read and update only their own profile
drop policy if exists "profiles are viewable by owner" on public.profiles;
create policy "profiles are viewable by owner"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles are updatable by owner" on public.profiles;
create policy "profiles are updatable by owner"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "profiles are insertable by owner" on public.profiles;
create policy "profiles are insertable by owner"
  on public.profiles for insert with check (auth.uid() = id);


-- ----- sessions -----
-- one row per completed study block. this is what the dashboard reads.
create table if not exists public.sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  duration_minutes integer not null,
  kind             text not null default 'study',   -- 'study' or 'break'
  completed_at     timestamptz not null default now()
);

create index if not exists sessions_user_time_idx
  on public.sessions (user_id, completed_at desc);

alter table public.sessions enable row level security;

drop policy if exists "sessions are viewable by owner" on public.sessions;
create policy "sessions are viewable by owner"
  on public.sessions for select using (auth.uid() = user_id);

drop policy if exists "sessions are insertable by owner" on public.sessions;
create policy "sessions are insertable by owner"
  on public.sessions for insert with check (auth.uid() = user_id);


-- ----- auto-create a profile row when a user signs up -----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ----- add minutes atomically (avoids read-then-write races) -----
create or replace function public.add_study_minutes(minutes_to_add integer)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  new_total integer;
begin
  update public.profiles
    set total_study_minutes = total_study_minutes + minutes_to_add
    where id = auth.uid()
    returning total_study_minutes into new_total;
  return new_total;
end;
$$;
