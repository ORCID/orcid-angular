import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
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
          if (queryParams.email || queryParams.orcid) {
            // TODO at the moment user arriving with an email on the Oauth url.
            // are not allow to go back.
            return this.isUserLoggedInOrExist(session, queryParams)
          } else if (
            queryParams.show_login &&
            (queryParams.email || queryParams.orcid)
          ) {
            return this.isUserLoggedInOrExist(session, queryParams)
          } else if (queryParams.show_login === 'false') {
            return this.isUserLoggedInOrExist(session, queryParams)
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

  private isUserLoggedInOrExist(session, queryParams) {
    const userId = !!session.oauthSession.userId
    if (!userId && !session.oauthSessionIsLoggedIn) {
      return this.redirectToRegister(queryParams)
    }
    return true
  }

  private redirectToRegister(queryParams) {
    return this._router.createUrlTree(['/register'], {
      queryParams,
    })
  }
}
