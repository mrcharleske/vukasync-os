# Repository Structure

VukaSync OS is planned as a Turborepo monorepo. The current repository contains
documentation plus the Phase 2 technical scaffold for web, mobile, and shared
packages. Business feature code should be added after the core architecture and
data model are agreed.

## Planned layout

```text
.
├── apps/
│   ├── web/        Next.js web app
│   └── mobile/     Expo React Native app
├── packages/
│   ├── config/     shared tooling configuration
│   ├── supabase/   shared Supabase client utilities
│   ├── ui/         shared design system components
│   ├── types/      shared domain contracts
│   └── utils/      shared utilities
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── engineering/
│   ├── operations/
│   └── product/
└── .github/
```

## Ownership boundaries

- `apps/web` should own web-specific routing, layouts, pages, and browser
  behavior.
- `apps/mobile` should own mobile navigation, device behavior, and Expo-specific
  configuration.
- `packages/ui` should hold reusable presentation components that are stable
  across apps.
- `packages/supabase` should hold shared Supabase client construction utilities
  and environment validation helpers.
- `packages/types` should hold shared TypeScript contracts that represent
  product concepts.
- `packages/utils` should hold framework-neutral utilities.
- `packages/config` should hold shared tooling and style configuration.

## Current scaffold policy

The scaffold exists to validate workspace tooling, TypeScript configuration,
styling setup, and package consumption. It should not accumulate business
features until the relevant product and architecture documents are in place.

## Package manager and orchestration

- Use pnpm for dependency management.
- Use Turborepo for workspace orchestration.
- Keep shared package APIs small until real cross-app needs are proven.
- Keep authentication, payments, and service modules out of the scaffold until
  their designs are documented.
- Keep Supabase staging and production connections out of local development
  until promotion procedures are approved.
