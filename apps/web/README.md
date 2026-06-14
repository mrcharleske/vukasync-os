# VukaSync OS Web

This is the Next.js App Router web application for VukaSync OS.

## Current scope

- Technical foundation only.
- App Router scaffold.
- Tailwind CSS configuration.
- Shared package consumption from `@vukasync/types`, `@vukasync/ui`, and
  `@vukasync/utils`.
- Dev-only Supabase client utility wrapper for future `vukasync-dev` work.

## Not included yet

- Business features.
- Authentication.
- Billing or payment providers.
- Client portal modules.
- Supabase authentication, migrations, or business queries.

## Commands

Run from the repository root:

```bash
pnpm --filter @vukasync/web dev
pnpm --filter @vukasync/web typecheck
pnpm --filter @vukasync/web build
```
