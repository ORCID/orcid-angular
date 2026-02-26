import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  catchError,
  first,
  last,
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators'
import { InboxService } from './inbox.service'
import {
  InboxNotification,
  InboxNotificationPermission,
} from '../../types/notifications.endpoint'
import { AccountTrustedOrganizationsService } from '../account-trusted-organizations/account-trusted-organizations.service'

@Injectable({
  providedIn: 'root',
})
export class PermissionNotificationsService {
  constructor(
    private _inbox: InboxService,
    private _trustedOrgs: AccountTrustedOrganizationsService
  ) {}

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
        return this.getTrustedOrgClientIds().pipe(
          switchMap((trustedClientIds) =>
            this._inbox.fetchNotificationsIncremental(false).pipe(
              takeWhile(
                (ev: {
                  total: number
                  notifications: InboxNotification[]
                  done: boolean
                }) => {
                  const grouped = this.groupUnreadPermissionByClient(
                    ev.notifications,
                    trustedClientIds
                  )
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
                this.groupUnreadPermissionByClient(
                  ev?.notifications ?? [],
                  trustedClientIds
                ).slice(0, maxItems)
              )
            )
          )
        )
      })
    )
  }

  private getTrustedOrgClientIds(): Observable<Set<string>> {
    return this._trustedOrgs.get().pipe(
      first(),
      map((orgs) => {
        const ids = (orgs || [])
          .map((o) => o?.clientId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
        return new Set<string>(ids)
      }),
      // If the trusted-orgs call fails, just don’t filter.
      catchError(() => of(new Set<string>()))
    )
  }

  private groupUnreadPermissionByClient(
    notifications: InboxNotification[],
    trustedClientIds: Set<string>
  ): InboxNotificationPermission[] {
    const unreadPermission = (notifications || [])
      .filter(
        (n): n is InboxNotificationPermission =>
          n?.notificationType === 'PERMISSION' && !n.readDate && !n.archivedDate
      )
      .sort(
        (a, b) =>
          new Date(b.createdDate || 0).getTime() -
          new Date(a.createdDate || 0).getTime()
      )
    const byClient = new Map<string, InboxNotificationPermission>()
    for (const n of unreadPermission) {
      const clientId = n?.source?.sourceClientId?.path
      if (!clientId) continue
      if (trustedClientIds?.has(clientId)) continue
      if (!byClient.has(clientId)) byClient.set(clientId, n)
    }
    return Array.from(byClient.values()).sort(
      (a, b) =>
        new Date(b.createdDate || 0).getTime() -
        new Date(a.createdDate || 0).getTime()
    )
  }
}
