# Environments

VukaSync OS uses separated Supabase environments so development, validation,
and production operations remain isolated.

## Environment summary

| Environment | Supabase project | Purpose | Connected in Phase 3B |
| --- | --- | --- | --- |
| Development | `vukasync-dev` | Local development and safe experimentation | Yes |
| Staging | `vukasync-staging` | Pre-production validation and selected testing | No |
| Production | `vukasync-prod` | Paying clients and stable releases | No |

All Supabase projects use European regions.

## Development: `vukasync-dev`

### Purpose

- Local development.
- Cursor experimentation.
- Initial feature development.
- Safe testing.

### Rules

- Developers connect only to this environment during Phase 3B.
- Migrations may be created and tested here in future phases.
- Secrets remain local and must not be committed.
- This environment is allowed to contain test data.
- Staging and production secrets must never be copied into development files.

### Ownership

- Charles.
- Cursor.

## Staging: `vukasync-staging`

### Purpose

- Family and friends testing.
- User acceptance testing.
- Pre-production validation.
- Release candidate verification.

### Rules

- Do not connect local development tooling to staging during Phase 3B.
- Only approved migrations from development may be promoted here in future
  phases.
- Production secrets must never be used.
- Staging data should be realistic enough for validation but must not be treated
  as production data.

### Ownership

- Charles.
- Selected testers.

## Production: `vukasync-prod`

### Purpose

- Paying clients.
- Stable releases.
- Production monitoring.

### Rules

- Do not connect local development tooling to production during Phase 3B.
- Only migrations validated in staging may be applied in future phases.
- Strict secret management is required.
- Access must be limited.
- Production service-role credentials must never be used locally unless a
  documented emergency process explicitly allows it.

### Ownership

- Charles.
- Paying clients.

## Deployment flow

```text
Feature Development
↓
Development
↓
Internal Validation
↓
Staging
↓
Family/Friends Testing
↓
Production Approval
↓
Production
```

## Migration policy

### Development

- Migrations may be created and tested.
- Migration experiments should happen against `vukasync-dev`.
- Failed experiments should be corrected before promotion.

### Staging

- Only validated migrations from development should be applied.
- Staging should be used for release candidate verification.
- Staging migration failures must be fixed before production approval.

### Production

- Only migrations that have passed staging should be applied.
- Production migrations require explicit approval.
- Production rollbacks should prefer forward-only corrective migrations unless a
  documented restore plan is approved.

## Secret management

### Local files

Local developers may use local `.env` files for development secrets:

- Root `.env.local` or `.env`.
- `apps/web/.env.local`.
- `apps/mobile/.env.local`.

These files must never be committed.

### Deployment platforms

Deployment platforms should store environment-specific secrets in their own
secret managers:

- Web deployment environment variables.
- Mobile build environment variables.
- Server-only deployment secrets.
- Supabase project secrets.

### Client-safe variables

These variables are safe to expose to client bundles because they use Supabase
anon access and must still be protected by Row Level Security:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Server-only variables

These variables must never be exposed to browser or mobile client bundles:

- `SUPABASE_SERVICE_ROLE_KEY`

Never prefix service-role secrets with:

- `NEXT_PUBLIC_`
- `EXPO_PUBLIC_`

## Secret rotation

If a secret is compromised:

1. Revoke or rotate the secret in the affected Supabase project.
2. Remove the leaked value from all local and deployment environments.
3. Replace the value in the appropriate secret manager.
4. Audit recent usage where possible.
5. If the secret was committed, treat the Git history as compromised and rotate
   immediately.
6. Document the incident and follow-up actions.

## Phase 3B boundary

Phase 3B connects local development to `vukasync-dev` only.

Do not connect:

- `vukasync-staging`
- `vukasync-prod`

Do not apply migrations, implement authentication, create dashboards, or build
business UI in this phase.
