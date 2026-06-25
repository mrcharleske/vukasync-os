"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  isAccountStatus,
  isConnectionType,
  isSocialPlatform
} from "@/lib/social-media/constants";
import { getWorkspaceMembership } from "@/lib/workspaces/service";

function toAccountsPath(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/social-media/accounts?${search.toString()}`;
}

function normalizeOptional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function isWorkspaceAdmin(role: string) {
  return role === "OWNER" || role === "ADMIN";
}

async function getAssignmentPermission(clientId: string, profileId: string) {
  const { data, error } = await supabaseAdmin
    .from("client_assignments")
    .select("permission")
    .eq("client_id", clientId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load client assignment: ${error.message}`);
  }

  return data?.permission ?? null;
}

export async function createSocialAccount(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const platform = String(formData.get("platform") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const connectionType = String(formData.get("connectionType") ?? "").trim();
  const accountStatus = String(formData.get("accountStatus") ?? "").trim();
  const metadataRaw = String(formData.get("metadata") ?? "").trim();

  if (!workspaceId || !clientId || !platform || !username) {
    redirect(
      toAccountsPath({
        error: "Workspace, client, platform, and username are required."
      })
    );
  }

  if (
    !isSocialPlatform(platform) ||
    !isConnectionType(connectionType) ||
    !isAccountStatus(accountStatus)
  ) {
    redirect(
      toAccountsPath({
        error: "Invalid platform or connection details provided."
      })
    );
  }

  let metadata: Record<string, unknown> = {};
  if (metadataRaw) {
    try {
      const parsed = JSON.parse(metadataRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        metadata = parsed as Record<string, unknown>;
      } else {
        throw new Error("Metadata must be a JSON object.");
      }
    } catch {
      redirect(
        toAccountsPath({
          error: "Metadata must be valid JSON."
        })
      );
    }
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await getWorkspaceMembership(supabase, user.id, workspaceId);
  if (!membership) {
    redirect("/onboarding");
  }

  const { data: clientRow, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id, workspace_id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientError || !clientRow || clientRow.workspace_id !== workspaceId) {
    redirect(
      toAccountsPath({
        error: clientError?.message ?? "Selected client is invalid."
      })
    );
  }

  const assignmentPermission = await getAssignmentPermission(clientId, user.id);
  const canManage =
    isWorkspaceAdmin(membership.role) || assignmentPermission === "EDITOR";

  if (!canManage) {
    redirect(
      toAccountsPath({
        error: "You do not have permission to add social accounts for this client."
      })
    );
  }

  const { data: account, error: insertError } = await supabaseAdmin
    .from("social_accounts")
    .insert({
      client_id: clientId,
      platform,
      username,
      profile_url: normalizeOptional(formData.get("profileUrl")),
      connection_type: connectionType,
      account_status: accountStatus,
      metadata
    })
    .select("id")
    .single();

  if (insertError || !account) {
    redirect(
      toAccountsPath({
        error: insertError?.message ?? "Failed to create social account."
      })
    );
  }

  await supabaseAdmin.from("audit_logs").insert({
    workspace_id: workspaceId,
    actor_profile_id: user.id,
    action: "SOCIAL_ACCOUNT_CREATED",
    entity_type: "social_accounts",
    entity_id: account.id,
    metadata: {
      client_id: clientId,
      platform
    }
  });

  redirect(
    toAccountsPath({
      success: "Social account added successfully.",
      platform
    })
  );
}
