# Client RUM / Observability (New Relic)

## Purpose

Define the shared browser observability plumbing used by the app to send `PageAction` events to New Relic with consistent event names and payload shape.

## Scope / Emitters

Primary files in this folder/domain:

- `service/customEvent.service.ts`
- `register/app-event-names.ts`
- `journeys/types.ts`
- `journeys/*.ts`

Flow-specific docs:

- [`oauth-observability.md`](./oauth-observability.md)
- [`signin-observability.md`](./signin-observability.md)
- [`registration-observability.md`](./registration-observability.md)

## Event model

### Simple events

- Emitted via `recordSimpleEvent(eventName, attrs?)`.
- New Relic stores them as `PageAction` where:
  - `actionName = <eventName>`
  - attributes are top-level fields.

### Journey events

- Emitted via `startJourney(journeyType, context)`, `recordEvent(...)`, and optionally `finishJourney(...)`.
- New Relic stores them as `PageAction` where:
  - `actionName = <journeyType>`
  - `system_eventName` holds the logical step/event
  - `journeyContext_*` stores journey context
  - `eventAttribute_*` stores per-event attributes.

## Flow diagram

Flow charts live in each flow-specific doc:

- [`oauth-observability.md`](./oauth-observability.md)
- [`signin-observability.md`](./signin-observability.md)
- [`registration-observability.md`](./registration-observability.md)

## Key events and where they fire

- `AppEventName` in `register/app-event-names.ts` is the canonical name source.
- `RumJourneyEventService` is the canonical transport.
- Domain flows (OAuth, sign-in, registration) call this service and own business-specific attributes.

## NRQL query patterns

- Simple events:
  - `FROM PageAction SELECT count(*) WHERE actionName = 'sign_in_success'`
- Journey events:
  - `FROM PageAction SELECT count(*) WHERE actionName = 'oauth_authorization' AND system_eventName = 'authorization_error'`
- Keep dashboards scoped to prefixed journey fields:
  - `journeyContext_*`
  - `eventAttribute_*`

## Troubleshooting / gotchas

- `recordEvent(...)` is ignored when `startJourney(...)` was not called.
- For mixed simple + journey dashboards, remember `actionName` means different things.
- Keep event names stable whenever possible; renames require NRQL/dashboard migration.
- With `runtimeEnvironment.debugger` enabled, emissions are logged in the browser console with `[RUM]`.
