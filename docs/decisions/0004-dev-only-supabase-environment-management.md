# ADR 0004: Dev-Only Supabase Environment Management

## Status

Accepted

## Context

VukaSync OS has three Supabase environments:

- `vukasync-dev`
- `vukasync-staging`
- `vukasync-prod`

All Supabase projects use European regions.

The project has completed product foundation, technical foundation, and backend
architecture design. Phase 3B introduces Supabase integration utilities and
environment management while preserving the documentation-first approach.

The project must avoid accidental staging or production access during early
development.

## Decision

Phase 3B will configure local development for `vukasync-dev` only.

The repository will include:

- Environment documentation.
- Local development workflow documentation.
- Safe `.env.example` templates.
- Supabase CLI configuration and migration directory placeholders.
- Reusable Supabase client utilities for web, mobile, and server usage.

The repository will not include:

- Real secrets.
- Staging or production connection setup.
- Supabase migrations.
- Authentication flows.
- Business dashboards.
- Business UI.

## Rationale

This approach was chosen because it:

- Preserves environment separation.
- Allows safe Cursor experimentation and local development.
- Reduces the chance of accidental staging or production changes.
- Keeps service-role credentials out of client code.
- Prepares the repository for migrations without applying any schema changes.
- Matches the existing documentation-first and workspace-based architecture
  decisions.

## Consequences

Positive outcomes:

- Developers have a clear dev-only setup path.
- Web and mobile apps can share Supabase client creation utilities.
- Server-only usage has a clear boundary for service-role access.
- Future migration work has a prepared directory and CLI configuration.

Tradeoffs:

- Staging and production remain manual/documented only for now.
- Supabase clients are untyped until database types are generated after
  migrations exist.
- Authentication persistence and session handling are intentionally deferred.

## Follow-up work

Future phases should:

1. Draft migrations against `vukasync-dev`.
2. Generate database types after migrations are applied.
3. Add RLS tests for tenant isolation.
4. Configure authentication flows.
5. Add staging promotion workflow.
6. Add production deployment procedures.
