import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, switchMap, finalize } from 'rxjs/operators'

import { PlatformInfoService } from '../cdk/platform-info'
import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters } from '../types'
import { oauthSessionHasError, oauthSessionUserIsLoggedIn } from './constants'
import { UserService } from '../core'

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _platform: PlatformInfoService
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = JSON.parse(
      JSON.stringify(next.queryParams)
    ) as OauthParameters

    return this._platform.get().pipe(
      switchMap((value) => {
        if (value.oauthMode) {
          return this.handleOauthSession(queryParams as OauthParameters)
        } else {
          return of(
            this._router.createUrlTree(['/signin'], {
              queryParams: next.queryParams,
            })
          )
        }
      })
    )
  }

  handleOauthSession(queryParams: OauthParameters) {
    return this._user.getUserSession(queryParams).pipe(
      map((x) => x.oauthSession),
      map((session) => {
        if (
          // value.forceLogin || TODO @leomendoza123 https://trello.com/c/xapTqK4F/6875-support-openid-query-parameters
          !oauthSessionUserIsLoggedIn(session) ||
          oauthSessionHasError(session)
        ) {
          // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
          // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route
          queryParams['oauth'] = ''
          return this._router.createUrlTree(['/signin'], {
            queryParams: queryParams,
          })
        }
        return true
      })
    )
  }
}
