export const environment = {
  production: true,

  // https://orcid.herokuapp.com is an instance of https://github.com/Rob--W/cors-anywhere hosted on Heroku
  // to avoid CORS errors while he prototype is not hosted on *.orcid.com domains.
  API_NEWS: 'https://orcid.herokuapp.com/https://orcid.org/blog/feed',
  API_WEB: 'https://orcid.herokuapp.com/https://qa.orcid.org/',
  BASE_URL: 'https://qa.orcid.org/',
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
  },
}
