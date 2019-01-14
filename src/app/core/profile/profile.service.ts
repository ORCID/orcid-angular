import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError } from 'rxjs/internal/operators/catchError'
import { retry } from 'rxjs/internal/operators/retry'

import { environment } from '../../../environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Person } from '../../types'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getAffiliations(id) {
    return this._http
      .get(environment.API_WEB + `${id}/affiliationGroups.json`)
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }
  getPerson(id): Observable<Person> {
    return this._http
      .get<Person>(environment.API_WEB + `${id}/person.json`)
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }
  getAffiliationsDetails(id, affiliationId, type) {
    return this._http
      .get(
        environment.API_WEB +
          `${id}/affiliationDetails.json?id=${affiliationId}&type=${type}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }
}
