export function googleAnalytics(indexHtml: string, options) {
  if (
    options.environmentVariables &&
    options.environmentVariables.GOOGLE_ANALYTICS
  ) {
    return indexHtml.replace(
      /UA-0000000-00/g,
      options.environmentVariables.GOOGLE_ANALYTICS
    )
  } else {
    console.warn(
      'This build will not have google analytics since the UID is not defined on the environment variables'
    )
    return indexHtml
  }
}
