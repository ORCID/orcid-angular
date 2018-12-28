import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { retry } from 'rxjs/internal/operators/retry'
import { catchError } from 'rxjs/internal/operators/catchError'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { HttpClient } from '@angular/common/http'

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
  getPerson(id) {
    return this._http.get(environment.API_WEB + `${id}/person.json`).pipe(
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
