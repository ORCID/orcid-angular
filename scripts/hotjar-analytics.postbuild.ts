export function hotjarAnalytics(indexHtml: string, options) {
  if (
    options.environmentVariables &&
    options.environmentVariables.HOTJAR_ANALYTICS
  ) {
    return indexHtml.replace(
      /hjid: 0000000/g,
      options.environmentVariables.HOTJAR_ANALYTICS
    )
  } else {
    console.warn(
      'This build will not have hotjar analytics since the hjid is not defined on the environment variables'
    )
    return indexHtml
  }
}
