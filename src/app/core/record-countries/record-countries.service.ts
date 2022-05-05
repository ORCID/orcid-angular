import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { CountriesEndpoint } from 'src/app/types/record-country.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'
import countryCodes from './countryCodes.json'

@Injectable({
  providedIn: 'root',
})
export class RecordCountriesService {
  $addresses: ReplaySubject<CountriesEndpoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getCountryCodes(): Observable<{ key: string; value: string }[]> {
    return of(countryCodes)
  }

  getAddresses(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<CountriesEndpoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.countries))
    }

    if (!this.$addresses) {
      this.$addresses = new ReplaySubject<CountriesEndpoint>(1)
    } else if (!options.forceReload) {
      return this.$addresses
    }
    if (options.cleanCacheIfExist && this.$addresses) {
      this.$addresses.next(<CountriesEndpoint>undefined)
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
        catchError(() => of({ addresses: [] } as CountriesEndpoint)),
        tap((value) => {
          this.reverseSort(value)
        }),
        tap((value) => {
          this.$addresses.next(value)
        })
      )
      .subscribe()
    return this.$addresses
  }

  postAddresses(countries: CountriesEndpoint): Observable<CountriesEndpoint> {
    return this._http
      .post<CountriesEndpoint>(
        environment.API_WEB + `account/countryForm.json`,
        countries,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAddresses({ forceReload: true }))
      )
  }

  private reverseSort(value: CountriesEndpoint) {
    value.addresses.sort((a, b) => a.displayIndex - b.displayIndex)
    value.addresses.reverse()
  }
}
