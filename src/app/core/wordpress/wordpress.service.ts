import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { WordpressPost } from 'src/app/types/wordpress'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getHomePagePost() {
    const primaryUrl = `${
      environment.WORDPRESS_S3
    }/index${this.getWordpressLocalizationCode()}.html`
    const fallbackUrl = `${
      environment.WORDPRESS_S3_FALLBACK
    }/index${this.getWordpressLocalizationCode()}.html`

    return this.httpClient
      .get(primaryUrl, { responseType: 'text' })
      .pipe(
        map((html: string) => {
          return {
            html: html,
            url: environment.WORDPRESS_S3,
          }
        })
      )
      .pipe(
        catchError((error) => {
          console.log('Primary URL failed, trying fallback URL:', error)
          return this.httpClient
            .get(fallbackUrl, { responseType: 'text' })
            .pipe(
              map((html: string) => {
                return {
                  html: html,
                  url: environment.WORDPRESS_S3_FALLBACK,
                }
              })
            )
        }),
        // Update resulting HTML to use the correct base URL
        map((data: { html: string; url: string }) => {
          const find = './assets/'
          const regex = new RegExp(find, 'g')
          console.log('html', data.html)
          const updatedHtml = data.html.replace(regex, data.url + '/assets/')
          return updatedHtml
        })
      )
  }
  getWordpressLocalizationCode() {
    if (this.locale.includes('en')) {
      return ''
    }
    return '-' + this.locale
  }
}
