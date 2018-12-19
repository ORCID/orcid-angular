// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_NEWS: 'https://cors.io/?https://orcid.org/blog/feed?format=text',
  // Use https://cors.io/ to proxy the news endpoint to avoid CORS errors during development/demo
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
    zh_CN: '简体中文',
    zh_TW: '繁體中文',
    xx: '** xx',
    lr: '** lr',
    rl: '** rl',
    uk: '** Ukrainian',
    ca: '** Catalan',
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
