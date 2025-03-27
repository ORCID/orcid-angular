export interface EnvironmentInterface {
  production: boolean
  debugger: boolean
  ROBOTS: string
  API_NEWS: string
  API_PUB: string
  API_WEB: string
  AUTH_SERVER: string
  BASE_URL: string
  INFO_SITE: string
  GOOGLE_ANALYTICS_TESTING_MODE: boolean
  GOOGLE_TAG_MANAGER: string
  GOOGLE_RECAPTCHA: string
  HELP_HERO_ID: string
  ZENDESK: string | null
  SHOW_TEST_WARNING_BANNER: boolean
  CAN_DISABLE_TEST_WARNING_BANNER: boolean
  INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: number
  VERBOSE_SNACKBAR_ERRORS_REPORTS: boolean
  WORDPRESS_S3: string
  WORDPRESS_S3_FALLBACK: string
  NEW_RELIC_APP: string
  LANGUAGE_MENU_OPTIONS: {
    [key: string]: string
  }
  proxyMode: boolean
  ONE_TRUST: string
}

declare global {
  const runtimeEnvironment: EnvironmentInterface
}
