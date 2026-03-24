# Registration observability

This document explains how registration observability is emitted across the registration flow, including journey setup, step instrumentation, validation/submission signals, and NRQL usage.

## Scope

Primary sources:

- `register/register-observability.service.ts`
- `register/pages/register/register.component.ts`
- `register/components/form-personal/form-personal.component.ts`
- `register/components/form-password/form-password.component.ts`
- `register/app-event-names.ts`

## Event model

Registration is instrumented as a journey with:

- `journeyType = orcid_registration`

In New Relic, journey events appear as:

- `eventType() = 'PageAction'`
- `actionName = 'orcid_registration'`
- logical event name in `system_eventName`
- context and event attrs under prefixed keys:
  - `journeyContext_*`
  - `eventAttribute_*`

## Journey lifecycle

### Start

`RegisterObservabilityService.initializeJourney(...)` starts the registration journey once per registration page lifecycle (guarded by `registrationJourneyStarted`).

Initial context includes reactivation and platform layout signals used by the flow.

### During the flow

Events are emitted from two places:

- Service-level helpers for step transitions/buttons and dynamic step-loaded markers.
- Component-level instrumentation for field-match and submit/confirm milestones.

### Finish

`RegisterObservabilityService.completeJourney(...)` exists and emits journey completion plus `finishJourney(...)`.

At present, the registration page flow mainly relies on intermediate and completion-like events emitted during submit/redirect handling; explicit `completeJourney(...)` is available in the service and can be wired where needed.

## What gets instrumented

### Step navigation and progression

The flow emits step-loaded and navigation events as users move through the stepper, including next/back paths and optional skip behavior where applicable.

### Field matching and form-state milestones

Key UX milestones are emitted from form components:

- email match state changes in step A
- password validity/match milestones in step B

These events are useful for diagnosing early drop-off before final submission.

### Submit pipeline milestones

The register page emits events around:

- backend validate stage
- validation-error stage
- registration confirmation stage
- confirmation-error stage (unexpected responses)

Event payloads may include backend validator or response objects for debugging.

## Reactivation context

Registration journey context includes reactivation state when relevant, allowing NRQL segmentation of regular registration vs reactivation scenarios.

## Querying guidance

For registration, always query journey style:

- `actionName = 'orcid_registration'`
- `system_eventName = ...`

Do not use `eventName` for this journey.

Use prefixed fields:

- `journeyContext_*` for registration context
- `eventAttribute_*` for event payload

## Alerting guidance

For alert stability, prefer nearby stage conversions for operational alerts (for example validate -> confirmation), and use broader funnel conversions for dashboard trend analysis.

Recommended protections:

- traffic gate condition
- sliding window aggregation
- evaluation offset for late-arriving events

## Common pitfalls

- Using `eventName` instead of `system_eventName` in NRQL.
- Mixing simple-event selectors with journey-event selectors.
- Expecting strict cohort conversion from short time-bucket ratios.
- Alerting on low-volume windows without a denominator guard.

## Troubleshooting checklist

- No registration events: verify journey start is called before any step events.
- Missing submit milestones: inspect register submit branches and unexpected error handling paths.
- Over-100% conversion in short windows: check denominator window alignment and low traffic conditions.
- Noisy alerts: adjust aggregation/sliding windows and add traffic guard conditions.
