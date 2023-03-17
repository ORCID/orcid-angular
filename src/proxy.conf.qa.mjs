export default {
  '/v3.0': {
    target: 'https://pub.qa.orcid.org',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    bypass: function (req, res, proxyOptions) {
      /// PRRINT REQUEST PATH
      if (req.headers.accept.includes('html')) {
        console.log('Skipping proxy', req.path)
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
      /// PRRINT REQUEST PATH
      if (req.headers.accept.includes('html') && req.path !== '/signout') {
        console.log('Skipping proxy', req.path)
        return '/index.html'
      } else {
        console.log('REDIRECTING TO QA', req.path)
      }
      req.headers['X-Dev-Header'] = 'local-host-proxy-call'
    },
  },

}
