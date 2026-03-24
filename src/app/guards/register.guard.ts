import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { UserService } from '../core'
import { RumJourneyEventService } from '../rum/service/customEvent.service'
import { AppEventName } from '../register/app-event-names'
import { serializeQueryParamsForRum } from '../rum/serialize-oauth-query-for-rum'

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _observability: RumJourneyEventService
  ) {}

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
          this._observability.recordSimpleEvent(
            AppEventName.RegisterGuardRedirectToAuthorize,
            {
              client_id: next.queryParams?.client_id,
              redirect_uri: next.queryParams?.redirect_uri,
              prompt: next.queryParams?.prompt,
              scope: next.queryParams?.scope,
              oauth_query_string: serializeQueryParamsForRum(next.queryParams),
            }
          )
          return this._router.createUrlTree(['/oauth/authorize'], {
            queryParams: next.queryParams,
          })
        }
        return true
      })
    )
  }
}
