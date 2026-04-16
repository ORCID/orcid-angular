# Client RUM / Observability (New Relic)

## Purpose

Define the shared browser observability plumbing used by the app to send `PageAction` events to New Relic with consistent event names and payload shape.

## Scope / Emitters

Primary files (paths relative to `src/app/`):

- `rum/service/customEvent.service.ts`
- `rum/app-event-names.ts`
- `rum/terminating-rum-events.ts` (which events trigger an immediate New Relic harvest)
- `core/new-relic/new-relic.service.ts` (`forceHarvestNow()`)
- `rum/journeys/types.ts`
- `rum/journeys/*.ts`

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

## Terminating events and New Relic harvest (flush)

Some outcomes mean the user is about to **leave the flow** or the **SPA**: OAuth error surfaces, sign-in success/failure, registration completion, guard redirects, etc. Those `PageAction` events are more likely to be lost if the browser navigates, reloads, or closes the tab before New Relic’s next scheduled harvest.

**Behavior**

- After a **successful** `newrelic.addPageAction(...)` call, `RumJourneyEventService` may call `NewRelicService.forceHarvestNow()` to push buffered data to New Relic immediately.
- **Always** flushes after `finishJourney(...)` when the final page action was sent.
- **Conditionally** flushes after `recordSimpleEvent` / `recordEvent` when the event name is classified as **terminating** (see below).

**Configuration**

- Terminating **simple** event names and **journey** event-name rules live in [`rum/terminating-rum-events.ts`](./terminating-rum-events.ts) (`TERMINATING_SIMPLE_EVENT_NAMES`, `isTerminatingJourneyEvent`).
- When you add a new `AppEventName` that represents a **terminal** outcome (user exits the journey, lands on a hard error screen, or you immediately navigate away), **add it to that module** so harvest runs. The enum file and repo `AGENTS.md` also mention this.
- `http_error` / `client_error` are intentionally **not** in the simple-event terminating set (high volume); add them there only after an explicit product/observability decision.

**Related**

- Hard URL changes sometimes go through `outOfRouterNavigation` in `cdk/window/window.service.ts`, which already calls `orcidForceRumHarvest` before navigating. Terminal-event flushing in `RumJourneyEventService` still matters for in-app `Router.navigate`, full reloads, and “stay on error page” cases.

## Flow diagram

Flow charts live in each flow-specific doc:

- [`oauth-observability.md`](./oauth-observability.md)
- [`signin-observability.md`](./signin-observability.md)
- [`registration-observability.md`](./registration-observability.md)

## Key events and where they fire

- `AppEventName` in `rum/app-event-names.ts` is the canonical name source.
- `RumJourneyEventService` (`rum/service/customEvent.service.ts`) is the canonical transport.
- Domain flows (OAuth, sign-in, registration) call this service and own business-specific attributes.

## NRQL query patterns

- Simple events:
  - `FROM PageAction SELECT count(*) WHERE actionName = 'sign_in_success'`
- Journey events:
  - `FROM PageAction SELECT count(*) WHERE actionName = 'oauth_authorization' AND system_eventName = 'authorization_error'`
- Keep dashboards scoped to prefixed journey fields:
  - `journeyContext_*`
  - `eventAttribute_*`
- Global HTTP errors (`actionName = 'http_error'`) now include request/page context:
  - `requestPath`, `requestHost`, `requestOriginType`, `currentPath`, `currentHost`, `referrerHost`, `isOnline`, `statusZeroCause`, `errorBody`, `errorBodyType`
  - XSRF cookie diagnostics: `xsrfCookiePresent`, `authXsrfCookiePresent`, `csrfCookieState`
  - Example for high-volume status 0 triage:
    - `FROM PageAction SELECT count(*) WHERE actionName = 'http_error' AND status = 0 FACET statusZeroCause, requestPath, currentPath`

## Troubleshooting / gotchas

- Terminal events may cause **more than one** harvest in a row (e.g. recorded event + later `outOfRouterNavigation`); that is expected and safe.
- `recordEvent(...)` is ignored when `startJourney(...)` was not called.
- For mixed simple + journey dashboards, remember `actionName` means different things.
- Keep event names stable whenever possible; renames require NRQL/dashboard migration.
- With `runtimeEnvironment.debugger` enabled, emissions are logged in the browser console with `[RUM]`.
- RUM emitters should avoid sending personal values directly; `RumJourneyEventService` also sanitizes payloads as a safety net (for example ORCID iDs, emails, and PID-like identifiers), replacing them with non-reversible hint strings.
