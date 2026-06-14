# Backend Architecture

Phase 3A designs the VukaSync OS backend architecture without applying
migrations or implementing business features.

## Scope

This document covers the proposed Supabase-backed data architecture for:

- Authentication and profiles.
- Workspace-based multi-tenancy.
- Services.
- Subscriptions.
- Payments.
- Feature flags.
- Activities.
- Reports.
- Notifications.
- Support.
- Audit logs.

## Explicit non-goals

This phase does not include:

- Applying Supabase migrations.
- Building dashboards.
- Implementing business UI.
- Configuring Supabase clients in the apps.
- Adding authentication flows.
- Adding payment provider integrations.
- Adding analytics, OpenAI, or n8n workflows.

## Environment model

VukaSync OS uses three Supabase environments:

- `vukasync-dev`
- `vukasync-staging`
- `vukasync-prod`

All Supabase projects are hosted in Europe regions. Migrations should be
developed and validated in `dev`, promoted to `staging`, and only then applied
to `prod`.

## Tenancy model

VukaSync OS should use a workspace-based multi-tenant architecture.

```text
auth.users
  -> profiles
  -> workspace_members
  -> workspaces
  -> workspace-owned records
```

Most operational records should include:

```sql
workspace_id uuid not null references public.workspaces(id)
```

This makes tenant ownership explicit and keeps Supabase Row Level Security
policies understandable.

## Role model

Use two role layers:

1. Platform role on `profiles.platform_role`.
2. Workspace role on `workspace_members.role`.

### Platform roles

- `super_admin`: global administrative access.
- `team_member`: internal VukaSync staff.
- `client`: client-side user.

### Workspace roles

- `owner`
- `admin`
- `team_member`
- `client_admin`
- `client_member`
- `viewer`

This split supports Super Admin global access, team members assigned to many
workspaces, and client users restricted to their own workspace data.

## Core domain relationships

```text
auth.users 1--1 profiles

profiles 1--many workspace_members
workspaces 1--many workspace_members
workspaces 1--many workspace_invitations

services 1--many workspace_services
workspaces 1--many workspace_services

plans 1--many subscriptions
workspaces 1--many subscriptions
subscriptions 1--many subscription_events
subscriptions 1--many payments

workspaces 1--many payment_methods
profiles 1--many payment_methods

features 1--many plan_features
plans 1--many plan_features
workspaces 1--many workspace_feature_overrides
features 1--many workspace_feature_overrides

workspaces 1--many activities
workspace_services 1--many activities
activities 1--many activity_comments

workspaces 1--many reports
workspace_services 1--many reports
reports 1--many report_exports

workspaces 1--many notifications
profiles 1--many notifications

workspaces 1--many support_tickets
support_tickets 1--many ticket_messages

workspaces 1--many audit_logs
profiles 1--many audit_logs
```

## Data ownership principles

- Workspace-owned records must include `workspace_id`.
- Global catalog records, such as `services`, `plans`, and `features`, do not
  belong to a single workspace.
- Provider identifiers should be stored as references, not as authoritative
  business state.
- Raw payment credentials must not be stored in VukaSync tables.
- Internal notes and client-visible content must be separated by visibility
  rules.
- Append-only event and audit tables should be used for lifecycle traceability.

## Hybrid workflow considerations

VukaSync OS must support automatic and manual workflows.

Recommended fields for workflow-sensitive records:

- `source`: `manual`, `automation`, `integration`, or `system`.
- `created_by`: profile responsible for a manual or administrative action.
- `metadata`: provider-specific or workflow-specific context.
- `status`: lifecycle state.
- `visibility`: `internal` or `client`.

Examples:

- `subscriptions.source` distinguishes self-service activation from manual
  administrative assignment.
- `activities.source` distinguishes manual staff updates from automation or
  integration records.
- `reports.status` supports draft, review, and published workflows.
- `workspace_feature_overrides.reason` documents custom arrangements.
- `subscription_events` records provider webhooks and manual changes.

## International readiness

The backend should be global-ready from the first migration:

- Store currencies as ISO 4217 currency codes in `currency` fields.
- Store monetary values in minor units using `amount_minor`.
- Store workspace-level `country_code`, `locale`, `timezone`, and
  `primary_currency`.
- Store profile-level `locale` and `timezone`.
- Use `timestamptz` for all timestamp columns.
- Keep payment provider fields generic with `provider`,
  `provider_payment_id`, and `provider_subscription_id`.
- Use `metadata jsonb` for provider-specific details until provider-specific
  tables are justified.

## Future extensibility

The proposed model leaves room for:

- Multiple users per client organization.
- Multiple client workspaces per internal team member.
- Additional service modules.
- Service-specific project tables.
- Provider-specific billing tables when Stripe or M-Pesa requirements grow.
- Analytics ingestion tables.
- File storage ownership tables.
- Notification delivery logs.
- AI and automation run logs.
- Data retention and compliance policies.

## Related documents

- [Database ERD](database-erd.md)
- [Row Level Security](row-level-security.md)
- [Supabase migration strategy](../engineering/supabase-migration-strategy.md)
- [ADR 0003: Workspace-based multi-tenant backend architecture](../decisions/0003-workspace-multitenant-backend-architecture.md)
