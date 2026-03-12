# QA: Observability / RUM console logs

How to see observability events in the browser console and what to expect. Useful for verifying that record and registration events are fired correctly (e.g. for PD-3636).

---

## 1. How to get the console logs

### Open the browser console

- **Chrome / Edge:** `F12` or `Ctrl+Shift+J` (Windows/Linux), `Cmd+Option+J` (Mac) → open the **Console** tab.
- **Firefox:** `F12` or `Ctrl+Shift+K` (Windows/Linux), `Cmd+Option+K` (Mac) → **Console** tab.
- **Safari:** Enable *Develop* menu first, then `Cmd+Option+C` → **Console**.

### When do RUM logs appear?

Observability events are written to the console **only when the app is running with debug mode on**. That is controlled by `runtimeEnvironment.debugger` (often set to `true` in dev/sandbox and `false` in production).

- **Local / dev:** If your build or backend injects `runtimeEnvironment.debugger = true`, you will see the logs as soon as you perform the actions below.
- **If you don’t see any `[RUM]` logs:** The environment may have `debugger: false`. You can try enabling it before the app loads (e.g. in a small script or in the console on a page that sets `runtimeEnvironment`), or use a dev/sandbox build where debug is enabled.

**Tip:** Filter the console by typing `[RUM]` or `record_` to see only these messages.

---

## 2. What to expect in the console

All observability logs are prefixed with **`[RUM]`**. There are two kinds:

### Simple events (standalone actions)

Format:

```text
[RUM][simple] : event <eventName> <attributes>
```

- **Event name** is a string (e.g. `record_expand_featured_work_clicked`).
- **Attributes** are an object (e.g. `{}` or `{ expanded: true }`).

### Journey events (registration flow, etc.)

Format:

```text
[RUM][journey:<journeyType>] : start | event <eventName> | finished
```

- **journeyType** is e.g. `orcid_registration`.
- **eventName** is the step or action (e.g. `step-a-next-button-clicked`).
- A payload object with `system_eventName`, `system_elapsedMs`, `system_journeyId`, etc. is logged as well.

---

## 3. Record page events (PD-3636)

These are the two **simple** events added for the record page. You should see exactly one log line per action when the feature is used.

### Expand featured work

- **Where:** Public record page → **Featured works** section → click the **Expand** (open_in_full) button on a work.
- **Expected log:**
  ```text
  [RUM][simple] : event record_expand_featured_work_clicked {}
  ```
- **Meaning:** The “expand featured work” action was tracked. Attributes may be empty `{}`.

### Record summary toggle (show / hide)

- **Where:** Public record page → header banner → click the **“Show record summary”** / **“Hide record summary”** control.
- **Expected log:**
  ```text
  [RUM][simple] : event record_summary_toggle_clicked { expanded: true }
  ```
  or
  ```text
  [RUM][simple] : event record_summary_toggle_clicked { expanded: false }
  ```
- **Meaning:** `expanded: true` = summary is now shown; `expanded: false` = summary is now hidden.

---

## 4. Quick checklist for QA

| Action | Expected console line |
|--------|------------------------|
| Click “Expand” on a featured work | `[RUM][simple] : event record_expand_featured_work_clicked {}` |
| Click to **show** record summary | `[RUM][simple] : event record_summary_toggle_clicked { expanded: true }` |
| Click to **hide** record summary | `[RUM][simple] : event record_summary_toggle_clicked { expanded: false }` |

If debug mode is on and these actions don’t produce the corresponding log lines, report that the observability event did not fire.

---

## 5. Other events you might see

- **`http_error`** / **`client_error`** — Error handler (when a request fails or a client error is caught).
- **`xsrf_missing_after_preload`** — Firefox XSRF preload path (only in specific conditions).
- **`[RUM][journey:orcid_registration]`** — Registration flow (step loaded, button clicked, journey complete, etc.).

These are normal; the QA focus for the record work is the two **record_** events above.
