if (window.self === window.top) {
  ;(function waitForRuntimeEnvironment() {
    // Check if the runtime environment is available.
    if (window.runtimeEnvironment) {
      if (window.runtimeEnvironment.ONE_TRUST) {
        // Retrieve your key-value (assuming it's a string).
        var keyValue = window.runtimeEnvironment.ONE_TRUST

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
      } else {
      }
    } else {
      // If runtimeEnvironment is not yet available, check again in 50ms.
      setTimeout(waitForRuntimeEnvironment, 50)
    }
  })()
}
