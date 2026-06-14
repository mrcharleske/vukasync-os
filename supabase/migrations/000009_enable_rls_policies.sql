-- Phase 3C: Row Level Security helper functions and policies.

create or replace function public.has_platform_role(role_keys text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.platform_roles pr on pr.id = p.platform_role_id
    where p.id = auth.uid()
      and p.deleted_at is null
      and pr.deleted_at is null
      and pr.key = any(role_keys)
  );
$$;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.profile_id = auth.uid()
      and wm.status = 'active'
      and wm.deleted_at is null
  );
$$;

create or replace function public.has_workspace_role(
  target_workspace_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.profile_id = auth.uid()
      and wm.status = 'active'
      and wm.deleted_at is null
      and wm.role = any(allowed_roles)
  );
$$;

create or replace function public.can_manage_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
    or public.has_workspace_role(target_workspace_id, array['OWNER']);
$$;

create or replace function public.validate_workspace_invitation_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.can_manage_workspace(old.workspace_id) then
    return new;
  end if;

  if old.email = public.current_user_email()
    and public.current_user_email_verified()
    and new.workspace_id = old.workspace_id
    and new.email = old.email
    and new.role = old.role
    and new.token_hash = old.token_hash
    and new.invited_by = old.invited_by
    and new.expires_at is not distinct from old.expires_at
    and new.created_at = old.created_at
    and new.deleted_at is not distinct from old.deleted_at
    and new.status = 'accepted'
    and new.accepted_by = auth.uid()
  then
    new.accepted_at = coalesce(new.accepted_at, now());
    return new;
  end if;

  raise exception 'workspace invitation update is not allowed';
end;
$$;

create trigger workspace_invitations_validate_update
before update on public.workspace_invitations
for each row
execute function public.validate_workspace_invitation_update();

create or replace function public.audit_workspace_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    workspace_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    visibility,
    source,
    after_state
  )
  values (
    new.id,
    new.created_by,
    'WORKSPACE_CREATED',
    'workspaces',
    new.id,
    'workspace',
    'manual',
    to_jsonb(new)
  );

  return new;
end;
$$;

create trigger workspaces_audit_created
after insert on public.workspaces
for each row
execute function public.audit_workspace_created();

create or replace function public.audit_workspace_invitation_sent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    workspace_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    visibility,
    source,
    after_state
  )
  values (
    new.workspace_id,
    new.invited_by,
    'INVITATION_SENT',
    'workspace_invitations',
    new.id,
    'workspace',
    'manual',
    to_jsonb(new) - 'token_hash'
  );

  return new;
end;
$$;

create trigger workspace_invitations_audit_sent
after insert on public.workspace_invitations
for each row
execute function public.audit_workspace_invitation_sent();

create or replace function public.audit_workspace_invitation_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status and new.status = 'accepted' then
    insert into public.audit_logs (
      workspace_id,
      actor_id,
      action,
      entity_type,
      entity_id,
      visibility,
      source,
      before_state,
      after_state
    )
    values (
      new.workspace_id,
      new.accepted_by,
      'INVITATION_ACCEPTED',
      'workspace_invitations',
      new.id,
      'workspace',
      'manual',
      to_jsonb(old) - 'token_hash',
      to_jsonb(new) - 'token_hash'
    );
  end if;

  return new;
end;
$$;

create trigger workspace_invitations_audit_accepted
after update on public.workspace_invitations
for each row
execute function public.audit_workspace_invitation_accepted();

create or replace function public.audit_service_assigned()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    workspace_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    visibility,
    source,
    after_state
  )
  values (
    new.workspace_id,
    new.assigned_by,
    'SERVICE_ASSIGNED',
    'workspace_services',
    new.id,
    'workspace',
    'manual',
    to_jsonb(new)
  );

  return new;
end;
$$;

create trigger workspace_services_audit_assigned
after insert on public.workspace_services
for each row
execute function public.audit_service_assigned();

create or replace function public.audit_subscription_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    workspace_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    visibility,
    source,
    after_state
  )
  values (
    new.workspace_id,
    new.created_by,
    'SUBSCRIPTION_CREATED',
    'subscriptions',
    new.id,
    'workspace',
    'manual',
    to_jsonb(new)
  );

  return new;
end;
$$;

create trigger subscriptions_audit_created
after insert on public.subscriptions
for each row
execute function public.audit_subscription_created();

create or replace function public.audit_subscription_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    workspace_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    visibility,
    source,
    before_state,
    after_state
  )
  values (
    new.workspace_id,
    new.created_by,
    'SUBSCRIPTION_CHANGED',
    'subscriptions',
    new.id,
    'workspace',
    'manual',
    to_jsonb(old),
    to_jsonb(new)
  );

  return new;
end;
$$;

create trigger subscriptions_audit_changed
after update on public.subscriptions
for each row
execute function public.audit_subscription_changed();

create or replace function public.audit_workspace_member_role_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role then
    insert into public.audit_logs (
      workspace_id,
      actor_id,
      action,
      entity_type,
      entity_id,
      visibility,
      source,
      before_state,
      after_state
    )
    values (
      new.workspace_id,
      auth.uid(),
      'ROLE_CHANGED',
      'workspace_members',
      new.id,
      'workspace',
      'manual',
      to_jsonb(old),
      to_jsonb(new)
    );
  end if;

  return new;
