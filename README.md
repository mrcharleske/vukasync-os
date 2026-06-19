# vukasync-os

## Supabase bootstrap (safe setup)

This repo now includes starter Supabase wiring using environment variables.

### 1) Install dependency

Run:

`npm install @supabase/supabase-js`

### 2) Add your local secrets

Copy `.env.example` to `.env` and fill in real values from your Supabase project settings:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

Do not commit `.env` files.

### 3) Use the clients

- Client/browser-safe key usage: `src/lib/supabase/client.ts`
- Server-only admin key usage: `src/lib/supabase/admin.ts`

Example imports in this repo:

- Frontend module importing `supabase`: `src/frontend/supabase-usage.ts`
- Server module importing `supabaseAdmin`: `src/server/supabase-admin-usage.ts`

### Security rules

- Safe to expose in frontend: `SUPABASE_ANON_KEY` (still keep private in chat/logs).
- Never expose to frontend: `SUPABASE_SERVICE_ROLE_KEY`.
- Never paste keys/passwords into chat, issues, or PR comments.
