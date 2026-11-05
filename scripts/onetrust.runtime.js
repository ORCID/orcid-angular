// Chooses and loads the cookie consent manager for this page (OPS-2428).
// OneTrust stays the default everywhere. CookieYes loads only when all of
// these hold:
// - the environment carries a COOKIE_YES key;
// - the environment is a debugging one (QA and local, never production or
//   sandbox);
// - the page itself is on a QA or development host;
// - this browser has opted in, with ?cookieyes=true on any page or with
//   setQAflag('useCookieYesConsent', true). ?cookieyes=false opts it back out.
// The functions take the window, storage and document they act on, so the
// unit tests can drive them with fakes.
;(function (consent) {
  consent.OPT_IN_KEY = 'useCookieYesConsent'

  consent.chooseVendor = function (environment, search, storage, hostname) {
    if (
      !environment ||
      !environment.COOKIE_YES ||
      !environment.debugger ||
      !/(^|\.)(qa|dev)\.orcid\.org$/.test(hostname || '') ||
      !storage
    ) {
      return 'onetrust'
    }
    try {
      var requested = new URLSearchParams(search || '').get('cookieyes')
      if (requested === 'true') {
        storage.setItem(consent.OPT_IN_KEY, 'true')
      } else if (requested === 'false') {
        storage.removeItem(consent.OPT_IN_KEY)
      }
      return storage.getItem(consent.OPT_IN_KEY) === 'true'
        ? 'cookieyes'
        : 'onetrust'
    } catch (e) {
      return 'onetrust'
    }
  }

  consent.loadVendor = function (environment, vendor, document) {
    if (vendor === 'cookieyes') {
      var cookieYesScript = document.createElement('script')
      cookieYesScript.id = 'cookieyes'
      cookieYesScript.type = 'text/javascript'
      cookieYesScript.src =
        'https://cdn-cookieyes.com/client_data/' +
        environment.COOKIE_YES +
        '/script.js'
      document.head.appendChild(cookieYesScript)
    } else if (environment.ONE_TRUST) {
      // Retrieve your key-value (assuming it's a string).
      var keyValue = environment.ONE_TRUST

      // Create the first script tag.
      var script1 = document.createElement('script')
      script1.type = 'text/javascript'
      script1.src =
        'https://cdn.cookielaw.org/consent/' + keyValue + '/OtAutoBlock.js'
      document.head.appendChild(script1)

      // Create the second script tag.
      var script2 = document.createElement('script')
      script2.type = 'text/javascript'
      script2.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js'
      script2.charset = 'UTF-8'
      // Set data attributes as needed.
      script2.setAttribute('data-document-language', 'true')
      script2.setAttribute('data-domain-script', keyValue)
      document.head.appendChild(script2)
    }
  }

  consent.start = function (win) {
    ;(function waitForRuntimeEnvironment() {
      // Check if the runtime environment is available.
      if (win.runtimeEnvironment) {
        var storage = null
        try {
          storage = win.localStorage
        } catch (e) {}
        var vendor = consent.chooseVendor(
          win.runtimeEnvironment,
          win.location.search,
          storage,
          win.location.hostname
        )
        win.orcidConsent = win.orcidConsent || {}
        win.orcidConsent.vendor = vendor
        consent.loadVendor(win.runtimeEnvironment, vendor, win.document)
      } else {
        // If runtimeEnvironment is not yet available, check again in 50ms.
        setTimeout(waitForRuntimeEnvironment, 50)
      }
    })()
  }

  // Nothing loads inside an iframe, such as the trust-markers summary widget
  // embedded on another site (PD-9698).
  if (window.self === window.top) {
    consent.start(window)
  }
})((window.orcidConsent = window.orcidConsent || {}))
