# ADR 0005: Database Backbone and Authentication Foundation

## Status

Accepted

## Context

VukaSync OS has completed:

- Product Foundation.
- Technical Foundation.
- Backend Architecture Design.
- Supabase Integration and Environment Management.

The platform is a global, workspace-based, multi-tenant client portal and
business services platform. It needs a minimum database backbone before future
authentication, onboarding, subscriptions, service assignment, and client
operations can be implemented.

## Decision

Phase 3C will create the initial Supabase schema for `vukasync-dev` only.

The schema includes:

- `profiles`
- `platform_roles`
- `workspaces`
- `workspace_members`
- `workspace_invitations`
- `services`
- `workspace_services`
- `plans`
- `subscriptions`
- `subscription_events`
- `audit_logs`

Platform-wide roles are modeled separately in `platform_roles` and referenced
from `profiles.platform_role_id`.

Workspace roles are scoped through `workspace_members.role`.

Supported platform roles:

- `SUPER_ADMIN`
- `PLATFORM_ADMIN`

Supported workspace roles:

- `OWNER`
- `TEAM_MEMBER`
- `CLIENT`

## Rationale

This design:

- Keeps platform-wide access separate from workspace-scoped membership.
- Supports client isolation through workspace membership.
- Allows future onboarding flows to distinguish workspace creation from
  invitation acceptance.
- Enforces verified email before workspace creation.
- Supports hybrid manual and automatic service operations.
- Keeps plans free from hardcoded currency assumptions.
- Provides audit hooks for critical operational events.
- Prepares the repository for generated Supabase database types.

## Consequences

Positive outcomes:

- The dev database has a usable tenant backbone.
- Future auth implementation has profile and onboarding primitives.
- Future subscriptions can attach to workspaces and plans.
- RLS policies establish tenant isolation from the first applied schema.
- Generated types can be used by shared packages and apps.

Tradeoffs:

- The first `SUPER_ADMIN` assignment requires a manual service-role bootstrap.
- Auth UI and session behavior remain out of scope.
- Invitation acceptance may still need a dedicated RPC in a later phase for a
  polished onboarding flow.
- Pricing is deferred to a future commercial model rather than placed directly
  on plans.

## Environment boundary

Apply migrations only to:

```text
vukasync-dev
```

Do not connect or apply migrations to:

- `vukasync-staging`
- `vukasync-prod`

## Follow-up work

Future phases should:

1. Bootstrap the first Super Admin profile.
2. Implement authentication UI and email verification flows.
3. Add onboarding screens for workspace creation and invitation acceptance.
4. Add RLS tests for tenant isolation.
5. Add service-role backend functions where direct client writes are not ideal.
6. Design pricing and payment provider integration.
