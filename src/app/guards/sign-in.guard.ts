import { Injectable, Inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { OauthParameters, RequestInfoForm } from '../types'
import { UserService } from '../core'
import { WINDOW } from '../cdk/window'
import { ERROR_REPORT } from '../errors'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _platform: PlatformInfoService,
    private _errorHandler: ErrorHandlerService,
    @Inject(WINDOW) private window: Window
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams

    return this._user.getUserSession().pipe(
      map((session) => {
        if (session.oauthSession) {
          if (
            (queryParams.email || queryParams.orcid) &&
            !session.oauthSession.userId
          ) {
            return this._router.createUrlTree(['/register'], {
              queryParams: queryParams,
            })
          } else if (
            queryParams.show_login &&
            (queryParams.email || queryParams.orcid) &&
            !session.oauthSession.userId
          ) {
            return this.redirectToRegister(queryParams)
          } else if (
            queryParams.show_login === 'false' &&
            !session.oauthSession.userId
          ) {
            return this.redirectToRegister(queryParams)
          } else if (
            !session.oauthSession.forceLogin &&
            session.oauthSessionIsLoggedIn
          ) {
            return this._router.createUrlTree(['/oauth/authorize'], {
              queryParams: queryParams,
            })
          }
        }
        return true
      })
    )
  }

  private redirectToRegister(queryParams) {
    return this._router.createUrlTree(['/register'], {
      queryParams: queryParams,
    })
  }
}
