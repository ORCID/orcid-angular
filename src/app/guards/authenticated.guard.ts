import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  Router,
} from '@angular/router'
import { Observable } from 'rxjs'
import { UserService } from '../core'
import { map } from 'rxjs/operators'
import { ApplicationRoutes } from '../constants'

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
    return this._userInfo
      .getUserInfoOnEachStatusUpdate()
      .pipe(
        map(
          (value) =>
            value.loggedIn ||
            this._router.createUrlTree([ApplicationRoutes.signin])
        )
      )
  }
}
