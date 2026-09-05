/**
 * Shared helpers for the `ng serve` proxy configurations.
 *
 * These files are consumed by `@angular/build:dev-server`, which is Vite, not
 * webpack-dev-server. Three differences drive everything below.
 *
 * 1. Angular's proxy loader (@angular/build/src/utils/load-proxy-config.js)
 *    accepts the webpack ARRAY form but SILENTLY DROPS any entry whose
 *    `context` is not an array of strings. Function contexts are gone. So these
 *    files use the object form, keyed by path prefix.
 *
 * 2. Vite matches keys in INSERTION ORDER and the first match wins
 *    (doesProxyContextMatchUrl: `context[0] === '^' && new RegExp(context).test(url)
 *    || url.startsWith(context)`). Specific prefixes must therefore be listed
 *    BEFORE the `/` catch-all.
 *
 * 3. The middleware order is: Angular's assets middleware -> Vite proxy ->
 *    Vite transform (which serves main.js, polyfills.js, chunk-*.js) -> Angular's
 *    html fallback. Application bundles reach the proxy BEFORE anything serves
 *    them, and they arrive with `Accept: * / *`, so a naive "proxy everything
 *    that is not an HTML navigation" rule ships them to the upstream. Under
 *    webpack-dev-server the dev middleware was mounted both before and after the
 *    proxies, which is why this never mattered.
 *
 * Hook translation: webpack's `onProxyReq`/`onProxyRes` are ignored by Vite.
 * Use `configure(proxy)` and `proxy.on('proxyReq'|'proxyRes', ...)`. `logLevel`
 * is also ignored; use `DEBUG=vite:proxy` to trace.
 *
 * `bypass(req, res, opts)` return values, per Vite 7:
 *   string           -> req.url is replaced and the request continues locally
 *   false            -> hard 404
 *   undefined / null -> proxied
 */

import { fileURLToPath } from 'node:url'

/** `/0000-0002-1825-0097/print`, the printable record route. */
export const ORCID_PRINT_RE = /^\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\/print\/?$/i

/** These files live in src/, the print view in src/assets/print-view/. */
export const PRINT_VIEW_INDEX = fileURLToPath(
  new URL('./assets/print-view/index.html', import.meta.url)
)

export const pathOf = (req) => (req.url || '').split('?')[0] || ''

/**
 * The origin the browser actually used, so redirect rewriting keeps working on
 * any port. The old configs hardcoded localhost:4200.
 */
export const devOrigin = (req) =>
  `${req.socket?.encrypted ? 'https' : 'http'}://${req.headers.host}`

/**
 * Paths the dev server owns. `/@vite/`, `/@fs/`, `/@id/` and `/node_modules/`
 * are Vite internals; Angular's assets middleware rewrites non-JS assets to
 * `/@fs/<abs path>` before the proxy sees them, so that prefix must pass through.
 */
const DEV_PREFIXES = [
  '/assets',
  '/print-view',
  '/favicon.ico',
  '/@vite/',
  '/@fs/',
  '/@id/',
  '/@ng/',
  '/node_modules/',
  '/__open-in-editor',
]

/** Application bundles and their sourcemaps: served by Vite's transform. */
const BUNDLE_RE = /\.(m?js|css|map)$/i

export function isDevServerRequest(req, path) {
  const accept = req.headers.accept || ''
  // SPA navigation. Same rule the previous configs used.
  if (accept.includes('text/html')) return true
  // Vite's own health ping.
  if (accept === 'text/x-vite-ping') return true
  if (path === '/' || path === '/index.html') return true
  if (path === '/.well-known/appspecific/com.chrome.devtools.json') return true
  if (BUNDLE_RE.test(path)) return true
  return DEV_PREFIXES.some((prefix) => path.startsWith(prefix))
}

/**
 * Mirrors the nginx rule `/:orcid/print` -> the print view, keeping the browser
 * URL intact.
 *
 * Returns an `/@fs/` URL rather than `/print-view/index.html`: Angular's html
 * fallback rewrites any .html request that is not /index.html to the SPA shell,
 * so the plain path would serve the app instead of the print view. Vite's raw-fs
 * middleware serves `/@fs/<abs>` because Angular adds every asset source
 * directory to `server.fs.allow`.
 */
export function printViewRewrite(path) {
  const match = path.match(ORCID_PRINT_RE)
  return match
    ? `/@fs/${encodeURI(PRINT_VIEW_INDEX)}?orcid=${encodeURIComponent(
        match[1]
      )}`
    : undefined
}

/** Decides, for the `/` catch-all, whether a request is an API call. */
export function rootBypass(req) {
  const path = pathOf(req)
  const printView = printViewRewrite(path)
  if (printView) return printView
  return isDevServerRequest(req, path) ? req.url : undefined
}

/**
 * Rewrites the Set-Cookie Domain so the browser keeps cookies issued for the
 * upstream host. Runs on 'proxyRes', which fires before Vite copies the headers
 * onto the response.
 */
export function rewriteCookieDomain(proxyRes, domainPattern) {
  const cookies = proxyRes.headers['set-cookie']
  if (Array.isArray(cookies)) {
    proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
      cookie.replace(domainPattern, 'Domain=localhost')
    )
  }
}

export const isRedirect = (proxyRes) =>
  proxyRes.statusCode >= 300 &&
  proxyRes.statusCode < 400 &&
  typeof proxyRes.headers.location === 'string'
