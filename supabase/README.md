# Supabase

This directory prepares VukaSync OS for Supabase migration tooling.

## Phase 3B scope

Included:

- Supabase CLI configuration.
- Migration directory placeholder.
- Local development guidance for `vukasync-dev`.

Not included:

- SQL migrations.
- Applying migrations.
- Authentication configuration.
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

Future migrations will live in:

```text
supabase/migrations/
```

No migration files are created in Phase 3B.
