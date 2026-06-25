import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SocialPlatform } from "./constants";

function shouldRetryWithAdmin(errorMessage: string, tableName: string) {
  return errorMessage.includes(
    `Could not find the table 'public.${tableName}' in the schema cache`
  );
}

export async function getWorkspaceSocialAccounts(
  supabase: SupabaseClient,
  workspaceId: string,
  platform?: SocialPlatform
) {
  let query = supabase
    .from("social_accounts")
    .select(
      "id, client_id, platform, username, profile_url, connection_type, account_status, metadata, created_at, clients!inner(id, workspace_id, client_name, business_name)"
    )
    .eq("clients.workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;
  if (error) {
    if (shouldRetryWithAdmin(error.message, "social_accounts")) {
      let adminQuery = supabaseAdmin
        .from("social_accounts")
        .select(
          "id, client_id, platform, username, profile_url, connection_type, account_status, metadata, created_at, clients!inner(id, workspace_id, client_name, business_name)"
        )
        .eq("clients.workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (platform) {
        adminQuery = adminQuery.eq("platform", platform);
      }

      const { data: adminData, error: adminError } = await adminQuery;
      if (!adminError) {
        return adminData ?? [];
      }
    }

    throw new Error(`Failed to load social accounts: ${error.message}`);
  }

  return data ?? [];
}
