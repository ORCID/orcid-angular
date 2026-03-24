# Client RUM / observability (New Relic)

This folder contains the app-side observability plumbing used to emit browser events to New Relic.

## What this folder owns

- Event transport through `window.newrelic.addPageAction`.
- Journey lifecycle state (`start`, `record`, `finish`) in memory.
- Shared payload conventions used by dashboards and alerts.
- Journey type contracts under `journeys/`.

## Core building blocks

| Piece | Role |
|--------|------|
| `service/customEvent.service.ts` | Emits simple events and journey events. |
| `register/app-event-names.ts` | Central source of event name strings/helpers. |
| `journeys/types.ts` + `journeys/*.ts` | Type-safe context and event attributes per journey. |

## Payload model (important for NRQL)

### Simple events

- Sent with `recordSimpleEvent(eventName, attrs?)`.
- New Relic `actionName` is the provided `eventName`.
- Custom attributes are stored directly on the PageAction payload.

### Journey events

- Sent with `startJourney(journeyType, context)` + `recordEvent(journeyType, eventName, attrs?)`.
- New Relic `actionName` is the `journeyType`.
- Logical event name is stored in `system_eventName`.
- Attributes are prefixed:
  - `journeyContext_*` for journey context.
  - `eventAttribute_*` for per-event attributes.

## Querying guidance

- For simple events, filter on `actionName`.
- For journey events, filter on `actionName = <journeyType>` and `system_eventName`.
- Prefer scoped attributes (`journeyContext_*`, `eventAttribute_*`) over free-form payload fields when building alerts.

## Deep-dive docs by flow

- `oauth-observability.md` - OAuth authorize and OAuth error observability.
- `signin-observability.md` - Sign-in observability and HTTP failure instrumentation.
- `registration-observability.md` - Registration journey observability and step/funnel instrumentation.

## Adding or changing observability

1. Add/adjust event names in `register/app-event-names.ts`.
2. Emit via `recordSimpleEvent` or journey methods in the relevant flow.
3. Keep naming and payload shape stable for dashboard/alert continuity.
4. Add or update tests around any new payload formatter/helper in this folder.

## Debugging

- With `runtimeEnvironment.debugger` enabled, RUM emissions are printed to console with a `[RUM]` prefix and pretty JSON payloads.
