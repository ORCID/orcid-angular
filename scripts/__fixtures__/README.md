# Test fixtures for the postbuild harness

These directories are inputs for `scripts/__tests__/postbuild.test.ts`
(`yarn test:scripts`). They are byte-stable on purpose and are listed in
`.prettierignore`: reformatting them would invalidate the golden layout
manifests in `golden/`.

Note that no README lives inside `dist-webpack/` or `dist-esbuild/`. Those
directories are copied verbatim into the workspace `dist/`, so anything in them
shows up in the layout manifest as if the build had emitted it.

---

# `dist-webpack` fixture

A byte-sized miniature of the `dist/` tree that
`ng build --configuration production --localize` produces, laid out exactly as
`scripts/postbuild.ts` expects: `./dist/<locale>/index.html` plus the locale's
hashed JS/CSS/font/image siblings, an `assets/` subtree, and `print-view/`.
Tests copy it into a temp `dist/`, run the real postbuild over it, and assert
the result still satisfies the deployed routing contract. `fetch-orcid.js` here
is a placeholder — postbuild's localize step overwrites it per locale.

## Identical filenames, different contents

Every locale ships the same hashed filenames (`main.3333333333333333.js`, …)
because webpack hashes the pre-localization chunk, so all locale builds collide
on name. Each JS file therefore carries a distinct `LOCALE:<code>` marker: once
step 6 flattens every locale into one `share-assets/`, a test can read
`main.3333333333333333-fr.js` and prove it still holds `LOCALE:fr` and not some
other locale's bytes. That collision is the whole reason postbuild appends
`-<locale>`: Cloudflare caches by URL for 2h with no cookie in the cache key.
CSS, fonts and images are byte-identical across locales — not localized, so
their flattened copies overwrite each other harmlessly and keep no suffix.

## Why `src` and `zh-CN`

`zh-CN` exercises step 5, which renames it to `zh_CN` so the Tomcat rewrite
valve's `^[a-z]{2}(_[A-Za-z]{2})?$` locale pattern matches and deep links fall
back to `index.html`. `src` is the pseudo-locale that pattern cannot match
(three letters): built and shipped, but unroutable. That is pre-existing, so
the harness allowlists it rather than failing.
