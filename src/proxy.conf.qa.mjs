/**
 * ──────────────────────────────────────────────────────────────────────────────
 * onProxyReq for /auth: before sending to auth.qa.orcid.org,
 * force Origin/Referer to https://qa.orcid.org
 * ──────────────────────────────────────────────────────────────────────────────
 */
const ORCID_PATH_REGEX = /^\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\/print\/?$/i

function proxyReqOverrideHeaders(proxyReq /* http.ClientRequest */, req, res) {
  proxyReq.setHeader('Origin', 'https://qa.orcid.org')
  proxyReq.setHeader('Referer', 'https://qa.orcid.org')
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * responseOverridesAuth: for /auth proxy responses.
 *   1) Rewrite Set-Cookie domain from qa.orcid.org → localhost
 *   2) If a 3xx redirect points at auth.qa.orcid.org/login → localhost:4200/auth/login
 * ──────────────────────────────────────────────────────────────────────────────
 */
function responseOverridesAuth() {
  return (proxyRes, req, res) => {
    const cookies = proxyRes.headers['set-cookie']
    if (Array.isArray(cookies)) {
      proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
        cookie.replace(/Domain=\.?(qa\.)?orcid\.org/i, 'Domain=localhost')
      )
    }
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
      let location = proxyRes.headers['location']
      if (typeof location === 'string') {
        proxyRes.headers['PROXY-ORIGINAL-location'] = location
        proxyRes.headers['location'] = location
          .replace(
            'http://auth.qa.orcid.org/login',
            'http://localhost:4200/auth/login'
          )
          .replace(
            'https://auth.qa.orcid.org/generateAuthorizationInfo',
            'http://localhost:4200/auth/generateAuthorizationInfo'
          )
          .replace(
            'https://auth.qa.orcid.org/login',
            'http://localhost:4200/auth/login'
          )
      }
    }
  }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * responseOverridesGeneric: for root (/) proxies.
 *   1) Rewrite Set-Cookie domain from qa.orcid.org → localhost
 *   2) If a 3xx redirect points at  qa.orcid.org/signin → /signin
 * ──────────────────────────────────────────────────────────────────────────────
 */
function responseOverridesGeneric() {
  return (proxyRes, req, res) => {
    const cookies = proxyRes.headers['set-cookie']
    if (Array.isArray(cookies)) {
      proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
        cookie.replace(/Domain=\.?(qa\.)?orcid\.org/i, 'Domain=localhost')
      )
    }
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
      let location = proxyRes.headers['location']
      if (typeof location === 'string') {
        proxyRes.headers['location'] = location.replace(
          'https://qa.orcid.org/signin',
          'http://localhost:4200/signin'
        )
      }
    }
  }
}

const shouldProxyRootApi = (pathname, req) => {
  const accept = req.headers.accept || ''

  // Do NOT proxy SPA navigations or dev-server internals
  if (accept.includes('text/html')) return false
  if (
    pathname.startsWith('/assets') ||
    pathname.startsWith('/print-view') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/ng-cli-ws') ||
    pathname.startsWith('/sockjs-node') ||
    pathname === '/' ||
    pathname === '/index.html'
  ) {
    return false
  }

  // Everything else at root (your API calls without a prefix) → proxy
  return true
}

export default [
  {
    // Simulate nginx rewrite: /:orcid/print → /print-view/index.html?orcid=:orcid
    context: (pathname, req) => ORCID_PATH_REGEX.test(pathname),
    target: 'https://qa.orcid.org', // unused when bypass returns a path
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: (req) => {
      const path = (req.url || '').split('?')[0] || ''
      const match = path.match(ORCID_PATH_REGEX)
      if (!match) return
      const orcid = match[1]
      return `/print-view/index.html?orcid=${encodeURIComponent(orcid)}`
    },
  },
  {
    context: ['/v3.0'],
    target: 'https://pub.qa.orcid.org',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
  },
  {
    context: ['/auth'],
    target: 'https://auth.qa.orcid.org',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    pathRewrite: { '^/auth': '' },
    onProxyReq: proxyReqOverrideHeaders,
    onProxyRes: responseOverridesAuth(),
  },
  {
    // Proxy only root-level API requests, not the app shell
    context: shouldProxyRootApi,
    target: 'https://qa.orcid.org',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    onProxyRes: responseOverridesGeneric(),
  },
]
