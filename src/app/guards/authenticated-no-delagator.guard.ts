import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedNoDelegatorGuard {
  constructor(
    private _userInfo: UserService,
    private _router: Router,
    private _togglz: TogglzService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return combineLatest([this._userInfo.getUserSession()]).pipe(
      map((value) => {
        const userSession = value[0]
        if (
          (userSession.loggedIn &&
            userSession.userInfo.IN_DELEGATION_MODE === 'false') ||
          userSession.userInfo.DELEGATED_BY_ADMIN === 'true'
        ) {
          return true
        } else {
          return this._router.createUrlTree([ApplicationRoutes.myOrcid])
        }
      })
    )
  }
}
