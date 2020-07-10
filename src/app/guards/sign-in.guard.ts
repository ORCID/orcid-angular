import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'

import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters } from '../types'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard implements CanActivateChild {
  constructor(private _oauth: OauthService, private _router: Router) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams as OauthParameters
    if (queryParams.show_login === 'false') {
      return this._router.createUrlTree(['/register'], {
        queryParams: queryParams,
      })
    }
    return true
  }
}
