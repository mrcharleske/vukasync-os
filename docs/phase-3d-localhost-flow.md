# First Authenticated Experience (Phase 4)

## User journey

`Landing -> Signup/Login -> Email Verification -> Onboarding -> Service Selection -> Business Command Center`

## Implemented pages

Public:

- `/`
- `/login`
- `/signup`
- `/auth/verify`

Protected:

- `/onboarding`
- `/service-selection`
- `/command-center`
- `/team/invite`

## Auth requirements mapped

- Email + Password: implemented via signup/login server actions.
- Google Sign-In: implemented via OAuth action on `/login`.
- Email verification required before workspace creation: enforced in onboarding action and RLS.
- Profile auto-create: implemented via `auth.users` trigger migration.
- Protected routes: middleware redirects unauthenticated users to `/login`.

## Command center scope

Current command center displays:

- greeting
- workspace overview
- active services
- subscription status
- member count
- activity summary
- quick actions (Add Service / Invite Team Member / View Subscription / Open Chatbot)
