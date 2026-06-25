import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../packages/types/src/database";

export function createMobileSupabaseClient(config: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}) {
  const { supabaseUrl, supabaseAnonKey } = config;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Mobile Supabase config is missing URL or anon key.");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
