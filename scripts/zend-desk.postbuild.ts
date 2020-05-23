export function zendeskPlugin(indexHtml: string, options) {
  if (options.environmentVariables && options.environmentVariables.ZENDESK) {
    return indexHtml.replace(
      /00000000-0000-0000-0000-000000000000/g,
      options.environmentVariables.ZENDESK
    )
  } else {
    console.warn(
      'This build will not have the Zendesk plugin since the key is not defined on the environment variables'
    )
    return indexHtml
  }
}
