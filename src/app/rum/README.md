# Client RUM / observability (New Relic)

This folder holds the **RUM (Real User Monitoring)** plumbing: how events are sent to **New Relic Browser** via `window.newrelic.addPageAction`, and how **journeys** group related steps.

## Central pieces

| Piece | Role |
|--------|------|
| **`RumJourneyEventService`** (`service/customEvent.service.ts`) | Sends `addPageAction` events; manages journey state in memory. |
| **`AppEventName`** (`register/app-event-names.ts`) | **Single source of truth** for event name strings. Do not hardcode names elsewhere. |
| Journey types (`journeys/types.ts` + per-journey files) | TypeScript context/attributes for each journey (`oauth_authorization`, `orcid_registration`, …). |

## Two ways to record events

### 1. **`recordSimpleEvent(eventName, attrs?)`**

- One-off **Page Actions** (New Relic: action name = `eventName`).
- **No journey**; no `startJourney` required.
- Use for: UI actions, **sign-in success/failure**, **HTTP-layer sign-in/OAuth errors**, global `http_error` / `client_error`, etc.

Attributes you pass are stored as custom attributes on that Page Action (see NR attribute naming in your account).

### 2. **`recordEvent(journeyType, eventName, eventAttrs?)`**

- Requires **`startJourney(journeyType, context)`** first (same tab/session).
- If the journey was not started, **`recordEvent` is ignored** (debug builds log this).
- New Relic receives the **`journeyType` string as the Page Action name** (e.g. `oauth_authorization`), not the logical event name.
- Payload is built with:
  - **`journeyContext_*`** — prefixed from `startJourney` context
  - **`eventAttribute_*`** — prefixed from `eventAttrs`
  - **`system_eventName`** — the logical `eventName` (e.g. `authorization_success`)
  - **`system_elapsedMs`**, **`system_journeyId`**, **`system_journeyType`**

So in NRQL you often filter on **`system_eventName`** (or equivalent custom attribute) when querying `PageAction` where `actionName` is the journey key.

## Sign-in events (simple)

Emitted from **`FormSignInComponent`** and **`SignInService`** for different layers:

| `AppEventName` / value | When | Typical attributes |
|------------------------|------|---------------------|
| **`sign_in_success`** | Login POST returns success and the UI proceeds. | `isOauth`, `signInType` |
| **`sign_in_failure`** | Login POST returns **200** with application failure (bad password, deprecated account, etc.). | Flags like `badCredentials`, `disabled`, … |
| **`sign_in_http_error`** | Login **POST fails at HTTP/network** (after retries, 403, 5xx, status 0, etc.). | `sign_in_flow`, `oauth_context`, `status`, `statusText`, `url_path_and_query` |

**Separation:** `sign_in_failure` = “business rules said no”; `sign_in_http_error` = “transport failed”.  
Global **`http_error`** from `ErrorHandlerService` may still fire for the same HTTP failure (use `sign_in_http_error` for sign-in–specific dashboards).

## OAuth authorization events

### Journey: `oauth_authorization`

- **`startJourney('oauth_authorization', context)`** — e.g. from **`FormAuthorizeComponent`** (authorize screen) or **`OauthErrorComponent`** (error page). Only the **first** start per journey type is kept; later starts are ignored.
- **Journey context** includes the core OAuth fields plus **`oauth_query_string`**: the full route query serialized as `key=value&…` (sorted keys), so parameters not modeled individually (`state`, `prompt`, `nonce`, etc.) still appear in New Relic. The server session (`oauthSession`) sometimes omits fields that are still on the **browser URL**; on the authorize screen, context **merges session with `platform.queryParameters`**.
- **`recordEvent('oauth_authorization', …)`** — user actions and outcomes (see `AppEventName` OAuth section).

Logical `eventName` values (via `AppEventName`) include:

| Value | Meaning |
|--------|--------|
| `error_page_loaded` | OAuth error page shown with session/query error context |
| `flag_status` | Feature flag snapshot (e.g. `OAUTH_AUTHORIZATION`) |
| `authorization_success` | User approved |
| `authorization_denied` | User denied |
| `authorization_error` | Authorize HTTP failed or flow threw — includes **`oauth_authorize_endpoint`** (`legacy` \| `auth_server`), **`oauth_authorize_approved`**, optional **`authorize_http_status`**, **`authorize_request_url_path_and_query`**, and string **`error`** (see `oauthAuthorizeHttpFailureEventAttrs`). |

