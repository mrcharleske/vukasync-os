import { redirect } from "next/navigation";
import { AppShell, PageHeader, SectionCard } from "@/components/app-shell";
import { requireAuthenticatedUser } from "../../lib/auth/guards";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../../lib/workspaces/context";
import { acceptInvitation, createWorkspace } from "./actions";

type OnboardingProps = {
  searchParams: Promise<{
    error?: string;
    token?: string;
  }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingProps) {
  const { supabase, user } = await requireAuthenticatedUser();
  const context = await getWorkspaceRouteContext(supabase, user.id);
  const params = await searchParams;

  if (context.workspaceId) {
    redirect(resolveWorkspaceRoute(context));
  }

  return (
    <AppShell>
      <PageHeader
        title="Workspace Onboarding"
        description="Create your first workspace or accept an invitation to join an existing one."
      />

      {params?.error ? <p className="error">{params.error}</p> : null}

      <div className="grid-two">
        <SectionCard
          title="Create Workspace"
          description="Start your VukaSync operating space and continue setup."
        >
          <form action={createWorkspace}>
            <label>
              Workspace name
              <input name="workspaceName" placeholder="Acme Holdings" required />
            </label>
            <button className="button" type="submit">
              Create Workspace
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Accept Invitation"
          description="Use your invitation token to join an existing workspace."
        >
          <form action={acceptInvitation}>
            <label>
              Invitation token
              <input
                defaultValue={params?.token}
                name="invitationToken"
                placeholder="Paste token"
                required
              />
            </label>
            <button className="button secondary" type="submit">
              Accept Invitation
            </button>
          </form>
        </SectionCard>
      </div>
    </AppShell>
  );
}
