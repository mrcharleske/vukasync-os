import { describe, expect, it } from "vitest";
import { toWorkspaceSlug } from "../src/lib/workspaces/service";

describe("toWorkspaceSlug", () => {
  it("normalizes workspace names to lowercase kebab-case slug", () => {
    const slug = toWorkspaceSlug("Acme Holdings Ltd");
    expect(slug).toMatch(/^acme-holdings-ltd-[a-z0-9]{6}$/);
  });

  it("removes symbols and collapses separators", () => {
    const slug = toWorkspaceSlug("  My   Workspace !!! ");
    expect(slug).toMatch(/^my-workspace-[a-z0-9]{6}$/);
  });
});
