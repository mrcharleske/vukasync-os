export {
  getMobileSupabaseConfig,
  getServerSupabaseConfig,
  getWebSupabaseConfig
} from "./config";
export type { SupabasePublicConfig, SupabaseServerConfig } from "./config";
export { createBrowserSupabaseClient } from "./client";
export { createServiceRoleSupabaseClient } from "./server";
