import { Injectable, Inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap, finalize } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { OauthParameters } from '../types'
import { UserService } from '../core'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { ERROR_REPORT } from '../errors'
import { WINDOW } from '../cdk/window'

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
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
    const queryParams = JSON.parse(
      JSON.stringify(next.queryParams)
    ) as OauthParameters

    return this._platform.get().pipe(
      switchMap((value) => {
        if (value.oauthMode) {
          return this.handleOauthSession(queryParams as OauthParameters)
        } else {
          return of(
            this._router.createUrlTree(['/signin'], {
              queryParams: next.queryParams,
            })
          )
        }
      })
    )
  }

  handleOauthSession(queryParams: OauthParameters) {
    return this._user.getUserSession(queryParams).pipe(
      map((session) => {
        const oauthSession = session.oauthSession
        if (
          oauthSession &&
          oauthSession.redirectUrl &&
          oauthSession.responseType &&
          oauthSession.redirectUrl.includes(oauthSession.responseType)
        ) {
          this.window.location.href = oauthSession.redirectUrl
        } else if (
          (oauthSession && oauthSession.forceLogin) ||
          !session.oauthSessionIsLoggedIn
        ) {
          return this.redirectToLoginPage(queryParams)
          // If the redirectUrl comes with a code from the start redirect the user immediately
        } else if (oauthSession.redirectUrl.includes('?code=')) {
          this.window.location.href = oauthSession.redirectUrl
        } else {
          return true
        }
      })
    )
  }

  private redirectToLoginPage(queryParams: OauthParameters) {
    // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
    // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route
    queryParams['oauth'] = ''
    return this._router.createUrlTree(['/signin'], {
      queryParams: queryParams,
    })
  }
}
