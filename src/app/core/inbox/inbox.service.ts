// TODO @leomendoza123 remove
// tslint:disable: max-line-length
// tslint:disable: quotemark

import { Injectable, LOCALE_ID, Inject, ErrorHandler } from '@angular/core'
import { of, Observable, ReplaySubject } from 'rxjs'
import {
  InboxNotification,
  InboxNotificationAmended,
  InboxNotificationHtml,
  InboxNotificationInstitutional,
  InboxNotificationPermission,
} from '../../types/notifications.endpoint'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { retry } from 'rxjs/internal/operators/retry'
import { catchError, tap, switchMap, delay } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private headers: HttpHeaders
  private inboxSubject = new ReplaySubject<
    (
      | InboxNotificationAmended
      | InboxNotificationHtml
      | InboxNotificationInstitutional
      | InboxNotificationPermission
    )[]
  >(1)

  lastEmittedValue: (
    | InboxNotificationAmended
    | InboxNotificationHtml
    | InboxNotificationInstitutional
    | InboxNotificationPermission
  )[]

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  }

  get(): Observable<
    (
      | InboxNotificationAmended
      | InboxNotificationHtml
      | InboxNotificationInstitutional
      | InboxNotificationPermission
    )[]
  > {
    return this.getNotifications().pipe(
      tap((data) => {
        this.lastEmittedValue = data
        this.inboxSubject.next(data)
      }),
      switchMap(() => this.inboxSubject.asObservable())
    )
  }

  private getNotifications(): Observable<
    (
      | InboxNotificationAmended
      | InboxNotificationHtml
      | InboxNotificationInstitutional
      | InboxNotificationPermission
    )[]
  > {
    return this._http
      .get<
        (
          | InboxNotificationAmended
          | InboxNotificationHtml
          | InboxNotificationInstitutional
          | InboxNotificationPermission
        )[]
      >(
        environment.BASE_URL +
          `inbox/notifications.json?firstResult=0&maxResults=10&includeArchived=true`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((data) => {
          this.lastEmittedValue = data
          this.inboxSubject.next(this.lastEmittedValue)
        })
      )
  }

  archive(
    code: number | string
  ): Observable<
    | InboxNotificationAmended
    | InboxNotificationHtml
    | InboxNotificationInstitutional
    | InboxNotificationPermission
  > {
    return this._http
      .post<
        | InboxNotificationAmended
        | InboxNotificationHtml
        | InboxNotificationInstitutional
        | InboxNotificationPermission
      >(environment.BASE_URL + `inbox/${code}/archive.json`, code, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        // set archive notification archived date to 1
        // when the backend archive the notification
        tap((data) => {
          this.lastEmittedValue.forEach((value) => {
            if (value.putCode === data.putCode) {
              value.archivedDate = data.archivedDate
            }
          })
          this.inboxSubject.next(this.lastEmittedValue)
        })
      )
  }
}
