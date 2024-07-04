import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getHomePagePost(): Observable<string> {
    const primaryUrl = `${
      environment.WORDPRESS_S3
    }/index${this.getWordpressLocalizationCode()}.html`
    const fallbackUrl = `${
      environment.WORDPRESS_S3_FALLBACK
    }/index${this.getWordpressLocalizationCode()}.html`
    return this.fetchWithFallback(primaryUrl, fallbackUrl).pipe(
      map((data: { html: string; url: string }) => {
        const find = './assets/'
        const regex = new RegExp(find, 'g')
        const updatedHtml = data.html.replace(
          regex,
          `${data.url.replace(/index.*\.html$/, '')}assets/`
        )
        return updatedHtml
      })
    )
  }

  getHomePageCSS(): Observable<string> {
    const primaryUrl = `${environment.WORDPRESS_S3}/wordpress-homepage.css`
    const fallbackUrl = `${environment.WORDPRESS_S3_FALLBACK}/wordpress-homepage.css`
    return this.fetchWithFallback(primaryUrl, fallbackUrl).pipe(
      map((data: { html: string; url: string }) => {
        const find = 'assets/'
        const regex = new RegExp(find, 'g')
        const updatedHtml = data.html.replace(
          regex,
          `${data.url.replace(/wordpress-homepage.*\.css$/, '')}assets/`
        )
        return updatedHtml
      })
    )
  }

  getHomePageJS(): Observable<string> {
    const primaryUrl = `${environment.WORDPRESS_S3}/wordpress-homepage.js`
    const fallbackUrl = `${environment.WORDPRESS_S3_FALLBACK}/wordpress-homepage.js`
    return this.fetchWithFallback(primaryUrl, fallbackUrl).pipe(
      map((data: { html: string; url: string }) => {
        const find = './assets/'
        const regex = new RegExp(find, 'g')
        let updateJs = data.html.replace(
          regex,
          `${data.url.replace(/wordpress-homepage.*\.js$/, '')}assets/`
        )
        // By default the script was intented to be executed after the event `DOMContentLoaded`
        // but in Angular the event `DOMContentLoaded` is already fired, so we need to execute it
        // the following line of code will load the code even if the DOMContentLoaded event is already fired
        updateJs += `if (document.readyState === 'complete') {tabtoursInit(document)}`
        return updateJs
      })
    )
  }

  private fetchWithFallback(
    primaryUrl: string,
    fallbackUrl: string
  ): Observable<{ html: string; url: string }> {
    return this.httpClient.get(primaryUrl, { responseType: 'text' }).pipe(
      map((html: string) => ({ html, url: primaryUrl })),
      catchError(() => {
        return this.httpClient
          .get(fallbackUrl, { responseType: 'text' })
          .pipe(map((html: string) => ({ html, url: fallbackUrl })))
      })
    )
  }

  private getWordpressLocalizationCode() {
    // if (this.locale.includes('en')) {
    //   return ''
    // }
    return '-' + 'fr'
  }
}
