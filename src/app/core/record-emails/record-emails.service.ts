import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms'
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators'
import {
  Assertion,
  AssertionVisibilityString,
  EmailsEndpoint,
  ErrorsListResponse,
} from 'src/app/types'
import { UserRecordOptions } from 'src/app/types/record.local'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'
import { setProfessionalEmails } from '../utils'

@Injectable({
  providedIn: 'root',
})
export class RecordEmailsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
  private $emailsSubject

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}
  getEmails(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<EmailsEndpoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.emails))
    }
    if (!this.$emailsSubject) {
      this.$emailsSubject = new ReplaySubject<EmailsEndpoint>(1)
    } else if (!options.forceReload) {
      return this.$emailsSubject
    }
    if (options.cleanCacheIfExist) {
      this.$emailsSubject.next(EMPTY)
    }

    this._http
      .get<EmailsEndpoint>(runtimeEnvironment.API_WEB + `account/emails.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({ emails: [] })),
        map((value: EmailsEndpoint) => {
          value.emails.sort(this.sortByEmailCreationDate)
          value = setProfessionalEmails(value)
          return value
        }),
        tap((value) => {
          this.$emailsSubject.next(value)
        })
      )
      .subscribe()
    return this.$emailsSubject
  }

  postEmails(emails: EmailsEndpoint): Observable<EmailsEndpoint> {
    return this._http
      .post<EmailsEndpoint>(
        runtimeEnvironment.API_WEB + `account/emails.json`,
        emails,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails({ forceReload: true }))
      )
  }

  editEmail(original: string, edited: string): Observable<EmailsEndpoint> {
    return this._http
      .post<Assertion>(
        runtimeEnvironment.API_WEB + `account/email/edit.json`,
        { original, edited },
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails({ forceReload: true }))
      )
  }

  verifyEmail(email: string): Observable<EmailsEndpoint> {
    return this._http
      .get<ErrorsListResponse>(
        runtimeEnvironment.API_WEB +
          `account/verifyEmail.json?email=${encodeURIComponent(email)}`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails())
      )
  }

  visibility(email): Observable<any> {
    const encoded_data = JSON.stringify(email)

    return this._http
      .post(
        runtimeEnvironment.API_WEB + `account/email/visibility`,
        encoded_data,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails({ forceReload: true }))
      )
  }

  validateRegisterValue(
    value: Assertion
  ): Observable<AssertionVisibilityString> {
    return this._http
      .post<AssertionVisibilityString>(
        runtimeEnvironment.API_WEB + `account/validateEmail.json`,
        value
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  backendEmailValidate(
    emailThatAreAlreadySaveOnTheBackend?: AssertionVisibilityString[]
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value === '') {
        return of(null)
      }
      const value: Assertion = { value: control.value }

      const thisEmailIsAlreadyOnTheBackend =
        emailThatAreAlreadySaveOnTheBackend.filter(
          (email) => email.value === value.value
        )

      if (thisEmailIsAlreadyOnTheBackend.length) {
        return of(null)
      }

      return this.validateRegisterValue(value).pipe(
        map((res) => {
          if (res.errors.length > 0) {
            const error = {
              backendError: res.errors,
            }
            return error
          }
          return null
        })
      )
    }
  }

  sortByEmailByValue(
    a: AssertionVisibilityString,
    b: AssertionVisibilityString
  ): number {
    if (a.value < b.value) {
      return -1
    }
    if (a.value > b.value) {
      return 1
    }
    return 0
  }

  sortByEmailByVerifiedState(
    a: AssertionVisibilityString,
    b: AssertionVisibilityString
  ): number {
    return a.verified === b.verified ? 0 : a.verified ? -1 : 1
  }

  sortByEmailPrimaryState(
    a: AssertionVisibilityString,
    b: AssertionVisibilityString
  ): number {
    return a.primary === b.primary ? 0 : a.primary ? -1 : 1
  }

  sortByEmailCreationDate(
    a: AssertionVisibilityString,
    b: AssertionVisibilityString
  ): number {
    return a.createdDate.timestamp - b.createdDate.timestamp
  }
}
