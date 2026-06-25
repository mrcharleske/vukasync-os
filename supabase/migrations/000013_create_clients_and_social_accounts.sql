do $$
begin
  if not exists (select 1 from pg_type where typname = 'social_platform') then
    create type public.social_platform as enum (
      'INSTAGRAM',
      'FACEBOOK',
      'LINKEDIN',
      'X',
      'TIKTOK',
      'YOUTUBE'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'social_connection_type') then
    create type public.social_connection_type as enum ('MANUAL', 'API_CONNECTED');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'social_account_status') then
    create type public.social_account_status as enum ('ACTIVE', 'INACTIVE');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'client_assignment_permission') then
    create type public.client_assignment_permission as enum ('VIEWER', 'EDITOR');
  end if;
end $$;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  client_name text not null,
  business_name text not null,
  contact_email text,
  phone text,
  country text,
  timezone text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_clients_workspace_id
  on public.clients (workspace_id);

create index if not exists idx_clients_contact_email
  on public.clients (lower(contact_email));

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row
execute procedure public.set_updated_at();

create table if not exists public.client_assignments (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.clients (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  permission public.client_assignment_permission not null default 'VIEWER',
  created_at timestamptz not null default timezone('utc', now()),
  unique (client_id, profile_id)
);

create index if not exists idx_client_assignments_profile_id
  on public.client_assignments (profile_id);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  platform public.social_platform not null,
  username text not null,
  profile_url text,
  connection_type public.social_connection_type not null default 'MANUAL',
  account_status public.social_account_status not null default 'ACTIVE',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (client_id, platform, username)
);

create index if not exists idx_social_accounts_client_id
  on public.social_accounts (client_id);

create index if not exists idx_social_accounts_platform
  on public.social_accounts (platform);

drop trigger if exists social_accounts_set_updated_at on public.social_accounts;
create trigger social_accounts_set_updated_at
before update on public.social_accounts
for each row
execute procedure public.set_updated_at();
