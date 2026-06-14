# Row Level Security

This document describes recommended Supabase Row Level Security (RLS) policies
for the Phase 3A workspace-based backend architecture. It is design
documentation only; no policies have been applied.

## Goals

- Clients can access only their own workspace data.
- Internal team members can access workspaces they are assigned to.
- Super Admin users can manage all platform data.
- Internal-only records stay hidden from clients.
- Provider webhooks and backend automation use service-role access, not client
  session policies.

## Role sources

### Platform role

Stored on `profiles.platform_role`.

Recommended values:

- `super_admin`
- `team_member`
- `client`

### Workspace role

Stored on `workspace_members.role`.

Recommended values:

- `owner`
- `admin`
- `team_member`
- `client_admin`
- `client_member`
- `viewer`

## Recommended helper functions

Implement helper functions in SQL before enabling broad table policies.

### `current_profile_id()`

Returns the current Supabase user id.

```sql
auth.uid()
```

### `is_super_admin()`

Returns true when the current user has the `super_admin` platform role.

Expected behavior:

```text
profiles.id = auth.uid()
profiles.platform_role = 'super_admin'
```

### `is_workspace_member(target_workspace_id uuid)`

Returns true when the current user is an active member of a workspace.

Expected behavior:

```text
workspace_members.profile_id = auth.uid()
workspace_members.workspace_id = target_workspace_id
workspace_members.status = 'active'
```

### `has_workspace_role(target_workspace_id uuid, allowed_roles text[])`

Returns true when the current user has one of the allowed workspace roles.

### `can_manage_workspace(target_workspace_id uuid)`

Returns true for:

- Super Admin users.
- Active workspace `owner` users.
- Active workspace `admin` users.

### `can_view_internal(target_workspace_id uuid)`

Returns true for:

- Super Admin users.
- Active internal team members assigned to the workspace.
- Workspace roles intended for internal visibility.

## General policy principles

### Read policies

Most workspace-owned tables should allow reads when:

```text
is_super_admin()
or is_workspace_member(workspace_id)
```

Client-visible tables must additionally enforce:

```text
visibility = 'client'
or can_view_internal(workspace_id)
```

### Insert policies

Insert policies should be stricter than read policies:

- Super Admin can insert administrative records.
- Workspace admins can insert client-managed records where appropriate.
- Team members can insert operational records in assigned workspaces.
- Clients can insert only client-owned records such as support tickets and
  ticket messages.

### Update policies

Update policies should depend on domain ownership:

- Catalog tables should be Super Admin only.
- Workspace settings should be Super Admin or workspace admin only.
- Reports should be internal-only until client review workflows are designed.
- Payments and subscription provider state should be service-role managed.

### Delete policies

Prefer soft state changes over deletes for business records.

Recommended approach:

- Use `status = 'archived'` or equivalent.
- Restrict hard deletes to Super Admin or service-role operations.
- Avoid deletes on append-only tables such as `subscription_events` and
  `audit_logs`.

## Domain policy recommendations

## Authentication and profiles

### `profiles`

Read:

- Users can read their own profile.
- Active workspace members can read limited profile fields for members of the
  same workspace.
- Super Admin can read all profiles.

Update:

- Users can update safe fields on their own profile, such as name, avatar,
  locale, and timezone.
- Super Admin can update platform role and administrative fields.

Important:

- Do not allow users to update their own `platform_role`.

## Workspaces

### `workspaces`

Read:

- Super Admin can read all.
- Active members can read their workspaces.

Insert:

- Super Admin can create any workspace.
- Future self-service signup flows may create client workspaces through trusted
  backend functions.

Update:

- Super Admin can update all workspace fields.
- Workspace admins can update limited non-billing fields.

### `workspace_members`

Read:

- Super Admin can read all.
- Active workspace members can read membership for their workspace.

Insert and update:

- Super Admin can manage all memberships.
- Workspace owners/admins can invite and manage non-owner users, subject to
  business rules.

Delete:

- Prefer `status = 'removed'` over hard delete.

### `workspace_invitations`

Read:

- Super Admin can read all.
- Workspace admins can read invitations for their workspace.

Insert:

- Super Admin and workspace admins can create invitations.

Update:

- Workspace admins can revoke pending invitations.
- Acceptance should happen through a controlled backend function.

## Services

### `services`

Read:

- Authenticated users can read active services.
- Super Admin can read all service records.

Write:

- Super Admin only.

### `workspace_services`

Read:

- Super Admin can read all.
- Active workspace members can read services for their workspace.

Write:

