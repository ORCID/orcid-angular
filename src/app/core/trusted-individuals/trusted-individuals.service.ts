import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import {
  TrustedIndividuals,
  Delegator,
} from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
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
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  // TODO @angel review
  // since the switch account is returning a 302 witch triggers a redirect to `my-orcid`
  // and we also trigger a reload, to reload the oauth page
  // there might be some scenarios where these two different request might not work as expected.
  switchAccount(delegator: Delegator) {
    return (
      this._http
        .get(
          `${environment.API_WEB}switch-user?username=${delegator.giverOrcid.path}`,
          {
            withCredentials: true,
          }
        )
        // TODO @leomendoza123 catch 302 error and reload the page
        .pipe()
    )
  }
}
