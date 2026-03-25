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
import { TogglzFlag } from '../types/config.endpoint'
import { RumJourneyEventService } from '../rum/service/customEvent.service'
import { AppEventName } from '../register/app-event-names'
import { serializeQueryParamsForRum } from '../rum/serialize-oauth-query-for-rum'

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivateChild {
  /**
   * Small delay to increase odds that RUM events are harvested before leaving app.
   */
  private static readonly RUM_REDIRECT_FLUSH_DELAY_MS = 150

  constructor(
    private _user: UserService,
    private readonly router: Router,
    private readonly platform: PlatformInfoService,
    private readonly oauthUrlSessionManger: OauthURLSessionManagerService,
    @Inject(WINDOW) private window: Window,
    private _togglzService: TogglzService,
    private oauthService: OauthService,
    private readonly featureLogger: FeatureLoggerService,
    private readonly authDecision: AuthDecisionService,
    private readonly _observability: RumJourneyEventService
  ) {}

  canActivateChild(
    _: ActivatedRouteSnapshot,
    __: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const queryParams = _.queryParams

    return forkJoin({
      session: this._user.getUserSession().pipe(take(1)),
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
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
            this._observability.recordSimpleEvent(
              AppEventName.OauthAuthorizeGuardRedirectToMyOrcid,
              this.buildDecisionAttrs(queryParams as OauthParameters, decision)
            )
            return of(this.router.createUrlTree(['/my-orcid']))
          case 'redirectToLogin':
            return this.redirectToLoginPage(
              queryParams as OauthParameters,
              decision
            )
          case 'validateRedirectUri': {
            const { clientId, redirectUri } = (decision.payload || {}) as any
            return this.validateRedirectUriAndRedirect(
              {
                ...(queryParams as any),
                client_id: clientId,
                redirect_uri: redirectUri,
              },
              decision
            )
          }
          case 'outOfRouterNavigation': {
            const { target } = (decision.payload || {}) as { target?: string }
            this._observability.recordSimpleEvent(
              AppEventName.OauthAuthorizeGuardOutOfRouterNavigation,
              {
                target,
                ...this.buildDecisionAttrs(
                  queryParams as OauthParameters,
                  decision
                ),
              }
            )
            this.navigateOutOfRouterWithRumFlush(target)
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
    queryParams: OauthParameters,
    decision: { action: string; reason?: string }
  ): Observable<boolean | UrlTree> {
    return this.oauthService
      .validateRedirectUri(queryParams.client_id, queryParams.redirect_uri)
      .pipe(
        take(1),
        map((resp) => {
          if (resp.valid) {
            // valid → redirect to the specified URI
            const target = `${queryParams.redirect_uri}#login_required`

            this._observability.recordSimpleEvent(
              AppEventName.OauthAuthorizeGuardLoginRequiredRedirect,
              {
                ...this.buildDecisionAttrs(queryParams, decision),
              }
            )

            this.featureLogger.debug(
              'Authorize Guard',
              'Redirecting out of router to',
              target
            )
            this.navigateOutOfRouterWithRumFlush(target)
            return false
          }
          // invalid → send to your 404 page
          this._observability.recordSimpleEvent(
            AppEventName.OauthAuthorizeGuardInvalidRedirectUri,
            {
              ...this.buildDecisionAttrs(queryParams, decision),
            }
          )
          this.featureLogger.warn(
            'Authorize Guard',
            'Invalid redirect_uri → /404'
          )
          return this.router.createUrlTree(['/404'])
        }),
        catchError(() => {
          // in case of error, redirect to 404
          this._observability.recordSimpleEvent(
            AppEventName.OauthAuthorizeGuardValidateRedirectUriError,
            {
              ...this.buildDecisionAttrs(queryParams, decision),
            }
          )
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
  private redirectToLoginPage(
    queryParams: OauthParameters,
    decision: { action: string; reason?: string }
  ): Observable<UrlTree> {
    this.oauthUrlSessionManger.set(this.window.location.href)
    this._observability.recordSimpleEvent(
      AppEventName.OauthAuthorizeGuardRedirectToLogin,
      this.buildDecisionAttrs(queryParams, decision)
    )
    return this.platform.get().pipe(
      map(({ queryParameters }) => {
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

  private buildDecisionAttrs(
    queryParams: OauthParameters,
    decision: { action: string; reason?: string }
  ): Record<string, unknown> {
    return {
      decision_action: decision.action,
      decision_reason: decision.reason,
      client_id: queryParams?.client_id,
      redirect_uri: queryParams?.redirect_uri,
      prompt: queryParams?.prompt,
      scope: queryParams?.scope,
      oauth_query_string: serializeQueryParamsForRum(queryParams as any),
    }
  }

  private navigateOutOfRouterWithRumFlush(target?: string): void {
    if (!target) return
    setTimeout(() => {
      ;(this.window as any).outOfRouterNavigation(target)
    }, AuthorizeGuard.RUM_REDIRECT_FLUSH_DELAY_MS)
  }
}
