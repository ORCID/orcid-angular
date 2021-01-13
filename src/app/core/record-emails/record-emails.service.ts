import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, switchMap } from 'rxjs/operators'
import { Emails, Assertion, ErrorsListResponse } from 'src/app/types'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class RecordEmailsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  private $emailsSubject

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}
  getEmails(): Observable<Emails> {
    if (this.$emailsSubject) {
      return this.$emailsSubject
    } else {
      this.$emailsSubject = new ReplaySubject<Emails>(1)
    }

    this._http
      .get<Emails>(environment.API_WEB + `account/emails.json`, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((value) => {
          this.$emailsSubject.next(value)
        })
      )
      .subscribe()
    return this.$emailsSubject
  }

  postEmails(otherNames: Emails): Observable<Emails> {
    return this._http
      .post<Emails>(environment.API_WEB + `account/edit.json`, otherNames, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails())
      )
  }

  addEmail(email: Assertion): Observable<Emails> {
    return this._http
      .post<Assertion>(environment.API_WEB + `account/addEmail.json`, email, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() => this.getEmails())
      )
  }

  veryEmail(email: String): Observable<Emails> {
    return this._http
      .get<ErrorsListResponse>(
        environment.API_WEB + `account/verifyEmail.json?email=${email}`,
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

  setAsPrimaryEmail(email: Assertion): Observable<Emails> {
    return this._http
      .post<Assertion>(
        environment.API_WEB + `account/email/setPrimary`,
        email,
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
}
