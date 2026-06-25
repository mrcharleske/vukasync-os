import { redirect } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CircleCheckBig,
  Sparkles,
  UsersRound
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { requireAuthenticatedUser } from "../../lib/auth/guards";
import {
  getLatestWorkspaceSubscription,
  getRecentWorkspaceActivity,
  getWorkspaceById,
  getWorkspaceMemberCount,
  getWorkspaceServices
} from "../../lib/workspaces/service";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "../../lib/workspaces/context";

export default async function CommandCenterPage() {
  const { supabase, user } = await requireAuthenticatedUser();

  const context = await getWorkspaceRouteContext(supabase, user.id);
  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  if (context.activeServiceCount === 0) {
    redirect(resolveWorkspaceRoute(context));
  }

  const workspaceId = context.workspaceId;
  const workspace = await getWorkspaceById(supabase, workspaceId);
  if (!workspace) {
    redirect("/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const userName = profile?.full_name ?? user.email ?? "there";
  const nowHour = new Date().getHours();
  const daytimeGreeting =
    nowHour < 12
      ? "Good Morning"
      : nowHour < 18
        ? "Good Afternoon"
        : "Good Evening";
  const greeting = `${daytimeGreeting}, ${userName} 👋`;

  const [activeServices, latestSubscription, workspaceMemberCount, recentActivity] =
    await Promise.all([
      getWorkspaceServices(supabase, workspaceId),
      getLatestWorkspaceSubscription(supabase, workspaceId),
      getWorkspaceMemberCount(supabase, workspaceId),
      getRecentWorkspaceActivity(supabase, workspaceId)
    ]);

  const kpiItems = [
    {
      label: "Active Clients",
      value: Math.max(workspaceMemberCount - 1, 0).toString()
    },
    { label: "Active Services", value: activeServices.length.toString() },
    { label: "Monthly Activity", value: recentActivity.length.toString() },
    {
      label: "Subscription Status",
      value: latestSubscription?.status?.toUpperCase() ?? "NOT SET"
    }
  ];

  return (
    <DashboardShell userName={userName} workspaceName={workspace.name}>
      <div className="dashboard-stack">
        <Card className="command-hero-card">
          <PageHeader
            eyebrow="Business Command Center"
            title={greeting}
            subtitle="Welcome back to VukaSync."
            actions={
              <div className="header-chip-row">
                <Badge>{workspace.name}</Badge>
                <Badge tone={user.email_confirmed_at ? "success" : "accent"}>
                  {user.email_confirmed_at ? "Email Verified" : "Verification Pending"}
                </Badge>
              </div>
            }
          />
          <div className="command-hero-metrics">
            <div>
              <Sparkles size={16} />
              <span>Premium operational clarity</span>
            </div>
            <div>
              <UsersRound size={16} />
              <span>Team coordination in real time</span>
            </div>
            <div>
              <Activity size={16} />
              <span>Live service and activity telemetry</span>
            </div>
          </div>
        </Card>

        <section>
          <SectionHeader
            title="KPI Overview"
            description="High-level business health snapshots for your workspace."
          />
          <div className="kpi-grid">
            {kpiItems.map((item) => (
              <Card className="kpi-card" key={item.label}>
                <p className="kpi-label">{item.label}</p>
                <p className="kpi-value">{item.value}</p>
                <p className="kpi-trend">Updated moments ago</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="dashboard-two-column">
          <Card className="section-card-modern">
            <SectionHeader
              title="Workspace Overview"
              description="Workspace profile and engagement summary."
            />
            <div className="overview-list">
              <div>
                <span>Workspace Name</span>
                <strong>{workspace.name}</strong>
              </div>
              <div>
                <span>Member Count</span>
                <strong>{workspaceMemberCount}</strong>
              </div>
              <div>
                <span>Service Count</span>
                <strong>{activeServices.length}</strong>
              </div>
            </div>
          </Card>

          <Card className="section-card-modern">
            <SectionHeader
              title="Services"
              description="Currently active services powering delivery."
            />
            {activeServices.length === 0 ? (
              <EmptyState
                description="No services selected yet."
                title="Services coming soon"
              />
            ) : (
              <ul className="service-pill-list">
                {activeServices.map((service) => (
                  <li key={service.id}>
                    <CircleCheckBig size={14} />
                    {service.catalog_service?.name ?? service.id}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="dashboard-two-column">
          <Card className="section-card-modern" id="subscription">
            <SectionHeader
              title="Subscription"
              description="Current billing plan and lifecycle state."
            />
            {latestSubscription ? (
              <div className="overview-list">
                <div>
                  <span>Plan</span>
                  <strong>{latestSubscription.subscription_plan?.name ?? "Custom"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{latestSubscription.status}</strong>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No active subscription"
                description="Subscription details will appear after plan assignment."
              />
            )}
          </Card>

          <Card className="section-card-modern">
            <SectionHeader
              title="Quick Actions"
              description="Common operations you can perform instantly."
            />
            <div className="quick-actions-modern">
              <Button href="/clients" variant="secondary">
                Add Client <ArrowUpRight size={14} />
              </Button>
              <Button
                href={`/service-selection?workspace=${workspaceId}&mode=manage`}
                variant="secondary"
              >
                Add Service <ArrowUpRight size={14} />
              </Button>
              <Button href="/team/invite" variant="secondary">
                Invite Team Member <ArrowUpRight size={14} />
              </Button>
              <Button href="/command-center#reports" variant="secondary">
                View Reports <ArrowUpRight size={14} />
              </Button>
            </div>
            <form action="/auth/logout" method="post">
              <Button className="logout-inline" type="submit" variant="ghost">
                Logout
              </Button>
            </form>
          </Card>
        </div>

        <Card className="section-card-modern" id="activity">
          <SectionHeader
            title="Activity Feed"
            description="Latest operational and service updates."
          />
          {recentActivity.length === 0 ? (
            <EmptyState
              title="No recent activity"
              description="Activity updates will appear here as your workspace team operates."
            />
          ) : (
            <ul className="activity-feed-modern">
              {recentActivity.map((activity) => (
                <li key={activity.id}>
                  <p>{activity.action.replaceAll("_", " ")}</p>
                  <span>
                    {activity.entity_type} •{" "}
                    {new Date(activity.created_at).toLocaleString("en-US")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="section-card-modern" id="chatbot">
          <SectionHeader title="Chatbot" description="AI support assistant preview." />
          <EmptyState
            title="Chatbot module in progress"
            description="Your assistant workspace will appear here in a future phase."
          />
        </Card>
        <section aria-hidden id="reports" />
        <section aria-hidden id="clients" />
      </div>
    </DashboardShell>
  );
}
