create policy "audit_logs_insert_invitation_acceptance_members"
on public.audit_logs
for insert
to authenticated
with check (
  action = 'INVITATION_ACCEPTED'
  and workspace_id is not null
  and actor_profile_id = auth.uid()
  and public.is_workspace_member(workspace_id)
);
