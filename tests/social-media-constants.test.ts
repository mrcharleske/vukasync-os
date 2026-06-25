import { describe, expect, it } from "vitest";
import {
  isAccountStatus,
  isConnectionType,
  isSocialPlatform
} from "../src/lib/social-media/constants";

describe("social media constants validators", () => {
  it("recognizes supported platforms", () => {
    expect(isSocialPlatform("INSTAGRAM")).toBe(true);
    expect(isSocialPlatform("YOUTUBE")).toBe(true);
    expect(isSocialPlatform("SNAPCHAT")).toBe(false);
  });

  it("recognizes supported connection types", () => {
    expect(isConnectionType("MANUAL")).toBe(true);
    expect(isConnectionType("API_CONNECTED")).toBe(true);
    expect(isConnectionType("WEBHOOK")).toBe(false);
  });

  it("recognizes supported account statuses", () => {
    expect(isAccountStatus("ACTIVE")).toBe(true);
    expect(isAccountStatus("INACTIVE")).toBe(true);
    expect(isAccountStatus("PAUSED")).toBe(false);
  });
});
