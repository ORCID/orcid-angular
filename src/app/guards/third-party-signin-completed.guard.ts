import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, forkJoin } from 'rxjs'
import { first, map, take } from 'rxjs/operators'

import { UserService } from '../core'
import { OauthURLSessionManagerService } from '../core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { WINDOW } from '../cdk/window/window.service'
import { TogglzService } from '../core/togglz/togglz.service'
import { TogglzFlag } from '../core/togglz/togglz-flags.enum'

@Injectable({
  providedIn: 'root',
})
export class ThirdPartySigninCompletedGuard {
  constructor(
    private _router: Router,
    private _user: UserService,
    private _oauthRedirect: OauthURLSessionManagerService,
    @Inject(WINDOW) private _window: any,
    private _togglzService: TogglzService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return forkJoin({
      session: this._user.getUserSession().pipe(take(1)),
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
        .pipe(take(1)),
    }).pipe(
      first(),
      map(({ isOauthAuthorizationTogglzEnable }) => {
        if (isOauthAuthorizationTogglzEnable) {
          const redirectUrl = this._oauthRedirect.get()
          if (redirectUrl) {
            this._oauthRedirect.clear()
            this._window.outOfRouterNavigation(redirectUrl)
            return false
          }
        }

        return this._router.parseUrl(
          state.url.replace(/\/third-party-signin-completed/, '')
        )
      })
    )
  }
}
