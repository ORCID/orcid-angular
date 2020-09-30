import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap, tap, catchError, last, take } from 'rxjs/operators'

import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { OauthService } from '../core/oauth/oauth.service'

@Injectable({
  providedIn: 'root',
})
export class LinkAccountGuard implements CanActivateChild {
  constructor(
    private _userInfo: UserService,
    private _router: Router,
    private _platformInfo: PlatformInfoService,
    private _oauthService: OauthService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._platformInfo.get().pipe(
      take(1),
      switchMap((platform) => {
        if (platform.social) {
          // TODO @leomendoza123 make the social/shibboleth data part of the user session
          return this._oauthService.loadSocialSigninData()
        } else {
          return this._oauthService.loadShibbolethSignInData()
        }
      }),
      map((value) => {
        if (value.providerId) {
          return true
        } else {
          return this._router.createUrlTree(['/signin'])
        }
      }),

      catchError(() => {
        return of(this._router.createUrlTree(['/signin']))
      })
    )
  }
}
