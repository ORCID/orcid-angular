import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { forkJoin, Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'

import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'
import { OauthParameters } from '../types'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _togglzService: TogglzService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams as OauthParameters

    return forkJoin({
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf('OAUTH_AUTHORIZATION')
        .pipe(take(1)),
      session: this._user.getUserSession().pipe(take(1)),
    }).pipe(
      take(1),
      map(({ isOauthAuthorizationTogglzEnable, session }) => {
        if (!isOauthAuthorizationTogglzEnable && session.oauthSession) {
          if (queryParams.email || queryParams.orcid) {
            // TODO at the moment user arriving with an email on the Oauth url.
            // are not allow to go back.
            return this.isUserLoggedInOrExist(session, queryParams)
          } else if (
            queryParams.show_login &&
            (queryParams.email || queryParams.orcid)
          ) {
            return this.isUserLoggedInOrExist(session, queryParams)
          } else if (queryParams.show_login === 'false') {
            return this.isUserLoggedInOrExist(session, queryParams)
          } else if (
            !session.oauthSession.forceLogin &&
            session.oauthSessionIsLoggedIn
          ) {
            return this._router.createUrlTree(['/oauth/authorize'], {
              queryParams: queryParams,
            })
          }
        } else if (isOauthAuthorizationTogglzEnable && queryParams.client_id) {
          if (
            session.loggedIn &&
            queryParams.show_login !== 'true' &&
            queryParams.prompt !== 'login'
          ) {
            return this._router.createUrlTree(['/oauth/authorize'], {
              queryParams: queryParams,
            })
          }
        }
        return true
      })
    )
  }

  private isUserLoggedInOrExist(session, queryParams) {
    const userId = !!session.oauthSession.userId
    if (!userId && !session.oauthSessionIsLoggedIn) {
      return this.redirectToRegister(queryParams)
    }
    return true
  }

  private redirectToRegister(queryParams) {
    return this._router.createUrlTree(['/register'], {
      queryParams,
    })
  }
}
