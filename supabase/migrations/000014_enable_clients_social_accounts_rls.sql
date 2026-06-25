alter table public.clients enable row level security;
alter table public.client_assignments enable row level security;
alter table public.social_accounts enable row level security;

create or replace function public.has_client_assignment(target_client_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.client_assignments ca
    where ca.client_id = target_client_id
      and ca.profile_id = auth.uid()
  );
$$;

create or replace function public.has_client_write_permission(target_client_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.client_assignments ca
    where ca.client_id = target_client_id
      and ca.profile_id = auth.uid()
      and ca.permission = 'EDITOR'
  );
$$;

revoke all on function public.has_client_assignment(uuid) from public;
revoke all on function public.has_client_write_permission(uuid) from public;
grant execute on function public.has_client_assignment(uuid) to authenticated;
grant execute on function public.has_client_write_permission(uuid) to authenticated;

create policy "clients_select_admins_or_assigned"
on public.clients
for select
to authenticated
using (
  public.is_workspace_admin(workspace_id)
  or public.has_client_assignment(id)
);

create policy "clients_insert_admins"
on public.clients
for insert
to authenticated
with check (public.is_workspace_admin(workspace_id));

create policy "clients_update_admins_or_editors"
on public.clients
for update
to authenticated
using (
  public.is_workspace_admin(workspace_id)
  or public.has_client_write_permission(id)
)
with check (
  public.is_workspace_admin(workspace_id)
  or public.has_client_write_permission(id)
);

create policy "clients_delete_admins_or_editors"
on public.clients
for delete
to authenticated
using (
  public.is_workspace_admin(workspace_id)
  or public.has_client_write_permission(id)
);

create policy "client_assignments_select_admin_or_self"
on public.client_assignments
for select
to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1
    from public.clients c
    where c.id = client_id
      and public.is_workspace_admin(c.workspace_id)
  )
);

create policy "client_assignments_insert_admins"
on public.client_assignments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and public.is_workspace_admin(c.workspace_id)
  )
);

create policy "client_assignments_update_admins"
on public.client_assignments
for update
to authenticated
using (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and public.is_workspace_admin(c.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and public.is_workspace_admin(c.workspace_id)
  )
);

create policy "client_assignments_delete_admins"
on public.client_assignments
for delete
to authenticated
using (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and public.is_workspace_admin(c.workspace_id)
  )
);

create policy "social_accounts_select_admins_or_assigned"
on public.social_accounts
for select
to authenticated
using (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and (
        public.is_workspace_admin(c.workspace_id)
        or public.has_client_assignment(c.id)
      )
  )
);

create policy "social_accounts_insert_admins_or_editors"
on public.social_accounts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and (
        public.is_workspace_admin(c.workspace_id)
        or public.has_client_write_permission(c.id)
      )
  )
);

create policy "social_accounts_update_admins_or_editors"
on public.social_accounts
for update
to authenticated
using (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and (
        public.is_workspace_admin(c.workspace_id)
        or public.has_client_write_permission(c.id)
      )
  )
)
with check (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and (
        public.is_workspace_admin(c.workspace_id)
        or public.has_client_write_permission(c.id)
      )
  )
);

create policy "social_accounts_delete_admins_or_editors"
on public.social_accounts
for delete
to authenticated
using (
  exists (
    select 1
    from public.clients c
    where c.id = client_id
      and (
        public.is_workspace_admin(c.workspace_id)
        or public.has_client_write_permission(c.id)
      )
  )
);
