# Architecture Overview

VukaSync OS is planned as a Turborepo monorepo with web, mobile, shared
packages, Supabase-backed services, and external integrations.

Phase 2 establishes the technical scaffold for the monorepo only. It does not
configure Supabase, authentication, billing providers, analytics providers,
OpenAI, or n8n workflows.

Phase 3A designs the backend architecture for the existing Supabase
environments without applying migrations or implementing business UI.

Phase 3B introduces dev-only Supabase integration utilities and environment
management documentation for `vukasync-dev` without connecting staging or
production.

Phase 3C introduces the initial database backbone and authentication foundation
for `vukasync-dev` only.

## Planned system boundaries

```text
apps/
  web/        Next.js client portal and admin experience
  mobile/     Expo React Native mobile experience

packages/
  config/     shared linting, TypeScript, Tailwind, and tooling config
  ui/         shared design system components
  types/      shared TypeScript domain types
  utils/      shared utilities

Supabase
  auth        authentication and user identity
  database    product data, tenancy, billing references, activities
  storage     client files, reports, and assets
  functions   backend workflows where appropriate

Integrations
  Stripe      global payments
  M-Pesa      Kenya mobile money payments
  OpenAI      AI-assisted summaries, chatbots, and automation
  n8n         workflow automation
  Analytics   social platform metrics and activity data
```

## Architectural principles

- TypeScript is the implementation language across application code.
- Client isolation must be enforced in backend policies and service logic.
- Shared packages should hold reusable contracts and components, not
  application-specific shortcuts.
- Integration-specific code should be isolated from core product workflows.
- Automation should be observable and auditable.
- Manual intervention should be a first-class product workflow.
- Currency, provider, and region assumptions should remain configurable.

## Areas requiring detailed design

Before business feature implementation begins, the project should define:

- Authentication and organization membership model.
- Row-level security and authorization rules.
- Core data model for clients, projects, subscriptions, reports, activities,
  tickets, files, and resources.
- Payment provider abstraction and webhook handling.
- Social analytics ingestion model.
- Reporting model and publishing workflow.
- Notification strategy.
- File storage access model.
- Audit logging strategy.
- Environment and secret management.

Phase 3A addresses the backend architecture, database ERD, RLS policy approach,
and migration strategy:

- [Backend architecture](backend-architecture.md)
- [Database ERD](database-erd.md)
- [Row Level Security](row-level-security.md)
- [Supabase migration strategy](../engineering/supabase-migration-strategy.md)

Phase 3B addresses environment management and local development setup:

- [Environments](../operations/environments.md)
- [Local development](../engineering/local-development.md)
- [ADR 0004: Dev-only Supabase environment management](../decisions/0004-dev-only-supabase-environment-management.md)

Phase 3C addresses the database backbone:

- [Database backbone and authentication foundation](database-backbone-auth-foundation.md)
- [ADR 0005: Database backbone and authentication foundation](../decisions/0005-database-backbone-auth-foundation.md)
