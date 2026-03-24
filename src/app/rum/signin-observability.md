# Sign-in observability

This document describes sign-in observability: where events are emitted, how success/failure is classified, and how to query it reliably in New Relic.

## Scope

Primary emitters:

- `sign-in/components/form-sign-in/form-sign-in.component.ts`
- `core/sign-in/sign-in.service.ts`
- `guards/sign-in.guard.ts`
- `guards/two-factor-signin.guard.ts`
- `core/error-handler/error-handler.service.ts` (global cross-cutting errors)

## Event model

Sign-in currently uses simple events (not a dedicated journey type).

Each sign-in event is emitted with `recordSimpleEvent(...)`, so in New Relic:

- `eventType() = 'PageAction'`
- `actionName` equals the event name

## Classification

Sign-in telemetry intentionally separates application-level and HTTP-level failures.

### Application outcome events (component-level)

In `FormSignInComponent.onSubmit()`:

- Success path records a success event before redirect logic.
- Unsuccessful sign-in responses (`success: false`) record failure with classification flags such as:
  - deprecated
  - disabled
  - unclaimed
  - bad verification or recovery code
  - invalid user type
  - bad credentials fallback

These events represent business/application outcomes from sign-in responses.

Additionally, the OAuth edge state `invalid_grant` in post-login OAuth handoff is emitted as a dedicated simple event.

### HTTP/transport failure event (service-level)

In `SignInService.signIn()`:

- HTTP POST calls are retried (`retry(3)`).
- On final failure, `recordSignInHttpError(...)` emits a dedicated sign-in HTTP error event with flow context.

Included attributes typically contain:

- flow label (password legacy, password auth-server, social, institutional)
- OAuth context boolean
- HTTP status/statusText/request URL path+query when available
- non-HTTP marker for unexpected error object types

This event represents transport/API failure, distinct from application rejection.

### Global errors that can co-exist

`ErrorHandlerService` also emits cross-app simple error events (`http_error`, `client_error`).

As a result, a single failing sign-in request can produce:

- a sign-in-specific HTTP error event
- and a global error event

This is expected and supports both flow-specific and platform-wide monitoring.

## Flow context captured in sign-in

Sign-in events capture context for:

- regular sign-in
- social sign-in
- institutional sign-in
- OAuth-related sign-in situations where session/query context affects redirect behavior

The component also handles 2FA and several UX error states, and emits corresponding failure flags for downstream analysis.

Guard outcomes are captured for:

- sign-in guard redirect to authorize
- sign-in guard redirect to register
- two-factor guard redirect to my-orcid when already logged in

## Querying guidance

Use `PageAction` with direct `actionName` filters (simple events).

Patterns:

- Success trend: filter by sign-in success `actionName`
- Application rejection rate: success vs failure events
- Transport health: sign-in HTTP error event, optionally faceted by flow label and status
- Correlation with global transport issues: compare with `http_error`
