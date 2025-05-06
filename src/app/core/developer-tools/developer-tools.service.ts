import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Client } from 'src/app/types/developer-tools'
import { Observable } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class DeveloperToolsService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getDeveloperToolsClient(): Observable<Client> {
    return this._http
      .get<Client>(
        runtimeEnvironment.BASE_URL + 'developer-tools/get-client.json'
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  postDeveloperToolsClient(client: Client): Observable<Client> {
    return this._http
      .post<Client>(
        runtimeEnvironment.BASE_URL + 'developer-tools/create-client.json',
        client
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  updateDeveloperToolsClient(client: Client): Observable<Client> {
    return this._http
      .post<Client>(
        runtimeEnvironment.BASE_URL + 'developer-tools/update-client.json',
        client
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  postResetClientSecret(client: Client): Observable<Client> {
    return this._http
      .post<Client>(
        runtimeEnvironment.BASE_URL +
          'developer-tools/reset-client-secret.json',
        client
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  enableDeveloperTools() {
    return this._http
      .post<Client>(
        runtimeEnvironment.BASE_URL +
          'developer-tools/enable-developer-tools.json',
        {}
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  resetClientSecret(client: Client): Observable<Client> {
    return this._http
      .post<Client>(
        runtimeEnvironment.BASE_URL +
          'developer-tools/reset-client-secret.json',
        client
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }
}
