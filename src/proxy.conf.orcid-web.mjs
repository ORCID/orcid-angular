/**
 * Proxy configuration to hit a local orcid-web backend at http://localhost:8080/orcid-web
 * - Rewrites cookie domains to localhost
 * - Strips `secure` so cookies work over http
 * - Proxies only API calls (not the Angular app shell)
 */

function rewriteCookies(proxyRes) {
  const cookies = proxyRes.headers['set-cookie']
  if (!cookies) return

  const rewrite = (cookie) => {
    let rewritten = cookie
    // Force cookies to localhost domain
    rewritten = rewritten.replace(/Domain=[^;]+/gi, 'Domain=localhost')
    // Normalize path to root
    rewritten = rewritten.replace(/Path=\/orcid-web/gi, 'Path=/')
    // Remove secure for http local dev
    rewritten = rewritten.replace(/;\s*secure/gi, '')
    return rewritten.trim()
  }

  proxyRes.headers['set-cookie'] = Array.isArray(cookies)
    ? cookies.map(rewrite)
    : rewrite(cookies)
}

function responseOverridesGeneric() {
  return (proxyRes, req, res) => {
    rewriteCookies(proxyRes)
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
      const location = proxyRes.headers['location']
      if (typeof location === 'string') {
        proxyRes.headers['location'] = location.replace(
          'http://localhost:8080/orcid-web',
          'http://localhost:4200'
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
    // Proxy root-level API calls to local orcid-web
    context: shouldProxyRootApi,
    target: 'http://localhost:8080/orcid-web',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    onProxyRes: responseOverridesGeneric(),
    pathRewrite: { '^/': '/' },
  },
]

