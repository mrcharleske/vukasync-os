import { createClient } from "@supabase/supabase-js";

import type { SupabasePublicConfig } from "./config";

export function createBrowserSupabaseClient(config: SupabasePublicConfig) {
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}
