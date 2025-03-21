import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { TrustedIndividuals, Delegator } from 'src/app/types/trusted-individuals.endpoint'

import { catchError, map, retry, tap } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  updateDelegatorSuccess = new Subject<void>()
    headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    })
    constructor(
      private _errorHandler: ErrorHandlerService,
      private _http: HttpClient
    ) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    return this._http
      .get<TrustedIndividuals>(
        `${runtimeEnvironment.API_WEB}delegators/delegators-and-me.json`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          if (response?.delegators?.length) {
            response.delegators.forEach((delegator) => {
              if (!delegator.giverName?.value) {
                delegator.giverName.value = $localize`:@@account.nameIsPri:Name is private`
              }
            })
          }
          return response
        })
      )
  }

    delete(account: Delegator): Observable<void> {
      return this._http
        .post<void>(
          runtimeEnvironment.API_WEB + `account/revokeDelegate.json`,
          { delegateToManage: account.giverOrcid.path },
          { headers: this.headers }
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap(() => this.updateDelegatorSuccess.next())
        )
    }
}
