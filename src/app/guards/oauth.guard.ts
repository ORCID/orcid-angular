import { Injectable } from '@angular/core'
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'
import { Observable } from 'rxjs'
import { OauthService } from '../core/oauth/oauth.service'
import { DeclareOauthSession } from '../types/declareOauthSession.endpoint'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class OauthGuard implements CanActivateChild {
  constructor(private _oauth: OauthService, private _router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    // TODO @angel check if these are all the oauth parameters we support
    // if any of this query parameters is present the backend will be call to try
    // to create an oauth section
    if (
      'client_id' in next.queryParams ||
      'response_type' in next.queryParams ||
      'scope' in next.queryParams ||
      'redirect_uri' in next.queryParams ||
      'oauth' in next.queryParams
    ) {
      // Declares the Oauth parameters on the backend
      return this._oauth
        .declareOauthSession(<DeclareOauthSession>next.queryParams)
        .pipe(
          map((value) => {
            if (value.errors.length || value.error) {
              // redirect the user to the login if something goes wrong on the backend declaration
              // TODO @leomendoza123 Throw toaster error and display error description
              return this._router.createUrlTree(['/signin'])
            } else if (!value.userOrcid || !value.userName) {
              // The users is not logged in
              if (state.url.startsWith('/oauth/authorize')) {
                const params = JSON.parse(JSON.stringify(next.queryParams))
                params['oauth'] = ''
                return this._router.createUrlTree(['/signin'], {
                  queryParams: params,
                })
              } else if (state.url.startsWith('/signin')) {
                return true
              }
            } else if (value.forceLogin) {
              return this._router.createUrlTree(['/oauth/authorize'], {
                queryParams: next.queryParams,
              })
            } else {
              // The users has already login and is ready to authorize
              if (state.url.startsWith('/oauth/authorize')) {
                return true
              } else if (state.url.startsWith('/signin')) {
                return this._router.createUrlTree(['/oauth/authorize'], {
                  queryParams: next.queryParams,
                })
              }
            }
          })
        )
    } else {
      // redirect the user to the login if incomplete oauth parameters are provided
      if (state.url.startsWith('/oauth/authorize')) {
        return this._router.createUrlTree(['/signin'], {
          queryParams: next.queryParams,
        })
      } else if (state.url.startsWith('/signin')) {
        return true
      }
    }
  }
}
