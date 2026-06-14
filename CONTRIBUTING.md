# Contributing to VukaSync OS

VukaSync OS is currently documentation-first. Before adding application code,
make sure the relevant product, architecture, and engineering documents exist.

## Contribution principles

- Use TypeScript for future implementation work.
- Keep changes scoped and maintainable.
- Reuse existing components, packages, and conventions once they exist.
- Update documentation when behavior, architecture, or workflows change.
- Add ADRs for meaningful technical decisions.
- Preserve client data isolation and backend authorization in all designs.

## Before implementation work

Document or confirm:

- Authentication model.
- Authorization and role model.
- Client tenancy model.
- Core data model.
- Payment provider and currency handling.
- Integration boundaries.
- Testing expectations.

## Pull request expectations

Each pull request should explain:

- What changed.
- Why it changed.
- Which documents or modules are affected.
- How the change was verified.
