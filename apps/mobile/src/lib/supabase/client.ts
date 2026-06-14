import {
  createBrowserSupabaseClient,
  getMobileSupabaseConfig
} from "@vukasync/supabase";

export function createMobileSupabaseClient() {
  return createBrowserSupabaseClient(getMobileSupabaseConfig(process.env));
}
