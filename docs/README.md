# VukaSync OS Documentation

This documentation is the source of truth for product scope, architecture,
delivery standards, and operational expectations.

## Proposed documentation structure

### Product

- [Project vision](product/project-vision.md): mission, principles, and success
  criteria.
- [Core modules](product/core-modules.md): service areas and expected platform
  capabilities.
- [Roles and access](product/roles-and-access.md): Super Admin, Team Member, and
  Client access boundaries.
- [Subscriptions and billing](product/subscriptions-and-billing.md): hybrid
  automatic and manual subscription model.
- [Hybrid operations](product/hybrid-operations.md): how automation and manual
  intervention work together.
- [Global readiness](product/global-readiness.md): currency, payments, locale,
  and international client assumptions.

### Architecture

- [Overview](architecture/overview.md): high-level system boundaries and
  integration direction.
- [Backend architecture](architecture/backend-architecture.md): workspace-based
  multi-tenant Supabase backend design.
- [Database ERD](architecture/database-erd.md): entity relationships, keys,
  indexes, and domain tables.
- [Row Level Security](architecture/row-level-security.md): recommended RLS
  helper functions and policy patterns.
- Future documents should cover authentication, authorization, tenancy, data
  model, payment flows, analytics ingestion, file storage, notifications, and
  reporting.

### Engineering

- [Standards](engineering/standards.md): TypeScript, maintainability, testing,
  and implementation expectations.
- [Repository structure](engineering/repository-structure.md): planned
  Turborepo layout and ownership boundaries.
- [Local development](engineering/local-development.md): dev-only setup flow for
  workspace tooling and Supabase development values.
- [Supabase migration strategy](engineering/supabase-migration-strategy.md):
  recommended migration sequencing and environment promotion approach.
- Future documents should cover environment setup, local development, release
  process, testing strategy, observability, and incident response.

### Operations

- [Client lifecycle](operations/client-lifecycle.md): how clients move from
  onboarding through delivery, reporting, support, and renewal.
- [Environments](operations/environments.md): development, staging, production,
  deployment flow, migration policy, and secret management.
- Future documents should cover support workflows, admin workflows, reporting
  cadence, meeting scheduling, and content operations.

### Decisions

- [ADR 0001: Documentation-first foundation](decisions/0001-documentation-first-foundation.md)
- [ADR 0002: Technical foundation scaffold](decisions/0002-technical-foundation-scaffold.md)
- [ADR 0003: Workspace-based multi-tenant backend architecture](decisions/0003-workspace-multitenant-backend-architecture.md)
- [ADR 0004: Dev-only Supabase environment management](decisions/0004-dev-only-supabase-environment-management.md)

Architecture Decision Records (ADRs) should be added for meaningful technical
choices so future contributors can understand why decisions were made.
