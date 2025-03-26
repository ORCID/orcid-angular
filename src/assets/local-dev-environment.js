//DO NOT MODIFY THIS environment file directly, to updat this file.
//To update environments please update the files under "/src/environments"

;(function () {
  // The raw environment objects
  var environmentProduction = {
    production: true,
    debugger: false,
    ROBOTS: 'all',
    API_NEWS: 'https://info.orcid.org/feed/',
    API_PUB: '//pub.<SUBDOMAIN><DOMAIN>/v3.0',
    API_WEB: '//<SUBDOMAIN><DOMAIN>/',
    BASE_URL: '//<SUBDOMAIN><DOMAIN>/',
    INFO_SITE: 'https://info.orcid.org/',
    SHOW_TEST_WARNING_BANNER: false,
    GOOGLE_ANALYTICS_TESTING_MODE: false,
    GOOGLE_TAG_MANAGER: 'GTM-WDKLQXL',
    GOOGLE_RECAPTCHA: '6Lfj4AoTAAAAAAjr0x3Gu2RcVpA1-0LJAhV-GRQj',
    ZENDESK: 'b8313acd-6439-4894-b431-8c5a2ae9e7cb',
    HELP_HERO_ID: 'oYFQMrzFHA',
    INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: 20,
    VERBOSE_SNACKBAR_ERRORS_REPORTS: false,
    WORDPRESS_S3: 'https://homepage-prod.orcid.org',
    WORDPRESS_S3_FALLBACK: 'https://homepage-fallback.orcid.org',
    NEW_RELIC_APP: '772335825',
    LANGUAGE_MENU_OPTIONS: {
      ar: 'العربية',
      cs: 'Čeština',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
    },
    proxyMode: null,
    CAN_DISABLE_TEST_WARNING_BANNER: null,
  }
  var environmentQa = {
    production: true,
    debugger: true,
    ROBOTS: 'noindex, nofollow',
    API_NEWS: 'https://info.qa.orcid.org/feed/',
    API_PUB: '//pub.<SUBDOMAIN><DOMAIN>/v3.0',
    API_WEB: '//<SUBDOMAIN><DOMAIN>/',
    BASE_URL: '//<SUBDOMAIN><DOMAIN>/',
    INFO_SITE: 'https://info.qa.orcid.org/',
    GOOGLE_ANALYTICS_TESTING_MODE: true,
    GOOGLE_TAG_MANAGER: 'GTM-TRLHLRZ',
    GOOGLE_RECAPTCHA: '6LfWgrYqAAAAAHDYK0JwyHdN7_YZtG6s7Mr3L8r2',
    ZENDESK: 'b8313acd-6439-4894-b431-8c5a2ae9e7cb',
    HELP_HERO_ID: 'oYFQMrzFHA',
    SHOW_TEST_WARNING_BANNER: true,
    CAN_DISABLE_TEST_WARNING_BANNER: true,
    INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: 20,
    VERBOSE_SNACKBAR_ERRORS_REPORTS: true,
    WORDPRESS_S3: 'https://homepage-qa.orcid.org',
    WORDPRESS_S3_FALLBACK: 'https://homepage-fallback.orcid.org',
    NEW_RELIC_APP: '772335827',
    LANGUAGE_MENU_OPTIONS: {
      ar: 'العربية',
      cs: 'Čeština',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      xx: '** xx',
      src: '** source',
      lr: '** lr',
      rl: '** rl',
      uk: '** Ukrainian',
      ca: '** Catalan',
    },
    proxyMode: false,
  }
  var environmentSandbox = {
    production: true,
    debugger: false,
    ROBOTS: 'noindex, nofollow',
    API_NEWS: 'https://info.qa.orcid.org/feed/',
    API_PUB: '//pub.<SUBDOMAIN><DOMAIN>/v3.0',
    API_WEB: '//<SUBDOMAIN><DOMAIN>/',
    BASE_URL: '//<SUBDOMAIN><DOMAIN>/',
    INFO_SITE: 'https://info.qa.orcid.org/',
    GOOGLE_ANALYTICS_TESTING_MODE: false,
    GOOGLE_TAG_MANAGER: 'GTM-M9Z7DHS',
    GOOGLE_RECAPTCHA: '6LfHobYqAAAAAGeg4J4gOor0SUzIeAHPeIyBeMNK',
    HELP_HERO_ID: 'oYFQMrzFHA',
    ZENDESK: null,
    SHOW_TEST_WARNING_BANNER: true,
    CAN_DISABLE_TEST_WARNING_BANNER: false,
    INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: 20,
    VERBOSE_SNACKBAR_ERRORS_REPORTS: false,
    WORDPRESS_S3: 'https://homepage-prod.orcid.org',
    WORDPRESS_S3_FALLBACK: 'https://homepage-fallback.orcid.org',
    NEW_RELIC_APP: '772335828',
    LANGUAGE_MENU_OPTIONS: {
      ar: 'العربية',
      cs: 'Čeština',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
    },
    proxyMode: false,
  }
  var environment4200 = {
    production: false,
    debugger: true,
    ROBOTS: 'all',
    API_NEWS: 'https://www.mocky.io/v2/5dced45b3000007300931ce8',
    API_PUB: '//<SUBDOMAIN><DOMAIN>/v3.0',
    API_WEB: '//<SUBDOMAIN><DOMAIN>/',
    BASE_URL: '//<SUBDOMAIN><DOMAIN>/',
    INFO_SITE: 'https://info.orcid.org/',
    GOOGLE_ANALYTICS_TESTING_MODE: true,
    GOOGLE_TAG_MANAGER: 'GTM-0000000',
    GOOGLE_RECAPTCHA: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    HELP_HERO_ID: 'oYFQMrzFHA',
    ZENDESK: null,
    SHOW_TEST_WARNING_BANNER: true,
    CAN_DISABLE_TEST_WARNING_BANNER: true,
    INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: 50,
    VERBOSE_SNACKBAR_ERRORS_REPORTS: true,
    WORDPRESS_S3: 'https://homepage-qa.orcid.org',
    WORDPRESS_S3_FALLBACK: 'https://homepage-fallback.orcid.org',
    NEW_RELIC_APP: '772335827',
    LANGUAGE_MENU_OPTIONS: {
      ar: 'العربية',
      cs: 'Čeština',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      xx: '** xx',
      src: '** source',
      lr: '** lr',
      rl: '** rl',
      uk: '** Ukrainian',
      ca: '** Catalan',
    },
    proxyMode: true,
  }
  var environmentDev = {
    production: false,
    debugger: true,
    ROBOTS: 'all',
    API_NEWS: 'https://www.mocky.io/v2/5dced45b3000007300931ce8',
    API_PUB: '//pub.<SUBDOMAIN><DOMAIN>/v3.0',
    API_WEB: '//<SUBDOMAIN><DOMAIN>/',
    BASE_URL: '//<SUBDOMAIN><DOMAIN>/',
    INFO_SITE: 'https://info.orcid.org/',
    GOOGLE_ANALYTICS_TESTING_MODE: true,
    GOOGLE_TAG_MANAGER: 'GTM-0000000',
    GOOGLE_RECAPTCHA: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    HELP_HERO_ID: 'oYFQMrzFHA',
    ZENDESK: null,
    SHOW_TEST_WARNING_BANNER: true,
    CAN_DISABLE_TEST_WARNING_BANNER: true,
    INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT: 50,
    VERBOSE_SNACKBAR_ERRORS_REPORTS: true,
    WORDPRESS_S3: 'https://homepage-qa.orcid.org',
    WORDPRESS_S3_FALLBACK: 'https://homepage-fallback.orcid.org',
    NEW_RELIC_APP: '772335827',
    LANGUAGE_MENU_OPTIONS: {
      ar: 'العربية',
      cs: 'Čeština',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      xx: '** xx',
      src: '** source',
      lr: '** lr',
      rl: '** rl',
      uk: '** Ukrainian',
      ca: '** Catalan',
    },
    proxyMode: false,
  }

  function getCurrentLeanDomain() {
    var port = window.location.port ? ':' + window.location.port : ''
    // e.g. "qa.myorg.com" -> ["qa", "myorg", "com"]
    // .slice(-2) -> ["myorg", "com"]
    return window.location.hostname.split('.').slice(-2).join('.') + port
  }

  function getSubDomain() {
    // e.g. "qa.myorg.com" -> ["qa", "myorg", "com"]
    // .slice(0, -2) -> ["qa"]
    var subdomain = window.location.hostname.split('.').slice(0, -2).join('.')
    return subdomain ? subdomain + '.' : ''
  }

  function replaceEnvironmentVars(env) {
    if (!env) return
    if (env.API_WEB) {
      env.API_WEB = env.API_WEB.replace('<SUBDOMAIN>', getSubDomain()).replace(
        '<DOMAIN>',
        getCurrentLeanDomain()
      )
    }
    if (env.BASE_URL) {
      env.BASE_URL = env.BASE_URL.replace(
        '<SUBDOMAIN>',
        getSubDomain()
      ).replace('<DOMAIN>', getCurrentLeanDomain())
    }
    if (env.API_PUB) {
      env.API_PUB = env.API_PUB.replace('<SUBDOMAIN>', getSubDomain()).replace(
        '<DOMAIN>',
        getCurrentLeanDomain()
      )
    }
    if (env.AUTH_SERVER) {
      env.AUTH_SERVER = env.AUTH_SERVER.replace(
        '<SUBDOMAIN>',
        getSubDomain()
      ).replace('<DOMAIN>', getCurrentLeanDomain())
    }
  }

  var domain = window.location.hostname + window.location.pathname
  var chosenEnv = environmentProduction // default to production

  if (domain.includes('qa.orcid.org')) {
    chosenEnv = environmentQa
  } else if (domain.includes('sandbox.orcid.org')) {
    chosenEnv = environmentSandbox
  } else if (domain.includes('localhost:4200')) {
    chosenEnv = environment4200
  } else if (domain.includes('dev.orcid.org')) {
    chosenEnv = environmentDev
  } else if (domain.includes('localhost')) {
    // fallback to dev (e.g. karma testig)
    chosenEnv = environmentDev
  }

  replaceEnvironmentVars(chosenEnv)

  window.runtimeEnvironment = chosenEnv
})()
