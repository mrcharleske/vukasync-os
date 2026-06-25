import { redirect } from "next/navigation";
import { createClient, updateClient } from "./actions";
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
  getWorkspaceRouteContext,
  resolveWorkspaceRoute
} from "@/lib/workspaces/context";
import { getWorkspaceById, getWorkspaceMembership } from "@/lib/workspaces/service";

type ClientsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function getUserName(fullName: string | null, email: string | undefined) {
  return fullName ?? email ?? "User";
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
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

  const membership = await getWorkspaceMembership(supabase, user.id, workspace.id);
  if (!membership) {
    redirect("/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const userName = getUserName(profile?.full_name ?? null, user.email);

  const clients = await getWorkspaceClients(supabase, workspace.id);
  const canCreateClient = membership.role === "OWNER" || membership.role === "ADMIN";

  return (
    <DashboardShell userName={userName} workspaceName={workspace.name}>
      <div className="dashboard-stack">
        <PageHeader
          eyebrow="Clients"
          title="Client Management"
          subtitle="Create, organize, and maintain client records for your workspace."
          actions={
            <div className="header-chip-row">
              <Badge>{workspace.name}</Badge>
              <Badge tone="accent">{membership.role}</Badge>
            </div>
          }
        />

        {params?.error ? <p className="error">{params.error}</p> : null}
        {params?.success ? <p className="success">{params.success}</p> : null}

        <Card className="section-card-modern">
          <SectionHeader
            title="Add Client"
            description="Capture business contact details to begin social account management."
          />
          <form action={createClient} className="form-grid-modern">
            <Input name="workspaceId" type="hidden" value={workspace.id} />
            <div className="form-row-two">
              <label>
                Client Name
                <Input
                  disabled={!canCreateClient}
                  name="clientName"
                  placeholder="Jane Doe"
                  required
                />
              </label>
              <label>
                Business Name
                <Input
                  disabled={!canCreateClient}
                  name="businessName"
                  placeholder="Acme Growth"
                  required
                />
              </label>
            </div>
            <div className="form-row-two">
              <label>
                Contact Email
                <Input
                  disabled={!canCreateClient}
                  name="contactEmail"
                  placeholder="contact@acme.com"
                  type="email"
                />
              </label>
              <label>
                Phone
                <Input disabled={!canCreateClient} name="phone" placeholder="+254 700 000 000" />
              </label>
            </div>
            <div className="form-row-two">
              <label>
                Country
                <Input disabled={!canCreateClient} name="country" placeholder="Kenya" />
              </label>
              <label>
                Timezone
                <Input disabled={!canCreateClient} name="timezone" placeholder="Africa/Nairobi" />
              </label>
            </div>
            <label>
              Notes
              <textarea
                className="ui-input ui-textarea"
                disabled={!canCreateClient}
                name="notes"
                placeholder="Any specific delivery notes or client preferences..."
                rows={3}
              />
            </label>
            <div className="inline-form-actions">
              <Button disabled={!canCreateClient} type="submit">
                Add Client
              </Button>
            </div>
            {!canCreateClient ? (
              <p className="muted-note">
                Only workspace owners and admins can create clients.
              </p>
            ) : null}
          </form>
        </Card>

        <Card className="section-card-modern">
          <SectionHeader
            title="Client Directory"
            description="Review and edit client business records."
          />
          {clients.length === 0 ? (
            <p className="muted-note">No clients added yet.</p>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Business</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Timezone</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.client_name}</td>
                      <td>{client.business_name}</td>
                      <td>{client.contact_email ?? "-"}</td>
                      <td>{client.country ?? "-"}</td>
                      <td>{client.timezone ?? "-"}</td>
                      <td>{new Date(client.updated_at).toLocaleDateString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {clients.map((client) => (
          <Card className="section-card-modern" key={`edit-${client.id}`}>
            <SectionHeader
              title={`Edit ${client.business_name}`}
              description="Update account owner and business details."
            />
            <form action={updateClient} className="form-grid-modern">
              <Input name="clientId" type="hidden" value={client.id} />
              <div className="form-row-two">
                <label>
                  Client Name
                  <Input defaultValue={client.client_name} name="clientName" required />
                </label>
                <label>
                  Business Name
                  <Input defaultValue={client.business_name} name="businessName" required />
                </label>
              </div>
              <div className="form-row-two">
                <label>
                  Contact Email
                  <Input
                    defaultValue={client.contact_email ?? ""}
                    name="contactEmail"
                    type="email"
                  />
                </label>
                <label>
                  Phone
                  <Input defaultValue={client.phone ?? ""} name="phone" />
                </label>
              </div>
              <div className="form-row-two">
                <label>
                  Country
                  <Input defaultValue={client.country ?? ""} name="country" />
                </label>
                <label>
                  Timezone
                  <Input defaultValue={client.timezone ?? ""} name="timezone" />
                </label>
              </div>
              <label>
                Notes
                <textarea
                  className="ui-input ui-textarea"
                  defaultValue={client.notes ?? ""}
                  name="notes"
                  rows={3}
                />
              </label>
              <div className="inline-form-actions">
                <Button type="submit" variant="secondary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
