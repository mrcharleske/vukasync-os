# Database Type Generation

Output path:

- `packages/types/src/database.ts`

## Regenerate

With Supabase CLI linked to `vukasync-dev`:

`pnpm db:types:generate`

Equivalent command:

`supabase gen types typescript --linked --schema public > packages/types/src/database.ts`

## When to regenerate

Regenerate after any approved migration that changes:

- tables
- columns
- enums
- nullable/default semantics
- relationships used by app queries

## Validation

After regeneration:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test`
