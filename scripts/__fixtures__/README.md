# Test fixtures for the postbuild harness

Inputs for `scripts/__tests__/postbuild.test.ts` (`yarn test:scripts`). They are
byte-stable on purpose and listed in `.prettierignore`: reformatting them would
invalidate the golden layout manifest in `golden/`.

No README lives inside `dist-esbuild/`. That directory is copied verbatim into
the workspace `dist/`, so anything in it shows up in the layout manifest as if
the build had emitted it. (`workspace.ts` filters OS junk and `README.md` for the
same reason, after one leaked into a golden.)

## `dist-esbuild`

A miniature of what `ng build --configuration production --localize` emits with
`@angular/build:application`, before postbuild runs.

**Four locales: `en`, `fr`, `zh-CN`, `src`.** Each is there for a reason.

- `zh-CN` exercises the rename to `zh_CN`. The Tomcat rewrite valve only serves
  locale directories matching `[a-z]{2}(_[A-Za-z]{2})?`, so a hyphen would 404
  every deep link in Chinese. Note the asymmetry this creates and which the
  tests assert: the directory becomes `zh_CN` but the bundles inside it keep the
  `-zh-CN` suffix, because filenames are stamped before the directory is renamed.
  That is what production serves.
- `src` is Angular's i18n source locale. Three letters, so the valve cannot route
  it; the harness allowlists it via `UNROUTABLE_LOCALE_DIRS`.
- `fr` is the locale the monit health check uses.
- `en` is the source of truth for `share-assets/assets`, which is why it alone
  carries `assets/en-only.txt`.

**Every locale uses the SAME hashed filenames with DIFFERENT contents.** That is
not an oversight, it is the situation the whole design exists for: esbuild
computes the content hash before translations are inlined, so all 21 locales
collide on `main-AAAAAAAA.js`. They are then flattened into one `share-assets`
directory, and Cloudflare caches by URL with no cookie in the key. Without the
`-<locale>` suffix the last locale written would be served to everyone.

Each JS file carries a `LOCALE:<code>` marker so a test can prove the per-locale
copies survived the flatten. The test also keys off that marker to decide which
bundles must differ: `new-relic.runtime.*` has no marker because it is a verbatim
copy of `scripts/new-relic.runtime.js` and is byte-identical in every locale, as
it is in the real build.

**Naming.** esbuild emits `<name>-<8 uppercase alphanumerics>`, not webpack's
`<name>.<16 lowercase hex>`. There is no `runtime.js`: lazy chunks are quoted ESM
specifiers (`import("./chunk-BBBBBBBB.js")`, `from"./chunk-CCCCCCCC.js"`) inside
the emitted modules, and `index.html` preloads them as bare
`href="chunk-CCCCCCCC.js"`. The fixture uses both spellings so the rewrite pass
has to handle both. Hashed fonts and images sit under `assets/` because
`angular.json` sets `outputPath.media` to `assets`.

**Root-level artifacts.** `3rdpartylicenses.txt` and `prerendered-routes.json`
are emitted at the top of the output directory, outside any locale, because
`outputPath.browser` is `""`. postbuild moves the first in with the bundles and
deletes the second; without that the WAR would gain two files at its served root
that were never there under webpack.

## `print-view`

Inputs for `scripts/print-view-localize.postbuild.ts`, which inlines `$localize`
into the print view. That script is needed because `fetch-orcid.js` is a plain
asset, not part of the Angular compilation, so the build never sees its messages.

- `fetch-orcid.js` mirrors the real file's shape: the
  `typeof $localize === 'undefined'` shim (which legitimately keeps the string
  `$localize` in the output, so the tests assert on the absence of tagged-template
  calls, not the identifier) plus three messages, one of them with a placeholder.
- `messages.fr.xlf`, `messages.zh_CN.xlf`, `messages.source.xlf` are XLIFF 1.2
  with those three units. The locale-to-file mapping is `XLF_LOCALE_MAP` in the
  localizer: `zh-CN` reads `messages.zh_CN.xlf` and `src` reads
  `messages.source.xlf`.
- There is deliberately **no** `messages.en.xlf`: `en` is the source locale, and
  the localizer inlines the English text with `missingTranslation: 'ignore'`.
- The placeholder unit uses a real `<x id="count"/>` element rather than the
  legacy `${expr}:name:` text, which `scripts/normalize-xlf.prebuild.ts` rejects.

## `golden`

`postbuild-esbuild.manifest.json` is the fixture's expected layout;
`real-build.manifest.json` is a normalized snapshot of an actual 21-locale build,
checked by `yarn build:manifest:check`. Hashes are collapsed to `<h>` so the
files stay stable across builds while the SHAPE of the tree remains reviewable.
Re-record with `yarn test:scripts:update` and `yarn build:manifest` respectively,
and read the diff: every line is a change production will see.
