import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { OauthService } from '../core/oauth/oauth.service'
import { RumJourneyEventService } from '../rum/service/customEvent.service'
import { AppEventName } from '../rum/app-event-names'

@Injectable({
  providedIn: 'root',
})
export class TwoFactorSigninGuard {
  constructor(
    private _userInfo: UserService,
    private _router: Router,
    private _platformInfo: PlatformInfoService,
    private _oauthService: OauthService,
    private _observability: RumJourneyEventService
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
          this._observability.recordSimpleEvent(
            AppEventName.TwoFactorSignInGuardRedirectToMyOrcid
          )
          return this._router.createUrlTree(['/my-orcid'])
        } else {
          return true
        }
      })
    )
  }
}
