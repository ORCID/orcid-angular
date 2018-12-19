export const environment = {
  production: true,
  // TODO Remove use https://cors.io/ to proxy the news endpoint to avoid CORS errors during demo
  API_NEWS: 'https://cors.io/?https://orcid.org/blog/feed?format=text',
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