Global **`http_error`** may still fire from **`ErrorHandlerService`** for the same transport failure (snackbar + cross-app HTTP metrics). OAuth-specific dashboards should filter journey **`oauth_authorization`** with **`system_eventName` = `authorization_error`**.

### Simple: **`oauth_authorization_validation_failed`**

When the backend rejects the OAuth request (wrong **scope**, **redirect_uri**, **client**, etc.) and the user sees **`OauthErrorComponent`**, we emit a **Page Action** (`oauth_authorization_validation_failed`) with:

- **`error_category`** — normalized bucket from **`getOauthAuthorizationErrorCategory(error, errorCode)`** (e.g. `invalid_scope`, `redirect_uri_invalid`, `invalid_client`, …)
- **`oauth_error`**, **`oauth_error_code`**, **`oauth_error_description`**
- **`client_id`**, **`redirect_uri`**, **`response_type`**, **`scope`** from the URL query
- **`oauth_query_string`** — full query for debugging

This complements the journey event **`error_page_loaded`** (same screen) with an easy NRQL facet on **`error_category`**.

### Authorize **route guard** (simple events)

Emitted from **`AuthorizeGuard`** on `/oauth/authorize` child activation:

| `AppEventName` / value | When |
|------------------------|------|
| **`oauth_authorize_guard_out_of_router_navigation`** | OAuth2 **`prompt=none`** + logged in + **`openid` in scope** + session `redirectUrl` → guard **`outOfRouterNavigation(target)`** (silent auth before the page loads) |
| **`oauth_authorize_page_already_authorized_redirect`** | **`AuthorizeComponent`**: session already includes a **`redirectUrl`** (e.g. **`prompt=none`** with scopes like **`/activities/update`** — not openid) → immediate **`outOfRouterNavigation`** without the consent UI |
| **`oauth_authorize_guard_login_required_redirect`** | `validateRedirectUri` `valid` → `outOfRouterNavigation` to `redirect_uri#login_required` |
| **`oauth_authorize_guard_invalid_redirect_uri`** | `validateRedirectUri` `valid: false` → in-app `/404` |
| **`oauth_authorize_guard_validate_redirect_uri_error`** | `validateRedirectUri` HTTP error → `/404` |

Attributes typically include `client_id`, `redirect_uri`, and for out-of-router navigation also **`target`**, **`prompt`**, **`scope`** when present on the query.

## Registration & other journeys

- **`orcid_registration`** — registration funnel; `AppEventName` + helpers like `stepLoadedEvent(step)`.
- **`orcid_notifications`** — inbox / notifications journey.
- See `journeys/types.ts` for the journey keys and types.

## Adding a new event

1. Add the name to **`AppEventName`** in `register/app-event-names.ts` (or a helper for dynamic names).
2. Call **`recordSimpleEvent`** or **`startJourney` + `recordEvent`** from the right place.
3. Avoid duplicating strings in code.

## Debugging

- With **`runtimeEnvironment.debugger`** enabled, events are also **`console.debug`**’d with a `[RUM]` prefix; payloads are **`JSON.stringify(..., null, 2)`** for readable copy/paste.

## Related

- Workspace rules: `AGENTS.md` → **RUM / Observability**
- `ErrorHandlerService` — global **`http_error`** / **`client_error`** for many HTTP and client failures. Transport failures (including blocked requests / status `0`) are recorded as **`http_error`** when the payload looks like an HTTP error (including plain objects produced after `HttpErrorResponse` is spread for the snackbar pipeline).

### OAuth authorize error chain (blocked request / CORS)

Typical order: **`http_error`** (from `ErrorHandlerService`) → journey **`authorization_error`** with HTTP details in **`eventAttribute_*`** (from `oauthAuthorizeHttpFailureEventAttrs`, including string **`error`** via `formatHttpErrorForRum`).

### Journey `start` (once per authorize screen)

**`FormAuthorizeComponent`** calls **`startJourney` only on the first `combineLatest` emission** (guarded by a flag). Later session/platform updates no longer trigger a second `start` (avoids confusing “ignored, already started” logs). **`OauthErrorComponent`** still uses its own one-time guard.
