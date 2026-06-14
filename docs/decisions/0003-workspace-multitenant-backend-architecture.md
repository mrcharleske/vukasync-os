# ADR 0003: Workspace-Based Multi-Tenant Backend Architecture

## Status

Accepted

## Context

VukaSync OS is a global client portal and business services platform. It must
support:

- Super Admin users with full platform access.
- Internal team members assigned to multiple clients.
- Client users who can access only their own data.
- Hybrid automatic and manual subscriptions.
- Manual service delivery updates.
- Automated analytics, reporting, and notifications in future phases.
- Stripe and M-Pesa payment flows.
- International clients with flexible currencies, locales, countries, and
  timezones.

The project already follows a documentation-first philosophy. Phase 3A designs
the backend architecture before migrations, dashboards, Supabase client setup,
or business UI are implemented.

## Decision

VukaSync OS will use a workspace-based multi-tenant Supabase architecture.

Each client organization, internal operating space, or future partner space is
represented by a `workspace`.

Users are connected to workspaces through `workspace_members`.

Most operational records are scoped by `workspace_id`, including:

- Services enabled for a workspace.
- Subscriptions.
- Payments.
- Feature overrides.
- Activities.
- Reports.
- Notifications.
- Support tickets.
- Audit logs.

Global catalog tables, such as `services`, `plans`, and `features`, remain
outside a single workspace and are managed by privileged roles.

## Rationale

This architecture was chosen because it:

- Matches the product requirement that clients access only their own data.
- Supports multiple users per client organization.
- Supports internal VukaSync team members assigned to many workspaces.
- Allows Super Admin users to manage the platform globally.
- Maps cleanly to Supabase Row Level Security.
- Keeps tenant ownership explicit in the database schema.
- Supports manual administrative arrangements and automatic provider-driven
  workflows.
- Keeps billing, service delivery, reports, support, and activities tenant-aware.
- Supports global readiness through workspace-level currency, locale, country,
  and timezone fields.

## Alternatives considered

### Single global client table without workspaces

This would model clients directly and attach records to `client_id`.

Rejected because:

- It does not naturally support internal workspaces or future partner spaces.
- It makes multi-user client organizations less flexible.
- It ties tenancy to one customer concept instead of a broader workspace model.

### Separate database schema per client

This would isolate every client in a separate Postgres schema.

Rejected because:

- It increases operational complexity.
- Cross-client internal reporting becomes harder.
- Migration management becomes more expensive.
- It is unnecessary for the current scale and product requirements.

### Separate Supabase project per client

This would isolate every client in a separate Supabase project.

Rejected because:

- It creates high environment and deployment overhead.
- It complicates global administration.
- It makes shared service catalogs, plans, and features harder to manage.
- It is not needed for the current product requirements.

## Consequences

Positive outcomes:

- Tenant isolation can be enforced consistently with RLS.
- The data model supports both self-service and administrator-managed clients.
- Shared service modules can reuse common workspace-owned primitives.
- Client-visible and internal-only records can coexist safely with visibility
  rules.
- Future features can be added under the workspace boundary.

Tradeoffs:

- Most business tables require `workspace_id`.
- RLS helper functions become critical infrastructure.
- Policy tests must be comprehensive before production use.
- Cross-workspace analytics require privileged or service-role access.
- Care must be taken to avoid exposing internal records to client users.

## Implementation notes

Implementation should proceed in this order:

1. Create backend architecture documentation.
2. Create ERD documentation.
3. Create RLS documentation.
4. Create migration strategy documentation.
5. Draft migrations without applying them.
6. Apply and validate migrations in `vukasync-dev`.
7. Validate in `vukasync-staging`.
8. Promote to `vukasync-prod` only after approval.

Phase 3A stops at documentation. No migrations are applied by this ADR.
