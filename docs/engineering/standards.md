# Engineering Standards

These standards apply to future VukaSync OS implementation work.

## Language and stack

- Use TypeScript for application and shared package code.
- Use Next.js for the web app.
- Use Expo React Native for the mobile app.
- Use Tailwind CSS for web styling and NativeWind for mobile styling.
- Use Supabase for backend services unless an approved architecture decision
  states otherwise.

## Code quality principles

- Prefer clarity over cleverness.
- Reuse existing components and helpers before adding new abstractions.
- Avoid duplication when shared behavior is stable and well understood.
- Keep module boundaries explicit.
- Keep integration code isolated from core business logic.
- Use structured APIs and typed contracts instead of ad hoc string handling.
- Document meaningful decisions in ADRs.

## Security and access

- Enforce authorization in backend policies and service logic.
- Never rely only on client-side checks.
- Keep internal notes private by default.
- Treat client files, billing data, and analytics as sensitive.
- Audit privileged administrative actions.
- Store secrets outside source control.

## Testing expectations

Testing strategy should scale with risk:

- Unit tests for shared business logic.
- Integration tests for payment, subscription, authorization, and reporting
  flows.
- End-to-end tests for critical client and admin journeys.
- Manual QA checklists for flows that depend on third-party sandboxes.

## Documentation expectations

Major changes should update the relevant documentation:

- Product behavior changes belong in `docs/product`.
- Architectural decisions belong in `docs/architecture` or `docs/decisions`.
- Engineering process changes belong in `docs/engineering`.
- Operational workflow changes belong in `docs/operations`.
