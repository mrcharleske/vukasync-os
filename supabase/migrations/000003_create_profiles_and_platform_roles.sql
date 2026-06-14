-- Phase 3C: authentication profile backbone and platform-wide roles.

create table public.platform_roles (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint platform_roles_key_format_check
    check (key = upper(key) and key ~ '^[A-Z][A-Z0-9_]*$')
);

create trigger platform_roles_set_updated_at
before update on public.platform_roles
for each row
execute function public.set_updated_at();

create index platform_roles_deleted_at_idx
on public.platform_roles (deleted_at);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  platform_role_id uuid references public.platform_roles (id) on delete set null,
  full_name text,
  email text,
  avatar_url text,
  locale text not null default 'en',
  timezone text not null default 'UTC',
  onboarding_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_onboarding_status_check
    check (onboarding_status in (
      'pending',
      'workspace_created',
      'invitation_accepted',
      'complete'
    )),
  constraint profiles_locale_not_blank_check
    check (length(trim(locale)) > 0),
  constraint profiles_timezone_not_blank_check
    check (length(trim(timezone)) > 0)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create index profiles_platform_role_id_idx
on public.profiles (platform_role_id);

create index profiles_email_idx
on public.profiles (lower(email));

create index profiles_onboarding_status_idx
on public.profiles (onboarding_status);

create index profiles_deleted_at_idx
on public.profiles (deleted_at);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name
  )
  values (
    new.id,
    lower(new.email),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();
