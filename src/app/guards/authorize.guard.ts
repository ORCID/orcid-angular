import { Inject, Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { WINDOW } from '../cdk/window'
import { UserService } from '../core'
import { GoogleTagManagerService } from '../core/google-tag-manager/google-tag-manager.service'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly platform: PlatformInfoService
  ) {}

  canActivateChild(
    _: ActivatedRouteSnapshot,
    __: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.userService.getUserSession().pipe(
      take(1),
      switchMap((session) => this.resolveNavigation(session))
    )
  }
  /**
   * Decides where to send the user based on the session state.
   */
  private resolveNavigation(
    session: Awaited<
      ReturnType<UserService['getUserSession']>
    > extends Observable<infer S>
      ? S
      : never
  ): Observable<boolean | UrlTree> {
    // 1. Account is locked ➜ always redirect to the profile
    if (session.userInfo?.LOCKED === 'true') {
      return of(this.router.createUrlTree(['/my-orcid']))
    }

    // 2. We have an OAuth session object – handle its states explicitly
    if (session.oauthSession) {
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
    }

    // 3. No OAuth session at all ➜ redirect
    return this.redirectToLoginPage()
  }

  /**
   * Builds a UrlTree pointing at /signin while preserving current query params.
   */
  private redirectToLoginPage(): Observable<UrlTree> {
    return this.platform.get().pipe(
      map(({ queryParameters }) =>
        this.router.createUrlTree(['/signin'], {
          queryParams: { ...queryParameters },
        })
      )
    )
  }
}
