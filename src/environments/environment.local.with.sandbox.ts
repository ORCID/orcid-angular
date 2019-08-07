// TODO: Currently CORS-Anywhere does not support calls with credentials
// to make the local environment work with Sandbox an alternative needs to be use to avoid CORS errors
export const environment = {
  production: false,
  API_NEWS: 'https://orcid.herokuapp.com/https://orcid.org/blog/feed',
  API_WEB: 'https://orcid.herokuapp.com/https://sandbox.orcid.org/',
  BASE_URL: 'https://orcid.org/',
  BLOG_NEWS: 'https://orcid.org/about/news',
  LANGUAGE_MENU_OPTIONS: {
    ar: 'العربية',
    cs: 'Čeština',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    pt: 'Português',
    ru: 'Русский',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    xx: '** xx',
    source: '** source',
    lr: '** lr',
    rl: '** rl',
    uk: '** Ukrainian',
    ca: '** Catalan',
  },
}
