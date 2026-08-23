# Translation Quality Experiment — Human vs. AI

A blind comparison study to find out whether AI models can translate ORCID's
interface as well as (or better than) the human translations we ship today — and
whether a more expensive AI model is meaningfully better than a cheaper one.

## What we're comparing

For a few key pages, across 8 languages, the same UI strings are translated four ways:

| Source | Folder | Notes |
| --- | --- | --- |
| **Human** | `human/` | The translations currently shipping on orcid.org |
| **English** | `english/` | Source-language reference (not a contender; for context) |
| **Cheaper AI** | `claude-sonnet-5/` | Claude Sonnet |
| **Expensive AI** | `claude-opus-4-8/` | Claude Opus |

Voters are shown the same screen translated each way — **without knowing which is
which** — and pick the one that reads best. The result is a side-by-side picture of
which source produces the best translations per language.

> **Note on fairness:** the AI models get an advantage human translators usually
> don't — they can see the full page/HTML context around each string. That is
> intentional and part of what we're testing.

## Scope

- **Languages (8):** Chinese (zh_CN), German (de), Portuguese (pt), Spanish (es),
  French (fr), Italian (it), Japanese (ja), Russian (ru)
- **Features (87 strings total), matching what each screenshot actually shows:**
  - `register` — 44 strings (Step 1: names + emails, incl. the multi-part
    "Per ORCID's terms of use…" sentence)
  - `developer-tools` — 31 strings (the intro / Terms-of-Service view)
  - `two-factor` — 12 strings (the authentication-app setup screen)

## Cost & turnaround: AI vs. Transifex

This job was **653 English source words** (the 87 strings) translated into **8
languages**.

### AI (this experiment)

| Model | GitHub AI credits |
| --- | --- |
| Sonnet (cheaper) | 147 |
| Opus (expensive) | 164 |
| **Total** | **311** |

Both models produced their full set of 696 translations (87 strings × 8
languages) the **same day, within a single working session** — the generation
itself is a matter of minutes per model. If those credits are billed at GitHub's
standard $0.04-per-request overage rate, the two runs together cost roughly
**$12**.

### Transifex (e2f) — what the same job would have cost

Rate derived from this account's recent order history (14-language orders):

- $1,027.67 ÷ 5,194 words = **$0.198 per source word** (all 14 languages) —
  i.e. **$0.0141 per word, per language**. (Three separate large orders land on
  this exact rate.)
- **Minimum order charge: $340** — every order under ~1,700 words in the history
  was billed exactly this floor.

For our 653-word job:

| Basis | Cost |
| --- | --- |
| Raw per-word (8 languages) | ~$74 |
| 14-language equivalent | ~$129 |
| **Realistic (minimum order applies)** | **$340** |

Because 653 words is well below the ~1,700-word minimum threshold, in practice it
would be charged the **$340 minimum** — as every comparable small order in the
history was.

**Turnaround:** the closest-sized order (812 words) was delivered in **3 days**;
the account average is ~5 days. This job would realistically take **2–3 business
days**.

### Bottom line

| | AI (both models) | Transifex (one pass) |
| --- | --- | --- |
| Cost | ~$12 (311 credits) | $340 (minimum order) |
| Turnaround | same day (minutes) | 2–3 business days |
| Output | 2 full translation sets to compare | 1 human set |

> Not a like-for-like comparison: Transifex delivers professional human
> translation with QA and an SLA; the AI runs are an experiment. This is a
> ballpark of cost and speed, not a service guarantee.

## Folder guide

```
translation-experiment/
├── human/            Human translations, per language/feature (the "answer key")
├── english/          English source strings, for reference
├── claude-sonnet-5/  Cheaper-AI translations
├── claude-opus-4-8/  Expensive-AI translations
├── screenshots/      Rendered full-page screenshots for each source × language
│   ├── human/  english/  claude-sonnet-5/  claude-opus-4-8/
├── prompts/          The reusable prompt given to each AI model
├── scripts/          Automation (see below)
└── archive/          Superseded earlier runs, kept for reference
```

Each translation file is `{source}/{lang}/{feature}.json` — a simple map of
`i18n key → translated string`.

## How it works (pipeline)

1. **Extract** the human translations for the in-scope strings → `human/`.
2. **Blank** those strings in the app's translation files so the UI falls back to
   English — giving each AI a clean slate with no human answer to copy.
3. Each **AI model** is given the reusable prompt (`prompts/`) and produces its own
   translations, saved under its own folder.
4. **Apply** one model's translations into the app, build it per language, and
   **screenshot** each feature page → `screenshots/{model}/`.
5. Repeat for the human baseline and each model, then compare.

Scripts (in `scripts/`):

| Script | Purpose |
| --- | --- |
| `scope.js` | Single source of truth: which strings each feature includes |
| `extract-translations.js` | Save the human translations as the baseline |
| `blank-translations.js` | Clear the in-scope strings so the AI can't peek |
| `apply-translations.js <model>` | Load a model's translations into the app |
| `run-local-screenshots.sh <model>` | Build + screenshot every language |
| `build-english-reference.js` | Generate the English reference set |

## Why this scope

The strings are deliberately limited to what is actually visible in each
screenshot, so voters compare exactly what they see. One pattern this study
specifically checks: sentences that are split across several pieces around an
inline link (e.g. "Per ORCID's **terms of use**, you may only register…").
Translating those piece-by-piece produces broken, ungrammatical results — a real
mistake found in the shipping translations — so the AI prompt calls it out
explicitly.
