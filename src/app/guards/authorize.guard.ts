import { Injectable, Inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { NEVER, Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { RequestInfoForm } from '../types'
import { UserService } from '../core'
import { WINDOW } from '../cdk/window'

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivateChild {
  constructor(
    private _user: UserService,
    private _router: Router,
    @Inject(WINDOW) private window: Window
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    return this._user.getUserSession().pipe(
      switchMap((session) => {
        const oauthSession = session.oauthSession
        if (oauthSession) {
          if (
            oauthSession &&
            oauthSession.redirectUrl &&
            oauthSession.responseType &&
            oauthSession.redirectUrl.includes(oauthSession.responseType + '=')
          ) {
            this.window.location.href = oauthSession.redirectUrl
            return NEVER
          } else if (
            (oauthSession && oauthSession.forceLogin) ||
            !session.oauthSessionIsLoggedIn
          ) {
            return this.redirectToLoginPage(next.queryParams, oauthSession)
            // If the redirectUrl comes with a code from the start redirect the user immediately
          } else if (oauthSession.redirectUrl.includes('?code=')) {
            this.window.location.href = oauthSession.redirectUrl
            return NEVER
          }
        }
        return of(true)
      })
    )
  }

  private redirectToLoginPage(
    queryParams,
    oauthSession: RequestInfoForm
  ): Observable<UrlTree> {
    // TODO @leomendoza123 @danielPalafox is adding the empty oauth parameters really required?
    // seems is never consumed or check by the frontend and it will never hit the backend on a frontend route
    // The router is removing parameters from the url it necessary reassigned from the oauth session to preserve all the parameters
    const newQueryParams = {
      ...queryParams,
      oauth: '',
      redirect_uri: oauthSession.redirectUrl,
      response_type: oauthSession.responseType,
      state: oauthSession.stateParam,
      scope: oauthSession.scopesAsString,
      client_id: oauthSession.clientId,
      email: oauthSession.userEmail,
      given_names: oauthSession.userGivenNames,
      family_names: oauthSession.userFamilyNames,
      orcid: oauthSession.userOrcid,
      nonce: oauthSession.nonce,
      forceLogin: oauthSession.forceLogin,
    }
    return of(
      this._router.createUrlTree(['/signin'], {
        queryParams: newQueryParams,
      })
    )
  }
}
