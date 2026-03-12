# Orcid Angular — Agent Notes

Monorepo: main app (`src/`, project `ng-orcid`), docs (`projects/orcid-ui-docs`), and libraries. Use this for fast orientation.

> **Note for future agents:** This file is intended to be edited over time. Any section—relevant or not—may be updated, trimmed, or reorganized so the document stays lean and useful for future agents. Prefer keeping only what helps the next AI work effectively with this project.

## Quick reference: libraries

- **@orcid/ui** — `projects/orcid-ui` — Agnostic UI components, design tokens, modal shell. See `projects/orcid-ui/AGENTS.md`.
- **@orcid/registry-ui** — `projects/orcid-registry-ui` — Registry-specific components (e.g. import-works-dialog). See `projects/orcid-registry-ui/AGENTS.md`.

Both are path-mapped from repo root (`tsconfig.json`). Main app and docs consume them from source.

## When changing a library component’s API

Update the main app and that component’s doc page (usage snippet, inputs list, examples).

## If component styles differ between docs and main app

If a library component (e.g. in orcid-registry-ui) looks correct in the docs app but wrong in the main app (e.g. missing margins or spacing), try **resetting the main project**: clean build artifacts, reinstall, or reset local overrides. Stale or inconsistent build/cache state in the main app can cause component styles to not apply as in docs; a fresh build often resolves it.

## Dialogs and async data

When a dialog or view needs data from an HTTP (or other async) call, opening the dialog only after the request completes can feel slow. Consider opening the dialog **immediately** with skeleton or static data (e.g. labels, empty lists, or a `loading: true` flag), then assigning the full payload to the dialog’s component instance when the observable emits. The dialog can show placeholders or a loading state until then.

## RUM / Observability

The app sends events to **New Relic** (and optionally logs them in the console) for analytics and debugging. The central service is **`RumJourneyEventService`** (`src/app/rum/service/customEvent.service.ts`).

### Two ways to record events

1. **`recordSimpleEvent(eventName, attrs?)`** — Standalone one-off events. No journey lifecycle. Use for: record page actions (expand featured work, summary toggle), errors (`http_error`, `client_error`), or any action that isn't part of a multi-step journey.
2. **`recordEvent(journeyType, eventName, eventAttrs?)`** — Events inside a **journey**. Requires `startJourney(journeyType, context)` first; events are tied to that journey (elapsed time, journey id). Use for: registration flow, OAuth, notifications. If no journey is active, the event is ignored (and logged in console when debug is on).

### Event names: use the enum

- **All event name strings** live in **`AppEventName`** in `src/app/register/app-event-names.ts`. Do not hardcode event names elsewhere.
- For **dynamic** names (e.g. `step-${step}-loaded`), add a small helper in the same file (e.g. `stepLoadedEvent(step)`) and use it when calling `recordEvent`.

### Where to call

- Call **`recordSimpleEvent` at the place where the action happens** (e.g. in the component method that handles the button click). Do not add wrapper "observability services" for one-off events; inject `RumJourneyEventService` and call it directly.
- For **journey** events, use the existing pattern: e.g. `RegisterObservabilityService` for `orcid_registration` (it injects `RumJourneyEventService`, calls `startJourney` / `recordEvent` / `finishJourney`). Other journey types: `oauth_authorization`, `orcid_notifications` (see `src/app/rum/journeys/types.ts`).

### Adding a new observable action

1. Add the event name to **`AppEventName`** in `src/app/register/app-event-names.ts` (or a dynamic helper there).
2. In the component (or service) where the action occurs, inject **`RumJourneyEventService`**.
3. At the right moment (e.g. click handler), call **`this._rumEvents.recordSimpleEvent(AppEventName.YourNewEvent, { ... })`** with optional attributes. For journey flows, use the existing journey service and **`recordEvent`** with the enum value.

### Console logs

- RUM events are printed to the console only when **`runtimeEnvironment.debugger`** is true (typically dev/sandbox). Format: `[RUM][simple] : event <name> <attrs>` or `[RUM][journey:<type>] : event <name> <payload>`.
- QA can filter the console by `[RUM]` to verify events. See `docs/qa-observability-console-logs.md` for a QA-facing note.
