# @vukasync/supabase

Shared Supabase client utilities for VukaSync OS.

## Current scope

Phase 3B introduces client construction helpers only.

Included:

- Web public client configuration.
- Mobile public client configuration.
- Server-side service-role client configuration.

Not included:

- Authentication flows.
- Session persistence.
- Generated database types.
- Business queries.
- Supabase migrations.

## Environment boundaries

Client-safe utilities use anon keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Server-side utilities use:

- `SUPABASE_SERVICE_ROLE_KEY`

Never expose the service-role key to browser or mobile code.

Phase 3B clients disable Supabase Auth persistence and automatic token refresh.
Authentication behavior should be designed and enabled in a later phase.

## Commands

```bash
pnpm --filter @vukasync/supabase typecheck
pnpm --filter @vukasync/supabase build
```
