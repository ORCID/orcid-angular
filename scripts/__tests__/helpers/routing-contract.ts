// The deployed routing contract for `dist/`, copied from the deployment configs
// cited on each constant. Tests import these instead of re-deriving them, so a
// postbuild layout change that breaks routing fails in review rather than 404ing
// after deploy.
//
// Sibling repos referenced below:
//   inventory = orcid-ansible_inventory-private
//   source    = ORCID-Source

/**
 * inventory prod/.files/slotr_java/reg/etc/slotr/instance/reg-ui/1/conf/
 * Catalina/localhost/rewrite.config lines 1-2:
 *
 *   RewriteCond %{REQUEST_PATH} !-f
 *   RewriteRule ^/orcid-web-frontend/([a-z]{2}(_[A-Za-z]{2})?)/.*
 *               /orcid-web-frontend/$1/index.html
 *
 * The valve is what makes client-side deep links work: any request under a
 * locale directory that is not an existing file falls back to that locale's
 * index.html. A directory whose name does not match this pattern never gets the
 * fallback, so every Angular route under it 404s. That is the whole reason
 * postbuild renames zh-CN -> zh_CN: a dash is not in the character class.
 */
export const LOCALE_DIR_RE = /^[a-z]{2}(_[A-Za-z]{2})?$/

/**
 * `src` is Angular's i18n source locale; `--localize` emits dist/src/ alongside
 * the real locales. Three letters, so LOCALE_DIR_RE rejects it and the rewrite
 * valve above never serves it -- it ships inside the WAR and is unreachable.
 * Pre-existing and out of scope for the postbuild tests; this allowlist exists
 * only so the locale-directory assertions can stay strict about everything else.
 *
 * Shrink this list, never grow it. A new entry means a new locale shipped that
 * nobody can load.
 */
export const UNROUTABLE_LOCALE_DIRS: readonly string[] = ['src']

/**
 * inventory prod/.files/nginx/reg/sites-enabled/ui.conf.j2 line 133 -- the
 * `location ~` whose block sets $app_path "/orcid-web-frontend/share-assets".
 *
 * index.html carries <base href="/"> and bare filenames, so the browser asks
 * for /main.<hash>-fr.js and /assets/... at the site ROOT, never under the
 * locale directory it came from. Only root paths matching this regex are sent
 * to share-assets; everything else falls through to the app routes and returns
 * HTML. Three consequences worth asserting:
 *
 *   - share-assets must stay flat apart from assets/, because the extension
 *     branch `\/([^\/]*)(\.js|...)$` spans a single path segment only;
 *   - a flat file must end in one of those extensions or start with
 *     styles/runtime/polyfills/main, or it is simply unreachable;
 *   - `.css` is NOT in the extension list. styles.<hash>.css reaches
 *     share-assets only via the `\/styles.*$` branch, so a stylesheet put in
 *     share-assets under any other name is unreachable.
 *
 * Do NOT assert this regex against print-view files. ui.conf.j2 line 125
 * declares `location ^~ /print-view/`, and an `^~` prefix match takes priority
 * over every regex location in nginx, so /print-view/* is served from
 * /orcid-web-frontend/<langCode>/print-view/ instead. That exemption is what
 * lets cv-style.css keep its name and what lets postbuild write a separately
 * localized fetch-orcid.js per locale rather than one shared copy.
 */
export const PROD_ASSET_RE =
  /^(\/assets\/.*$|\/([^\/]*)(\.js|\.jpg|\.jpeg|\.png|\.svg|\.woff|\.woff2|\.webp)$|\/styles.*$|\/runtime.*$|\/polyfills.*$|\/main.*$|\/manifest\.json$|\/assets.*$)/

/**
 * source orcid-web-proxy/nginx/conf.d/default.conf line 83, which is also the
 * copy the inventory's int/ and stage/ ui.conf.j2 still carry (neither file
 * mentions webp). It is PROD_ASSET_RE minus `|\.webp`.
 *
 * Kept as a separate constant on purpose: a .webp reaching share-assets
 * resolves in prod and qa but 404s on the dev proxy, on int and on stage.
 * Assert new asset types against this narrower regex so the build cannot ship
 * something that only works in two of the five environments.
 */
export const DEV_ASSET_RE =
  /^(\/assets\/.*$|\/([^\/]*)(\.js|\.jpg|\.jpeg|\.png|\.svg|\.woff|\.woff2)$|\/styles.*$|\/runtime.*$|\/polyfills.*$|\/main.*$|\/manifest\.json$|\/assets.*$)/

/**
 * inventory prod/.files/nginx/reg/sites-enabled/ui.conf.j2 lines 12-33,
 * `map $cookie_locale_v3 $langCode`. These are the map's VALUES (the folder
 * names), not its keys: the cookie reads `zh-CN`, the folder it selects is
 * `zh_CN`. nginx serves /orcid-web-frontend/<$langCode>/index.html, so if the
 * build stops emitting one of these directories, every visitor already holding
 * that cookie gets nothing -- and they cannot clear it from inside the app.
 *
 * This is a strict SUBSET of what the build emits: `src` is unroutable, and
 * `uk` is built and routable but has no cookie entry, so it is reachable only
 * by direct URL. Assert containment (every folder named here exists in dist),
 * never equality.
 *
 * Listed alphabetically for review; the nginx map is in its own order.
 */
export const COOKIE_MAP_FOLDERS: readonly string[] = [
  'ar',
  'ca',
  'cs',
  'de',
  'en',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'lr',
  'pl',
  'pt',
  'rl',
  'ru',
  'tr',
  'xx',
  'zh_CN',
  'zh_TW',
]

/**
 * `url` is the root-relative URL the BROWSER requests, not a path inside dist:
 * because of <base href="/">, dist/share-assets/main.<hash>-en.js is fetched as
 * '/main.<hash>-en.js'. Neither regex carries the /g flag, so .test() keeps no
 * lastIndex state and both helpers are safe to call in a loop.
 */
export function matchesProdAssetRoute(url: string): boolean {
  return PROD_ASSET_RE.test(url)
}

export function matchesDevAssetRoute(url: string): boolean {
  return DEV_ASSET_RE.test(url)
}
