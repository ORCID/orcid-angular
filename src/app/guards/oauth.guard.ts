import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { OauthService } from '../core/oauth/oauth.service'
import { OauthParameters } from '../types'
@Injectable({
  providedIn: 'root',
})
export class OauthGuard implements CanActivateChild {
  constructor(private _oauth: OauthService, private _router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = JSON.parse(
      JSON.stringify(next.queryParams)
    ) as OauthParameters

    if (this.isOauthRequest(next.queryParams)) {
      // Declares the Oauth parameters on the backend
      return this._oauth.declareOauthSession(<OauthParameters>queryParams).pipe(
        map((value) => {
          // If there are errors, is a forceLogin or the user is not login
          // makes sure the user is going to the login page
          if (
            !state.url.startsWith('/signin') &&
            // value.forceLogin || TODO @leomendoza123 https://trello.com/c/xapTqK4F/6875-support-openid-query-parameters
            (!value.userOrcid ||
              !value.userName ||
              value.errors.length ||
              value.error)
          ) {
            // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
            // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route
            queryParams['oauth'] = ''
            return this._router.createUrlTree(['/signin'], {
              queryParams: queryParams,
            })

            // if no errors, the user is login and is not a force login
            // make sure the user is going to the authorization page
          } else if (
            state.url.startsWith('/signin') &&
            // !value.forceLogin && TODO @leomendoza123 https://trello.com/c/xapTqK4F/6875-support-openid-query-parameters
            value.userOrcid &&
            value.userName &&
            !value.errors.length &&
            !value.error
          ) {
            return this._router.createUrlTree(['/oauth/authorize'], {
              queryParams: queryParams,
            })
          }
          return true
        })
      )
    } else {
      if (state.url.startsWith('/oauth/authorize')) {
        // redirect the user to the login if no oauth parameters are provided
        return this._router.createUrlTree(['/signin'], {
          queryParams: next.queryParams,
        })
      }
      return true
    }
  }

  // TODO @leomendoza123 check if these are all the oauth parameters we support
  // if any of this query parameters is present the backend will be call to try
  // to create an oauth section

  // Try using the platform service to check this
  isOauthRequest(queryParams: Object) {
    if (
      'client_id' in queryParams ||
      'response_type' in queryParams ||
      'scope' in queryParams ||
      'redirect_uri' in queryParams ||
      'oauth' in queryParams
    ) {
      return true
    } else {
      return false
    }
  }
}
