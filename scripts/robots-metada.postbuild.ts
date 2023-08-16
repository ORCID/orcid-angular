export function robotsMetadata(indexHtml: string, options) {
  if (options.languageCode === 'xx') {
    console.warn('XX build will allow all robots')
    return indexHtml.replace(`[ROBOTS_PARAMETERS]`, 'all')
  } else if (
    options.environmentVariables &&
    options.environmentVariables.ROBOTS
  ) {
    return indexHtml.replace(
      `[ROBOTS_PARAMETERS]`,
      options.environmentVariables.ROBOTS
    )
  } else {
    console.warn(
      'This build will disallow robots with `noindex, nofollow` since the parameters are not defined on the environment variables'
    )
    return indexHtml.replace(`[ROBOTS_PARAMETERS]`, `noindex, nofollow`)
  }
}
