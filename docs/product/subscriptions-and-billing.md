# Subscriptions and Billing

VukaSync OS must support hybrid subscriptions so clients can onboard through
self-service flows or through administrator-managed arrangements.

## Automatic subscriptions

Automatic flows should support:

- Client self-signup.
- Online payment.
- Subscription activation after successful payment.
- Automatic access provisioning.
- Renewal, cancellation, and payment status handling.
- Notifications for subscription lifecycle events.

Stripe is the primary global payment provider for automatic card-based
subscriptions.

## Manual subscriptions

Manual flows should support:

- Administrator-created clients.
- Manually assigned plans or service packages.
- Custom prices, terms, or payment arrangements.
- Offline payment tracking.
- Manual subscription activation, suspension, and cancellation.
- Internal notes explaining custom arrangements.

Manual flows are required because real client engagements may include custom
contracts, regional payment preferences, negotiated service packages, or
strategic exceptions.

## Payment providers

The platform should be designed to support multiple providers:

- Stripe for global card and subscription payments.
- M-Pesa for Kenya-focused mobile money payments.

Payment code should be provider-aware and should not assume a single gateway.

## Currency principles

- Do not hardcode a single currency.
- Store currency codes using ISO 4217 values where possible.
- Treat amount precision carefully and store money in minor units when supported
  by the provider.
- Keep display formatting separate from stored billing data.
- Allow plan prices to vary by currency and market.

## Open design questions

- Which currencies should be available at launch?
- Which billing cycles should be supported first?
- How should tax, invoices, and receipts be handled by region?
- What is the manual approval process for custom arrangements?
