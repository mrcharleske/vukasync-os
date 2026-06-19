import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppShell,
  EmptyState,
  PageHeader,
  SectionCard
} from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
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
    nowHour < 12 ? "Good morning" : nowHour < 18 ? "Good afternoon" : "Good evening";
  const greeting = `${daytimeGreeting}, ${userName}.`;

  const [activeServices, latestSubscription, workspaceMemberCount, recentActivity] =
    await Promise.all([
      getWorkspaceServices(supabase, workspaceId),
      getLatestWorkspaceSubscription(supabase, workspaceId),
      getWorkspaceMemberCount(supabase, workspaceId),
      getRecentWorkspaceActivity(supabase, workspaceId)
    ]);

  return (
    <AppShell>
      <PageHeader
        title="Business Command Center"
        description={greeting}
        actions={
          <div className="inline-actions">
            <StatusBadge label={workspace.name} />
            <StatusBadge
              label={user.email_confirmed_at ? "Email Verified" : "Verification Pending"}
              tone={user.email_confirmed_at ? "success" : "warning"}
            />
          </div>
        }
      />

      <SectionCard
        title="Workspace Overview"
        description="Your workspace setup and team snapshot."
      >
        <div className="metric-grid">
          <div className="metric">
            <p className="metric-label">Workspace</p>
            <p className="metric-value">{workspace.name}</p>
          </div>
          <div className="metric">
            <p className="metric-label">Status</p>
            <p className="metric-value">{workspace.status}</p>
          </div>
          <div className="metric">
            <p className="metric-label">Team Members</p>
            <p className="metric-value">{workspaceMemberCount}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Services"
        description="Active services assigned to this workspace."
      >
        {activeServices.length === 0 ? (
          <EmptyState
            title="No active services yet"
            description="Add at least one service to begin delivery workflows."
          />
        ) : (
          <ul className="simple-list">
            {activeServices.map((service) => (
              <li key={service.id}>{service.catalog_service?.name ?? service.id}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Subscription"
        description="Current plan and billing lifecycle status."
        id="subscription"
      >
        {latestSubscription ? (
          <div className="metric-grid">
            <div className="metric">
              <p className="metric-label">Plan</p>
              <p className="metric-value">
                {latestSubscription.subscription_plan?.name ?? "Custom"}
              </p>
            </div>
            <div className="metric">
              <p className="metric-label">Status</p>
              <p className="metric-value">{latestSubscription.status}</p>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No subscription found"
            description="Subscription details will appear after plan assignment."
          />
        )}
      </SectionCard>

      <SectionCard title="Activity Feed" description="Recent workspace activity summary.">
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Activity events will appear here once actions are performed."
          />
        ) : (
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id}>
                <p className="activity-title">{activity.action.replaceAll("_", " ")}</p>
                <p className="activity-meta">
                  {activity.entity_type} ·{" "}
                  {new Date(activity.created_at).toLocaleString("en-US")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Quick Actions" description="Common workspace operations.">
        <div className="quick-actions-grid">
          <Link
            className="quick-action-link"
            href={`/service-selection?workspace=${workspaceId}&mode=manage`}
          >
            Add Service
          </Link>
          <Link className="quick-action-link" href="/team/invite">
            Invite Team Member
          </Link>
          <Link className="quick-action-link" href="/command-center#subscription">
            View Subscription
          </Link>
          <Link className="quick-action-link" href="/command-center#chatbot">
            Open Chatbot
          </Link>
        </div>
        <form action="/auth/logout" method="post">
          <button className="button secondary" type="submit">
            Logout
          </button>
        </form>
      </SectionCard>

      <SectionCard
        id="chatbot"
        title="Chatbot"
        description="AI assistant entrypoint placeholder."
      >
        <EmptyState
          title="Chatbot will be available soon"
          description="Use this section for guided Q&A and operational support in a future phase."
        />
      </SectionCard>
    </AppShell>
  );
}
