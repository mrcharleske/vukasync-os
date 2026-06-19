create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  catalog_service_id uuid not null references public.service_catalog (id),
  status text not null default 'ACTIVE',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_services_workspace_id
  on public.services (workspace_id);

create trigger services_set_updated_at
before update on public.services
for each row
execute procedure public.set_updated_at();
