import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard {
  constructor(
    private _user: UserService,
    private _router: Router
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    return this._user.getUserSession().pipe(
      map((session) => {
        if (
          session.oauthSession &&
          !session.oauthSession.forceLogin &&
          session.oauthSessionIsLoggedIn
        ) {
          return this._router.createUrlTree(['/oauth/authorize'], {
            queryParams: next.queryParams,
          })
        }
        return true
      })
    )
  }
}
