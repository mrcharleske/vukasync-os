import type { AppSurface } from "@vukasync/types";

export const vukasyncTheme = {
  color: {
    background: "#f8fafc",
    foreground: "#0f172a",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    muted: "#64748b",
    surface: "#ffffff"
  },
  radius: {
    md: "0.75rem",
    xl: "1.5rem"
  }
} as const;

export const foundationBadgeClassName =
  "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700";

export function getFoundationLabel(surface: AppSurface): string {
  return surface === "web" ? "Next.js App Router" : "Expo Managed Workflow";
}
