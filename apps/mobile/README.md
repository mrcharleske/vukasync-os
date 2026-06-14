# VukaSync OS Mobile

This is the Expo Managed Workflow mobile application for VukaSync OS.

## Current scope

- Technical foundation only.
- Expo managed app scaffold.
- NativeWind configuration.
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
pnpm --filter @vukasync/mobile dev
pnpm --filter @vukasync/mobile typecheck
pnpm --filter @vukasync/mobile build
```
