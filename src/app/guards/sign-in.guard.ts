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
import { FeatureLoggerService } from '../core/logging/feature-logger.service'
import { AuthDecisionService } from '../core/auth-decision/auth-decision.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'

@Injectable({
  providedIn: 'root',
})
export class SignInGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _togglzService: TogglzService,
    private readonly featureLogger: FeatureLoggerService,
    private readonly authDecision: AuthDecisionService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    const queryParams = next.queryParams as OauthParameters

    return forkJoin({
      isOauthAuthorizationTogglzEnable: this._togglzService
        .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
        .pipe(take(1)),
      session: this._user.getUserSession().pipe(take(1)),
    }).pipe(
      take(1),
      map(({ isOauthAuthorizationTogglzEnable, session }) => {
        const decision = this.authDecision.decideForSignIn(
          session as any,
          isOauthAuthorizationTogglzEnable,
          queryParams
        )
        this.featureLogger.debug('Sign-In Guard', ...decision.trace)
        switch (decision.action) {
          case 'redirectToAuthorize':
            return this.redirectToAuthorize(queryParams)
          case 'redirectToRegister':
            return this.redirectToRegister(queryParams)
          case 'allow':
          default:
            return true
        }
      })
    )
  }

  private redirectToAuthorize(queryParams) {
    return this._router.createUrlTree(['/oauth/authorize'], {
      queryParams: queryParams,
    })
  }

  private redirectToRegister(queryParams) {
    return this._router.createUrlTree(['/register'], {
      queryParams,
    })
  }
}
