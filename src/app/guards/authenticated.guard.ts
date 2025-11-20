import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard {
  constructor(private _userInfo: UserService, private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn()
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn()
  }

  private isLoggedIn(): Observable<boolean | UrlTree> | boolean {
    return this._userInfo.getUserSession().pipe(
      map((value) => {
        return (
          value.loggedIn ||
          this._router.createUrlTree([ApplicationRoutes.signin])
        )
      })
    )
  }
}
