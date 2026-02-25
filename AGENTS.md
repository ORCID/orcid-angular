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
