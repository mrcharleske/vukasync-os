# Local Development

This document describes the Phase 3B local development workflow for VukaSync OS.

## Scope

Phase 3B prepares local development to use the `vukasync-dev` Supabase
environment only.

This phase does not:

- Connect staging or production.
- Apply Supabase migrations.
- Configure authentication flows.
- Implement dashboards.
- Implement business UI.

## Prerequisites

- Node.js matching the workspace environment.
- pnpm.
- Supabase CLI available through the workspace dev dependency.
- Access to the `vukasync-dev` Supabase project.

## Install dependencies

From the repository root:

```bash
pnpm install
```

## Configure local environment files

Copy the examples:

```bash
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Fill the copied files with values from `vukasync-dev` only.

Do not use staging or production values in local development.

## Required variables

### Web

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. It must not be imported into client
components or browser-executed modules.

### Mobile

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Mobile must not receive `SUPABASE_SERVICE_ROLE_KEY`.

## Supabase CLI workflow

Check the CLI:

```bash
pnpm supabase --version
```

Authenticate if needed:

```bash
pnpm supabase login
```

Link local tooling to the development project only:

```bash
pnpm supabase link --project-ref <vukasync-dev-project-ref>
```

Do not link local tooling to:

- `vukasync-staging`
- `vukasync-prod`

## Migration workflow

Phase 3B prepares migration tooling only. No migrations are created or applied.

Future development migration workflow:

```text
Create migration locally
↓
Test against vukasync-dev
↓
Review migration and RLS behavior
↓
Promote to staging after approval
↓
Promote to production after staging validation
```

## Run apps

Web:

```bash
pnpm --filter @vukasync/web dev
```

Mobile:

```bash
pnpm --filter @vukasync/mobile dev
```

## Verify the workspace

Run:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Secret safety checklist

Before committing:

- Confirm no `.env` or `.env.local` files are staged.
- Confirm no Supabase service-role key appears in source code.
- Confirm mobile code uses only `EXPO_PUBLIC_SUPABASE_*` variables.
- Confirm web client code uses only `NEXT_PUBLIC_SUPABASE_*` variables.
- Confirm server-only Supabase code is not imported by client modules.
