/**
 * `ng serve --configuration=local-qa` (and the localized variants): the app is
 * served locally, everything else is proxied to QA.
 *
 * Object form keyed by path prefix. See ./proxy.conf.shared.mjs for why the
 * webpack array form with function contexts no longer works and how the hooks
 * translate to Vite.
 *
 * ORDER MATTERS. Vite matches keys with `url.startsWith(key)` and the first
 * match wins, so `/` has to be last.
 */

import {
  devOrigin,
  isRedirect,
  rewriteCookieDomain,
  rootBypass,
} from './proxy.conf.shared.mjs'

const QA_ORIGIN = 'https://qa.orcid.org'
const AUTH_ORIGIN = 'https://auth.qa.orcid.org'

/** Cookies come back scoped to qa.orcid.org; the browser is on localhost. */
const QA_COOKIE_DOMAIN = /Domain=\.?(qa\.)?orcid\.org/i

export default {
  // Public API. Must precede '/', which would otherwise swallow it.
  '/v3.0': {
    target: 'https://pub.qa.orcid.org',
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
  },

  '/auth': {
    target: AUTH_ORIGIN,
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    // was pathRewrite: { '^/auth': '' }
    rewrite: (path) => path.replace(/^\/auth/, ''),
    configure(proxy) {
      // The auth server rejects requests whose Origin is not the registry.
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.setHeader('Origin', QA_ORIGIN)
        proxyReq.setHeader('Referer', QA_ORIGIN)
      })
      proxy.on('proxyRes', (proxyRes, req) => {
        rewriteCookieDomain(proxyRes, QA_COOKIE_DOMAIN)
        if (!isRedirect(proxyRes)) return
        // Keep the browser on the dev server instead of following it to QA.
        const origin = devOrigin(req)
        proxyRes.headers['proxy-original-location'] = proxyRes.headers.location
        proxyRes.headers.location = proxyRes.headers.location
          .replace(`http://auth.qa.orcid.org/login`, `${origin}/auth/login`)
          .replace(
            `https://auth.qa.orcid.org/generateAuthorizationInfo`,
            `${origin}/auth/generateAuthorizationInfo`
          )
          .replace(`https://auth.qa.orcid.org/login`, `${origin}/auth/login`)
      })
    },
  },

  // Catch-all for root-level API calls. rootBypass keeps SPA navigations,
  // application bundles, assets and Vite internals on the dev server, and
  // rewrites /:orcid/print to the print view.
  '/': {
    target: QA_ORIGIN,
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    bypass: rootBypass,
    configure(proxy) {
      proxy.on('proxyRes', (proxyRes, req) => {
        rewriteCookieDomain(proxyRes, QA_COOKIE_DOMAIN)
        if (!isRedirect(proxyRes)) return
        proxyRes.headers.location = proxyRes.headers.location.replace(
          `${QA_ORIGIN}/signin`,
          `${devOrigin(req)}/signin`
        )
      })
    },
  },
}
