import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, first, map, retry, switchMap, tap } from 'rxjs/operators'
import { Person } from 'src/app/types'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { UserService } from '../user/user.service'

@Injectable({
  providedIn: 'root',
})
export class RecordPersonService {
  private $personPublicRecordSubject: ReplaySubject<Person>
  private $personPrivateRecordSubject: ReplaySubject<Person>

  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient,
    private _user: UserService
  ) {}

  getPerson(options: UserRecordOptions): Observable<Person> {
    if (options?.publicRecordId) {
      return this.getPublicRecordPerson(options)
    } else {
      return this.getPrivateRecordPerson(options)
    }
  }

  private getPublicRecordPerson(
    options: UserRecordOptions
  ): Observable<Person | undefined> {
    if (!this.$personPublicRecordSubject || options.forceReload) {
      this.$personPublicRecordSubject = new ReplaySubject<Person>(1)
    } else {
      return this.$personPublicRecordSubject.asObservable()
    }

    this.getPersonHttpCall(options.publicRecordId)
      .pipe(
        tap((data) => {
          this.setupFullCountryCodes(data)
        }),
        tap((value) => {
          this.$personPublicRecordSubject.next(value)
        })
      )
      .subscribe()
    return this.$personPublicRecordSubject.asObservable()
  }

  public getPrivateRecordPerson(
    options: UserRecordOptions
  ): ReplaySubject<Person> {
    if (!this.$personPrivateRecordSubject) {
      this.$personPrivateRecordSubject = new ReplaySubject<Person>(1)
    } else if (!options.forceReload) {
      return this.$personPrivateRecordSubject
    }

    this._user
      .getUserSession()
      .pipe(
        first(),
        map((userSession) => userSession.userInfo.EFFECTIVE_USER_ORCID),
        switchMap((orcid) => this.getPersonHttpCall(orcid)),
        tap((data) => {
          this.setupFullCountryCodes(data)
        }),
        tap((value) => {
          this.$personPrivateRecordSubject.next(value)
        })
      )
      .subscribe()
    return this.$personPrivateRecordSubject
  }

  private getPersonHttpCall(orcid: string): Observable<Person> {
    return this._http
      .get<Person>(runtimeEnvironment.API_WEB + `${orcid}/person.json`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  private setupFullCountryCodes(data: Person) {
    if (data.publicGroupedAddresses) {
      Object.keys(data.publicGroupedAddresses).map((key) => {
        if (data.countryNames && data.countryNames[key]) {
          data.publicGroupedAddresses[data.countryNames[key]] =
            data.publicGroupedAddresses[key]
          delete data.publicGroupedAddresses[key]
        }
      })
    }
  }
}
