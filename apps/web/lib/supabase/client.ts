import {
  createBrowserSupabaseClient,
  getWebSupabaseConfig
} from "@vukasync/supabase";

export function createWebSupabaseClient() {
  return createBrowserSupabaseClient(getWebSupabaseConfig(process.env));
}
