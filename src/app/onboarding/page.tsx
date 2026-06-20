import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
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
    <main className="app-page">
      <div className="app-page-inner">
        <PageHeader
          title="Workspace onboarding"
          subtitle="Create your first workspace or accept an invitation to join one."
        />

        {params?.error ? <p className="error">{params.error}</p> : null}

        <div className="responsive-two-column">
          <Card className="section-card-modern">
            <SectionHeader
              title="Create Workspace"
              description="Start your VukaSync operating space and continue setup."
            />
            <form action={createWorkspace}>
              <label>
                Workspace name
                <Input name="workspaceName" placeholder="Acme Holdings" required />
              </label>
              <Button type="submit">Create Workspace</Button>
            </form>
          </Card>

          <Card className="section-card-modern">
            <SectionHeader
              title="Accept Invitation"
              description="Use your invitation token to join an existing workspace."
            />
            <form action={acceptInvitation}>
              <label>
                Invitation token
                <Input
                  defaultValue={params?.token}
                  name="invitationToken"
                  placeholder="Paste token"
                  required
                />
              </label>
              <Button type="submit" variant="secondary">
                Accept Invitation
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
