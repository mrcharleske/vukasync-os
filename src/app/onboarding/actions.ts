"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import {
  getActiveWorkspaceServiceCount,
  toWorkspaceSlug
} from "../../lib/workspaces/service";
import { resolveWorkspaceRoute } from "../../lib/workspaces/context";

function toErrorPath(message: string) {
  const params = new URLSearchParams({ error: message });
  return `/onboarding?${params.toString()}`;
}

async function insertAuditEvent(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  payload: {
    workspaceId: string;
    actorProfileId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("audit_logs").insert({
    workspace_id: payload.workspaceId,
    actor_profile_id: payload.actorProfileId,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId,
    metadata: payload.metadata ?? {}
  });

  if (error) {
    throw new Error(`Failed to log audit event: ${error.message}`);
  }
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

  const { error: membershipError } = await supabase.from("workspace_members").upsert(
    {
      workspace_id: workspace.id,
      profile_id: user.id,
      role: "OWNER"
    },
    {
      onConflict: "workspace_id,profile_id"
    }
  );

  if (membershipError) {
    redirect(toErrorPath(membershipError.message));
  }

  try {
    await insertAuditEvent(supabase, {
      workspaceId: workspace.id,
      actorProfileId: user.id,
      action: "WORKSPACE_CREATED",
      entityType: "workspaces",
      entityId: workspace.id,
      metadata: {
        workspace_name: workspaceName
      }
    });
  } catch (error) {
    redirect(
      toErrorPath(
        error instanceof Error ? error.message : "Failed to create workspace."
      )
    );
  }

  redirect(`/service-selection?workspace=${workspace.id}`);
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

  if (!user.email_confirmed_at) {
    redirect("/auth/verify");
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

  const { error: membershipError } = await supabase.from("workspace_members").upsert(
    {
      workspace_id: invitation.workspace_id,
      profile_id: user.id,
      role: invitation.role
    },
    {
      onConflict: "workspace_id,profile_id"
    }
  );

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

  try {
    await insertAuditEvent(supabase, {
      workspaceId: invitation.workspace_id,
      actorProfileId: user.id,
      action: "INVITATION_ACCEPTED",
      entityType: "workspace_invitations",
      entityId: invitation.id,
      metadata: {
        invitation_email: invitation.email
      }
    });
  } catch (error) {
    redirect(
      toErrorPath(
        error instanceof Error
          ? error.message
          : "Failed to accept invitation."
      )
    );
  }

  const activeServiceCount = await getActiveWorkspaceServiceCount(
    supabase,
    invitation.workspace_id
  );

  redirect(
    resolveWorkspaceRoute({
      workspaceId: invitation.workspace_id,
      activeServiceCount
    })
  );
}
