# Hybrid Operations

VukaSync OS should support automatic workflows while preserving space for
manual service delivery and strategic judgment.

## Automatic workflows

Examples:

- Subscription activation.
- Payment status syncing.
- Analytics syncing.
- Report generation.
- Notification delivery.
- Reminder workflows.
- Scheduled data refreshes.
- AI-assisted summaries and drafts.

Automatic workflows should be observable. Staff should be able to understand
what ran, when it ran, whether it succeeded, and what client-visible data was
changed.

## Manual workflows

Examples:

- Strategic notes.
- Custom client arrangements.
- Activities that are unavailable through APIs.
- Consulting updates.
- Client-specific recommendations.
- Manual report commentary.
- Internal-only delivery notes.

Manual updates should be structured enough to report on and audit, but flexible
enough to reflect real service work.

## Design principles

- Distinguish automated records from manually entered records.
- Track who or what created important records.
- Allow staff review before publishing sensitive client-visible updates.
- Keep client-facing information clear and polished.
- Keep internal operational context private by default.
- Make automation failures visible to staff without exposing confusing system
  errors to clients.
