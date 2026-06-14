import { createClient } from "@supabase/supabase-js";

import type { SupabaseServerConfig } from "./config";

export function createServiceRoleSupabaseClient(config: SupabaseServerConfig) {
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
