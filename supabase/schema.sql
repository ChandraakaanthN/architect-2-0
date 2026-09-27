-- Architect 2.0 — core schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query) after creating the project.

-- 1. profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. projects ----------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  framework text not null default 'nextjs',       -- nextjs | agent-langchain | agent-crewai | agent-claude-sdk | custom
  template text not null default 'blank',
  status text not null default 'ready',           -- generating | ready | error
  model text not null default 'claude-sonnet-4.6',
  github_repo text,
  github_connected boolean not null default false,
  last_deployment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "projects are readable by owner" on public.projects
  for select using (auth.uid() = owner_id);

create policy "projects are insertable by owner" on public.projects
  for insert with check (auth.uid() = owner_id);

create policy "projects are editable by owner" on public.projects
  for update using (auth.uid() = owner_id);

create policy "projects are deletable by owner" on public.projects
  for delete using (auth.uid() = owner_id);

-- 3. messages (chat history per project) --------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages are readable by project owner" on public.messages
  for select using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

create policy "messages are insertable by project owner" on public.messages
  for insert with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- 4. deployments (simulated deploy pipeline history) --------------------------
create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  provider text not null default 'vercel',        -- vercel | netlify | fly
  status text not null default 'queued',          -- queued | building | deploying | live | failed
  url text,
  created_at timestamptz not null default now()
);

alter table public.deployments enable row level security;

create policy "deployments are readable by project owner" on public.deployments
  for select using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

create policy "deployments are insertable by project owner" on public.deployments
  for insert with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

create policy "deployments are updatable by project owner" on public.deployments
  for update using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- 5. keep updated_at fresh -----------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.touch_updated_at();
