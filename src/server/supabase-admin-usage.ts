import { supabaseAdmin } from "../lib/supabase/admin";

export async function listAuthUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw new Error(`Failed to list auth users: ${error.message}`);
  }

  return data.users;
}
