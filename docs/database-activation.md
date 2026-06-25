# Database Activation (Phase 3D-A)

Use only `vukasync-dev`.

## 1) Link local project

If Supabase CLI auth is configured:

`supabase link --project-ref vukasync-dev`

## 2) Apply migrations

Run in order via `supabase db push` (CLI applies by filename order):

1. `000001_enable_extensions.sql`
2. `000002_create_shared_functions.sql`
3. `000003_create_profiles_and_platform_roles.sql`
4. `000004_create_workspaces.sql`
5. `000005_create_services.sql`
6. `000006_create_subscriptions.sql`
7. `000007_create_audit_logs.sql`
8. `000008_seed_foundation_data.sql`
9. `000009_enable_rls_policies.sql`
10. `000010_allow_invitation_acceptance_audit.sql`
11. `000011_seed_phase4_services.sql`
12. `000012_relax_workspace_insert_policy.sql`
13. `000013_create_clients_and_social_accounts.sql`
14. `000014_enable_clients_social_accounts_rls.sql`

## 3) Verify migrations and tables

Run:

- `pnpm db:verify:migrations`

This script verifies:

- migration file order integrity in the repository
- presence/queryability of all expected public tables on the linked environment

## 4) Verify seed data

Run:

- `pnpm db:verify:seed`

This script checks minimum row counts for:

- `platform_roles`
- `service_catalog`
- `subscription_plans`

## 5) Founder promotion (manual bootstrap)

After the first founder account exists, promote manually:

`update public.profiles set platform_role = 'SUPER_ADMIN' where email = '<founder-email>';`
