# ADR 0002: Technical Foundation Scaffold

## Status

Accepted

## Context

Phase 1 established the documentation-first foundation for VukaSync OS. Phase 2
begins the technical foundation without implementing product features.

The project needs a working monorepo structure that matches the planned stack:
pnpm, Turborepo, Next.js, Expo React Native, TypeScript, Tailwind CSS,
NativeWind, and shared packages.

## Decision

Create a minimal technical scaffold:

- Use pnpm workspaces.
- Use Turborepo to orchestrate `dev`, `build`, `lint`, `typecheck`, and `test`
  tasks.
- Add `apps/web` as a Next.js App Router application.
- Add `apps/mobile` as an Expo Managed Workflow application.
- Configure Tailwind CSS for the web app.
- Configure NativeWind for the mobile app.
- Add shared packages:
  - `@vukasync/config`
  - `@vukasync/types`
  - `@vukasync/ui`
  - `@vukasync/utils`
- Keep shared package exports limited to neutral technical foundation contracts,
  utilities, and design tokens.

## Explicit non-goals

This phase does not include:

- Supabase configuration.
- Authentication or authorization implementation.
- Billing or payment provider setup.
- Social analytics integrations.
- OpenAI integration.
- n8n workflow implementation.
- Business service modules or client portal features.

## Consequences

Positive outcomes:

- The repository becomes runnable and type-checkable.
- Web and mobile apps can consume shared workspace packages.
- Future feature work has clear package and tooling boundaries.
- The documentation-first philosophy remains intact.

Tradeoffs:

- The UI screens are technical placeholders only.
- Linting is currently represented by TypeScript checks until a full ESLint
  standard is selected.
- Mobile build automation is limited to TypeScript validation at this phase.
