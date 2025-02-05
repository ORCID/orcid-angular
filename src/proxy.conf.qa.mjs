export default {
  '/v3.0': {
    target: 'https://pub.qa.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    bypass: function (req, res, proxyOptions) {
      /// PRINT REQUEST PATH
      if (req.headers.accept?.includes('html')) {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
    onProxyRes: responseOverights(),
  },
  '/': {
    target: 'https://qa.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    onProxyRes: responseOverights(),

    bypass: function (req, res, proxyOptions) {
      if (req.headers.accept?.includes('html') && req.path !== '/signout') {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
}
function responseOverights() {
  return (proxyRes, req, res) => {
    // Grab the existing 'set-cookie' headers
    const cookies = proxyRes.headers['set-cookie']
    if (cookies) {
      // Transform each cookie
      const newCookies = cookies.map((cookie) => {
        // Example: rewrite "Domain=qa.orcid.org" to "Domain=localhost"
        return cookie.replace(/Domain=\.?qa\.orcid\.org/i, 'Domain=localhost')
      })

      // Put the transformed cookies back into the response header
      proxyRes.headers['set-cookie'] = newCookies
    }

    // Check for 3xx (especially 302) status codes:
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
      let location = proxyRes.headers['location']
      if (location) {
        location = location.replace(
          'https://qa.orcid.org/signin',
          'http://localhost:4200/signin'
        )
        proxyRes.headers['location'] = location
      }
    }
  }
}
