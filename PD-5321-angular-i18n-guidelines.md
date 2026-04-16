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
4. **Use ICU for plural/select logic.**  
   Keep pluralization and gender/select logic inside one translatable unit.
5. **Use `i18n` metadata (`meaning|description@@id`) for clarity and stability.**  
   Add translator context where ambiguity exists.
6. **Do not use HTML structure to force translation segmentation.**  
   If visual emphasis is needed, prefer styling that does not break translation context.

## Anti-pattern (do not use)

Fragmenting one message into multiple translatable chunks:

```html
<p>
  <span i18n>You have</span>
  <strong>{{ workCount }}</strong>
  <span i18n>works pending review.</span>
</p>
```

Problems:

- Translators cannot reorder words naturally for other languages.
- Grammar agreement can break.
- Translation memory is fragmented.

## Preferred pattern

Single message with placeholders:

```html
<p i18n="dashboard pending work message|Shown in works summary card@@pending_work_summary">
  You have {{ workCount }} works pending review.
</p>
```

## Additional examples

### 1) Paragraph-level content

**Bad (segmented):**

```html
<p>
  <span i18n>Connect your account to import</span>
  <span i18n>works and affiliations</span>
  <span i18n>automatically.</span>
</p>
```

**Good (single paragraph unit):**

```html
<p i18n="connection help text|Displayed on account setup screen@@connect_import_help">
  Connect your account to import works and affiliations automatically.
</p>
```

### 2) Dynamic values

**Good:**

```html
<p i18n="search results count|Results summary above table@@search_results_summary">
  Showing {{ shown }} of {{ total }} results.
</p>
```

### 3) Pluralization (ICU)

**Good:**

```html
<p i18n="notifications count|User inbox summary@@notifications_count">
  {count, plural, =0 {You have no notifications.} one {You have one notification.} other {You have # notifications.}}
</p>
```

### 4) Attributes and controls

```html
<input
  i18n-placeholder="search field placeholder|Global search input@@global_search_placeholder"
  placeholder="Search by keyword"
/>

<button i18n="save button label|Primary save action@@save_button">
  Save changes
</button>
```

## Implementation checklist (PR-level)

- [ ] Full paragraph or complete message is marked as one i18n unit.
- [ ] No unnecessary message splitting for style-only reasons.
- [ ] Dynamic values are placeholders within the same message.
- [ ] Plural/select grammar uses ICU when needed.
- [ ] `meaning|description@@id` metadata is present for non-obvious strings.
- [ ] Content reads naturally if translated with different word order.

## Migration guidance

When touching existing templates:

1. Identify adjacent i18n strings that form one user-facing message.
2. Merge them into a single i18n-marked element.
3. Preserve styling without splitting translatable content (move styling to CSS classes where possible).
4. Add metadata and stable custom IDs for translator context.
5. Validate extraction output and review translation units for readability.

## Scope and exceptions

Valid exceptions where splitting is acceptable:

- Truly independent UI strings (e.g., separate labels, independent actions)
- Reusable standalone components with isolated semantics
- Accessibility-only text that serves a different purpose from visual copy

If uncertain, prefer a single message unit and ask in code review.