- Super Admin and authorized internal team members can manage.
- Clients should not directly manage enabled services unless a future
  self-service service marketplace is designed.

## Subscriptions and payments

### `plans`

Read:

- Authenticated users can read active plans.
- Super Admin can read all plans.

Write:

- Super Admin only.

### `subscriptions`

Read:

- Super Admin can read all.
- Authorized internal users can read assigned workspace subscriptions.
- Client admins can read their own workspace subscriptions.

Write:

- Super Admin can create or update manual subscriptions.
- Provider-driven writes should use service-role backend code.
- Clients should not directly update provider subscription state.

### `subscription_events`

Read:

- Super Admin and authorized internal users can read.
- Client admins may read sanitized events later, but not raw provider payloads
  by default.

Write:

- Service role and Super Admin only.

### `payments`

Read:

- Super Admin can read all.
- Client admins can read their own workspace payment records.
- Internal team members can read payment state when assigned and authorized.

Write:

- Service role for provider webhooks.
- Super Admin for manual payment records.

### `payment_methods`

Read:

- Super Admin can read all.
- Client admins can read payment method references for their workspace.

Write:

- Provider setup flows and trusted backend functions only.
- Never expose raw payment credentials through application policies.

## Feature flags

### `features`

Read:

- Authenticated users can read active features if needed by clients.
- Super Admin can read all.

Write:

- Super Admin only.

### `plan_features`

Read:

- Authenticated users can read active plan feature mapping if needed by clients.
- Super Admin can read all.

Write:

- Super Admin only.

### `workspace_feature_overrides`

Read:

- Super Admin can read all.
- Authorized internal users can read assigned workspace overrides.
- Client admins may read effective feature state but should not necessarily see
  internal override reasons.

Write:

- Super Admin only at first.

## Activities

### `activities`

Read:

- Super Admin can read all.
- Internal team members can read assigned workspace activities.
- Clients can read only `visibility = 'client'` activities in their workspace.

Insert:

- Internal team members can create manual activities in assigned workspaces.
- Automation and integration activities should be inserted by service-role
  backend processes.
- Clients should not create staff activity records.

Update:

- Internal team members can update their own draft/manual records where allowed.
- Published client-visible activity edits should be audited.

### `activity_comments`

Read:

- Same workspace visibility rule as `activities`.

Insert:

- Workspace members can comment where allowed.
- Client comments should default to `visibility = 'client'`.
- Internal comments can use `visibility = 'internal'`.

## Reports

### `reports`

Read:

- Super Admin can read all.
- Internal team members can read assigned workspace reports.
- Clients can read only published client-visible reports.

Insert and update:

- Internal users only for drafts and review workflow.
- Publishing should require internal authorization.

### `report_exports`

Read:

- Same visibility and publication rules as parent reports.

Write:

- Service role and authorized internal users.

## Notifications

### `notifications`

Read:

- Users can read their own notifications.
- Super Admin can read all for support and auditing.

Update:

- Users can mark their own notifications as read.

Insert:

- Service role and trusted backend functions.

### `notification_preferences`

Read:

- Users can read their own preferences.
- Super Admin can read all.

Write:

- Users can manage their own preferences.

## Support

### `support_tickets`

Read:

- Super Admin can read all.
- Internal team members can read assigned workspace tickets.
- Clients can read tickets in their workspace that are client-visible.

Insert:

- Clients can create tickets in their own workspace.
- Internal users can create tickets for assigned workspaces.

Update:

- Internal team members can update status, priority, assignee, and category.
- Clients can update limited requester fields where appropriate.

### `ticket_messages`

Read:

- Same workspace and visibility rule as support tickets.

Insert:

- Ticket participants can add messages.
- Internal-only notes must use `visibility = 'internal'`.

## Audit logs

### `audit_logs`

Read:

- Super Admin can read all.
- Internal audit access may be added later for limited workspace views.
- Clients should not read raw audit logs by default.

Write:

- Service role and trusted backend functions only.

Delete:

- No application-level deletes.

## Testing recommendations

RLS tests should cover:

- Client A cannot read Client B workspace data.
- Client users cannot read internal activity, report, ticket, or message records.
- Team members can access assigned workspaces only.
- Super Admin can access all workspaces.
- Clients cannot update subscription provider state.
- Provider webhook writes require service-role execution.
- Workspace admins cannot grant themselves Super Admin role.

## Future improvements

- Add policy test fixtures for each role.
- Add database functions for effective feature resolution.
- Add storage policies once file ownership tables are designed.
- Add sanitized client-facing audit events if needed.
- Add service-specific authorization helpers when service modules become more
  detailed.
