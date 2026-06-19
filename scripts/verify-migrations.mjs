import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const expectedMigrations = [
  "000001_enable_extensions.sql",
  "000002_create_shared_functions.sql",
  "000003_create_profiles_and_platform_roles.sql",
  "000004_create_workspaces.sql",
  "000005_create_services.sql",
  "000006_create_subscriptions.sql",
  "000007_create_audit_logs.sql",
  "000008_seed_foundation_data.sql",
  "000009_enable_rls_policies.sql"
];

const migrationDir = path.resolve("supabase/migrations");
const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (JSON.stringify(expectedMigrations) !== JSON.stringify(migrationFiles)) {
  throw new Error(
    `Migration files mismatch.\nExpected: ${expectedMigrations.join(", ")}\nFound: ${migrationFiles.join(", ")}`
  );
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const expectedTables = [
  "platform_roles",
  "profiles",
  "workspaces",
  "workspace_members",
  "workspace_invitations",
  "service_catalog",
  "services",
  "subscription_plans",
  "subscriptions",
  "audit_logs"
];

for (const tableName of expectedTables) {
  const { count, error } = await supabase
    .from(tableName)
    .select("*", { head: true, count: "exact" });

  if (error) {
    throw new Error(`Table verification failed for "${tableName}": ${error.message}`);
  }

  console.log(`table ok: ${tableName} (rows=${count ?? 0})`);
}

console.log("migration verification passed");
