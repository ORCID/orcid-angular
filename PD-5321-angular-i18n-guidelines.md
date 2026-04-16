# PD-5321: Angular i18n Guidelines (Paragraph-First)

## Why this guideline exists

Translations in this codebase currently mix two patterns:

- Legacy segmented strings (many small translation units for one sentence/paragraph)
- Paragraph-level translation units (single cohesive message)

This inconsistency creates fragmented translation memory and extra translator effort.  
The standard moving forward is **paragraph-first translation**: translate complete user-facing thoughts as one unit whenever possible.

## Core principle

Use Angular i18n to mark **complete semantic messages** (typically full paragraphs, headings, labels, or complete button text), not fragmented pieces.

## Standard rules

1. **Translate full paragraphs as one unit.**  
   Avoid splitting one sentence/paragraph across multiple elements solely for styling.
2. **Keep meaning and grammar together.**  
   Articles, nouns, verbs, punctuation, and dynamic placeholders that form a single thought should stay in one translation unit.
3. **Use placeholders for dynamic values.**  
   Interpolate variables in a single i18n-marked sentence.
4. **Provide rich context metadata when dynamic values are present.**  
   In the `description`, explain what each dynamic value represents so translators can select correct grammar and tone.
5. **Use ICU for plural/select logic.**  
   Keep pluralization and gender/select logic inside one translatable unit.
6. **Use `i18n` metadata (`meaning|description@@id`) for clarity and stability.**  
   Add translator context where ambiguity exists, especially for dynamic values.
7. **Do not use HTML structure to force translation segmentation.**  
   If visual emphasis is needed, prefer styling that does not break translation context.

## Metadata guideline for dynamic values

When using placeholders (for example `{{ total }}`, `{{ roleName }}`, `{{ startDate }}`), the i18n description should explicitly define each value.

### Recommended pattern

```html
<p i18n="results summary|Displays list results count; shown=results currently visible on page; total=all records matching filters@@search_results_summary">
  Showing {{ shown }} of {{ total }} results.
</p>
```

### Avoid vague descriptions

- Bad: `i18n="message|results info@@results_info"`
- Good: `i18n="message|shown=results displayed on current page; total=all results returned by query@@results_info"`

## Anti-pattern (do not use)

Fragmenting one message because part of it is visually emphasized (`<strong>`, link, badge, etc.):

```html
<p>
  <span i18n>Access granted by</span>
  <strong>{{ giverName }}</strong>
  <span i18n>on your ORCID record.</span>
</p>
```

Problems:

- Translators cannot reorder words naturally for other languages.
- Grammar agreement can break.
- Translation memory is fragmented.

## Preferred pattern

Single message with placeholders and inline emphasis:

```html
<p i18n="trusted party grant message|Message in trusted-party card; giverName=full name of user who granted trust@@trusted_party_grant_message">
  Access granted by <strong>{{ giverName }}</strong> on your ORCID record.
</p>
```

## Additional template examples

### 1) Paragraph-level content

**Bad (segmented for style):**

```html
<p>
  <span i18n>Trusted individual:</span>
  <strong>{{ trustedIndividualName }}</strong>
  <span i18n>can now update your works.</span>
</p>
```

**Good (single paragraph unit, still styled):**

```html
<p i18n="trusted party update rights|Shown in trusted individuals section; trustedIndividualName=full name of the trusted individual@@trusted_party_update_rights">
  Trusted individual: <strong>{{ trustedIndividualName }}</strong> can now update your works.
</p>
```

### 2) Dynamic values

**Good:**

```html
<p i18n="search results count|Results summary above table; shown=visible results count; total=all query matches@@search_results_summary">
  Showing {{ shown }} of {{ total }} results.
</p>
```

### 3) Pluralization (ICU)

**Good:**

```html
<p i18n="notifications count|User inbox summary; count=number of unread notifications@@notifications_count">
  {count, plural, =0 {You have no notifications.} one {You have one notification.} other {You have # notifications.}}
</p>
```

### 4) Attributes and controls

```html
<input
  i18n-placeholder="search field placeholder|Global search input placeholder@@global_search_placeholder"
  placeholder="Search by keyword"
/>

<button i18n="save button label|Primary save action@@save_button">
  Save changes
</button>
```

## TypeScript examples (`$localize`)

Use `$localize` with `meaning|description@@id` in TS files, following the same paragraph-first and context-rich rules.

### 1) Dynamic value in a single message

```ts
const summary = $localize`:search results summary|shown=results currently visible in table; total=all records matching filters@@search_results_summary_ts:Showing ${shown}:shown: of ${total}:total: results.`;
```

### 2) Error message with contextual placeholder

```ts
const errorMessage = $localize`:permission error|roleName=display label of the required permission role@@permission_required_error:You need the ${roleName}:roleName: role to continue.`;
```

### 3) Date range with explicit placeholder meaning

```ts
const rangeMessage = $localize`:reporting range|startDate=report period start date; endDate=report period end date@@report_range_message:Report period: ${startDate}:startDate: to ${endDate}:endDate:.`;
```

## Implementation checklist (PR-level)

- [ ] Full paragraph or complete message is marked as one i18n unit.
- [ ] No unnecessary message splitting for style-only reasons.
- [ ] Dynamic values are placeholders within the same message.
- [ ] Dynamic-value messages include clear placeholder context in the i18n description.
- [ ] Plural/select grammar uses ICU when needed.
- [ ] `meaning|description@@id` metadata is present for non-obvious strings.
- [ ] Content reads naturally if translated with different word order.

## Scope and exceptions

Valid exceptions where splitting is acceptable:

- Truly independent UI strings (e.g., separate labels, independent actions)
- Reusable standalone components with isolated semantics
- Accessibility-only text that serves a different purpose from visual copy

If uncertain, prefer a single message unit and ask in code review.

