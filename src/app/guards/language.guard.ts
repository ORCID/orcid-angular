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
import { catchError, switchMap, tap } from 'rxjs/operators'
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
      switchMap((platform) => {
        if (
          platform.oauthMode &&
          this.locale.indexOf(
            parameterLanguage &&
              parameterLanguage.toLocaleLowerCase().replace('_', '-')
          ) === -1
        ) {
          return this._language.changeLanguage(parameterLanguage).pipe(
            tap(() => this.window.location.reload()),
            switchMap(() => NEVER),
            catchError(() => of(this._router.createUrlTree(['/signin'])))
          )
        } else {
          return of(true)
        }
      })
    )
  }
}
