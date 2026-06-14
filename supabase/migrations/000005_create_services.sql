-- Phase 3C: service catalog and workspace service assignments.

create table public.services (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  category text not null,
  status text not null default 'active',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint services_key_format_check
    check (key = upper(key) and key ~ '^[A-Z][A-Z0-9_]*$'),
  constraint services_name_not_blank_check
    check (length(trim(name)) > 0),
  constraint services_category_not_blank_check
    check (length(trim(category)) > 0),
  constraint services_status_check
    check (status in ('active', 'inactive', 'archived'))
);

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

create index services_category_idx
on public.services (category);

create index services_status_idx
on public.services (status);

create index services_deleted_at_idx
on public.services (deleted_at);

create table public.workspace_services (
  id uuid primary key default extensions.gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,
  status text not null default 'active',
  assigned_by uuid references public.profiles (id) on delete set null,
  delivery_owner_id uuid references public.profiles (id) on delete set null,
  start_date date,
  end_date date,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint workspace_services_status_check
    check (status in ('active', 'paused', 'ended', 'archived')),
  constraint workspace_services_date_order_check
    check (end_date is null or start_date is null or end_date >= start_date)
);

create trigger workspace_services_set_updated_at
before update on public.workspace_services
for each row
execute function public.set_updated_at();

create unique index workspace_services_active_unique_idx
on public.workspace_services (workspace_id, service_id)
where deleted_at is null;

create index workspace_services_workspace_id_idx
on public.workspace_services (workspace_id);

create index workspace_services_service_id_idx
on public.workspace_services (service_id);

create index workspace_services_status_idx
on public.workspace_services (status);

create index workspace_services_assigned_by_idx
on public.workspace_services (assigned_by);

create index workspace_services_delivery_owner_id_idx
on public.workspace_services (delivery_owner_id);

create index workspace_services_deleted_at_idx
on public.workspace_services (deleted_at);
