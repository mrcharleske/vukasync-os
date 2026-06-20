import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../lib/supabase/server";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../lib/workspaces/context";

export default async function LandingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const context = await getWorkspaceRouteContext(supabase, user.id);
    redirect(resolveWorkspaceRoute(context));
  }

  return (
    <main>
      <h1>VukaSync OS</h1>
      <p>
        A workspace-based client portal and business services platform for global
        teams.
      </p>

      <div className="card">
        <h2>Get started</h2>
        <p>Authenticate first, then create or join your workspace.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/signup" className="button">
            Sign up
          </Link>
          <Link href="/login" className="button secondary">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
