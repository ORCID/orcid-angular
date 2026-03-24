# OAuth observability

This document describes how OAuth authorization observability works in the app, including journey lifecycle, simple events, payload shape, and practical NRQL usage.

## Scope

OAuth observability is emitted mainly from:

- `authorize/components/form-authorize/form-authorize.component.ts`
- `authorize/components/oauth-error/oauth-error.component.ts`
- `guards/authorize.guard.ts`
- `authorize/pages/authorize/authorize.component.ts`
- `core/oauth/oauth.service.ts` (request behavior that drives error paths)
- `rum/oauth-authorize-http-failure-event-attrs.ts` and helpers

## Event model used by OAuth flow

OAuth uses both event styles:

- Journey events with `journeyType = oauth_authorization`.
- Simple standalone events for guard/page-level routing outcomes and validation failures.

### Journey events in New Relic

- `actionName = 'oauth_authorization'`
- Logical event name in `system_eventName`
- Context fields in `journeyContext_*`
- Event attributes in `eventAttribute_*`

## Journey lifecycle

### Journey start

The OAuth journey starts once per screen lifecycle:

- `FormAuthorizeComponent` starts the journey on the first `combineLatest` emission only (guard flag prevents duplicate starts on later reactive updates).
- `OauthErrorComponent` also starts the journey once for error-page scenarios.

Context includes OAuth essentials and the serialized full query:

- `client_id`
- `redirect_uri`
- `response_type`
- `scope`
- `oauth_query_string`
- delegation context (`acting_as_trusted_user`, effective/real ORCID fields when present)

The query string is intentionally preserved to keep parameters that are not always materialized in strongly typed fields.

### Journey events during authorize flow

On the authorize screen:

- approval and denial outcomes are recorded as journey events
- HTTP/transport failures while calling authorize endpoints are recorded as OAuth journey error events with normalized HTTP metadata attributes
- feature flag state is recorded from the error page flow

### Journey finish

`RumJourneyEventService` supports `finishJourney(...)`, but OAuth flow currently relies primarily on event emissions during navigation outcomes rather than explicit finish in each path.

## Simple events around OAuth

Several OAuth-relevant outcomes are tracked as standalone simple events:

- authorize guard out-of-router navigation
- login-required redirect after `validateRedirectUri`
- invalid redirect URI route-to-404
- redirect URI validation API failure route-to-404
- already-authorized page redirect path
- OAuth validation failure surfaced on OAuth error page
- authorize guard redirect-to-login and redirect-to-my-orcid outcomes
- OAuth session client-handled `#error` redirects
- OAuth session navigate-to-authorize error outcomes
- auth-server authorize response-body errors (non-`access_denied`)
- trusted-individual/delegated account switch action from authorize screen

These appear in New Relic as `PageAction` with `actionName = <eventName>`.

## Error instrumentation design

OAuth error telemetry is intentionally layered:

- Global transport/client instrumentation from `ErrorHandlerService` (`http_error`, `client_error`)
- OAuth-specific journey error event for authorize endpoint failures
- OAuth validation-failure simple event for URL/session semantic issues shown on error page

This enables both:

- cross-app incident visibility (global errors)
- OAuth-specific diagnostics (endpoint, approval/deny intent, status, request path/query, normalized category)

## Endpoint split and flags

OAuth authorize requests may go through:

- legacy endpoint (`oauth/custom/authorize.json`)
- auth server endpoint (`oauth2/authorize`)

Feature flags determine path selection, and OAuth journey payloads include attributes to identify which path was used.

## Routing and guard observability

`AuthorizeGuard` emits simple events for key control-flow decisions before the screen is rendered:

- immediate out-of-router redirects
- login-required redirects after redirect URI validation
- invalid redirect URI and validation-error 404 routes
- redirect-to-login outcomes
- redirect-to-my-orcid outcomes for locked accounts

Guard outcome events include decision metadata from `AuthDecisionService`:

- `decision_action`
- `decision_reason`

This captures high-signal routing outcomes that may otherwise be invisible when users never reach the authorize form.

## NRQL patterns

### Journey events

Use:

- `actionName = 'oauth_authorization'`
- `system_eventName = ...`

Filter/facet on:

- `journeyContext_*` for request context
- `eventAttribute_*` for per-event details

### Simple events

Use:

- `actionName = '<simple-event-name>'`

Filter/facet on direct attributes, for example URL/redirect/normalized error fields.