end;
$$;

create trigger workspace_members_audit_role_changed
after update on public.workspace_members
for each row
execute function public.audit_workspace_member_role_changed();

alter table public.platform_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.services enable row level security;
alter table public.workspace_services enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_events enable row level security;
alter table public.audit_logs enable row level security;

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.platform_roles to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.workspaces to authenticated;
grant select, insert, update on public.workspace_members to authenticated;
grant select, insert, update on public.workspace_invitations to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update on public.workspace_services to authenticated;
grant select, insert, update, delete on public.plans to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert on public.subscription_events to authenticated;
grant select, insert on public.audit_logs to authenticated;

create policy platform_roles_select_authenticated
on public.platform_roles
for select
to authenticated
using (deleted_at is null);

create policy platform_roles_manage_platform_admins
on public.platform_roles
for all
to authenticated
using (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']))
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid() and deleted_at is null);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and platform_role_id is null
);

create policy workspaces_select_members
on public.workspaces
for select
to authenticated
using (
  deleted_at is null
  and (
    public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
    or public.is_workspace_member(id)
  )
);

create policy workspaces_insert_verified_users
on public.workspaces
for insert
to authenticated
with check (
  public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
  or (
    created_by = auth.uid()
    and public.current_user_email_verified()
  )
);

create policy workspaces_update_managers
on public.workspaces
for update
to authenticated
using (public.can_manage_workspace(id))
with check (public.can_manage_workspace(id));

create policy workspace_members_select_own_or_managers
on public.workspace_members
for select
to authenticated
using (
  deleted_at is null
  and (
    profile_id = auth.uid()
    or public.can_manage_workspace(workspace_id)
  )
);

create policy workspace_members_insert_managers
on public.workspace_members
for insert
to authenticated
with check (public.can_manage_workspace(workspace_id));

create policy workspace_members_update_managers
on public.workspace_members
for update
to authenticated
using (public.can_manage_workspace(workspace_id))
with check (public.can_manage_workspace(workspace_id));

create policy workspace_invitations_select_invitees_or_managers
on public.workspace_invitations
for select
to authenticated
using (
  deleted_at is null
  and (
    public.can_manage_workspace(workspace_id)
    or email = public.current_user_email()
  )
);

create policy workspace_invitations_insert_owners
on public.workspace_invitations
for insert
to authenticated
with check (
  public.can_manage_workspace(workspace_id)
  and (
    public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
    or invited_by = auth.uid()
  )
);

create policy workspace_invitations_update_managers_or_verified_invitees
on public.workspace_invitations
for update
to authenticated
using (
  public.can_manage_workspace(workspace_id)
  or email = public.current_user_email()
)
with check (
  public.can_manage_workspace(workspace_id)
  or (
    email = public.current_user_email()
    and public.current_user_email_verified()
    and status = 'accepted'
    and accepted_by = auth.uid()
  )
);

create policy services_select_active
on public.services
for select
to authenticated
using (
  deleted_at is null
  and (
    status = 'active'
    or public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
  )
);

create policy services_manage_platform_admins
on public.services
for all
to authenticated
using (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']))
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy workspace_services_select_members
on public.workspace_services
for select
to authenticated
using (
  deleted_at is null
  and (
    public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
    or public.is_workspace_member(workspace_id)
  )
);

create policy workspace_services_insert_managers
on public.workspace_services
for insert
to authenticated
with check (public.can_manage_workspace(workspace_id));

create policy workspace_services_update_managers
on public.workspace_services
for update
to authenticated
using (public.can_manage_workspace(workspace_id))
with check (public.can_manage_workspace(workspace_id));

create policy plans_select_active
on public.plans
for select
to authenticated
using (
  deleted_at is null
  and (
    status = 'active'
    or public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
  )
);

create policy plans_manage_platform_admins
on public.plans
for all
to authenticated
using (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']))
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy subscriptions_select_owners_or_platform_admins
on public.subscriptions
for select
to authenticated
using (
  deleted_at is null
  and (
    public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
    or public.has_workspace_role(workspace_id, array['OWNER'])
  )
);

create policy subscriptions_insert_platform_admins
on public.subscriptions
for insert
to authenticated
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy subscriptions_update_platform_admins
on public.subscriptions
for update
to authenticated
using (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']))
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy subscription_events_select_owners_or_platform_admins
on public.subscription_events
for select
to authenticated
using (
  public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
  or public.has_workspace_role(workspace_id, array['OWNER'])
);

create policy subscription_events_insert_platform_admins
on public.subscription_events
for insert
to authenticated
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));

create policy audit_logs_select_platform_or_workspace_visible
on public.audit_logs
for select
to authenticated
using (
  public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN'])
  or (
    workspace_id is not null
    and visibility = 'workspace'
    and public.is_workspace_member(workspace_id)
  )
);

create policy audit_logs_insert_platform_admins
on public.audit_logs
for insert
to authenticated
with check (public.has_platform_role(array['SUPER_ADMIN', 'PLATFORM_ADMIN']));
