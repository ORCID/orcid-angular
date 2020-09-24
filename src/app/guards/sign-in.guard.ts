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

    return this._platform.get().pipe(
      switchMap((value) => {
        if (value.oauthMode) {
          return this.handleOauthSession(queryParams as OauthParameters)
        } else {
          return of(true)
        }
      })
    )
  }

  handleOauthSession(queryParams: OauthParameters) {
    // check if the user is already login or there are errors
    return this._user.getUserSession(queryParams).pipe(
      map((session) => {
        if (
          queryParams.email &&
          session.oauthSession &&
          !session.oauthSession.userId
        ) {
          return this._router.createUrlTree(['/register'], {
            queryParams: queryParams,
          })
        }

        const oauthSession = session.oauthSession
        // If the show login parameters is present redirect the user to the register
        if (
          queryParams.show_login &&
          (queryParams.email || queryParams.orcid) &&
          session.oauthSession &&
          !session.oauthSession.userId
        ) {
          return this.redirectToRegister(queryParams)
        } else if (
          queryParams.show_login === 'false' &&
          session.oauthSession &&
          !session.oauthSession.userId
        ) {
          return this.redirectToRegister(queryParams)
        }

        if (
          oauthSession &&
          !oauthSession.forceLogin &&
          session.oauthSessionIsLoggedIn
        ) {
          return this._router.createUrlTree(['/oauth/authorize'], {
            queryParams: queryParams,
          })
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
