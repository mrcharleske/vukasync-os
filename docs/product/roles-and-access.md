# Roles and Access

VukaSync OS must use role-based access control with strong client isolation.

## Roles

### Super Admin

Super Admin users have full platform access.

Responsibilities may include:

- Managing clients, team members, subscriptions, and service assignments.
- Viewing and editing all projects, reports, tickets, files, and activities.
- Configuring integrations and automation.
- Applying manual subscription or billing arrangements.
- Auditing platform activity.

### Team Member

Team Members are internal VukaSync staff with limited access based on
assignments.

Responsibilities may include:

- Updating assigned projects.
- Adding activity logs, notes, deliverables, and reports.
- Responding to support tickets.
- Viewing client context required for assigned work.

Access should be scoped by assignment, service module, and permission level.

### Client

Clients can only access their own data.

Client users may:

- View their projects, subscriptions, reports, activities, tickets, files, and
  resources.
- Submit support requests.
- Review milestones and deliverables.
- Manage self-service subscription and billing details when enabled.

Clients must not be able to access another client's records, files, analytics,
or billing data.

## Access principles

- Enforce authorization on the backend, not only in the user interface.
- Model client ownership explicitly on client-owned records.
- Support multiple users per client organization.
- Keep internal notes separate from client-visible notes.
- Audit privileged actions such as role changes, billing changes, and manual
  subscription overrides.
