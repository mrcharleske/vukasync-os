import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { requireAuthenticatedUser } from "../../../lib/auth/guards";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../../../lib/workspaces/context";
import { getWorkspaceById } from "../../../lib/workspaces/service";

export default async function InviteTeamMemberPage() {
  const { supabase, user } = await requireAuthenticatedUser();
  const context = await getWorkspaceRouteContext(supabase, user.id);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  if (context.activeServiceCount === 0) {
    redirect(resolveWorkspaceRoute(context));
  }

  const workspace = await getWorkspaceById(supabase, context.workspaceId);

  return (
    <DashboardShell
      userName={user.email ?? "User"}
      workspaceName={workspace?.name ?? "Workspace"}
    >
      <div className="dashboard-stack">
        <PageHeader
          eyebrow="Team"
          title="Invite Team Member"
          subtitle="Invitation creation UI will be enabled in the next phase."
        />
        <Card className="section-card-modern">
          <SectionHeader
            title="Invitation Foundation"
            description="Invitation acceptance is active. Sending UI follows next."
          />
          <EmptyState
            title="Invitation sending UI coming soon"
            description="This module is intentionally scoped out for this phase and will be enabled next."
          />
        </Card>
      </div>
    </DashboardShell>
  );
}
