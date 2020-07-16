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

import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters } from '../types'
import { oauthSectionHasError, oauthSectionUserIsLoggedIn } from './constants'
import { PlatformInfoService } from '../cdk/platform-info'
@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _oauth: OauthService,
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
          return this.handleOauthSection(queryParams as OauthParameters)
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

  handleOauthSection(queryParams: OauthParameters) {
    return this._oauth.declareOauthSession(<OauthParameters>queryParams).pipe(
      map((value) => {
        if (
          // value.forceLogin || TODO @leomendoza123 https://trello.com/c/xapTqK4F/6875-support-openid-query-parameters
          !oauthSectionUserIsLoggedIn(value) ||
          oauthSectionHasError(value)
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
