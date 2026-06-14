# Database Backbone & Authentication Foundation

Phase 3C implements the minimum Supabase database backbone needed to support
future authentication, onboarding, subscriptions, services, and client
operations.

## Scope

Included:

- Profiles linked to Supabase Auth users.
- Separate platform role model.
- Workspace-based tenancy.
- Workspace-scoped roles.
- Workspace invitations.
- Service catalog and workspace service assignments.
- Plan catalog and subscriptions.
- Subscription events.
- Audit logs.
- Row Level Security policies.
- Foundation seed data.
- Database type generation process.

Not included:

- Login UI.
- Dashboards.
- Social integrations.
- Analytics syncing.
- Payment gateways.
- Business workflows.
- Staging or production migration application.

## Environment boundary

Phase 3C applies migrations only to:

```text
vukasync-dev
```

Do not connect or apply migrations to:

- `vukasync-staging`
- `vukasync-prod`

## Migration sequence

```text
000001_enable_extensions.sql
000002_create_shared_functions.sql
000003_create_profiles_and_platform_roles.sql
000004_create_workspaces.sql
000005_create_services.sql
000006_create_subscriptions.sql
000007_create_audit_logs.sql
000008_seed_foundation_data.sql
000009_enable_rls_policies.sql
```

## Platform access

Platform-wide access is modeled with a dedicated table:

```text
platform_roles
profiles.platform_role_id -> platform_roles.id
```

Seeded roles:

- `SUPER_ADMIN`
- `PLATFORM_ADMIN`

The first platform admin assignment is a bootstrap operation and should be
performed manually with service-role privileges after a trusted profile exists.

## Workspace access

Workspace-scoped access is modeled with:

```text
workspace_members
```

Supported workspace roles:

- `OWNER`
- `TEAM_MEMBER`
- `CLIENT`

## Onboarding model

After signup and email verification, a user must choose one path:

1. Create a workspace.
2. Accept a workspace invitation.

Workspace creation is blocked by RLS unless the user's email is verified.

When a verified user creates a workspace:

- A workspace row is created.
- The creator is automatically inserted as `OWNER` in `workspace_members`.
- The creator's profile records the workspace as the default workspace when no
  default exists.

Invitation acceptance is constrained so invitees can accept invitations
addressed to their own verified email without changing the workspace, role,
token, inviter, or deletion state.

## Table relationships

```text
auth.users 1--1 profiles
platform_roles 1--many profiles

profiles 1--many workspaces.created_by
workspaces 1--many workspace_members
profiles 1--many workspace_members

workspaces 1--many workspace_invitations
profiles 1--many workspace_invitations.invited_by
profiles 1--many workspace_invitations.accepted_by

services 1--many workspace_services
workspaces 1--many workspace_services

plans 1--many subscriptions
workspaces 1--many subscriptions
subscriptions 1--many subscription_events

workspaces 1--many audit_logs
profiles 1--many audit_logs.actor_id
```

## Soft-delete strategy

Soft-delete columns are included on mutable operational and catalog tables:

- `platform_roles.deleted_at`
- `profiles.deleted_at`
- `workspaces.deleted_at`
- `workspace_members.deleted_at`
- `workspace_invitations.deleted_at`
- `services.deleted_at`
- `workspace_services.deleted_at`
- `plans.deleted_at`
- `subscriptions.deleted_at`

Append-only event tables do not use soft deletes:

- `subscription_events`
- `audit_logs`

## International readiness

The backbone avoids hardcoded currency assumptions.

Workspaces include:

- `primary_currency`
- `country_code`
- `locale`
- `timezone`

Profiles include:

- `locale`
- `timezone`

Plans intentionally do not include fixed pricing or currency. Pricing can be
modeled later with plan pricing tables or subscription-specific commercial
terms.

## Seed strategy

Seeds are idempotent and use `insert ... on conflict` patterns.

Seeded platform roles:

- `SUPER_ADMIN`
- `PLATFORM_ADMIN`

Seeded services:

- Social Media Management
- Websites & Mobile Apps
- Business Systems & Automation
- Growth Services

Seeded plans:

- Starter: Entry-level package.
- Growth: Mid-tier package.
- Authority: Premium package.

## RLS summary

### Profiles

- Users can read only their own profile.
- Users can insert their own fallback profile only without a platform role.
- Users cannot update their own platform role through RLS.

### Workspaces

- Members can read only workspaces they belong to.
- Verified users can create workspaces.
- Owners and platform admins can update workspaces.

### Workspace members

- Members can view their own memberships.
- Owners and platform admins can manage memberships.

### Workspace invitations

- Owners can create invitations.
- Invitees can view invitations addressed to their email.
- Verified invitees can accept their own invitation without changing protected
  fields.

### Workspace services

- Workspace members can view assigned services.
- Owners and platform admins can manage assignments.

### Subscriptions

- Workspace owners can view subscriptions.
- Platform admins retain oversight and management access.

### Audit logs

- Platform admins have full access.
- Workspace users can view workspace-visible audit events for workspaces they
  belong to.
- Audit logs are append-only at the application level.

## Audit logging

The schema supports and automatically logs these actions where the relevant
table operation exists:

- `WORKSPACE_CREATED`
- `INVITATION_SENT`
- `INVITATION_ACCEPTED`
- `SERVICE_ASSIGNED`
- `SUBSCRIPTION_CREATED`
- `SUBSCRIPTION_CHANGED`
- `ROLE_CHANGED`

## Database type generation

After migrations are applied to `vukasync-dev`, regenerate database types:

```bash
pnpm supabase gen types typescript --linked --schema public > packages/types/src/database.ts
```

Then validate:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Rollback considerations

- Phase 3C applies only to `vukasync-dev`.
- Do not apply these migrations to staging or production in this phase.
- Prefer forward-only corrective migrations after a migration is pushed to a
  shared Supabase environment.
- If the dev environment must be reset, confirm explicitly before destructive
  action.
- Seeds are idempotent and can be reapplied safely.
- RLS policies are isolated in the final migration to make policy fixes easier
  to review.

## Risks

- Supabase CLI must be linked to the correct `vukasync-dev` project reference.
- Email verification enforcement depends on Supabase Auth user metadata.
- Bootstrap assignment of the first `SUPER_ADMIN` requires service-role access.
- RLS helper functions must avoid recursive table-policy evaluation.
- Generated database types require successful dev migration application.
