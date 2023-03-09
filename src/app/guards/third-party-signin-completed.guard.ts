import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, Observable } from 'rxjs'
import { catchError, first, map } from 'rxjs/operators'

import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { GoogleUniversalAnalyticsService } from '../core/google-analytics/google-universal-analytics.service'
import { RequestInfoForm } from '../types'
import { GoogleTagManagerService } from '../core/google-tag-manager/google-tag-manager.service'
import { ERROR_REPORT } from '../errors'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class ThirdPartySigninCompletedGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    @Inject(WINDOW) private window: Window,
    private _analytics: GoogleUniversalAnalyticsService,
    private _googleTagManagerService: GoogleTagManagerService,
    private _errorHandler: ErrorHandlerService,
    private _user: UserService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._user.getUserSession().pipe(
      first(),
      map((value) => value.oauthSession),
      map((requestInfoForm: RequestInfoForm) => {
        const analyticsReports: Observable<void>[] = []
        analyticsReports.push(
          this._analytics.reportEvent(
            'Sign-In',
            'RegGrowth',
            requestInfoForm || 'Website' // If the is no requestInfoForm report a Website signin]]\
          )
        )
        analyticsReports.push(
          this._googleTagManagerService.reportEvent(
            'Sign-In',
            requestInfoForm || 'Website'
          )
        )
        this._googleTagManagerService
          .addGtmToDom()
          .pipe(
            catchError((err) =>
              this._errorHandler.handleError(
                err,
                ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
              )
            )
          )
          .subscribe((response) => {
            if (response) {
              forkJoin(analyticsReports)
                .pipe(
                  catchError((err) =>
                    this._errorHandler.handleError(
                      err,
                      ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
                    )
                  )
                )
                .subscribe()
            }
          })
        return this._router.parseUrl(
          state.url.replace(/\/third-party-signin-completed/, '')
        )
      })
    )
  }
}
