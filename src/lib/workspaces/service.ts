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

export async function getWorkspaceMembership(
  supabase: SupabaseClient,
  profileId: string,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("profile_id", profileId)
    .eq("workspace_id", workspaceId)
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

export async function getActiveWorkspaceServiceCount(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { count, error } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("status", "ACTIVE");

  if (error) {
    throw new Error(`Failed to load workspace service count: ${error.message}`);
  }

  return count ?? 0;
}

export async function getWorkspaceServices(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("services")
    .select("id, status, catalog_service:service_catalog(id, code, name)")
    .eq("workspace_id", workspaceId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load workspace services: ${error.message}`);
  }

  return data ?? [];
}

export async function getWorkspaceMemberCount(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { count, error } = await supabase
    .from("workspace_members")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (error) {
    throw new Error(`Failed to load workspace member count: ${error.message}`);
  }

  return count ?? 0;
}

export async function getLatestWorkspaceSubscription(
  supabase: SupabaseClient,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "id, status, starts_at, ends_at, subscription_plan:subscription_plans(name, code)"
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load workspace subscription: ${error.message}`);
  }

  return data;
}

export async function getRecentWorkspaceActivity(
  supabase: SupabaseClient,
  workspaceId: string,
  limit = 5
) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, metadata, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load workspace activity: ${error.message}`);
  }

  return data ?? [];
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
