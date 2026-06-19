do $$
begin
  if not exists (select 1 from pg_type where typname = 'workspace_status') then
    create type public.workspace_status as enum ('PENDING', 'ACTIVE', 'SUSPENDED');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'workspace_membership_role') then
    create type public.workspace_membership_role as enum ('OWNER', 'ADMIN', 'MEMBER');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'invitation_status') then
    create type public.invitation_status as enum ('PENDING', 'ACCEPTED', 'EXPIRED');
  end if;
end $$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.workspace_status not null default 'PENDING',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_members (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.workspace_membership_role not null default 'MEMBER',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, profile_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role public.workspace_membership_role not null default 'MEMBER',
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  status public.invitation_status not null default 'PENDING',
  invited_by uuid references public.profiles (id) on delete set null,
  accepted_by uuid references public.profiles (id) on delete set null,
  expires_at timestamptz not null default timezone('utc', now()) + interval '14 day',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_workspace_members_profile_id
  on public.workspace_members (profile_id);

create index if not exists idx_workspace_invitations_email
  on public.workspace_invitations (lower(email));

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row
execute procedure public.set_updated_at();

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.profile_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.profile_id = auth.uid()
      and wm.role in ('OWNER', 'ADMIN')
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_admin(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid) to authenticated;
