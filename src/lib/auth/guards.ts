import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../workspaces/context";

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function redirectIfAuthenticated() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const context = await getWorkspaceRouteContext(supabase, user.id);
    redirect(resolveWorkspaceRoute(context));
  }
}
