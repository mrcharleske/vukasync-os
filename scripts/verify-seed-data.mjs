import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const checks = [
  { table: "platform_roles", minRows: 3 },
  { table: "service_catalog", minRows: 3 },
  { table: "subscription_plans", minRows: 3 }
];

for (const check of checks) {
  const { count, error } = await supabase
    .from(check.table)
    .select("*", { head: true, count: "exact" });

  if (error) {
    throw new Error(`Seed verification failed for "${check.table}": ${error.message}`);
  }

  if ((count ?? 0) < check.minRows) {
    throw new Error(
      `Seed verification failed for "${check.table}": expected at least ${check.minRows}, found ${count ?? 0}`
    );
  }

  console.log(`seed ok: ${check.table} (rows=${count})`);
}

console.log("seed verification passed");
