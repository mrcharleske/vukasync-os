import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
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
    <main className="auth-page">
      <div className="auth-page-inner">
        <PageHeader
          eyebrow="VukaSync OS"
          title="Run your workspace from one command center"
          subtitle="A workspace-based client portal and business services platform for global teams."
        />

        <Card className="auth-card">
          <h2>Get started</h2>
          <p>Authenticate first, then create or join your workspace.</p>
          <div className="landing-actions">
            <Button href="/signup">Sign up</Button>
            <Button href="/login" variant="secondary">
              Login
            </Button>
          </div>
        </Card>
        <p className="auth-footer">
          Returning member? <Link href="/login">Continue to login</Link>.
        </p>
      </div>
    </main>
  );
}
