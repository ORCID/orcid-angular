import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { OauthService } from '../core/oauth/oauth.service'

@Injectable({
  providedIn: 'root',
})
export class TwoFactorSigninGuard  {
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
        if (value.loggedIn) {
          return this._router.createUrlTree(['/my-orcid'])
        } else {
          return true
        }
      })
    )
  }
}
