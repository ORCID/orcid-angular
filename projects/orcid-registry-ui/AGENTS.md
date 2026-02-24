# Orcid Registry UI — Agent Notes (for future GPTs)

This package (`projects/orcid-registry-ui`, published as `@orcid/registry-ui`) contains **feature-oriented UI components** for the main orcid-angular application only. It is not intended for reuse outside this project.

> **Note for future agents:** This file is intended to be edited over time. Any section—relevant or not—may be updated, trimmed, or reorganized so the document stays lean and useful for future agents. Prefer keeping only what helps the next AI work effectively with this library.

## Library scope: orcid-registry-ui vs orcid-ui

- **orcid-ui** (`@orcid/ui`): Fully **agnostic** UI building blocks. No feature names or domain-specific wording. Open source–friendly and reusable across any ORCID or non-ORCID project. Components use Angular Material when possible and design tokens for styling.

- **orcid-registry-ui** (`@orcid/registry-ui`): **Registry-specific** components for the orcid-angular app only. May use feature names (e.g. “Import your works”, “Permission notifications”). Builds on **orcid-ui** components, Angular Material, and **orcid-tokens**. More flexible and app-coupled.

## Conventions

- **Package entry**: `projects/orcid-registry-ui/src/public-api.ts`
- **Components**: `projects/orcid-registry-ui/src/lib/components/**`
- Prefer **standalone components**. Use `@orcid/ui` for base primitives (modals, action surfaces, etc.) and **orcid-tokens** CSS variables for layout/color/typography.
- Dialogs that use the shared modal chrome should use `OrcidModalComponent` and `ORCID_MODAL_DIALOG_PANEL_CLASS` from `@orcid/ui` when opening with `MatDialog`.

## Dependencies

- Peer: `@angular/common`, `@angular/core`, `@angular/material`, `@orcid/ui`, `rxjs`
- The host app (orcid-angular) supplies `@orcid/ui` and design tokens (e.g. via `tokens.css`).

## Building

- From repo root: `ng build orcid-registry-ui` (or use the npm script if defined).

## Docs site (`projects/orcid-ui-docs`)

Registry-ui doc pages live under **`src/app/pages/orcid-registry-ui/`** (orcid-ui pages live under `pages/orcid-ui/`). When adding a new registry-ui component doc:

- Add the page in `projects/orcid-ui-docs/src/app/pages/orcid-registry-ui/<name>-page.component.{ts,html,scss}`
- Import `DocumentationPageComponent` from `'../../components/documentation-page/documentation-page.component'`
- Register a lazy route in `app.routes.ts` pointing to `./pages/orcid-registry-ui/<name>-page.component`
- Add a sidebar link under the “Orcid Registry UI” section in `docs-shell.component.html`
