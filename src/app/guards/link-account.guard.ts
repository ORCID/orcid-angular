import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap, tap, catchError } from 'rxjs/operators'

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
      switchMap((platform) => {
        if (platform.social) {
          return this._oauthService.loadSocialSigninData()
        } else {
          return this._oauthService.loadShibbolethSignInData()
        }
      }),
      tap((value) => console.log(value)),
      catchError(() => of(false)),
      map((value) => {
        if (typeof value !== 'boolean' && value.providerId) {
          return true
        } else {
          return this._router.createUrlTree(['/'])
        }
      })
    )
  }
}
