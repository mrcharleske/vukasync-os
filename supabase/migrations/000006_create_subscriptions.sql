-- Phase 3C: subscription plan catalog and workspace subscription backbone.

create table public.plans (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  status text not null default 'active',
  billing_interval text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint plans_key_format_check
    check (key = upper(key) and key ~ '^[A-Z][A-Z0-9_]*$'),
  constraint plans_name_not_blank_check
    check (length(trim(name)) > 0),
  constraint plans_status_check
    check (status in ('active', 'inactive', 'archived')),
  constraint plans_billing_interval_check
    check (
      billing_interval is null
      or billing_interval in ('monthly', 'quarterly', 'yearly', 'custom')
    )
);

create trigger plans_set_updated_at
before update on public.plans
for each row
execute function public.set_updated_at();

create index plans_status_idx
on public.plans (status);

create index plans_billing_interval_idx
on public.plans (billing_interval);

create index plans_deleted_at_idx
on public.plans (deleted_at);

create table public.subscriptions (
  id uuid primary key default extensions.gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete restrict,
  status text not null default 'active',
  source text not null default 'manual',
  provider text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint subscriptions_status_check
    check (status in (
      'trialing',
      'active',
      'past_due',
      'paused',
      'canceled',
      'incomplete'
    )),
  constraint subscriptions_source_check
    check (source in ('automatic', 'manual')),
  constraint subscriptions_provider_check
    check (provider is null or provider in ('stripe', 'mpesa', 'manual')),
  constraint subscriptions_period_order_check
    check (
      current_period_end is null
      or current_period_start is null
      or current_period_end >= current_period_start
    )
);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

create index subscriptions_workspace_id_idx
on public.subscriptions (workspace_id);

create index subscriptions_plan_id_idx
on public.subscriptions (plan_id);

create index subscriptions_status_idx
on public.subscriptions (status);

create index subscriptions_provider_subscription_idx
on public.subscriptions (provider, provider_subscription_id);

create index subscriptions_current_period_end_idx
on public.subscriptions (current_period_end);

create index subscriptions_deleted_at_idx
on public.subscriptions (deleted_at);

create table public.subscription_events (
  id uuid primary key default extensions.gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  event_type text not null,
  source text not null default 'manual',
  provider text,
  provider_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint subscription_events_event_type_not_blank_check
    check (length(trim(event_type)) > 0),
  constraint subscription_events_source_check
    check (source in ('stripe', 'mpesa', 'admin', 'system', 'manual')),
  constraint subscription_events_provider_check
    check (provider is null or provider in ('stripe', 'mpesa', 'manual'))
);

create index subscription_events_subscription_id_idx
on public.subscription_events (subscription_id);

create index subscription_events_workspace_id_idx
on public.subscription_events (workspace_id);

create index subscription_events_event_type_idx
on public.subscription_events (event_type);

create index subscription_events_provider_event_idx
on public.subscription_events (provider, provider_event_id);

create index subscription_events_created_at_idx
on public.subscription_events (created_at);
