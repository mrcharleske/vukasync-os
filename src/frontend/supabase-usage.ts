import { supabase } from "../lib/supabase/client";

export async function fetchPublicProfiles() {
  const { data, error } = await supabase.from("profiles").select("*").limit(10);

  if (error) {
    throw new Error(`Failed to fetch profiles: ${error.message}`);
  }

  return data;
}
