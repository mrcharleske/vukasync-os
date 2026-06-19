import { redirect } from "next/navigation";
import { AppShell, PageHeader, SectionCard } from "@/components/app-shell";
import { requireAuthenticatedUser } from "../../../lib/auth/guards";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../../../lib/workspaces/context";

export default async function InviteTeamMemberPage() {
  const { supabase, user } = await requireAuthenticatedUser();
  const context = await getWorkspaceRouteContext(supabase, user.id);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  if (context.activeServiceCount === 0) {
    redirect(resolveWorkspaceRoute(context));
  }

  return (
    <AppShell>
      <PageHeader
        title="Invite Team Member"
        description="Invitation creation UI will be enabled in the next phase."
      />

      <SectionCard
        title="Invitation Foundation"
        description="Workspace invitation acceptance is active. Invitation sending UI is next."
      >
        <p>
          Use this area to invite team members in the next iteration. Current phase
          includes invitation acceptance flow and membership assignment.
        </p>
      </SectionCard>
    </AppShell>
  );
}
