import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { first, last, map, switchMap, takeWhile } from 'rxjs/operators'
import { InboxService } from './inbox.service'
import {
  InboxNotification,
  InboxNotificationPermission,
} from '../../types/notifications.endpoint'

@Injectable({
  providedIn: 'root',
})
export class PermissionNotificationsService {
  constructor(private _inbox: InboxService) {}

  /**
   * Load unread permission notifications, one per client (deduplicated by source client),
   * up to maxItems. Fetches incrementally and stops once enough are found.
   */
  loadUnreadPermissionNotifications(
    maxItems = 3,
    maxToScan = 50
  ): Observable<InboxNotificationPermission[]> {
    return this._inbox.getUnreadCount().pipe(
      first(),
      switchMap((unreadCount: number | null) => {
        if (unreadCount == null || unreadCount === 0) {
          return of([])
        }
        const limit = Math.min(maxToScan, unreadCount)
        return this._inbox.fetchNotificationsIncremental(false).pipe(
          takeWhile(
            (ev: {
              total: number
              notifications: InboxNotification[]
              done: boolean
            }) => {
              const grouped = this.groupUnreadPermissionByClient(ev.notifications)
              return (
                grouped.length < maxItems &&
                !ev.done &&
                ev.notifications.length < limit
              )
            },
            true
          ),
          last(),
          map((ev: { notifications: InboxNotification[] }) =>
            this.groupUnreadPermissionByClient(ev?.notifications ?? []).slice(
              0,
              maxItems
            )
          )
        )
      })
    )
  }

  private groupUnreadPermissionByClient(
    notifications: InboxNotification[]
  ): InboxNotificationPermission[] {
    const unreadPermission = (notifications || [])
      .filter(
        (n): n is InboxNotificationPermission =>
          n?.notificationType === 'PERMISSION' && !n.readDate && !n.archivedDate
      )
      .sort((a, b) => Number(b.sentDate || 0) - Number(a.sentDate || 0))
    const byClient = new Map<string, InboxNotificationPermission>()
    for (const n of unreadPermission) {
      const clientId = n?.source?.sourceClientId?.path
      if (!clientId) continue
      if (!byClient.has(clientId)) byClient.set(clientId, n)
    }
    return Array.from(byClient.values()).sort(
      (a, b) => Number(b.sentDate || 0) - Number(a.sentDate || 0)
    )
  }
}
