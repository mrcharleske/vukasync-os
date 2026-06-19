import type { SupabaseClient } from "@supabase/supabase-js";

export async function getFirstWorkspaceMembership(
  supabase: SupabaseClient,
  profileId: string
) {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load workspace membership: ${error.message}`);
  }

  return data;
}

export async function getWorkspaceById(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name, slug, status")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load workspace: ${error.message}`);
  }

  return data;
}

export function toWorkspaceSlug(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
