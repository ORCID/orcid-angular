import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { retry, catchError, tap } from 'rxjs/operators'
import { RecordCountryCodesEndpoint } from 'src/app/types/record-country'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordCountriesService {
  $countryCodes: ReplaySubject<RecordCountryCodesEndpoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getCountryCodes() {
    if (!this.$countryCodes) {
      this.$countryCodes = new ReplaySubject(1)
      this._http
        .get<RecordCountryCodesEndpoint>(
          environment.API_WEB + `countryNamesToCountryCodes.json`,
          {
            headers: this.headers,
          }
        )
        .pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          tap((value) => {
            this.$countryCodes.next(value)
          })
        )
        .subscribe()
    }
    return this.$countryCodes.asObservable()
  }
}
