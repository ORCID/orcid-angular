import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { catchError, map, switchMap, tap, retry } from 'rxjs/operators'
import { AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL } from 'src/app/constants'
import { ERROR_REPORT } from 'src/app/errors'
import { environment } from 'src/environments/environment'

import {
  InboxNotificationAmended,
  InboxNotificationHtml,
  InboxNotificationInstitutional,
  InboxNotificationPermission,
  TotalNotificationCount,
} from '../../types/notifications.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private nextLoadRequireAFullBackendSyncronization = false
  private currentlyIncludingArchive: boolean
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
    })
  }

  get(
    getNextDepthLevel = false,
    includeArchived = false
  ): Observable<
    (
      | InboxNotificationAmended
      | InboxNotificationHtml
      | InboxNotificationInstitutional
      | InboxNotificationPermission
    )[]
  > {
    if (
      this.lastEmittedValue &&
      getNextDepthLevel === false &&
      !!this.currentlyIncludingArchive === includeArchived &&
      !this.nextLoadRequireAFullBackendSyncronization
    ) {
      return this.inboxSubject.asObservable()
    }
    if (this.currentlyIncludingArchive === null) {
      this.currentlyIncludingArchive = includeArchived
    } else if (this.currentlyIncludingArchive !== includeArchived) {
      this.currentlyIncludingArchive = includeArchived
      this.currentLevel = 0
      this.lastEmittedValue = null
    }
    // Only allow to get the next level if the first level was already retrieved
    if (getNextDepthLevel && this.lastEmittedValue) {
      this.currentLevel++
    }
    return this.getNotifications(this.currentLevel, includeArchived).pipe(
      tap((data) => {
        if (this.nextLoadRequireAFullBackendSyncronization) {
          this.lastEmittedValue = null
          this.nextLoadRequireAFullBackendSyncronization = false
        }

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
    depthLevel,
    includeArchived
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
        !this.nextLoadRequireAFullBackendSyncronization
          ? // if a complete refresh is not required only load the the new notifications
            runtimeEnvironment.BASE_URL +
              `inbox/notifications.json?firstResult=${
                AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * depthLevel
              }&maxResults=${AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL}&includeArchived=${includeArchived}`
          : // if a complete refresh is required reload all the notification from index 0
            `inbox/notifications.json?firstResult=0&maxResults=${
              AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * depthLevel +
              AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL
            }&includeArchived=${includeArchived}`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  flagAsArchive(
    code: number | string,
    emitUpdate = true
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
      >(runtimeEnvironment.BASE_URL + `inbox/${code}/archive.json`, code, {
        headers: this.headers,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        ),
        tap((data) => {
          this.lastEmittedValue.forEach((value, index) => {
            if (value.putCode === data.putCode) {
              if (this.currentlyIncludingArchive) {
                value.archivedDate = data.archivedDate
                value.readDate = data.readDate
              } else {
                this.lastEmittedValue.splice(index, 1)
                // When one or multiple notifications are archived and deleted from the local list
                // the next load of notifications from the backend will require a complete reload
                // this is because just concatenating newly loaded items would be accurate
                this.nextLoadRequireAFullBackendSyncronization = true
              }
            }
          })
          if (emitUpdate) {
            this.emitUpdate()
          }
        })
      )
  }

  emitUpdate() {
    this.inboxSubject.next(this.lastEmittedValue)
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
      >(runtimeEnvironment.BASE_URL + `inbox/${code}/read.json`, code, {
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

  retrieveUnreadCount(): any {
    return this._http.get(
      runtimeEnvironment.BASE_URL + 'inbox/unreadCount.json'
    )
  }

  totalNumber() {
    return this._http
      .get<TotalNotificationCount>(
        runtimeEnvironment.BASE_URL + `inbox/totalCount.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        map((value) => {
          value.archived = value.all - value.nonArchived
          return value
        }),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
