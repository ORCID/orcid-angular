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
import { AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL } from 'src/app/constants'

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private currentLevel = 0
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

  get(
    getNextDepthLevel = false
  ): Observable<
    (
      | InboxNotificationAmended
      | InboxNotificationHtml
      | InboxNotificationInstitutional
      | InboxNotificationPermission
    )[]
  > {
    // Only allow to get the next level if the first level was already retrieved
    if (getNextDepthLevel && this.lastEmittedValue) {
      this.currentLevel++
    }
    return this.getNotifications(this.currentLevel).pipe(
      tap((data) => {
        if (!this.lastEmittedValue) {
          this.lastEmittedValue = data
        } else {
          this.lastEmittedValue = this.lastEmittedValue.concat(data)
        }
        this.inboxSubject.next(this.lastEmittedValue)
      }),
      switchMap(() => this.inboxSubject.asObservable())
    )
  }

  private getNotifications(
    depthLevel
  ): Observable<
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
          `inbox/notifications.json?firstResult=${
            AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * depthLevel
          }&maxResults=${AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL}&includeArchived=true`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  public mightHaveMoreNotifications() {
    if (!this.lastEmittedValue) {
      return true
    } else if (
      AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * (this.currentLevel + 1) ===
      this.lastEmittedValue.length
    ) {
      return true
    } else {
      return false
    }
  }

  flagAsArchive(
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

  flagAsRead(
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
      >(environment.BASE_URL + `inbox/${code}/read.json`, code, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((data) => {
          this.lastEmittedValue.forEach((value) => {
            if (value.putCode === data.putCode) {
              value.readDate = data.readDate
            }
          })
          this.inboxSubject.next(this.lastEmittedValue)
        })
      )
  }
}
