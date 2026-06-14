import "server-only";

import {
  createServiceRoleSupabaseClient,
  getServerSupabaseConfig
} from "@vukasync/supabase";

export function createServerSupabaseClient() {
  return createServiceRoleSupabaseClient(getServerSupabaseConfig(process.env));
}
