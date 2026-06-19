import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getActiveWorkspaceServiceCount,
  getFirstWorkspaceMembership,
  getWorkspaceById
} from "./service";

export type WorkspaceRouteContext = {
  workspaceId: string | null;
  activeServiceCount: number;
};

export function resolveWorkspaceRoute(context: WorkspaceRouteContext) {
  if (!context.workspaceId) {
    return "/onboarding";
  }

  if (context.activeServiceCount === 0) {
    return `/service-selection?workspace=${context.workspaceId}`;
  }

  return `/command-center?workspace=${context.workspaceId}`;
}

export async function getWorkspaceRouteContext(
  supabase: SupabaseClient,
  profileId: string
): Promise<WorkspaceRouteContext> {
  const membership = await getFirstWorkspaceMembership(supabase, profileId);
  if (!membership) {
    return {
      workspaceId: null,
      activeServiceCount: 0
    };
  }

  const workspace = await getWorkspaceById(supabase, membership.workspace_id);
  if (!workspace) {
    return {
      workspaceId: null,
      activeServiceCount: 0
    };
  }

  const activeServiceCount = await getActiveWorkspaceServiceCount(
    supabase,
    workspace.id
  );

  return {
    workspaceId: workspace.id,
    activeServiceCount
  };
}
