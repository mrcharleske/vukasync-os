# VukaSync OS Web

This is the Next.js App Router web application for VukaSync OS.

## Current scope

- Technical foundation only.
- App Router scaffold.
- Tailwind CSS configuration.
- Shared package consumption from `@vukasync/types`, `@vukasync/ui`, and
  `@vukasync/utils`.

## Not included yet

- Business features.
- Supabase configuration.
- Authentication.
- Billing or payment providers.
- Client portal modules.

## Commands

Run from the repository root:

```bash
pnpm --filter @vukasync/web dev
pnpm --filter @vukasync/web typecheck
pnpm --filter @vukasync/web build
```
