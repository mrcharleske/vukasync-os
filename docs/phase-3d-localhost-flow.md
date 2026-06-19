# First Localhost Experience (Phase 3D-C)

## User journey

`Landing -> Signup/Login -> Email Verification -> Onboarding -> Command Center`

## Implemented pages

Public:

- `/`
- `/login`
- `/signup`
- `/auth/verify`

Protected:

- `/onboarding`
- `/command-center`

## Auth requirements mapped

- Email + Password: implemented via signup/login server actions.
- Google Sign-In: implemented via OAuth action on `/login`.
- Email verification required before workspace creation: enforced in onboarding action and RLS.
- Profile auto-create: implemented via `auth.users` trigger migration.
- Protected routes: middleware redirects unauthenticated users to `/login`.

## Minimal command center scope

Current command center displays:

- greeting
- workspace status
- account status
- quick actions (Create Workspace / Accept Invitation)
