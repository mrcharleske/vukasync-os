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
- Future documents should cover authentication, authorization, tenancy, data
  model, payment flows, analytics ingestion, file storage, notifications, and
  reporting.

### Engineering

- [Standards](engineering/standards.md): TypeScript, maintainability, testing,
  and implementation expectations.
- [Repository structure](engineering/repository-structure.md): planned
  Turborepo layout and ownership boundaries.
- Future documents should cover environment setup, local development, release
  process, testing strategy, observability, and incident response.

### Operations

- [Client lifecycle](operations/client-lifecycle.md): how clients move from
  onboarding through delivery, reporting, support, and renewal.
- Future documents should cover support workflows, admin workflows, reporting
  cadence, meeting scheduling, and content operations.

### Decisions

- [ADR 0001: Documentation-first foundation](decisions/0001-documentation-first-foundation.md)

Architecture Decision Records (ADRs) should be added for meaningful technical
choices so future contributors can understand why decisions were made.
