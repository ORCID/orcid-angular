import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
  InboxNotificationItem,
  TotalNotificationCount,
} from '../../types/notifications.endpoint'

/**
 * Holds cache state and in-flight request deduplication for the inbox.
 * Separates cache/TTL and dedupe logic from InboxService for readability and testability.
 */
@Injectable({
  providedIn: 'root',
})
export class InboxCacheService {
  readonly totalCountTtlMs = 30_000
  readonly unreadCountTtlMs = 10_000

  private _totalCountAt = 0
  private _totalCount$: Observable<TotalNotificationCount> | null = null

  private _unreadCountAt = 0
  private _unreadCount$: Observable<number | null> | null = null

  private _notificationsPage = new Map<string, Observable<InboxNotificationItem[]>>()
  private _flagAsReadInFlight = new Map<string, Observable<InboxNotificationItem>>()
  private _flagAsArchiveInFlight = new Map<
    string,
    Observable<InboxNotificationItem>
  >()

  // --- Total count cache ---

  isTotalCountValid(): boolean {
    return (
      this._totalCount$ !== null &&
      Date.now() - this._totalCountAt < this.totalCountTtlMs
    )
  }

  getTotalCount(): Observable<TotalNotificationCount> | null {
    return this._totalCount$
  }

  setTotalCount(obs: Observable<TotalNotificationCount>): void {
    this._totalCountAt = Date.now()
    this._totalCount$ = obs
  }

  clearTotalCount(_reason: string): void {
    if (this._totalCount$) {
      this._totalCount$ = null
      this._totalCountAt = 0
    }
  }

  // --- Unread count cache ---

  isUnreadCountValid(): boolean {
    return (
      this._unreadCount$ !== null &&
      Date.now() - this._unreadCountAt < this.unreadCountTtlMs
    )
  }

  getUnreadCount(): Observable<number | null> | null {
    return this._unreadCount$
  }

  setUnreadCount(obs: Observable<number | null>): void {
    this._unreadCountAt = Date.now()
    this._unreadCount$ = obs
  }

  clearUnreadCount(): void {
    if (this._unreadCount$) {
      this._unreadCount$ = null
      this._unreadCountAt = 0
    }
  }

  // --- Notifications page cache ---

  notificationsPageKey(depthLevel: number, includeArchived: boolean): string {
    return `${includeArchived ? 'archived' : 'nonArchived'}:${depthLevel}`
  }

  getNotificationsPage(key: string): Observable<InboxNotificationItem[]> | undefined {
    return this._notificationsPage.get(key)
  }

  setNotificationsPage(key: string, obs: Observable<InboxNotificationItem[]>): void {
    this._notificationsPage.set(key, obs)
  }

  clearNotificationsPage(_reason: string): void {
    if (this._notificationsPage.size > 0) {
      this._notificationsPage.clear()
    }
  }

  // --- In-flight deduplication (flag-as-read / flag-as-archive) ---

  getFlagAsReadInFlight(key: string): Observable<InboxNotificationItem> | undefined {
    return this._flagAsReadInFlight.get(key)
  }

  setFlagAsReadInFlight(key: string, obs: Observable<InboxNotificationItem>): void {
    this._flagAsReadInFlight.set(key, obs)
  }

  deleteFlagAsReadInFlight(key: string): void {
    this._flagAsReadInFlight.delete(key)
  }

  getFlagAsArchiveInFlight(
    key: string
  ): Observable<InboxNotificationItem> | undefined {
    return this._flagAsArchiveInFlight.get(key)
  }

  setFlagAsArchiveInFlight(
    key: string,
    obs: Observable<InboxNotificationItem>
  ): void {
    this._flagAsArchiveInFlight.set(key, obs)
  }

  deleteFlagAsArchiveInFlight(key: string): void {
    this._flagAsArchiveInFlight.delete(key)
  }

  /** Clear all caches (e.g. on full backend sync). */
  clearAll(reason: string): void {
    this.clearTotalCount(reason)
    this.clearUnreadCount()
    this.clearNotificationsPage(reason)
  }
}
