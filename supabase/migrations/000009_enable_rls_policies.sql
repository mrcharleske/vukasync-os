alter table public.platform_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.service_catalog enable row level security;
alter table public.services enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

create policy "platform_roles_read_authenticated"
on public.platform_roles
for select
to authenticated
using (true);

create policy "profiles_select_self"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "workspaces_select_members"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

create policy "workspaces_insert_verified_creator"
on public.workspaces
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.requesting_user_email_verified()
);

create policy "workspaces_update_admins"
on public.workspaces
for update
to authenticated
using (public.is_workspace_admin(id))
with check (public.is_workspace_admin(id));

create policy "workspace_members_select_members"
on public.workspace_members
for select
to authenticated
using (
  profile_id = auth.uid()
  or public.is_workspace_admin(workspace_id)
);

create policy "workspace_members_insert_self_owner_for_new_workspace"
on public.workspace_members
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and role = 'OWNER'
  and exists (
    select 1
    from public.workspaces w
    where w.id = workspace_id
      and w.created_by = auth.uid()
  )
);

create policy "workspace_members_insert_admins"
on public.workspace_members
for insert
to authenticated
with check (public.is_workspace_admin(workspace_id));

create policy "workspace_members_update_admins"
on public.workspace_members
for update
to authenticated
using (public.is_workspace_admin(workspace_id))
with check (public.is_workspace_admin(workspace_id));

create policy "workspace_members_delete_admins"
on public.workspace_members
for delete
to authenticated
using (public.is_workspace_admin(workspace_id));

create policy "workspace_invitations_select_invitee_or_admin"
on public.workspace_invitations
for select
to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_workspace_admin(workspace_id)
);

create policy "workspace_invitations_insert_admin"
on public.workspace_invitations
for insert
to authenticated
with check (public.is_workspace_admin(workspace_id));

create policy "workspace_invitations_update_invitee_or_admin"
on public.workspace_invitations
for update
to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_workspace_admin(workspace_id)
)
with check (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_workspace_admin(workspace_id)
);

create policy "service_catalog_read_authenticated"
on public.service_catalog
for select
to authenticated
using (true);

create policy "services_select_members"
on public.services
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "services_mutate_admins"
on public.services
for all
to authenticated
using (public.is_workspace_admin(workspace_id))
with check (public.is_workspace_admin(workspace_id));

create policy "subscription_plans_read_authenticated"
on public.subscription_plans
for select
to authenticated
using (true);

create policy "subscriptions_select_members"
on public.subscriptions
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "subscriptions_mutate_admins"
on public.subscriptions
for all
to authenticated
using (public.is_workspace_admin(workspace_id))
with check (public.is_workspace_admin(workspace_id));

create policy "audit_logs_select_members"
on public.audit_logs
for select
to authenticated
using (
  workspace_id is null
  or public.is_workspace_member(workspace_id)
);

create policy "audit_logs_insert_admins"
on public.audit_logs
for insert
to authenticated
with check (
  workspace_id is null
  or public.is_workspace_admin(workspace_id)
);
