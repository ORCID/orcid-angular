import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { OauthParameters } from '../types'
import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanActivateChild {
  constructor(private _user: UserService, private _router: Router) {}

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
