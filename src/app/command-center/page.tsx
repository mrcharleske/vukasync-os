import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "../../lib/auth/guards";
import {
  getFirstWorkspaceMembership,
  getWorkspaceById
} from "../../lib/workspaces/service";

type CommandCenterProps = {
  searchParams: Promise<{
    workspace?: string;
  }>;
};

export default async function CommandCenterPage({
  searchParams
}: CommandCenterProps) {
  const { supabase, user } = await requireAuthenticatedUser();
  const params = await searchParams;

  const membership = await getFirstWorkspaceMembership(supabase, user.id);
  if (!membership) {
    redirect("/onboarding");
  }

  const workspaceId = params?.workspace ?? membership.workspace_id;
  const workspace = await getWorkspaceById(supabase, workspaceId);
  if (!workspace) {
    redirect("/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const userName = profile?.full_name ?? user.email ?? "Founder";
  const greeting = `Good Morning, ${userName} 👋`;

  return (
    <main>
      <h1>{greeting}</h1>
      <p>Welcome to your VukaSync Business Command Center.</p>

      <div className="card">
        <p>
          <strong>Workspace:</strong> {workspace.name}
        </p>
        <p>
          <strong>Workspace status:</strong> {workspace.status}
        </p>
        <p>
          <strong>Account status:</strong>{" "}
          {user.email_confirmed_at ? "Email Verified" : "Verification Pending"}
        </p>
      </div>

      <div className="card">
        <h2>Quick actions</h2>
        <ul>
          <li>
            <Link href="/onboarding">Create Workspace</Link>
          </li>
          <li>
            <Link href="/onboarding">Accept Invitation</Link>
          </li>
        </ul>
        <form action="/auth/logout" method="post">
          <button className="button secondary" type="submit">
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}
