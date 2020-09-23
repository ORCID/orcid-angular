import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { NEVER, Observable, of } from 'rxjs'
import { catchError, first, map, switchMap, tap } from 'rxjs/operators'
import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { LanguageService } from '../core/language/language.service'

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivateChild {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private _platform: PlatformInfoService,
    private _cookies: CookieService,
    private _language: LanguageService,
    @Inject(WINDOW) private window: Window,
    private _router: Router,
    private _errorHandler: ErrorHandlerService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const queryParams = next.queryParams
    const parameterLanguage = this.normalizeLanguageCode(
      queryParams['lang'] || queryParams['LANG']
    )
    const angularAppLocaleCode = this.normalizeLanguageCode(this.locale)

    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        if (
          // tslint:disable-next-line: max-line-length
          Object.keys(queryParams).length && // TODO @leomendoza123 make the platform handle the query parameters of the guards correctly, this line is a temporary quick fix
          platform.oauthMode &&
          parameterLanguage &&
          angularAppLocaleCode.indexOf(parameterLanguage) === -1 &&
          !this.hasCloudflareEtagIssue()
        ) {
          return this._language.changeLanguage(parameterLanguage).pipe(
            map((value) => this.window.location.reload()),
            switchMap((value) => NEVER),
            catchError((value) => of(true)) // When the language change fail ignore and continue
          )
        } else if (this.hasCloudflareEtagIssue()) {
          return this._errorHandler
            .handleError(new Error('etagIssueDetected/'))
            .pipe(catchError((error) => of(true)))
        } else {
          return of(true)
        }
      })
    )
  }

  /**
   *
   * @param languageCode Any Language code set by the Orcid Source backend
   *
   * Transform backend codes to ISO 639-1 Code to be compatible with Angular codes
   */
  normalizeLanguageCode(languageCode: string): string {
    if (languageCode) {
      return languageCode.toLocaleLowerCase().replace('_', '-')
    }
    return languageCode
  }

  /**
   * If on the application load the language cookie (set by the backend) and the real app language differ
   * it is highly likely an Etag issue with cloudflare
   */
  hasCloudflareEtagIssue() {
    const localeCookie = this.normalizeLanguageCode(
      this._cookies.get('locale_v3')
    )
    const angularAppLocaleCode = this.normalizeLanguageCode(this.locale)

    if (
      angularAppLocaleCode &&
      localeCookie &&
      angularAppLocaleCode !== localeCookie
    ) {
      return true
    } else {
      return false
    }
  }
}
