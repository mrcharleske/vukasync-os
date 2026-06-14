# Supabase Migration Strategy

This document recommends how VukaSync OS should introduce Supabase migrations.
It is documentation only; no migrations are applied in Phase 3A.

## Supabase environments

VukaSync OS has three Supabase environments:

- `vukasync-dev`
- `vukasync-staging`
- `vukasync-prod`

All projects are hosted in Europe regions.

## Environment promotion flow

Migrations should be promoted in order:

```text
dev -> staging -> prod
```

Recommended rules:

- Develop and test new migrations in `vukasync-dev`.
- Validate migration order, RLS policies, and seed assumptions in
  `vukasync-staging`.
- Apply to `vukasync-prod` only after staging validation passes.
- Never edit a migration that has already been applied outside local
  experimentation.
- Add a new migration for every follow-up schema change.

## Recommended migration sequence

Use small, ordered migrations so each domain can be reviewed and tested.

```text
supabase/
  migrations/
    000001_enable_extensions.sql
    000002_create_enums.sql
    000003_create_auth_profiles.sql
    000004_create_workspaces.sql
    000005_create_services.sql
    000006_create_subscriptions.sql
    000007_create_payments.sql
    000008_create_features.sql
    000009_create_activities.sql
    000010_create_reports.sql
    000011_create_notifications.sql
    000012_create_support.sql
    000013_create_audit_logs.sql
    000014_create_rls_helpers.sql
    000015_enable_rls_and_policies.sql
```

## Migration responsibilities

### `000001_enable_extensions.sql`

Recommended extensions:

- `pgcrypto` for `gen_random_uuid()`.
- Any future text-search or scheduling extensions only after specific use cases
  are documented.

### `000002_create_enums.sql`

Decide whether to use Postgres enums or text columns with check constraints.

Phase 3A recommendation:

- Start with text columns plus check constraints for frequently changing
  product states.
- Consider enums only for stable, low-change values.

Reason:

- Early service and billing workflows may evolve quickly.
- Text plus constraints is easier to adjust through additive migrations.

### `000003_create_auth_profiles.sql`

Create:

- `profiles`
- profile update timestamp trigger
- optional auth user profile creation trigger

Do not add complex workspace assumptions in this migration.

### `000004_create_workspaces.sql`

Create:

- `workspaces`
- `workspace_members`
- `workspace_invitations`

This should establish the tenant boundary before domain tables are introduced.

### `000005_create_services.sql`

Create:

- `services`
- `workspace_services`

### `000006_create_subscriptions.sql`

Create:

- `plans`
- `subscriptions`
- `subscription_events`

### `000007_create_payments.sql`

Create:

- `payments`
- `payment_methods`

Provider-specific integrations should not be implemented in this migration.

### `000008_create_features.sql`

Create:

- `features`
- `plan_features`
- `workspace_feature_overrides`

### `000009_create_activities.sql`

Create:

- `activities`
- `activity_comments`

### `000010_create_reports.sql`

Create:

- `reports`
- `report_exports`

### `000011_create_notifications.sql`

Create:

- `notifications`
- `notification_preferences`

### `000012_create_support.sql`

Create:

- `support_tickets`
- `ticket_messages`

### `000013_create_audit_logs.sql`

Create:

- `audit_logs`

Audit logs should be append-only at the application level.

### `000014_create_rls_helpers.sql`

Create stable helper functions for:

- `is_super_admin()`
- `is_workspace_member(uuid)`
- `has_workspace_role(uuid, text[])`
- `can_manage_workspace(uuid)`
- `can_view_internal(uuid)`

These functions should be reviewed carefully because many policies will depend
on them.

### `000015_enable_rls_and_policies.sql`

Enable RLS and add policies after base tables and helper functions exist.

Recommended approach:

- Enable RLS on every application table.
- Add Super Admin policies.
- Add workspace member read policies.
- Add client visibility policies.
- Add strict write policies.
- Add policy tests before applying to production.

## Seed strategy

Use seed data only where appropriate:

### Development

May include:

- Demo workspaces.
- Demo users.
- Demo services.
- Demo plans.
- Demo feature flags.
- Sample activities, reports, and tickets.

### Staging

May include:

- Minimal realistic service catalog.
- Test plans.
- Controlled test workspaces.

### Production

Should include only deliberate production seed data:

- Initial service catalog.
- Initial plan catalog.
- Initial feature registry.

Avoid demo users and demo client workspaces in production.

## Type generation

After migrations are created and applied to a target environment, generate
TypeScript database types into a shared package.

Recommended target:

```text
packages/types/src/database.ts
```

Recommended process:

1. Apply migrations to `vukasync-dev`.
2. Generate database types from dev.
3. Commit generated types with the migration files.
4. Validate type consumers in web and mobile.

## RLS validation strategy

Before production migration:

- Test Super Admin global access.
- Test team member assigned workspace access.
- Test client access to own workspace.
- Test client isolation across workspaces.
- Test internal visibility restrictions.
- Test provider webhook service-role writes.
- Test that clients cannot mutate billing provider state.

## Rollback strategy

Because Supabase migrations should be treated as immutable after promotion:

- Prefer forward-only corrective migrations.
- Keep migrations small and reviewable.
- Avoid destructive schema changes until data retention and backup processes are
  documented.
- For high-risk changes, create a staging backup before promotion.

## Operational recommendations

- Keep Supabase project references and secrets outside source control.
- Document environment variables before app integration begins.
- Use separate webhook endpoints and secrets per environment.
- Keep production service-role keys restricted to backend-only execution
  contexts.
- Review RLS changes as security-sensitive changes.

## Phase 3A boundary

Phase 3A stops at documentation.

Do not apply:

- Supabase migrations.
- Seed files.
- Supabase client configuration.
- Authentication UI.
- Business dashboards.
