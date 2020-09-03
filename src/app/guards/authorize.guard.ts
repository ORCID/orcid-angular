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
import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters } from '../types'
import { oauthSessionHasError, oauthSessionUserIsLoggedIn } from './constants'
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
      map((x) => x.oauthSession),
      map((session) => {
        if (session.redirectUrl && session.responseType && session.redirectUrl.includes(session.responseType)) {
          window.location.href = session.redirectUrl
        } else if (oauthSessionHasError(session)) {
          this._router.navigate(['/signin'], { queryParams: queryParams })
            .then((navigated: boolean) => {
              if (navigated) {
                this._errorHandler.handleError(
                  new Error(`${session.error}.${session.errorDescription}`),
                  ERROR_REPORT.OAUTH_PARAMETERS
                ).subscribe()
              }
          })
        } else if (session.forceLogin || !oauthSessionUserIsLoggedIn(session)) {
          return this.redirectToLoginPage(queryParams)
          // If the redirectUrl comes with a code from the start redirect the user immediately
        } else if (session.redirectUrl.includes('?code=')) {
          this.window.location.href = session.redirectUrl
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
