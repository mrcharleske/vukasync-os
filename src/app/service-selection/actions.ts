"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import {
  getActiveWorkspaceServiceCount,
  getWorkspaceMembership
} from "../../lib/workspaces/service";
import { resolveWorkspaceRoute } from "../../lib/workspaces/context";

function toErrorPath(message: string, workspaceId: string) {
  const params = new URLSearchParams({
    error: message,
    workspace: workspaceId
  });
  return `/service-selection?${params.toString()}`;
}

export async function saveSelectedServices(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const selectedServiceIds = Array.from(
    new Set(
      formData
        .getAll("serviceIds")
        .map((value) => String(value))
        .filter(Boolean)
    )
  );

  if (!workspaceId) {
    redirect("/onboarding");
  }

  if (selectedServiceIds.length === 0) {
    redirect(toErrorPath("Select at least one service.", workspaceId));
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

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    redirect(toErrorPath("Only workspace admins can assign services.", workspaceId));
  }

  const { data: catalogRows, error: catalogError } = await supabase
    .from("service_catalog")
    .select("id")
    .in("id", selectedServiceIds);

  if (catalogError) {
    redirect(toErrorPath(catalogError.message, workspaceId));
  }

  if ((catalogRows ?? []).length !== selectedServiceIds.length) {
    redirect(toErrorPath("One or more selected services were not found.", workspaceId));
  }

  const { error: deleteError } = await supabaseAdmin
    .from("services")
    .delete()
    .eq("workspace_id", workspaceId);

  if (deleteError) {
    redirect(toErrorPath(deleteError.message, workspaceId));
  }

  const { data: insertedRows, error: insertError } = await supabaseAdmin
    .from("services")
    .insert(
      selectedServiceIds.map((catalogServiceId) => ({
        workspace_id: workspaceId,
        catalog_service_id: catalogServiceId,
        status: "ACTIVE"
      }))
    )
    .select("id, catalog_service_id");

  if (insertError) {
    redirect(toErrorPath(insertError.message, workspaceId));
  }

  if (insertedRows && insertedRows.length > 0) {
    const { error: auditError } = await supabaseAdmin.from("audit_logs").insert(
      insertedRows.map((row) => ({
        workspace_id: workspaceId,
        actor_profile_id: user.id,
        action: "SERVICE_ASSIGNED",
        entity_type: "services",
        entity_id: row.id,
        metadata: {
          catalog_service_id: row.catalog_service_id
        }
      }))
    );

    if (auditError) {
      redirect(toErrorPath(auditError.message, workspaceId));
    }
  }

  const activeServiceCount = await getActiveWorkspaceServiceCount(
    supabase,
    workspaceId
  );

  redirect(
    resolveWorkspaceRoute({
      workspaceId,
      activeServiceCount
    })
  );
}
