import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "../../lib/auth/guards";
import { getFirstWorkspaceMembership } from "../../lib/workspaces/service";
import { acceptInvitation, createWorkspace } from "./actions";

type OnboardingProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingProps) {
  const { supabase, user } = await requireAuthenticatedUser();
  const membership = await getFirstWorkspaceMembership(supabase, user.id);
  const params = await searchParams;

  if (membership) {
    redirect(`/command-center?workspace=${membership.workspace_id}`);
  }

  return (
    <main>
      <h1>Workspace onboarding</h1>
      <p>Create your first workspace or accept an invitation.</p>
      {params?.error ? <p className="error">{params.error}</p> : null}

      <div className="card">
        <h2>Create Workspace</h2>
        <form action={createWorkspace}>
          <label>
            Workspace name
            <input name="workspaceName" placeholder="Acme Holdings" required />
          </label>
          <button className="button" type="submit">
            Create Workspace
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Accept Invitation</h2>
        <form action={acceptInvitation}>
          <label>
            Invitation token
            <input name="invitationToken" placeholder="Paste token" required />
          </label>
          <button className="button secondary" type="submit">
            Accept Invitation
          </button>
        </form>
      </div>
    </main>
  );
}
