import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'

import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'
import { OauthParameters } from '../types'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _togglzService: TogglzService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams as OauthParameters

    return forkJoin({
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf('OAUTH_AUTHORIZATION')
        .pipe(take(1)),
      session: this._user.getUserSession().pipe(take(1)),
    }).pipe(
      take(1),
      map(({ isOauthAuthorizationTogglzEnable, session }) => {
        if (!isOauthAuthorizationTogglzEnable && session.oauthSession) {
          return this.handleOauthLegacyAuthorization(session, queryParams)
        } else if (isOauthAuthorizationTogglzEnable && session.oauthSession) {
          return this.handleOauth2Authorization(session, queryParams)
        }
        return true
      })
    )
  }

  private handleOauthLegacyAuthorization(session, queryParams) {
    // If there is no oauthSession, do nothing special
    if (!session?.oauthSession) return true

    const hasUserIdentifier = !!(queryParams?.email || queryParams?.orcid)
    const showLoginIsFalse = queryParams?.show_login === 'false'
    const userIsLoggedIn = !!session?.oauthSessionIsLoggedIn

    if (!userIsLoggedIn) {
      // When arriving with an identifier (email/orcid), or explicitly show_login === 'false',
      // we check if the user exists or redirect to register
      if (hasUserIdentifier) {
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
      if (showLoginIsFalse) {
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
    } else {
      // If already logged into the oauth session and not forced to login, go straight to authorize
      if (!session.oauthSession.forceLogin) {
        return this.redirectToAuthorize(queryParams)
      }
    }

    return true
  }

  private handleOauth2Authorization(session, queryParams) {
    // If there is no oauthSession, do nothing special
    if (!session?.oauthSession) return true

    const showLoginIsFalse = queryParams?.show_login === 'false'
    const userIsLoggedIn = !!session?.oauthSessionIsLoggedIn
    const scopeIsOpenId = queryParams?.scope === 'openid'
    const promptLogin = queryParams?.prompt === 'login'

    if (!userIsLoggedIn) {
      if (showLoginIsFalse) {
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
    } else {
      // If already logged into the oauth session and not forced to login, go straight to authorize
      // prompt=login only applies to openid scope
      if (!(promptLogin && scopeIsOpenId)) {
        return this.redirectToAuthorize(queryParams)
      }
    }

    return true
  }

  private allowExistingUserOrRedirectToRegister(session, queryParams) {
    // NOTE session?.oauthSession?.userId is not present on the Oauth2 Server
    // This means that ones the Legacy Authorization is disabled, we will always redirect to register
    const userExists = !!session?.oauthSession?.userId
    return userExists ? true : this.redirectToRegister(queryParams)
  }

  private redirectToAuthorize(queryParams) {
    return this._router.createUrlTree(['/oauth/authorize'], {
      queryParams: queryParams,
    })
  }

  private redirectToRegister(queryParams) {
    return this._router.createUrlTree(['/register'], {
      queryParams,
    })
  }
}
