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
import { DeclareOauthSession } from '../types/declareOauthSession.endpoint'

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
      return this._oauth
        .declareOauthSession(<DeclareOauthSession>queryParams)
        .pipe(
          map((value) => {
            if (!state.url.startsWith('/signin') && value.forceLogin) {
              return this._router.createUrlTree(['/signin'], {
                queryParams: queryParams,
              })
            } else if (value.errors.length || value.error) {
              // redirect the user to the login if something goes wrong on the backend declaration
              // TODO @leomendoza123 Throw toaster error and display error description
              return this._router.createUrlTree(['/signin'])
            } else if (!value.userOrcid || !value.userName) {
              // The users is not logged in
              if (state.url.startsWith('/oauth/authorize')) {
                // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
                // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route
                queryParams['oauth'] = ''
                return this._router.createUrlTree(['/signin'], {
                  queryParams,
                })
              } else if (state.url.startsWith('/signin')) {
                return true
              }
            } else {
              // The users has already login and is ready to authorize
              if (state.url.startsWith('/oauth/authorize')) {
                return true
              } else if (state.url.startsWith('/signin')) {
                return this._router.createUrlTree(['/oauth/authorize'], {
                  queryParams: queryParams,
                })
              }
            }
          })
        )
    } else {
      if (state.url.startsWith('/oauth/authorize')) {
        // redirect the user to the login if no oauth parameters are provided
        return this._router.createUrlTree(['/signin'], {
          queryParams: next.queryParams,
        })
      } else if (state.url.startsWith('/signin')) {
        return true
      }
    }
  }

  // TODO @angel check if these are all the oauth parameters we support
  // if any of this query parameters is present the backend will be call to try
  // to create an oauth section
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
