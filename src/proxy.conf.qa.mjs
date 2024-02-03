export default {
  '/v3.0': {
    target: 'https://pub.qa.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRINT REQUEST PATH
      if (req.headers.accept?.includes('html')) {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
  '/': {
    target: 'https://qa.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRINT REQUEST PATH
      if (req.headers.accept?.includes('html') && req.path !== '/signout') {
        return '/index.html'
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
}
