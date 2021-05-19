import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  Router,
} from '@angular/router'
import { Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { GoogleAnalyticsService } from '../core/google-analytics/google-analytics.service'
import { RequestInfoForm } from '../types'

@Injectable({
  providedIn: 'root',
})
export class ThirdPartySigninCompletedGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    @Inject(WINDOW) private window: Window,
    private _analytics: GoogleAnalyticsService,
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
        this._analytics.reportEvent(
          'Sign-In',
          'RegGrowth',
          requestInfoForm || 'Website' // If the is no requestInfoForm report a Website signin]]\
        )
        if (state.url.startsWith('/my-orcid')) {
          // This "out of router navigation" is necesary while my-orcid exist on the old page
          // as a temporal side effect will show the new app header/footer before navigating into the old app
          ;(<any>this.window).outOfRouterNavigation('/my-orcid')
          return false
        } else {
          return this._router.parseUrl(
            state.url.replace(/\/third-party-signin-completed/, '')
          )
        }
      })
    )
  }
}
