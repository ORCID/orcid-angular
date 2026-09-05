import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map, shareReplay } from 'rxjs/operators'

import {
  HOMEPAGE_CONTENT_SCHEMA_MAJOR,
  HomepageContent,
  isSupportedHomepageContent,
} from 'src/app/types/homepage-content'

/**
 * Fetches the homepage content published by orcid-homepage-decap-cms.
 *
 * The bundle is a static, cross-origin JSON document per locale. That is the
 * whole point of it: the words on the homepage can be released without
 * releasing this application, so this service knows a URL and a schema version
 * and nothing else about how the content is produced.
 *
 * Two failure modes are handled deliberately, because both have happened to the
 * homepage before. A locale whose file does not exist falls back to English
 * rather than leaving the page blank, and a document from a schema version this
 * build does not understand is refused so the caller can render its own static
 * page instead of a half-empty one.
 */
@Injectable({
  providedIn: 'root',
})
export class HomepageContentService {
  private content$: Observable<HomepageContent> | null = null

  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  /** Whether this environment publishes homepage content as JSON. */
  isEnabled(): boolean {
    return this.baseUrl() !== ''
  }

  getContent(): Observable<HomepageContent> {
    if (!this.content$) {
      const base = this.baseUrl()
      if (base === '') {
        return throwError(() => new Error('HOMEPAGE_CONTENT_URL is not set'))
      }

      const localeCode = this.contentLocaleCode()
      const primary = `${base}/home.${localeCode}.json`
      const english = `${base}/home.en.json`

      this.content$ = this.fetch(primary).pipe(
        catchError((problem) => {
          if (localeCode === 'en') {
            return throwError(() => problem)
          }
          // A language the content bundle does not carry yet still gets a
          // homepage, in English, instead of nothing at all.
          return this.fetch(english)
        }),
        shareReplay(1)
      )
    }

    return this.content$
  }

  /**
   * A plain cross-origin GET with no headers and no credentials, so it stays a
   * simple CORS request. Anything else would need a preflight, which a static
   * host such as GitHub Pages does not answer.
   */
  private fetch(url: string): Observable<HomepageContent> {
    return this.httpClient.get<unknown>(url).pipe(
      map((document) => {
        if (!isSupportedHomepageContent(document)) {
          throw new Error(
            `${url} is not homepage content this version can render (expected schemaVersion ${HOMEPAGE_CONTENT_SCHEMA_MAJOR})`
          )
        }
        return this.withAbsoluteAssets(document, url)
      })
    )
  }

  /**
   * Image paths are relative to the document, so they are resolved against the
   * URL the document actually came from. That keeps them correct whichever
   * host served it, including the English fallback.
   */
  private withAbsoluteAssets(
    content: HomepageContent,
    documentUrl: string
  ): HomepageContent {
    const resolve = (assetPath: string): string => {
      try {
        return new URL(assetPath, documentUrl).toString()
      } catch {
        return assetPath
      }
    }

    return {
      ...content,
      audiences: content.audiences.map((audience) => ({
        ...audience,
        background: resolve(audience.background),
        features: audience.features.map((feature) => ({
          ...feature,
          icon: resolve(feature.icon),
        })),
      })),
    }
  }

  private baseUrl(): string {
    const configured = runtimeEnvironment.HOMEPAGE_CONTENT_URL
    if (typeof configured !== 'string') {
      return ''
    }
    return configured.trim().replace(/\/+$/, '')
  }

  /**
   * The locale of the file to ask for. Mirrors the rule the WordPress path
   * uses, so both read the same names: English is unsuffixed upstream, and
   * every other locale is its own code.
   */
  private contentLocaleCode(): string {
    return this.locale.startsWith('en') ? 'en' : this.locale
  }
}
