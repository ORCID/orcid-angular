import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, NEVER, Observable, of, throwError } from 'rxjs'
import { catchError, map, switchMap, take, tap, timeout } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { GoogleUniversalAnalyticsService } from '../core/google-analytics/google-universal-analytics.service'
import { ERROR_REPORT } from '../errors'
import { RequestInfoForm } from '../types'
import { GoogleTagManagerService } from '../core/google-tag-manager/google-tag-manager.service'

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  lastRedirectUrl: string
  constructor(
    private _user: UserService,
    private _router: Router,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleUniversalAnalyticsService,
    private _googleTagManagerService: GoogleTagManagerService,
    private _errorHandler: ErrorHandlerService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    return this._user.getUserSession().pipe(
      take(1),
      switchMap((session) => {
        const oauthSession = session.oauthSession
        if (session.userInfo?.LOCKED === 'true') {
          return of(this._router.createUrlTree(['/my-orcid']))
        }
        if (oauthSession) {
          // Session errors are allow to be displayed
          if (oauthSession.error) {
            return of(true)
          } else if (
            oauthSession &&
            oauthSession.redirectUrl &&
            oauthSession.responseType &&
            oauthSession.redirectUrl.includes(oauthSession.responseType + '=')
          ) {
            return this.reportAlreadyAuthorize(oauthSession)
          } else if (
            oauthSession.forceLogin ||
            !session.oauthSessionIsLoggedIn
          ) {
            return this.redirectToLoginPage(oauthSession)
          }
        }
        return of(true)
      })
    )
  }

  sendUserToRedirectURL(oauthSession: RequestInfoForm): Observable<boolean> {
    this.lastRedirectUrl = oauthSession.redirectUrl
    if (this.lastRedirectUrl !== oauthSession.redirectUrl) {
      this.window.location.href = oauthSession.redirectUrl
    }
    return NEVER
  }

  reportAlreadyAuthorize(request: RequestInfoForm) {
    const analyticsReports: Observable<void>[] = []
    analyticsReports.push(
      this._gtag.reportEvent(`Reauthorize`, 'RegGrowth', request)
    )
    analyticsReports.push(
      this._googleTagManagerService.reportEvent(`Reauthorize`, request)
    )

    return forkJoin(analyticsReports).pipe(
      take(1),
      switchMap((value) => {
        if (value[0] === undefined && value[1] === undefined) {
          return throwError('blocked-analytics')
        } else {
          return of(value)
        }
      }),
      catchError((err) => {
        this._errorHandler.handleError(
          err,
          ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
        )
        return this.sendUserToRedirectURL(request)
      }),
      switchMap(() => {
        return NEVER
      })
    )
  }

  private redirectToLoginPage(
    oauthSession: RequestInfoForm
  ): Observable<UrlTree> {
    // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
    // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route

    return this._platform.get().pipe(
      map((platform) => {
        const newQueryParams = {
          ...platform.queryParameters,
          // The router is removing parameters from the url it necessary reassigned from the oauth session to preserve all the parameters
          // related to
          redirect_uri: oauthSession.redirectUrl,
        }
        return this._router.createUrlTree(['/signin'], {
          queryParams: newQueryParams,
        })
      })
    )
  }
}
