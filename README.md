# VukaSync OS

VukaSync OS is the client portal and business services platform for VukaSync.
It is designed to combine automation with human expertise so clients can see
transparent progress, measurable outcomes, and clear communication across all
services.

This repository is currently in Phase 2: Technical Foundation. It contains the
documentation-first foundation plus a minimal Turborepo scaffold for the web
app, mobile app, and shared packages. Business features have not been
implemented yet.

## Product direction

VukaSync OS will support:

- Social media management, analytics, calendars, engagement logs, and reports.
- Website and mobile app project tracking, milestones, requirements, launch
  tracking, and file sharing.
- Business systems and automation projects, including CRM work, internal tools,
  AI chatbots, and n8n workflows.
- Growth services such as branding, graphic design, SEO, consulting, and future
  service lines.
- Support tickets, resources, FAQs, documentation, training, and meeting
  scheduling.

The platform must support global clients, flexible currencies, Stripe, M-Pesa,
hybrid self-service subscriptions, and administrator-managed arrangements.

## Planned technology stack

- Turborepo monorepo
- Next.js web app
- Expo React Native mobile app
- Supabase backend
- TypeScript
- Tailwind CSS and NativeWind
- Stripe and M-Pesa payments
- OpenAI API
- n8n automation workflows

## Documentation

Start with the documentation index:

- [Documentation structure](docs/README.md)
- [Project vision](docs/product/project-vision.md)
- [Core modules](docs/product/core-modules.md)
- [Roles and access model](docs/product/roles-and-access.md)
- [Subscription and billing model](docs/product/subscriptions-and-billing.md)
- [Hybrid operations model](docs/product/hybrid-operations.md)
- [Architecture overview](docs/architecture/overview.md)
- [Engineering standards](docs/engineering/standards.md)
- [Repository structure](docs/engineering/repository-structure.md)
- [Initial architecture decision](docs/decisions/0001-documentation-first-foundation.md)
- [Technical foundation decision](docs/decisions/0002-technical-foundation-scaffold.md)
- [Backend architecture](docs/architecture/backend-architecture.md)
- [Database ERD](docs/architecture/database-erd.md)
- [Row Level Security](docs/architecture/row-level-security.md)
- [Supabase migration strategy](docs/engineering/supabase-migration-strategy.md)
- [Workspace backend architecture decision](docs/decisions/0003-workspace-multitenant-backend-architecture.md)

## Repository status

The foundation intentionally contains only technical scaffolding and
documentation. Product implementation should begin after the data model,
authentication model, payment flows, Supabase configuration, and module
boundaries are agreed.

## Workspace commands

Use pnpm from the repository root:

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```
