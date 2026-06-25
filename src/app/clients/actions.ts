"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWorkspaceMembership } from "@/lib/workspaces/service";

function toClientsPath(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/clients?${search.toString()}`;
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

export async function createClient(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();

  if (!workspaceId || !clientName || !businessName) {
    redirect(
      toClientsPath({
        error: "Workspace, client name, and business name are required."
      })
    );
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

  if (!isWorkspaceAdmin(membership.role)) {
    redirect(
      toClientsPath({
        error: "Only workspace owners and admins can create clients."
      })
    );
  }

  const { data: clientRow, error: clientError } = await supabaseAdmin
    .from("clients")
    .insert({
      workspace_id: workspaceId,
      client_name: clientName,
      business_name: businessName,
      contact_email: normalizeOptional(formData.get("contactEmail")),
      phone: normalizeOptional(formData.get("phone")),
      country: normalizeOptional(formData.get("country")),
      timezone: normalizeOptional(formData.get("timezone")),
      notes: normalizeOptional(formData.get("notes"))
    })
    .select("id")
    .single();

  if (clientError || !clientRow) {
    redirect(
      toClientsPath({
        error: clientError?.message ?? "Failed to create client."
      })
    );
  }

  await supabaseAdmin.from("client_assignments").upsert(
    {
      client_id: clientRow.id,
      profile_id: user.id,
      permission: "EDITOR"
    },
    {
      onConflict: "client_id,profile_id"
    }
  );

  await supabaseAdmin.from("audit_logs").insert({
    workspace_id: workspaceId,
    actor_profile_id: user.id,
    action: "CLIENT_CREATED",
    entity_type: "clients",
    entity_id: clientRow.id,
    metadata: {
      business_name: businessName
    }
  });

  redirect(
    toClientsPath({
      success: "Client created successfully."
    })
  );
}

export async function updateClient(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "").trim();
  if (!clientId) {
    redirect(
      toClientsPath({
        error: "Client ID is required."
      })
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existingClient, error: existingClientError } = await supabaseAdmin
    .from("clients")
    .select("id, workspace_id")
    .eq("id", clientId)
    .maybeSingle();

  if (existingClientError || !existingClient) {
    redirect(
      toClientsPath({
        error: existingClientError?.message ?? "Client not found."
      })
    );
  }

  const membership = await getWorkspaceMembership(
    supabase,
    user.id,
    existingClient.workspace_id
  );
  if (!membership) {
    redirect("/onboarding");
  }

  const assignmentPermission = await getAssignmentPermission(clientId, user.id);
  const canEdit =
    isWorkspaceAdmin(membership.role) || assignmentPermission === "EDITOR";

  if (!canEdit) {
    redirect(
      toClientsPath({
        error: "You do not have permission to edit this client."
      })
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("clients")
    .update({
      client_name: String(formData.get("clientName") ?? "").trim(),
      business_name: String(formData.get("businessName") ?? "").trim(),
      contact_email: normalizeOptional(formData.get("contactEmail")),
      phone: normalizeOptional(formData.get("phone")),
      country: normalizeOptional(formData.get("country")),
      timezone: normalizeOptional(formData.get("timezone")),
      notes: normalizeOptional(formData.get("notes"))
    })
    .eq("id", clientId);

  if (updateError) {
    redirect(
      toClientsPath({
        error: updateError.message
      })
    );
  }

  await supabaseAdmin.from("audit_logs").insert({
    workspace_id: existingClient.workspace_id,
    actor_profile_id: user.id,
    action: "CLIENT_UPDATED",
    entity_type: "clients",
    entity_id: clientId
  });

  redirect(
    toClientsPath({
      success: "Client updated successfully."
    })
  );
}
