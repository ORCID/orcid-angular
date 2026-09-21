/**
 * `ng serve --configuration=local-orcid-web`: the app is served locally and API
 * calls go to a local orcid-web backend at http://localhost:8080/orcid-web.
 *
 * Object form keyed by path prefix. See ./proxy.conf.shared.mjs for why the
 * webpack array form with function contexts no longer works and how the hooks
 * translate to Vite.
 */

import { devOrigin, isRedirect, rootBypass } from './proxy.conf.shared.mjs'

const BACKEND = 'http://localhost:8080/orcid-web'

/**
 * The local backend issues cookies for its own host and context path, over
 * plain http. Reshape them so the browser on localhost keeps them.
 */
function rewriteCookies(proxyRes) {
  const cookies = proxyRes.headers['set-cookie']
  if (!cookies) return

  const rewrite = (cookie) =>
    cookie
      .replace(/Domain=[^;]+/gi, 'Domain=localhost')
      .replace(/Path=\/orcid-web/gi, 'Path=/')
      // no TLS in local dev, so a Secure cookie would never be sent back
      .replace(/;\s*secure/gi, '')
      .trim()

  proxyRes.headers['set-cookie'] = Array.isArray(cookies)
    ? cookies.map(rewrite)
    : rewrite(cookies)
}

export default {
  // http-proxy keeps the target's /orcid-web prefix (prependPath defaults to
  // true), so no path rewrite is needed. The old `pathRewrite: { '^/': '/' }`
  // was an identity and is dropped.
  '/': {
    target: BACKEND,
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    bypass: rootBypass,
    configure(proxy) {
      proxy.on('proxyRes', (proxyRes, req) => {
        rewriteCookies(proxyRes)
        if (!isRedirect(proxyRes)) return
        proxyRes.headers.location = proxyRes.headers.location.replace(
          BACKEND,
          devOrigin(req)
        )
      })
    },
  },
}
