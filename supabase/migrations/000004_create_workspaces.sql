-- Phase 3C: workspace tenancy backbone.

create table public.workspaces (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'client',
  status text not null default 'active',
  primary_currency text,
  country_code text,
  locale text not null default 'en',
  timezone text not null default 'UTC',
  created_by uuid not null default auth.uid() references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint workspaces_name_not_blank_check
    check (length(trim(name)) > 0),
  constraint workspaces_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint workspaces_type_check
    check (type in ('client', 'internal', 'partner')),
  constraint workspaces_status_check
    check (status in ('active', 'inactive', 'suspended', 'archived')),
  constraint workspaces_primary_currency_check
    check (primary_currency is null or primary_currency ~ '^[A-Z]{3}$'),
  constraint workspaces_country_code_check
    check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  constraint workspaces_locale_not_blank_check
    check (length(trim(locale)) > 0),
  constraint workspaces_timezone_not_blank_check
    check (length(trim(timezone)) > 0)
);

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

create index workspaces_created_by_idx
on public.workspaces (created_by);

create index workspaces_status_idx
on public.workspaces (status);

create index workspaces_type_idx
on public.workspaces (type);

create index workspaces_country_code_idx
on public.workspaces (country_code);

create index workspaces_deleted_at_idx
on public.workspaces (deleted_at);

alter table public.profiles
add column default_workspace_id uuid references public.workspaces (id) on delete set null;

create index profiles_default_workspace_id_idx
on public.profiles (default_workspace_id);

create table public.workspace_members (
  id uuid primary key default extensions.gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null,
  status text not null default 'active',
  invited_by uuid references public.profiles (id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint workspace_members_role_check
    check (role in ('OWNER', 'TEAM_MEMBER', 'CLIENT')),
  constraint workspace_members_status_check
    check (status in ('active', 'invited', 'suspended', 'removed'))
);

create trigger workspace_members_set_updated_at
before update on public.workspace_members
for each row
execute function public.set_updated_at();

create unique index workspace_members_active_unique_idx
on public.workspace_members (workspace_id, profile_id)
where deleted_at is null;

create index workspace_members_workspace_id_idx
on public.workspace_members (workspace_id);

create index workspace_members_profile_id_idx
on public.workspace_members (profile_id);

create index workspace_members_role_idx
on public.workspace_members (role);

create index workspace_members_status_idx
on public.workspace_members (status);

create index workspace_members_deleted_at_idx
on public.workspace_members (deleted_at);

create table public.workspace_invitations (
  id uuid primary key default extensions.gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role text not null,
  token_hash text not null,
  status text not null default 'pending',
  invited_by uuid not null references public.profiles (id) on delete restrict,
  accepted_by uuid references public.profiles (id) on delete set null,
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint workspace_invitations_email_lower_check
    check (email = lower(email)),
  constraint workspace_invitations_role_check
    check (role in ('OWNER', 'TEAM_MEMBER', 'CLIENT')),
  constraint workspace_invitations_status_check
    check (status in ('pending', 'accepted', 'expired', 'revoked'))
);

create trigger workspace_invitations_set_updated_at
before update on public.workspace_invitations
for each row
execute function public.set_updated_at();

create unique index workspace_invitations_pending_unique_idx
on public.workspace_invitations (workspace_id, email)
where status = 'pending' and deleted_at is null;

create index workspace_invitations_workspace_id_idx
on public.workspace_invitations (workspace_id);

create index workspace_invitations_email_idx
on public.workspace_invitations (email);

create index workspace_invitations_status_idx
on public.workspace_invitations (status);

create index workspace_invitations_token_hash_idx
on public.workspace_invitations (token_hash);

create index workspace_invitations_deleted_at_idx
on public.workspace_invitations (deleted_at);

create or replace function public.create_workspace_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (
    workspace_id,
    profile_id,
    role,
    status,
    joined_at
  )
  values (
    new.id,
    new.created_by,
    'OWNER',
    'active',
    now()
  )
  on conflict (workspace_id, profile_id)
  where deleted_at is null
  do nothing;

  update public.profiles
  set
    default_workspace_id = coalesce(default_workspace_id, new.id),
    onboarding_status = case
      when onboarding_status = 'pending' then 'workspace_created'
      else onboarding_status
    end,
    updated_at = now()
  where id = new.created_by;

  return new;
end;
$$;

create trigger workspaces_create_owner_membership
after insert on public.workspaces
for each row
execute function public.create_workspace_owner_membership();
