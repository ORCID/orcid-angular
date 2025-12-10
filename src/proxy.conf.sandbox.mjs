export default {
  '/': {
    target: 'https://sandbox.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRRINT REQUEST PATH
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
      /// PRRINT REQUEST PATH
      if (req.headers.accept && req.headers.accept.includes('html')) {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
}
