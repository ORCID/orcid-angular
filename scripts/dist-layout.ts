/**
 * The shape of `dist/`, in one place.
 *
 * `ng build --localize` writes one directory per locale plus a few artifacts
 * that are not locale output. Several scripts walk `dist/` and each used to
 * carry its own idea of what to skip, which is how `dist/test-out` (karma's
 * compiled specs) ended up being treated as a locale.
 */

/**
 * Top-level directories under `dist/` that are NOT locale output.
 *
 * - `share-assets` is created by the last step of postbuild, so a re-run sees it
 * - `test-out` is written by `@angular/build:karma`
 * - `browser` means `outputPath.browser` is not `""` and the whole tree is one
 *   level deeper than every glob assumes
 */
export const NON_LOCALE_DIRS = ['share-assets', 'test-out', 'browser']

/**
 * True for `./dist/<locale>/index.html`, false for the same path under a
 * non-locale directory.
 *
 * Takes the glob's own forward-slashed form (`./dist/<locale>/index.html`), so
 * the locale is segment 2. That is the same derivation `getOptionsObjet` in
 * ./utils uses, and both depend on the tree being exactly two levels deep.
 */
export function isLocaleIndexFile(file: string): boolean {
  return !NON_LOCALE_DIRS.includes(file.split('/')[2])
}
