# Architecture Overview

VukaSync OS is planned as a Turborepo monorepo with web, mobile, shared
packages, Supabase-backed services, and external integrations.

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

Before application implementation begins, the project should define:

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
