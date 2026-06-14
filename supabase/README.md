# Supabase

This directory prepares VukaSync OS for Supabase migration tooling.

## Scope

Included:

- Supabase CLI configuration.
- Migration directory placeholder.
- Local development guidance for `vukasync-dev`.
- Phase 3C database backbone migrations for `vukasync-dev`.

Not included:

- Applying migrations to staging or production.
- Authentication UI.
- Storage policies.
- Edge Functions.
- Staging or production linking.

## Local development

Use `vukasync-dev` only during Phase 3B.

```bash
pnpm supabase --version
pnpm supabase login
pnpm supabase link --project-ref <vukasync-dev-project-ref>
```

Do not link this repository to:

- `vukasync-staging`
- `vukasync-prod`

## Migrations

Migrations live in:

```text
supabase/migrations/
```

Phase 3C migrations must be applied only to `vukasync-dev`.

## Type generation

After applying migrations to `vukasync-dev`, regenerate database types:

```bash
pnpm supabase gen types typescript --linked --schema public > packages/types/src/database.ts
```
