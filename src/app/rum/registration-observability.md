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

The registration page now calls `completeJourney(...)` on successful final redirect handling, so registrations that reach a valid redirect URL produce explicit journey completion telemetry.

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
- pipeline error stage (submit observable error callback)

Event payloads may include backend validator or response objects for debugging.

## Guard-level registration handoff

`RegisterGuard` emits a simple event when it redirects an already-logged-in OAuth registration path to `/oauth/authorize`, including OAuth query context attributes. This helps explain pre-form exits that do not traverse full register journey steps.

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

