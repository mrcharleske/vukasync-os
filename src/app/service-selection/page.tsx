import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import {
  PHASE4_SERVICE_CODES,
  sortPhase4ServicesByOrder
} from "../../lib/workspaces/service-catalog";
import {
  getActiveWorkspaceServiceCount,
  getWorkspaceById,
  getWorkspaceMembership
} from "../../lib/workspaces/service";
import { saveSelectedServices } from "./actions";

type ServiceSelectionPageProps = {
  searchParams: Promise<{
    workspace?: string;
    mode?: string;
    error?: string;
  }>;
};

export default async function ServiceSelectionPage({
  searchParams
}: ServiceSelectionPageProps) {
  const { supabase, user } = await requireAuthenticatedUser();
  const params = await searchParams;
  const context = await getWorkspaceRouteContext(supabase, user.id);

  if (!context.workspaceId) {
    redirect("/onboarding");
  }

  const isManageMode = params?.mode === "manage";

  let workspaceId = context.workspaceId;
  if (params?.workspace && params.workspace !== context.workspaceId) {
    const requestedMembership = await getWorkspaceMembership(
      supabase,
      user.id,
      params.workspace
    );

    if (requestedMembership) {
      workspaceId = params.workspace;
    }
  }

  const activeServiceCount = await getActiveWorkspaceServiceCount(
    supabase,
    workspaceId
  );
  if (activeServiceCount > 0 && !isManageMode) {
    redirect(
      resolveWorkspaceRoute({
        workspaceId,
        activeServiceCount
      })
    );
  }
  const workspace = await getWorkspaceById(supabase, workspaceId);

  if (!workspace) {
    redirect("/onboarding");
  }

  const { data: availableServices, error: availableServicesError } = await supabase
    .from("service_catalog")
    .select("id, code, name, description")
    .in("code", [...PHASE4_SERVICE_CODES]);

  if (availableServicesError) {
    redirect(
      `/service-selection?workspace=${workspaceId}&error=${encodeURIComponent(
        availableServicesError.message
      )}`
    );
  }

  const { data: selectedRows, error: selectedRowsError } = await supabase
    .from("services")
    .select("catalog_service_id")
    .eq("workspace_id", workspaceId)
    .eq("status", "ACTIVE");

  if (selectedRowsError) {
    redirect(
      `/service-selection?workspace=${workspaceId}&error=${encodeURIComponent(
        selectedRowsError.message
      )}`
    );
  }

  const selectedServiceIds = new Set(
    (selectedRows ?? []).map((row) => row.catalog_service_id)
  );
  const orderedServices = sortPhase4ServicesByOrder(availableServices ?? []);

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <PageHeader
          title="Service Selection"
          subtitle="Choose the services you want active in your workspace."
          actions={<Badge>{workspace.name}</Badge>}
        />

        {params?.error ? <p className="error">{params.error}</p> : null}

        <Card className="section-card-modern">
          <SectionHeader
            title="Available Services"
            description="You can select one or multiple services and update this later."
          />
          <form action={saveSelectedServices}>
            <Input name="workspaceId" type="hidden" value={workspace.id} />
            {orderedServices.length === 0 ? (
              <p>No services are currently configured in the catalog.</p>
            ) : (
              <div className="selection-grid-modern">
                {orderedServices.map((service) => (
                  <label className="selection-card-modern" key={service.id}>
                    <div className="selection-card-modern-header">
                      <input
                        defaultChecked={selectedServiceIds.has(service.id)}
                        name="serviceIds"
                        type="checkbox"
                        value={service.id}
                      />
                      <span>{service.name}</span>
                    </div>
                    <p>{service.description ?? "Service module for your workspace."}</p>
                  </label>
                ))}
              </div>
            )}
            <Button type="submit">Save Services</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
