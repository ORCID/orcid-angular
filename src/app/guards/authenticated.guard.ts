import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivateChild {
  constructor(private _userInfo: UserService, private _router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._userInfo.getUserSession().pipe(
      map(
        (value) =>
          value.loggedIn ||
          this._router.createUrlTree([ApplicationRoutes.signin])
      ),
      tap((x) => {
        console.log(x)
      })
    )
  }
}
