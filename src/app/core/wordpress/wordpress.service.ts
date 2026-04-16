import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators'

type HomePageAssetType = 'css' | 'classicScript' | 'moduleScript'

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  private homePageIndex$: Observable<{ html: string; url: string }> | null = null

  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getHomePagePost(): Observable<string> {
    return this.getHomePageIndex().pipe(
      map((data: { html: string; url: string }) => {
        return this.rewriteRelativeAssets(data.html, data.url, './assets/')
      })
    )
  }

  getHomePageCSS(): Observable<string> {
    return this.getHomePageAssetContent('css', 'wordpress-homepage.css').pipe(
      map((data: { html: string; url: string }) => {
        return this.rewriteRelativeAssets(data.html, data.url, 'assets/')
      })
    )
  }

  getHomePageJS(): Observable<string> {
    return this.getHomePageAssetContent(
      'classicScript',
      'wordpress-homepage.js'
    ).pipe(
      map((data: { html: string; url: string }) => {
        return this.rewriteRelativeAssets(data.html, data.url, './assets/')
      })
    )
  }

  getHomePageModulesJS(): Observable<string> {
    return this.getHomePageAssetContent(
      'moduleScript',
      'wordpress-homepage-modules.js'
    ).pipe(
      map((data: { html: string; url: string }) => {
        return this.rewriteRelativeAssets(data.html, data.url, './assets/')
      })
    )
  }

  private getHomePageIndex(): Observable<{ html: string; url: string }> {
    if (!this.homePageIndex$) {
      const primaryUrl = `${
        runtimeEnvironment.WORDPRESS_S3
      }/index${this.getWordpressLocalizationCode()}.html`
      const fallbackUrl = `${
        runtimeEnvironment.WORDPRESS_S3_FALLBACK
      }/index${this.getWordpressLocalizationCode()}.html`

      this.homePageIndex$ = this.fetchWithFallback(primaryUrl, fallbackUrl).pipe(
        shareReplay(1)
      )
    }

    return this.homePageIndex$
  }

  private getHomePageAssetContent(
    assetType: HomePageAssetType,
    fallbackFileName: string
  ): Observable<{ html: string; url: string }> {
    const fallbackPrimary = `${runtimeEnvironment.WORDPRESS_S3}/${fallbackFileName}`
    const fallbackSecondary = `${runtimeEnvironment.WORDPRESS_S3_FALLBACK}/${fallbackFileName}`

    return this.getHomePageIndex().pipe(
      switchMap((indexData) => {
        const assetUrl = this.getAssetUrlFromIndex(indexData, assetType)

        if (!assetUrl) {
          return this.fetchWithFallback(fallbackPrimary, fallbackSecondary)
        }

        return this.httpClient.get(assetUrl, { responseType: 'text' }).pipe(
          map((html: string) => ({ html, url: assetUrl })),
          catchError(() => this.fetchWithFallback(fallbackPrimary, fallbackSecondary))
        )
      })
    )
  }

  private getAssetUrlFromIndex(
    indexData: { html: string; url: string },
    assetType: HomePageAssetType
  ): string | null {
    const doc = new DOMParser().parseFromString(indexData.html, 'text/html')
    let assetPath: string | null

    if (assetType === 'css') {
      const cssLink = doc.querySelector(
        'head link[rel="stylesheet"][href]'
      ) as HTMLLinkElement | null
      assetPath = cssLink ? cssLink.getAttribute('href') : null
    } else if (assetType === 'moduleScript') {
      const moduleScript = doc.querySelector(
        'head script[type="module"][src]'
      ) as HTMLScriptElement | null
      assetPath = moduleScript ? moduleScript.getAttribute('src') : null
    } else {
      const classicScript = doc.querySelector(
        'head script[src]:not([type="module"])'
      ) as HTMLScriptElement | null
      assetPath = classicScript ? classicScript.getAttribute('src') : null
    }

    if (!assetPath) {
      return null
    }

    return new URL(assetPath, indexData.url).toString()
  }

  private rewriteRelativeAssets(
    content: string,
    assetFileUrl: string,
    prefix: string
  ): string {
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedPrefix, 'g')
    const assetBaseUrl = new URL('assets/', assetFileUrl).toString()
    return content.replace(regex, assetBaseUrl)
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
    if (this.locale.includes('en')) {
      return ''
    }
    return '-' + this.locale
  }
}
