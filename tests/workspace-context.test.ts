import { describe, expect, it } from "vitest";
import { resolveWorkspaceRoute } from "../src/lib/workspaces/context";

describe("resolveWorkspaceRoute", () => {
  it("routes users without a workspace to onboarding", () => {
    expect(
      resolveWorkspaceRoute({
        workspaceId: null,
        activeServiceCount: 0
      })
    ).toBe("/onboarding");
  });

  it("routes users with a workspace and no services to service selection", () => {
    expect(
      resolveWorkspaceRoute({
        workspaceId: "workspace-123",
        activeServiceCount: 0
      })
    ).toBe("/service-selection?workspace=workspace-123");
  });

  it("routes users with services to command center", () => {
    expect(
      resolveWorkspaceRoute({
        workspaceId: "workspace-123",
        activeServiceCount: 2
      })
    ).toBe("/command-center?workspace=workspace-123");
  });
});
