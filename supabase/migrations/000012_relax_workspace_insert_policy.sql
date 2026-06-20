create policy "workspaces_insert_verified_creator_relaxed"
on public.workspaces
for insert
to authenticated
with check (public.requesting_user_email_verified());
