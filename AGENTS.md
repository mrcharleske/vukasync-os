# AGENTS.md

## Cursor Cloud specific instructions

VukaSync OS is a documentation-first `pnpm` + Turborepo monorepo:

- `apps/web` — Next.js 16 (App Router, Turbopack) web app (`@vukasync/web`).
- `apps/mobile` — Expo managed React Native app (`@vukasync/mobile`).
- `packages/*` — shared workspace packages (`config`, `types`, `ui`, `utils`, `supabase`).
- `supabase/` — Supabase config and SQL migrations (not applied locally; cloud access requires `SUPABASE_ACCESS_TOKEN`).

The full local workflow is documented in `docs/engineering/local-development.md`; use it as the source of truth.

### Running, linting, testing

- Toolchain (Node 22, pnpm 10.33.3) is preinstalled and the update script runs `pnpm install`. No manual setup is needed.
- Verify the workspace from the repo root with the standard scripts in `package.json`: `pnpm typecheck`, `pnpm lint`, `pnpm test` (all driven by `turbo`).
- `lint` and `typecheck` are both `tsc --noEmit` (the web app also runs `next typegen` first). There is no ESLint setup, and `test` scripts are placeholders (no real tests exist yet).
- Web dev server: `pnpm --filter @vukasync/web dev` serves on `http://localhost:3000`.
- Mobile dev server: `pnpm --filter @vukasync/mobile dev` runs `expo start`, which needs a device/emulator or Expo Go; it cannot fully run headless. Use `pnpm --filter @vukasync/mobile typecheck` to validate mobile code without a device.

### Non-obvious gotchas

- The web foundation pages do **not** require Supabase environment variables. The Supabase clients in `apps/web/lib/supabase/*` and `packages/supabase` are only instantiated where used, and `getWebSupabaseConfig`/`getServerSupabaseConfig` throw on missing `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` only when those clients are actually created. So the web dev server starts and the homepage renders without any `.env.local`.
- `pnpm install` reports `Ignored build scripts: sharp`. This is expected and fine for development — `sharp` is only Next.js image optimization and is not needed for the current foundation pages.
- `main` is intentionally near-empty (just a README); the actual codebase lives on the project-foundation branch / its PR. Make sure you are on the branch that contains the monorepo before running any commands above.
