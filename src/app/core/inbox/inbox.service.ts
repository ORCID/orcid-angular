import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, ReplaySubject, of, range } from 'rxjs'
import {
  catchError,
  concatMap,
  finalize,
  first,
  map,
  retry,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators'
import { AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL } from '../../constants'
import { ERROR_REPORT } from '../../errors'

import {
  InboxNotificationItem,
  TotalNotificationCount,
} from '../../types/notifications.endpoint'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { InboxCacheService } from './inbox-cache.service'

declare const runtimeEnvironment: { BASE_URL: string }

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private nextLoadRequireAFullBackendSyncronization = false
  private currentlyIncludingArchive = false
  private currentLevel = 0
  private headers: HttpHeaders

  private _unreadCountSubject = new BehaviorSubject<number | null>(null)
  public readonly unreadCount$: Observable<number | null> =
    this._unreadCountSubject.asObservable()

  private inboxSubject = new ReplaySubject<InboxNotificationItem[]>(1)
  lastEmittedValue: InboxNotificationItem[] | null = null

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _cache: InboxCacheService
  ) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    })
  }

  get(
    getNextDepthLevel = false,
    includeArchived = false
  ): Observable<InboxNotificationItem[]> {
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
      this._cache.clearNotificationsPage('includeArchived changed')
    }
    if (getNextDepthLevel && this.lastEmittedValue) {
      this.currentLevel++
    }
    return this.getNotifications(this.currentLevel, includeArchived).pipe(
      tap((data) => {
        if (this.nextLoadRequireAFullBackendSyncronization) {
          this.lastEmittedValue = null
          this.nextLoadRequireAFullBackendSyncronization = false
        }
        this.lastEmittedValue = this.lastEmittedValue
          ? this.lastEmittedValue.concat(data)
          : data
        if (this.lastEmittedValue) {
          this.inboxSubject.next(this.lastEmittedValue)
        }
      }),
      switchMap(() => this.inboxSubject.asObservable())
    )
  }

  private getNotifications(
    depthLevel: number,
    includeArchived: boolean
  ): Observable<InboxNotificationItem[]> {
    if (!this.nextLoadRequireAFullBackendSyncronization) {
      return this.fetchNotificationsPage(depthLevel, includeArchived)
    }

    this._cache.clearNotificationsPage('full backend synchronization')
    this._cache.clearTotalCount('full backend synchronization')
    const maxResults =
      AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * depthLevel +
      AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL
    const url = `inbox/notifications.json?firstResult=0&maxResults=${maxResults}&includeArchived=${includeArchived}`

    return this._http
      .get<InboxNotificationItem[]>(url, { headers: this.headers })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        )
      )
  }

  /**
   * Fetch a notifications page (cached per includeArchived+depthLevel).
   */
  fetchNotificationsPage(
    depthLevel = 0,
    includeArchived = false
  ): Observable<InboxNotificationItem[]> {
    const cacheKey = this._cache.notificationsPageKey(
      depthLevel,
      includeArchived
    )
    const cached = this._cache.getNotificationsPage(cacheKey)
    if (cached) return cached

    const firstResult = AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL * depthLevel
    const url =
      runtimeEnvironment.BASE_URL +
      `inbox/notifications.json?firstResult=${firstResult}&maxResults=${AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL}&includeArchived=${includeArchived}`

    const req$ = this._http
      .get<InboxNotificationItem[]>(url, { headers: this.headers })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        ),
        shareReplay(1)
      )

    this._cache.setNotificationsPage(cacheKey, req$)
    return req$
  }

  /**
   * Emits after each page so callers can stop early (e.g. once enough items are found).
   * Unsubscribing stops further requests. Does not mutate cached inbox state.
   */
  fetchNotificationsIncremental(includeArchived = false): Observable<{
    total: number
    notifications: InboxNotificationItem[]
    done: boolean
  }> {
    return this.totalNumber({ skipUnreadRefresh: true }).pipe(
      switchMap((totalCount) => {
        const target = includeArchived ? totalCount.all : totalCount.nonArchived
        if (!target) {
          return of({ total: 0, notifications: [], done: true })
        }
        const pageCount = Math.ceil(
          target / AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL
        )
        return range(0, pageCount).pipe(
          concatMap((depth) =>
            this.fetchNotificationsPage(depth, includeArchived)
          ),
          scan((acc, page) => acc.concat(page), [] as InboxNotificationItem[]),
          map((notifications) => ({
            total: target,
            notifications,
            done: notifications.length >= target,
          }))
        )
      })
    )
  }

  flagAsArchive(
    code: number | string,
    emitUpdate = true
  ): Observable<InboxNotificationItem> {
    const key = `${code}:${emitUpdate ? 'emit' : 'noemit'}`
    const inFlight = this._cache.getFlagAsArchiveInFlight(key)
    if (inFlight) return inFlight

    const existing = this.lastEmittedValue?.find(
      (n) =>
        `${n.putCode}` === `${code}` &&
        !!(n as { archivedDate?: number }).archivedDate
    )
    if (existing) return of(existing)

    const url = `inbox/${code}/archive.json`
    const req$ = this._http
      .post<InboxNotificationItem>(url, JSON.stringify(code), {
        headers: this.headers.set('Content-Type', 'application/json'),
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) =>
          this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
        ),
        tap((data) => {
          if (!this.lastEmittedValue) return
          this.lastEmittedValue.forEach((value, index) => {
            if (value.putCode === data.putCode) {
              if (this.currentlyIncludingArchive) {
                value.archivedDate = data.archivedDate
                value.readDate = data.readDate
              } else {
                this.lastEmittedValue?.splice(index, 1)
                this.nextLoadRequireAFullBackendSyncronization = true
              }
            }
          })
          this._cache.clearNotificationsPage('flagAsArchive')
          this._cache.clearTotalCount('flagAsArchive')
          if (emitUpdate) this.emitUpdate()
        }),
        finalize(() => this._cache.deleteFlagAsArchiveInFlight(key)),
        shareReplay(1)
      )

    this._cache.setFlagAsArchiveInFlight(key, req$)
    return req$
  }

  emitUpdate() {
    if (this.lastEmittedValue) {
      this.inboxSubject.next(this.lastEmittedValue)
    }
  }

  flagAsRead(code: number | string): Observable<InboxNotificationItem> {
    const key = `${code}`
    const inFlight = this._cache.getFlagAsReadInFlight(key)
    if (inFlight) return inFlight

    const existing = this.lastEmittedValue?.find(
      (n) =>
        `${n.putCode}` === `${code}` && !!(n as { readDate?: number }).readDate
    )
    if (existing) return of(existing)

    const url = `inbox/${code}/read.json`
    const req$ = this._http
      .post<InboxNotificationItem>(url, JSON.stringify(code), {
        headers: this.headers.set('Content-Type', 'application/json'),
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap((data) => {
          if (this.lastEmittedValue) {
            this.lastEmittedValue.forEach((value) => {
              if (value.putCode === data.putCode) {
                value.readDate = data.readDate
              }
            })
            this.inboxSubject.next(this.lastEmittedValue)
          }
          this._cache.clearNotificationsPage('flagAsRead')
        }),
        finalize(() => this._cache.deleteFlagAsReadInFlight(key)),
        shareReplay(1)
      )

    this._cache.setFlagAsReadInFlight(key, req$)
    return req$
  }

  private _fetchAndUpdateUnreadCount(): Observable<number | null> {
    const url = `${runtimeEnvironment.BASE_URL}inbox/unreadCount.json`
    if (this._cache.isUnreadCountValid() && this._cache.getUnreadCount()) {
      return this._cache.getUnreadCount()!
    }

    const req$ = this._http
      .get<number>(url, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((resp) => {
          // If the server bounced us to /login, treat as “not logged in”
          const count = resp.url?.includes('/login') ? null : resp.body ?? null
          return count
        }),
        tap((count) => {
          if (count !== null) {
            this._unreadCountSubject.next(count)
          }
        }),
        catchError((err) => {
          this._cache.clearUnreadCount()
          return of(null)
        }),
        shareReplay(1)
      )

    this._cache.setUnreadCount(req$)
    return req$
  }

  /**
   * Calling retrieveUnreadCount() will:
   * 1) Kick off a fresh HTTP GET to inbox/unreadCount.json
   * 2) Push that result into _unreadCountSubject
   * 3) Return the “hot” Observable from _unreadCountSubject, so that ANY future changes are pass through
   */
  /**
   * One-shot GET of inbox/unreadCount.json. Returns the number of unread notifications (or null if not logged in / error).
   * Also updates unreadCount$ for other subscribers.
   */
  getUnreadCount(): Observable<number | null> {
    return this._fetchAndUpdateUnreadCount().pipe(first())
  }

  retrieveUnreadCount(): Observable<number | null> {
    this._fetchAndUpdateUnreadCount().subscribe()
    return this.unreadCount$
  }

  /**
   * Returns Observable<TotalNotificationCount>.
   * By default also triggers a fresh fetch of unreadCount.json so that unreadCount$ subscribers are updated.
   * Pass { skipUnreadRefresh: true } when the caller already has unread count (e.g. permission panel flow).
   */
  totalNumber(options?: {
    skipUnreadRefresh?: boolean
    skipCache?: boolean
  }): Observable<TotalNotificationCount> {
    const url = runtimeEnvironment.BASE_URL + 'inbox/totalCount.json'

    if (
      !options?.skipCache &&
      this._cache.isTotalCountValid() &&
      this._cache.getTotalCount()
    ) {
      return this._cache.getTotalCount()!
    }

    const req$ = this._http
      .get<TotalNotificationCount>(url, { headers: this.headers })
      .pipe(
        retry(3),
        map((value) => {
          value.archived = value.all - value.nonArchived
          return value
        }),
        tap(() => {
          if (!options?.skipUnreadRefresh) {
            this._fetchAndUpdateUnreadCount().subscribe()
          }
        }),
        catchError((error) => this._errorHandler.handleError(error)),
        shareReplay(1)
      )

    if (!options?.skipCache) {
      this._cache.setTotalCount(req$)
    }

    return req$
  }
}
