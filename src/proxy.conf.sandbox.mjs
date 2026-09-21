/**
 * `ng serve --configuration=local-sandbox`: the app is served locally,
 * everything else is proxied to sandbox.
 *
 * Object form keyed by path prefix. See ./proxy.conf.shared.mjs for why the
 * hooks and the print-view rewrite look the way they do.
 *
 * ORDER MATTERS. Vite matches keys with `url.startsWith(key)` and the first
 * match wins. This file previously listed '/' first, which made the '/v3.0'
 * entry unreachable, so public-API calls went to sandbox.orcid.org instead of
 * pub.sandbox.orcid.org. That was true under webpack-dev-server too (same
 * prefix semantics, handlers mounted in order), so it has never worked.
 */

import { rootBypass } from './proxy.conf.shared.mjs'

export default {
  // Public API. Must precede '/'.
  '/v3.0': {
    target: 'https://pub.sandbox.orcid.org',
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
  },

  '/': {
    target: 'https://sandbox.orcid.org',
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    bypass: (req, res, options) => {
      const local = rootBypass(req, res, options)
      if (local !== undefined) return local
      // Marks proxied traffic for the backend; bypass runs before proxy.web,
      // so the header is forwarded.
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
      return undefined
    },
  },
}
