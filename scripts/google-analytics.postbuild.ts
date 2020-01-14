export function googleAnalytics(indexHtml, options) {
  if (
    options.environmentVariables &&
    options.environmentVariables.GOOGLE_ANALYTICS
  ) {
    const googleScript = `  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=${
      options.environmentVariables.GOOGLE_ANALYTICS
    }"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', '${options.environmentVariables.GOOGLE_ANALYTICS}')
  </script>`
    const i = indexHtml.indexOf('</head>')
    return `${indexHtml.slice(0, i)}
${googleScript}
${indexHtml.slice(i)}`
  } else {
    console.warn(
      'This build will not have google analytics since the UID is not defined on the environment variables'
    )
    return indexHtml
  }
}
