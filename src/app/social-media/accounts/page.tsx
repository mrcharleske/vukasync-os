import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Filter, Globe2, Link2 } from "lucide-react";
import { createSocialAccount } from "./actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { getWorkspaceClients } from "@/lib/clients/service";
import {
  ACCOUNT_STATUSES,
  CONNECTION_TYPES,
  SOCIAL_PLATFORMS,
  isSocialPlatform
} from "@/lib/social-media/constants";
import { getWorkspaceSocialAccounts } from "@/lib/social-media/service";
import {
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "@/lib/workspaces/context";
import { getWorkspaceById } from "@/lib/workspaces/service";

type SocialAccountsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    platform?: string;
  }>;
};

function getUserName(fullName: string | null, email: string | undefined) {
  return fullName ?? email ?? "User";
}

function getAccountClientName(account: unknown) {
  const clients = (account as { clients?: unknown }).clients;
  if (Array.isArray(clients)) {
    const first = clients[0] as { business_name?: string } | undefined;
    return first?.business_name ?? "-";
  }

  if (clients && typeof clients === "object") {
    return (clients as { business_name?: string }).business_name ?? "-";
  }

  return "-";
}

export default async function SocialAccountsPage({
  searchParams
}: SocialAccountsPageProps) {
  const params = await searchParams;
  const { supabase, user } = await requireAuthenticatedUser();
  const context = await getWorkspaceRouteContext(supabase, user.id);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  if (context.activeServiceCount === 0) {
    redirect(resolveWorkspaceRoute(context));
  }

  const workspace = await getWorkspaceById(supabase, context.workspaceId);
  if (!workspace) {
    redirect("/onboarding");
  }

  const selectedPlatform =
    params.platform && isSocialPlatform(params.platform)
      ? params.platform
      : undefined;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const userName = getUserName(profile?.full_name ?? null, user.email);

  const [clients, socialAccounts] = await Promise.all([
    getWorkspaceClients(supabase, workspace.id),
    getWorkspaceSocialAccounts(supabase, workspace.id, selectedPlatform)
  ]);

  return (
    <DashboardShell userName={userName} workspaceName={workspace.name}>
      <div className="dashboard-stack">
        <Card className="command-hero-card">
          <PageHeader
            eyebrow="Social Media"
            title="Social Accounts"
            subtitle="Track and manage each client's connected social channels."
            actions={
              <div className="header-chip-row">
                <Badge>{workspace.name}</Badge>
                {selectedPlatform ? <Badge tone="accent">{selectedPlatform}</Badge> : null}
              </div>
            }
          />
          <div className="command-hero-metrics">
            <div>
              <Globe2 size={16} />
              <span>{socialAccounts.length} connected accounts</span>
            </div>
            <div>
              <Filter size={16} />
              <span>Live platform filtering</span>
            </div>
            <div>
              <Link2 size={16} />
              <span>Unified client-to-account mapping</span>
            </div>
          </div>
        </Card>

        {params?.error ? <p className="error">{params.error}</p> : null}
        {params?.success ? <p className="success">{params.success}</p> : null}

        <Card className="section-card-modern">
          <SectionHeader
            title="Filter by Platform"
            description="Slice account visibility by social network."
          />
          <div className="filter-chip-row">
            <Link
              className={`filter-chip ${!selectedPlatform ? "filter-chip-active" : ""}`}
              href="/social-media/accounts"
            >
              All Platforms
            </Link>
            {SOCIAL_PLATFORMS.map((platform) => (
              <Link
                className={`filter-chip ${
                  selectedPlatform === platform ? "filter-chip-active" : ""
                }`}
                href={`/social-media/accounts?platform=${platform}`}
                key={platform}
              >
                {platform}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="section-card-modern">
          <SectionHeader
            title="Add Social Account"
            description="Attach a social profile to a client workspace record."
          />
          {clients.length === 0 ? (
            <p className="muted-note">
              Add at least one client first before creating social accounts.
            </p>
          ) : (
            <form action={createSocialAccount} className="form-grid-modern">
              <Input name="workspaceId" type="hidden" value={workspace.id} />
              <div className="form-row-two">
                <label>
                  Client
                  <select className="ui-input" defaultValue={clients[0]?.id} name="clientId" required>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.business_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Platform
                  <select
                    className="ui-input"
                    defaultValue={selectedPlatform ?? SOCIAL_PLATFORMS[0]}
                    name="platform"
                    required
                  >
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-row-two">
                <label>
                  Username
                  <Input name="username" placeholder="@account_name" required />
                </label>
                <label>
                  Profile URL
                  <Input name="profileUrl" placeholder="https://..." />
                </label>
              </div>
              <div className="form-row-two">
                <label>
                  Connection Type
                  <select className="ui-input" defaultValue="MANUAL" name="connectionType">
                    {CONNECTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Account Status
                  <select className="ui-input" defaultValue="ACTIVE" name="accountStatus">
                    {ACCOUNT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Metadata (JSON)
                <textarea
                  className="ui-input ui-textarea"
                  name="metadata"
                  placeholder='{"followers": 12000}'
                  rows={3}
                />
              </label>
              <div className="inline-form-actions">
                <Button type="submit">Add Social Account</Button>
                <Button href="/clients" variant="secondary">
                  Manage Clients
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="section-card-modern">
          <SectionHeader
            title="Account Inventory"
            description="Current social accounts connected across clients."
          />
          {socialAccounts.length === 0 ? (
            <p className="muted-note">
              No social accounts found for the selected platform.
            </p>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Platform</th>
                    <th>Username</th>
                    <th>Connection</th>
                    <th>Status</th>
                    <th>Profile URL</th>
                  </tr>
                </thead>
                <tbody>
                  {socialAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>{getAccountClientName(account)}</td>
                      <td>
                        <Badge tone="accent">{account.platform}</Badge>
                      </td>
                      <td>{account.username}</td>
                      <td>
                        <Badge>{account.connection_type}</Badge>
                      </td>
                      <td>
                        <Badge tone={account.account_status === "ACTIVE" ? "success" : "neutral"}>
                          {account.account_status}
                        </Badge>
                      </td>
                      <td>
                        {account.profile_url ? (
                          <a href={account.profile_url} rel="noreferrer" target="_blank">
                            <span className="table-link-with-icon">
                              <BadgeCheck size={14} />
                              Open
                            </span>
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
