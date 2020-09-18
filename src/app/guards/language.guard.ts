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
    private _router: Router
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const queryParams = next.queryParams
    const parameterLanguage = queryParams['lang'] || queryParams['LANG']

    return this._platform.get().pipe(
      first(),
      switchMap((platform) => {
        if (
          // tslint:disable-next-line: max-line-length
          Object.keys(queryParams).length && // TODO @leomendoza123 make the platform handle the query parameters of the guards correctly, this line is a temporary quick fix
          platform.oauthMode &&
          parameterLanguage &&
          this.locale.indexOf(
            parameterLanguage.toLocaleLowerCase().replace('_', '-')
          ) === -1
        ) {
          return this._language.changeLanguage(parameterLanguage).pipe(
            map((value) => this.window.location.reload()),
            switchMap((value) => NEVER),
            catchError((value) => of(true)) // When the language change fail ignore and continue
          )
        } else {
          return of(true)
        }
      })
    )
  }
}
