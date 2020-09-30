import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { NEVER, Observable, of } from 'rxjs'
import { catchError, switchMap, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { LanguageContext } from '../types/language.locale'

const GUARD_COOKIE_CHECK = 'lang_refresh'
@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivateChild {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private _cookies: CookieService,
    private _user: UserService,
    @Inject(WINDOW) private window: Window,
    private _errorHandler: ErrorHandlerService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let langContext: LanguageContext

    // Wait the user session so the language cookie is declared from the backend
    return this._user.getUserSession().pipe(
      tap(() => {
        // get language context
        langContext = this.getLanguageContext(next.queryParams)
        if (environment.sessionDebugger) {
          console.log('language context', langContext)
        }
      }),
      switchMap(() => {
        // The browser might be already loading the right language
        if (this.currentAppLanguageMatchTheCookieLanguage(langContext)) {
          this._cookies.delete(GUARD_COOKIE_CHECK)
          return of(true)
        }
        // the browser needs to be reloaded to load the correct language
        // the GUARD_COOKIE_CHECK cookie is used to avoid infinite reloading
        if (
          !this._cookies.check(GUARD_COOKIE_CHECK) ||
          this._cookies.get(GUARD_COOKIE_CHECK) !== langContext.cookie
        ) {
          this._cookies.set(GUARD_COOKIE_CHECK, langContext.cookie)
          return of(this.window.location.reload()).pipe(switchMap(() => NEVER))
        } else {
          // if even after a reload the app can't get the language match the cookie
          // there is a cloudflare or browser cache issue
          return this._errorHandler
            .handleError(new Error('cacheIssueDetected/'))
            .pipe(catchError((error) => of(true)))
        }
      }),
      catchError((value) => of(true)) // Allow to continue if the language change fails
    )
  }

  getLanguageContext(queryParams): LanguageContext {
    return {
      param: this.normalizeLanguageCode(
        queryParams['lang'] || queryParams['LANG']
      ),
      app: this.normalizeLanguageCode(this.locale),
      cookie: this.normalizeLanguageCode(this._cookies.get('locale_v3')),
    }
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

  currentAppLanguageMatchTheCookieLanguage(langContext: LanguageContext) {
    if (
      langContext.cookie &&
      langContext.app &&
      langContext.app.indexOf(langContext.cookie) === -1
    ) {
      return false
    }
    return true
  }

  /**
   * @deprecated
   */
  requireLanguageCookieUpdate(lang: LanguageContext): boolean {
    return lang.param && lang.cookie && lang.cookie.indexOf(lang.param) === -1
  }
}
