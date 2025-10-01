import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, NEVER, Observable, of } from 'rxjs'
import { catchError, map, switchMap, take } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { OauthURLSessionManagerService } from '../core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { TogglzService } from '../core/togglz/togglz.service'
import { UserSession } from '../types/session.local'
import { OauthParameters } from '../types'
import { OauthService } from '../core/oauth/oauth.service'
import { FeatureLoggerService } from '../core/logging/feature-logger.service'
import { AuthDecisionService } from '../core/auth-decision/auth-decision.service'

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private readonly router: Router,
    private readonly platform: PlatformInfoService,
    private readonly oauthUrlSessionManger: OauthURLSessionManagerService,
    @Inject(WINDOW) private window: Window,
    private _togglzService: TogglzService,
    private oauthService: OauthService,
    private readonly featureLogger: FeatureLoggerService,
    private readonly authDecision: AuthDecisionService
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
      switchMap(({ session, isOauthAuthorizationTogglzEnable }) => {
        const decision = this.authDecision.decideForAuthorize(
          session,
          isOauthAuthorizationTogglzEnable,
          queryParams as OauthParameters
        )
        this.featureLogger.debug('Authorize Guard', ...decision.trace)
        switch (decision.action) {
          case 'redirectToMyOrcid':
            return of(this.router.createUrlTree(['/my-orcid']))
          case 'redirectToLogin':
            return this.redirectToLoginPage()
          case 'validateRedirectUri': {
            const { clientId, redirectUri } = (decision.payload || {}) as any
            return this.validateRedirectUriAndRedirect({
              ...(queryParams as any),
              client_id: clientId,
              redirect_uri: redirectUri,
            })
          }
          case 'outOfRouterNavigation': {
            const { target } = (decision.payload || {}) as any
            ;(this.window as any).outOfRouterNavigation(target)
            return NEVER
          }
          case 'allow':
          default:
            return of(true)
        }
      })
    )
  }

  private validateRedirectUriAndRedirect(
    queryParams: OauthParameters
  ): Observable<boolean | UrlTree> {
    return this.oauthService
      .validateRedirectUri(queryParams.client_id, queryParams.redirect_uri)
      .pipe(
        take(1),
        map((resp) => {
          if (resp.valid) {
            // valid → redirect to the specified URI
            const target = `${queryParams.redirect_uri}#login_required`

            this.featureLogger.debug(
              'Authorize Guard',
              'Redirecting out of router to',
              target
            )
            ;(this.window as any).outOfRouterNavigation(target)
            return false
          }
          // invalid → send to your 404 page
          this.featureLogger.warn(
            'Authorize Guard',
            'Invalid redirect_uri → /404'
          )
          return this.router.createUrlTree(['/404'])
        }),
        catchError(() => {
          // in case of error, redirect to 404
          this.featureLogger.error(
            'Authorize Guard',
            'Error validating redirect_uri → /404'
          )
          return of(this.router.createUrlTree(['/404']))
        })
      )
  }

  /**
   * Builds a UrlTree pointing at /signin while preserving current query params.
   */
  private redirectToLoginPage(): Observable<UrlTree> {
    this.oauthUrlSessionManger.set(this.window.location.href)
    return this.platform.get().pipe(
      map(({ queryParameters }) => {
        console.log('Current query params:', queryParameters)
        this.featureLogger.debug(
          'Authorize Guard',
          'Building /signin UrlTree with current query params'
        )
        return this.router.createUrlTree(['/signin'], {
          queryParams: { ...queryParameters },
        })
      })
    )
  }
}
