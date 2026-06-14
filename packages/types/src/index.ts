export const FOUNDATION_STAGE = "technical-foundation" as const;

export type FoundationStage = typeof FOUNDATION_STAGE;

export type AppSurface = "web" | "mobile";

export type WorkspacePackageName =
  | "@vukasync/config"
  | "@vukasync/types"
  | "@vukasync/ui"
  | "@vukasync/utils";
