import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'

import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class ThirdPartySigninCompletedGuard {
  constructor(private _router: Router, private _user: UserService) {}

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
      map(() => {
        return this._router.parseUrl(
          state.url.replace(/\/third-party-signin-completed/, '')
        )
      })
    )
  }
}
