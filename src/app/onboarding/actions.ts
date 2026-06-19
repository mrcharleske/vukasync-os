"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { toWorkspaceSlug } from "../../lib/workspaces/service";

function toErrorPath(message: string) {
  const params = new URLSearchParams({ error: message });
  return `/onboarding?${params.toString()}`;
}

export async function createWorkspace(formData: FormData) {
  const workspaceName = String(formData.get("workspaceName") ?? "").trim();

  if (!workspaceName) {
    redirect(toErrorPath("Workspace name is required."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.email_confirmed_at) {
    redirect("/auth/verify");
  }

  const slug = toWorkspaceSlug(workspaceName);
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: workspaceName,
      slug,
      created_by: user.id
    })
    .select("id")
    .single();

  if (workspaceError || !workspace) {
    redirect(toErrorPath(workspaceError?.message ?? "Failed to create workspace."));
  }

  const { error: membershipError } = await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    profile_id: user.id,
    role: "OWNER"
  });

  if (membershipError) {
    redirect(toErrorPath(membershipError.message));
  }

  redirect(`/command-center?workspace=${workspace.id}`);
}

export async function acceptInvitation(formData: FormData) {
  const token = String(formData.get("invitationToken") ?? "").trim();

  if (!token) {
    redirect(toErrorPath("Invitation token is required."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: invitation, error: invitationError } = await supabase
    .from("workspace_invitations")
    .select("id, workspace_id, role, email, status, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (invitationError || !invitation) {
    redirect(toErrorPath("Invitation not found."));
  }

  if (invitation.status !== "PENDING") {
    redirect(toErrorPath("Invitation is no longer active."));
  }

  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    redirect(toErrorPath("Invitation has expired."));
  }

  if ((user.email ?? "").toLowerCase() !== invitation.email.toLowerCase()) {
    redirect(toErrorPath("Invitation email does not match this account."));
  }

  const { error: membershipError } = await supabase.from("workspace_members").upsert({
    workspace_id: invitation.workspace_id,
    profile_id: user.id,
    role: invitation.role
  });

  if (membershipError) {
    redirect(toErrorPath(membershipError.message));
  }

  const { error: updateInvitationError } = await supabase
    .from("workspace_invitations")
    .update({
      status: "ACCEPTED",
      accepted_by: user.id
    })
    .eq("id", invitation.id);

  if (updateInvitationError) {
    redirect(toErrorPath(updateInvitationError.message));
  }

  redirect(`/command-center?workspace=${invitation.workspace_id}`);
}
