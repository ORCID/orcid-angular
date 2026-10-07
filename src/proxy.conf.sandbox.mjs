export default {
  '/': {
    target: 'https://sandbox.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      const match = (req.url || '').match(
        /^\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\/print\/?$/i
      )
      if (match) {
        return `/print-view/index.html?orcid=${encodeURIComponent(match[1])}`
      }
      // Keep /print-view fully local so Angular is never involved.
      if (req.url?.startsWith('/print-view/')) {
        return req.url
      }
      if (req.headers.accept && req.headers.accept.includes('html')) {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
  '/v3.0': {
    target: 'https://pub.sandbox.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      const match = (req.url || '').match(
        /^\/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\/print\/?$/i
      )
      if (match) {
        return `/print-view/index.html?orcid=${encodeURIComponent(match[1])}`
      }
      // Keep /print-view fully local so Angular is never involved.
      if (req.url?.startsWith('/print-view/')) {
        return req.url
      }
      if (req.headers.accept && req.headers.accept.includes('html')) {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
}
