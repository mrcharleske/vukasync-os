import type { SupabaseClient } from "@supabase/supabase-js";

export async function getWorkspaceClients(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, workspace_id, client_name, business_name, contact_email, phone, country, timezone, notes, created_at, updated_at"
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load clients: ${error.message}`);
  }

  return data ?? [];
}
