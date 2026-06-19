import { redirect } from "next/navigation";
import { AppShell, PageHeader, SectionCard } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
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
    <AppShell>
      <PageHeader
        title="Service Selection"
        description="Choose the services you want active in your workspace."
        actions={<StatusBadge label={workspace.name} />}
      />

      {params?.error ? <p className="error">{params.error}</p> : null}

      <SectionCard
        title="Available Services"
        description="You can select one or multiple services. You can update this later."
      >
        <form action={saveSelectedServices}>
          <input type="hidden" name="workspaceId" value={workspace.id} />
          {orderedServices.length === 0 ? (
            <p>No services are currently configured in the catalog.</p>
          ) : (
            <div className="selection-grid">
              {orderedServices.map((service) => (
                <label className="selection-card" key={service.id}>
                  <div className="selection-card-header">
                    <input
                      type="checkbox"
                      defaultChecked={selectedServiceIds.has(service.id)}
                      name="serviceIds"
                      value={service.id}
                    />
                    <span>{service.name}</span>
                  </div>
                  <p>{service.description ?? "Service module for your workspace."}</p>
                </label>
              ))}
            </div>
          )}
          <button className="button" type="submit">
            Save Services
          </button>
        </form>
      </SectionCard>
    </AppShell>
  );
}
