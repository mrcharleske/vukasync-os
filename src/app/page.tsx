import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  LayoutPanelLeft,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <main className="landing-page">
      <div className="landing-bg-orb landing-bg-orb-left" />
      <div className="landing-bg-orb landing-bg-orb-right" />

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-kicker">Premium Intelligent Business OS</p>
          <h1>Operate growth with one elegant command layer.</h1>
          <p>
            VukaSync unifies clients, service delivery, social media operations, and team
            execution into a single enterprise-grade experience.
          </p>
          <div className="landing-actions">
            <Button href="/signup">
              Start Free Workspace <ArrowRight size={16} />
            </Button>
            <Button href="/login" variant="secondary">
              Login
            </Button>
          </div>
          <p className="landing-footer-note">
            Trusted by fast-moving operators who value polish, visibility, and execution speed.
          </p>
        </div>

        <Card className="landing-highlight-card">
          <p className="landing-highlight-label">Command Center Status</p>
          <h2>All systems active</h2>
          <ul>
            <li>
              <LayoutPanelLeft size={16} />
              Unified workspace command center
            </li>
            <li>
              <ChartNoAxesCombined size={16} />
              Real-time KPI and client health visibility
            </li>
            <li>
              <Bot size={16} />
              AI-enabled delivery workflows
            </li>
            <li>
              <ShieldCheck size={16} />
              Enterprise-ready governance controls
            </li>
          </ul>
          <Link className="landing-inline-link" href="/login">
            Access your workspace
          </Link>
        </Card>
      </section>

      <section className="landing-grid">
        <Card className="landing-grid-card">
          <h3>Social Media Management</h3>
          <p>Track clients, accounts, engagement streams, and execution timelines in one view.</p>
        </Card>
        <Card className="landing-grid-card">
          <h3>Websites & Mobile Apps</h3>
          <p>Coordinate delivery milestones, client collaboration, and project progress with clarity.</p>
        </Card>
        <Card className="landing-grid-card">
          <h3>Business Systems & Automation</h3>
          <p>Run internal operations with premium workflows, accountability, and reporting loops.</p>
        </Card>
      </section>
    </main>
  );
}
