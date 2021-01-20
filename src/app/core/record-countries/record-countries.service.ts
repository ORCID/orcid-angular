import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { retry, catchError, tap } from 'rxjs/operators'
import {
  CountriesEndpoint,
  RecordCountryCodesEndpoint,
} from 'src/app/types/record-country.endpoint'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordCountriesService {
  $countryCodes: ReplaySubject<RecordCountryCodesEndpoint>
  $addresses: ReplaySubject<CountriesEndpoint>
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

  getAddresses(forceReload = false): Observable<CountriesEndpoint> {
    if (!this.$addresses) {
      this.$addresses = new ReplaySubject<CountriesEndpoint>(1)
    } else if (!forceReload) {
      return this.$addresses
    }

    this._http
      .get<CountriesEndpoint>(
        environment.API_WEB + `account/countryForm.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          this.$addresses.next(value)
        })
      )
      .subscribe()
    return this.$addresses
  }

  postAddresses(countries: CountriesEndpoint): Observable<CountriesEndpoint> {
    console.log(countries)
    return this._http
      .post<CountriesEndpoint>(
        environment.API_WEB + `account/countryForm.json`,
        countries,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => this.$addresses.next(value))
      )
  }
}
