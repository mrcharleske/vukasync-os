import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const platformRoles = [
  { code: "SUPER_ADMIN", description: "Global platform administrator" },
  { code: "FOUNDER", description: "Founder account with bootstrap rights" },
  { code: "WORKSPACE_MEMBER", description: "Default authenticated user role" }
];

const services = [
  {
    code: "BOOKKEEPING",
    name: "Bookkeeping",
    description: "Baseline bookkeeping service"
  },
  { code: "PAYROLL", name: "Payroll", description: "Payroll operations service" },
  {
    code: "TAX_PREP",
    name: "Tax Preparation",
    description: "Tax prep and filing service"
  }
];

const plans = [
  { code: "FREE", name: "Free", monthly_price_cents: 0 },
  { code: "STARTER", name: "Starter", monthly_price_cents: 9900 },
  { code: "GROWTH", name: "Growth", monthly_price_cents: 24900 }
];

const rolesResult = await supabase
  .from("platform_roles")
  .upsert(platformRoles, { onConflict: "code" });
if (rolesResult.error) {
  throw new Error(`Failed to seed platform_roles: ${rolesResult.error.message}`);
}

const servicesResult = await supabase
  .from("service_catalog")
  .upsert(services, { onConflict: "code" });
if (servicesResult.error) {
  throw new Error(`Failed to seed service_catalog: ${servicesResult.error.message}`);
}

const plansResult = await supabase
  .from("subscription_plans")
  .upsert(plans, { onConflict: "code" });
if (plansResult.error) {
  throw new Error(`Failed to seed subscription_plans: ${plansResult.error.message}`);
}

console.log("foundation seed applied");
