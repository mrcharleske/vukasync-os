# vukasync-os

Phase 4 foundation for VukaSync: database activation assets, authentication flows, workspace onboarding, service selection, and business command center.

## Environment

Use `vukasync-dev` only for this phase.

Required local env keys:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy and populate:

`cp .env.example .env`

Do not commit `.env`.

## Run locally

- `pnpm install`
- `pnpm dev`
- open `http://localhost:3000`

## Implemented routes

Public:

- `/` (Landing)
- `/login`
- `/signup`
- `/auth/verify`

Protected:

- `/onboarding`
- `/service-selection`
- `/command-center`
- `/team/invite`

Auth utilities:

- `/auth/callback`
- `/auth/logout`

## Authentication coverage

- Email + password signup/login/logout
- Google sign-in bootstrap
- Session handling via Supabase SSR cookies
- Protected route redirect middleware
- Email verification gate before workspace creation

## Database activation

Migrations are defined in:

- `supabase/migrations/000001_enable_extensions.sql`
- `supabase/migrations/000002_create_shared_functions.sql`
- `supabase/migrations/000003_create_profiles_and_platform_roles.sql`
- `supabase/migrations/000004_create_workspaces.sql`
- `supabase/migrations/000005_create_services.sql`
- `supabase/migrations/000006_create_subscriptions.sql`
- `supabase/migrations/000007_create_audit_logs.sql`
- `supabase/migrations/000008_seed_foundation_data.sql`
- `supabase/migrations/000009_enable_rls_policies.sql`
- `supabase/migrations/000010_allow_invitation_acceptance_audit.sql`
- `supabase/migrations/000011_seed_phase4_services.sql`

Operational docs:

- `docs/database-activation.md`
- `docs/type-generation.md`
- `docs/phase-3d-localhost-flow.md`

## Commands

- `pnpm db:verify:migrations`
- `pnpm db:verify:seed`
- `pnpm db:types:generate`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- `pnpm security:check`
