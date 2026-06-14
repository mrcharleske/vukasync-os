# Repository Structure

VukaSync OS is planned as a Turborepo monorepo. The current repository contains
documentation and placeholders only; application code should be added after the
core architecture and data model are agreed.

## Planned layout

```text
.
├── apps/
│   ├── web/        Next.js web app
│   └── mobile/     Expo React Native app
├── packages/
│   ├── config/     shared tooling configuration
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
- `packages/types` should hold shared TypeScript contracts that represent
  product concepts.
- `packages/utils` should hold framework-neutral utilities.
- `packages/config` should hold shared tooling and style configuration.

## Current placeholder policy

Placeholder directories exist to communicate the intended monorepo shape. They
should not accumulate implementation code until the relevant architecture
documents are in place.
