import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

function shouldRetryWithAdmin(errorMessage: string, tableName: string) {
  return errorMessage.includes(
    `Could not find the table 'public.${tableName}' in the schema cache`
  );
}

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
    if (shouldRetryWithAdmin(error.message, "clients")) {
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from("clients")
        .select(
          "id, workspace_id, client_name, business_name, contact_email, phone, country, timezone, notes, created_at, updated_at"
        )
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (!adminError) {
        return adminData ?? [];
      }
    }

    throw new Error(`Failed to load clients: ${error.message}`);
  }

  return data ?? [];
}
