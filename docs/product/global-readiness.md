# Global Readiness

VukaSync OS should be designed for international clients from the beginning.

## Payments

Initial payment providers:

- Stripe for global payments.
- M-Pesa for Kenya-focused mobile money flows.

Payment integrations should be isolated behind provider-specific boundaries so
new providers can be added without rewriting product logic.

## Currencies

Currency must be flexible:

- Use explicit currency codes.
- Avoid hardcoded currency assumptions in plans, invoices, reports, and UI copy.
- Support market-specific pricing when needed.
- Format currency values for display at the edge of the application.

## Localization

The initial product may launch in English, but the system should avoid choices
that block future localization:

- Keep user-facing text centralized when practical.
- Store timestamps in a consistent canonical format.
- Display dates and times according to user or client preferences when possible.
- Avoid region-specific address and phone number assumptions.

## Compliance and privacy

Future planning should cover:

- Client data residency expectations.
- Privacy policies and data processing agreements.
- Audit logs for privileged access.
- Secure file access.
- Retention policies for reports, tickets, and analytics snapshots.
