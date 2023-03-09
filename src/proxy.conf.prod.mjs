export default {
  '/': {
    target: 'https://orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRRINT REQUEST PATH
      if (req.headers.accept.includes('html')) {
        console.log('Skipping proxy', req.path)
        return '/index.html'
      } else {
        console.log('REDIRECTING TO QA', req.path)
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
  '/v3.0': {
    target: 'https://pub.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRRINT REQUEST PATH
      if (req.headers.accept.includes('html')) {
        console.log('Skipping proxy', req.path)
        return '/index.html'
      } else {
        console.log('REDIRECTING TO QA', req.path)
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },
}
