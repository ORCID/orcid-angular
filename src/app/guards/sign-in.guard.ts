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
import { FeatureLoggerService } from '../core/logging/feature-logger.service'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _togglzService: TogglzService,
    private readonly featureLogger: FeatureLoggerService
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
        this.featureLogger.debug('Sign-In Guard', 'Evaluating with togglz', isOauthAuthorizationTogglzEnable, 'session', {
          hasOauthSession: !!session?.oauthSession,
          loggedIn: !!session?.oauthSessionIsLoggedIn,
        })
        if (!isOauthAuthorizationTogglzEnable && session.oauthSession) {
          this.featureLogger.debug('Sign-In Guard', 'Legacy OAuth flow detected')
          return this.handleOauthLegacyAuthorization(session, queryParams)
        } else if (isOauthAuthorizationTogglzEnable && session.oauthSession) {
          this.featureLogger.debug('Sign-In Guard', 'OAuth2 flow detected')
          return this.handleOauth2Authorization(session, queryParams)
        }
        this.featureLogger.debug('Sign-In Guard', 'No oauthSession → allow navigation to login')
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
      this.featureLogger.debug('Sign-In Guard', 'Legacy: not logged in', { hasUserIdentifier, showLoginIsFalse })
      // When arriving with an identifier (email/orcid), or explicitly show_login === 'false',
      // we check if the user exists or redirect to register
      if (hasUserIdentifier) {
        this.featureLogger.info('Sign-In Guard', 'Legacy: identifier provided → check user or register')
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
      if (showLoginIsFalse) {
        this.featureLogger.info('Sign-In Guard', "Legacy: show_login === 'false' → check user or register")
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
    } else {
      // If already logged into the oauth session and not forced to login, go straight to authorize
      if (!session.oauthSession.forceLogin) {
        this.featureLogger.info('Sign-In Guard', 'Legacy: logged in and not forceLogin → /oauth/authorize')
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
        this.featureLogger.info('Sign-In Guard', "OAuth2: show_login === 'false' and not logged → /register")
        return this.allowExistingUserOrRedirectToRegister(session, queryParams)
      }
    } else {
      // If already logged into the oauth session and not forced to login, go straight to authorize
      // prompt=login only applies to openid scope
      if (!(promptLogin && scopeIsOpenId)) {
        this.featureLogger.info('Sign-In Guard', 'OAuth2: logged in and no prompt login on openid → /oauth/authorize')
        return this.redirectToAuthorize(queryParams)
      }
    }

    this.featureLogger.debug('Sign-In Guard', 'OAuth2: allow default (go to login)')
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
