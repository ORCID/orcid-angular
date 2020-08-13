import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs'
import {
  TrustedIndividuals,
  Delegator,
} from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { retry, catchError, tap, repeatWhen } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { map } from 'puppeteer/DeviceDescriptors'
import { UserService } from '../user/user.service'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  accountSwitchedSubject = new Subject<void>()
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _userService: UserService
  ) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    return this._http
      .get<TrustedIndividuals>(
        `${environment.API_WEB}delegators/delegators-and-me.json`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        repeatWhen(() => this.accountSwitchedSubject)
      )
  }

  refreshTrustedIndividuals() {
    this.accountSwitchedSubject.next()
  }

  // TODO @angel review
  // since the switch account is returning a 302 witch triggers a redirect to `my-orcid`
  // and we also trigger a reload, to reload the oauth page
  // there might be some scenarios where these two different request might not work as expected.
  switchAccount(delegator: Delegator) {
    return this._http
      .get(
        `${environment.API_WEB}switch-user?username=${delegator.giverOrcid.path}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          // TODO @angel review
          // The endpoint response need to be handle as an error
          // since the response is not a 200 from the server
          // The status is interpreted as a error code 0 since the 302 redirect is cancelled
          if (error.status === 0) {
            this._userService.refreshUserSession()
            this.refreshTrustedIndividuals()
            return of(error)
          } else {
            return this._errorHandler.handleError(
              error,
              ERROR_REPORT.STANDARD_VERBOSE
            )
          }
        })
      )
  }
}
