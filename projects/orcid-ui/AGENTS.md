# Orcid UI — Agent Notes
This repo contains an Angular library at `projects/orcid-ui` published as `@orcid/ui`.
Use this document as a fast orientation and a checklist for making safe, consistent changes.

> **Note for future agents:** This file is intended to be edited over time. Any section—relevant or not—may be updated, trimmed, or reorganized so the document stays lean and useful for future agents. Prefer keeping only what helps the next AI work effectively with this library.

## Library scope: orcid-ui vs orcid-registry-ui

- **orcid-ui** (`@orcid/ui`): Only **agnostic** UI elements. No references to specific features or domain copy. This is an open-source–friendly library reusable in any ORCID or non-ORCID project. Components should use **Angular Material** when possible and design tokens for sizing, color, and typography.

- **orcid-registry-ui** (`@orcid/registry-ui`): **Registry-specific** components for the main orcid-angular app only. May use feature names and app-specific wording. Those components consume **orcid-ui**, Angular Material, and **orcid-tokens**.

## No i18n — strings from content project via inputs

- **Do not use i18n translations** in this library (no `i18n` attributes, no translation pipes, no runtime translation services).
- **All user-facing strings** must be supplied by the **content project** (the app that uses the library) via **Angular inputs** (e.g. `@Input() title`, `@Input() label`). Components should not hard-code copy; they receive it from the host.

## TL;DR (how to ship changes here)

- Prefer **standalone components** (`standalone: true`) and export them from `projects/orcid-ui/src/public-api.ts`.
- Style using **ORCID design tokens** (CSS variables like `--orcid-space-4`, `--orcid-color-text`, etc).
- If you add/modify tokens, update **all three**:
  - `projects/orcid-tokens/tokens.scss` (SCSS source-of-truth)
  - `projects/orcid-tokens/tokens.css` (CSS variables used by apps/docs)
  - `projects/orcid-tokens/tokens.json` (structured token map)
- Keep `projects/orcid-ui-docs` updated with a docs page + route + sidebar link. When you **change a component’s API** (inputs, data types, public behavior), update the main app (or other consumers) and that component’s doc page (usage snippet, inputs list, examples).
- Verify builds:
  - `npm run build:tokens`
  - `npm run build:ui`
  - `npm run build:ui-docs`

## Library structure and conventions

- **Package entry**: `projects/orcid-ui/src/public-api.ts`
- **Components**: `projects/orcid-ui/src/lib/components/**`
- **Directives**: `projects/orcid-ui/src/lib/directives/**`
- **Themes/typography**: `projects/orcid-ui/src/lib/themes/**`
- **Tokens** live in a sibling library `projects/orcid-tokens` (published as `@orcid/tokens`).

### Styling approach

- Components generally rely on **CSS variables** in `tokens.css` (e.g. `--orcid-space-*`, `--orcid-font-*`, `--orcid-color-*`).
- Some SCSS (typography/theme helpers) imports token SCSS.
- Prefer token variables over hard-coded colors/sizes.

### Loading and placeholder states

- Prefer existing **skeleton/placeholder components** from this library (e.g. `SkeletonPlaceholderComponent`) for loading or empty states so loading UIs stay consistent. Check `public-api.ts` and the docs before adding new spinners or custom placeholders.

## MCP Figma-to-code workflow used in this repo

When the user provides a Figma URL:

- Parse `fileKey` and `nodeId` from the URL query `node-id=...` (convert `-` to `:`).
- Use the Figma MCP in this order:
  - `get_design_context(fileKey, nodeId)` to extract layout/typography details
  - `get_screenshot(fileKey, nodeId)` for visual confirmation
- The MCP returns React/Tailwind examples; **do not** add Tailwind dependencies. Convert to Angular + existing token system.

## Docs site (`projects/orcid-ui-docs`) structure

Docs pages are split by library:

- **`src/app/pages/orcid-ui/`** — Pages for **@orcid/ui** components (overview, colors, typography, record-header, modal, panel, etc.). Add new orcid-ui doc pages here.
- **`src/app/pages/orcid-registry-ui/`** — Pages for **@orcid/registry-ui** components (e.g. permission-notifications, import-works-dialog). Add new registry-ui doc pages here.

When adding a doc page:

- Place the page in the correct folder: `pages/orcid-ui/<thing>-page.component.*` or `pages/orcid-registry-ui/<thing>-page.component.*`
- Import `DocumentationPageComponent` from `'../../components/documentation-page/documentation-page.component'`
- Register a lazy route in `app.routes.ts` (e.g. `import('./pages/orcid-ui/modal-page.component').then(...)`)
- Add a sidebar link in `docs-shell.component.html`
- Use `DocumentationPageComponent` with content-projected sections: `[controls]`, `[examples]`, `[usage]`, `[inputs]`

### Gotcha: braces in HTML docs templates

Angular templates may treat raw `{ ... }` inside text as ICU syntax. If you render TypeScript snippets like:

```ts
import { MatDialog } from '@angular/material/dialog'
```

escape braces in the HTML (e.g. `&#123;` and `&#125;`) to avoid template parse errors.


