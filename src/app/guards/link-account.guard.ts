import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { UserService } from '../core'
import { OauthService } from '../core/oauth/oauth.service'

@Injectable({
  providedIn: 'root',
})
export class LinkAccountGuard {
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
    return this._userInfo.getUserSession().pipe(
      take(1),
      map((value) => {
        return true
        // if (value.thirdPartyAuthData?.signinData?.providerId) {
        //   return true
        // } else {
        //   return this._router.createUrlTree(['/signin'])
        // }
      }),

      catchError(() => {
        return of(this._router.createUrlTree(['/signin']))
      })
    )
  }
}
