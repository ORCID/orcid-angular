import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { ModalNameComponent } from './modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from './modals/modal-biography/modal-biography.component'
import { takeUntil, tap } from 'rxjs/operators'
import { of, Subject } from 'rxjs'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { Assertion, UserInfo } from '../../../types'
import { UserStatus } from '../../../types/userStatus.endpoint'
import { RecordEmailsService } from '../../../core/record-emails/record-emails.service'
import { MatDialog } from '@angular/material/dialog'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { isEmpty } from 'lodash'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { ModalEmailComponent } from 'src/app/cdk/side-bar/modals/modal-email/modal-email.component'
import { WINDOW } from 'src/app/cdk/window'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import {
  RegistryNotificationActionEvent,
  RegistryPermissionNotification,
} from '@orcid/registry-ui'
import {
  InboxNotification,
  InboxNotificationPermission,
} from 'src/app/types/notifications.endpoint'
import { first, last, switchMap, takeWhile } from 'rxjs/operators'
import { Router } from '@angular/router'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: [
    './top-bar.component.scss',
    './top-bar.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class TopBarComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() isPublicRecord: string

  userInfo: UserInfo
  userRecord: UserRecord
  userStatus: UserStatus

  modalNameComponent = ModalNameComponent
  modalBiographyComponent = ModalBiographyComponent

  platform: PlatformInfo
  givenNames = ''
  familyName = ''
  creditName = ''
  otherNames = ''
  expandedContent = false
  recordWithIssues: boolean
  justRegistered: boolean
  emailVerified: boolean
  checkEmailValidated: boolean
  inDelegationMode: boolean

  @Input() newlySharedDomains: string[] = []
  @Input() newAddedAffiliation: string
  @Input() loadingUserRecord = true

  regionNames = $localize`:@@topBar.names:Names`
  regionBiography = $localize`:@@topBar.biography:Biography`

  ariaLabelName: string

  permissionPanelTitle = $localize`:@@topBar.permissionNotificationsTitle:Unread permission notifications`
  permissionPanelSubtitle = $localize`:@@topBar.permissionNotificationsSubtitle:You have updates waiting for your review.`
  permissionPanelNotifications: RegistryPermissionNotification[] = []
  private permissionPanelRaw: InboxNotificationPermission[] = []
  private _permissionPanelLoadStarted = false

  constructor(
    private _dialog: MatDialog,
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private _inbox: InboxService,
    private _recordEmails: RecordEmailsService,
    private _verificationEmailModalService: VerificationEmailModalService,
    private _router: Router,
    @Inject(WINDOW) private window: Window
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
        if (this.platform.queryParameters.hasOwnProperty('justRegistered')) {
          this.justRegistered = true
        }

        if (this.platform.queryParameters.hasOwnProperty('emailVerified')) {
          this.emailVerified = true
        }
      })
    _user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.userStatus = data
      })
  }

  openEmailModal() {
    return this._dialog
      .open(ModalEmailComponent, {
        width: '850px',
        maxWidth: '99%',
      })
      .afterClosed()
  }

  goToAffiliations() {
    this.window.document
      .querySelector('#affiliations')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  ngOnInit(): void {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.recordWithIssues = userRecord?.userInfo?.RECORD_WITH_ISSUES
        this.userRecord = userRecord
        this.userInfo = userRecord?.userInfo

        if (!isEmpty(this.userRecord?.names)) {
          this.givenNames = RecordUtil.getGivenNames(this.userRecord)
          this.familyName = RecordUtil.getFamilyName(this.userRecord)
          this.creditName = RecordUtil.getCreditName(this.userRecord)
          this.ariaLabelName = RecordUtil.getAriaLabelName(
            this.userRecord,
            this.ariaLabelName
          )
        }

        if (!isEmpty(this.userRecord.otherNames?.otherNames)) {
          this.otherNames = RecordUtil.getOtherNamesUnique(
            userRecord.otherNames?.otherNames
          )
        }

        // Load permission notifications panel once (only for logged-in private record views)
        if (
          !this.isPublicRecord &&
          !this.recordWithIssues &&
          !this._permissionPanelLoadStarted
        ) {
          this._permissionPanelLoadStarted = true
          this.loadUnreadPermissionNotifications()
        }
      })
  }

  onPermissionPanelAction(event: RegistryNotificationActionEvent) {
    const raw = this.permissionPanelRaw[event.notificationIndex]
    if (!raw) {
      return
    }

    if (event.actionId === 'connect') {
      const target = raw.authorizationUrl?.uri
      this._inbox
        .flagAsRead(raw.putCode)
        .pipe(first())
        .subscribe(() => {
          this.permissionPanelRaw = this.permissionPanelRaw.filter(
            (n) => n.putCode !== raw.putCode
          )
          this.permissionPanelNotifications =
            this.permissionPanelNotifications.filter(
              (_, i) => i !== event.notificationIndex
            )
          if (target) {
            ;(this.window as any).outOfRouterNavigation(target)
          }
        })
      return
    }

    if (event.actionId === 'read') {
      // Open inbox and auto-expand the notification.
      this._router.navigate(['/inbox'], {
        queryParams: { open: raw.putCode },
      })
    }
  }

  private _groupUnreadPermissionByClient(
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

  private loadUnreadPermissionNotifications(): void {
    console.log('[TopBar] loadUnreadPermissionNotifications start')
    this._inbox
      .getUnreadCount()
      .pipe(
        takeUntil(this.$destroy),
        first(),
        switchMap((unreadCount: number | null) => {
          console.log('[TopBar] getUnreadCount →', unreadCount)
          if (unreadCount == null || unreadCount === 0) {
            console.log('[TopBar] no unread, skip notifications.json')
            return of({
              total: 0,
              notifications: [] as InboxNotification[],
              done: true,
            })
          }
          const maxNotificationsToScan = Math.min(50, unreadCount)
          console.log(
            '[TopBar] fetching notification pages (max to scan:',
            maxNotificationsToScan,
            ')'
          )
          return this._inbox.fetchNotificationsIncremental(false).pipe(
            takeWhile(
              (ev: {
                total: number
                notifications: InboxNotification[]
                done: boolean
              }) => {
                const grouped = this._groupUnreadPermissionByClient(
                  ev.notifications
                )
                return (
                  grouped.length < 3 &&
                  !ev.done &&
                  ev.notifications.length < maxNotificationsToScan
                )
              },
              true
            ),
            last()
          )
        })
      )
      .subscribe(
        (ev: {
          total: number
          notifications: InboxNotification[]
          done: boolean
        }) => {
          const grouped = this._groupUnreadPermissionByClient(
            ev?.notifications ?? []
          ).slice(0, 3)
          console.log(
            '[TopBar] permission panel →',
            grouped.length,
            'items (from',
            ev?.notifications?.length ?? 0,
            'notifications)'
          )

          this.permissionPanelRaw = grouped
          this.permissionPanelNotifications = grouped.map((n) => {
            const orgName = n?.source?.sourceName?.content || ''
            const escaped = orgName
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
            const wantsToAddMsg = $localize`:@@topBar.permissionWantsToAdd:wants to add information to your ORCID record`
            return {
              id: n?.source?.sourceClientId?.path,
              icon: 'automation',
              iconColor: 'var(--orcid-color-state-notice-dark, #ff9c00)',
              text: `<strong>${escaped}</strong> ${wantsToAddMsg}`,
              actions: [
                {
                  id: 'read',
                  label: $localize`:@@topBar.permissionRead:Read`,
                  variant: 'text',
                  underline: true,
                },
                {
                  id: 'connect',
                  label: $localize`:@@topBar.permissionConnectNow:Connect now`,
                  variant: 'flat',
                },
              ],
            }
          })
        }
      )
  }

  resendVerificationEmailModal(email: string) {
    this._verificationEmailModalService.openVerificationEmailModal(email)
  }

  collapse(): void {
    this.expandedContent = !this.expandedContent
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
