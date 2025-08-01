import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, Observable, of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { GoogleTagManagerService } from '../core/google-tag-manager/google-tag-manager.service'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { OauthURLSessionManagerService } from '../core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { TogglzService } from '../core/togglz/togglz.service'
import { UserSession } from '../types/session.local'
import { OauthParameters } from '../types'

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private readonly router: Router,
    private readonly platform: PlatformInfoService,
    private readonly oauthUrlSessionManger: OauthURLSessionManagerService,
    @Inject(WINDOW) private window: Window,
    private _togglzService: TogglzService
  ) {}

  canActivateChild(
    _: ActivatedRouteSnapshot,
    __: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const queryParams = _.queryParams

    return forkJoin({
      session: this._user.getUserSession().pipe(take(1)),
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf('OAUTH_AUTHORIZATION')
        .pipe(take(1)),
    }).pipe(
      take(1),
      switchMap(({ session, isOauthAuthorizationTogglzEnable }) =>
        this.resolveNavigation(
          session,
          isOauthAuthorizationTogglzEnable,
          queryParams as OauthParameters
        )
      )
    )
  }
  /**
   * Decides where to send the user based on the session state.
   */
  private resolveNavigation(
    session: UserSession,
    isOauthAuthorizationTogglzEnable: boolean,
    queryParams: OauthParameters
  ): Observable<boolean | UrlTree> {
    // 1. Account is locked ➜ always redirect to the profile
    if (session.userInfo?.LOCKED === 'true') {
      return of(this.router.createUrlTree(['/my-orcid']))
    }

    // 2. We have an OAuth session object – handle its states explicitly
    if (!isOauthAuthorizationTogglzEnable && session.oauthSession) {
      const { error, forceLogin } = session.oauthSession

      // 2a. An error exists – let the component display it
      if (error) {
        return of(true)
      }

      // 2b. Force-login flag or the user is not authenticated yet ➜ redirect
      if (forceLogin || !session.oauthSessionIsLoggedIn) {
        return this.redirectToLoginPage()
      }

      // 2c. Everything looks good – allow navigation
      return of(true)
    } else if (isOauthAuthorizationTogglzEnable && (queryParams.client_id || queryParams.scope)) {
      if (
        !session.loggedIn ||
        queryParams.show_login === 'true' ||
        queryParams.prompt === 'login'
      ) {
        return this.redirectToLoginPage()
      } else if(session.oauthSession?.redirectUrl){        
        // Clear the local storage
        this.oauthUrlSessionManger.clear()
        ;(this.window as any).outOfRouterNavigation(session.oauthSession?.redirectUrl)
        return of(true)
      } else {
        this.oauthUrlSessionManger.clear()
        return of(true)
      }
    }

    // 3. No OAuth session at all ➜ redirect
    return this.redirectToLoginPage()
  }

  /**
   * Builds a UrlTree pointing at /signin while preserving current query params.
   */
  private redirectToLoginPage(): Observable<UrlTree> {
    this.oauthUrlSessionManger.set(this.window.location.href)
    return this.platform.get().pipe(
      map(({ queryParameters }) =>
        this.router.createUrlTree(['/signin'], {
          queryParams: { ...queryParameters },
        })
      )
    )
  }
}
