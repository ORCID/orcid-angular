import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { NEVER, Observable, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { GoogleAnalyticsService } from '../core/google-analytics/google-analytics.service'
import { ERROR_REPORT } from '../errors'
import { RequestInfoForm } from '../types'

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleAnalyticsService,
    private _errorHandler: ErrorHandlerService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    return this._user.getUserSession().pipe(
      switchMap((session) => {
        const oauthSession = session.oauthSession
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
            return this.reportAlreadyAuthorize(session.oauthSession).pipe(
              switchMap(() => {
                this.window.location.href = oauthSession.redirectUrl
                return NEVER
              })
            )
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
  reportAlreadyAuthorize(request: RequestInfoForm) {
    return this._gtag
      .reportEvent(`Reauthorize`, 'RegGrowth', request)
      .pipe(
        catchError((err) =>
          this._errorHandler.handleError(
            err,
            ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
          )
        )
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
