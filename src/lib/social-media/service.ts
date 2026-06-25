import type { SupabaseClient } from "@supabase/supabase-js";
import type { SocialPlatform } from "./constants";

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
    throw new Error(`Failed to load social accounts: ${error.message}`);
  }

  return data ?? [];
}
