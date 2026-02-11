import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { first, takeUntil, tap } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import {
  InboxNotification,
  TotalNotificationCount,
} from 'src/app/types/notifications.endpoint'
import { ActivatedRoute } from '@angular/router'
import { NotificationComponent } from '../notification/notification.component'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class NotificationsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  notifications: InboxNotification[]
  $destroy: Subject<boolean> = new Subject<boolean>()
  form: UntypedFormGroup = this._fromBuilder.group({})
  _allCheck = false
  loading = true
  showArchived = false
  totalNotifications: TotalNotificationCount

  indeterminate = false
  changesSubscription: Subscription
  amountOfSelectableItems: number
  private openPutCodeFromUrl: number | null = null

  @ViewChildren(NotificationComponent)
  notificationComponents: QueryList<NotificationComponent>

  set generalCheck(value: boolean) {
    this._allCheck = value
    // set all the checkbox on the form to the same value
    const allCheckboxValue = {}
    Object.keys(this.form.controls).forEach(
      (key) => (allCheckboxValue[key] = value)
    )
    this.indeterminate = false
    this.form.setValue(allCheckboxValue, { emitEvent: false, onlySelf: true })
  }
  get generalCheck(): boolean {
    return this._allCheck
  }

  constructor(
    private _inbox: InboxService,
    private _fromBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.openPutCodeFromUrl = this.getPutCodeFromUrl()
    this.form = this._fromBuilder.group({})
    this.loading = true
    this._inbox
      .get(false)
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        // get retrieved values

        this.notifications = value

        // Remove previous setup change listener (if exist)
        if (this.changesSubscription) {
          this.changesSubscription.unsubscribe()
        }

        // setup a new notifications checkboxes form
        this.form = this.setUpCheckboxForm(value)
        this.amountOfSelectableItems = Object.keys(this.form.controls).length
        this.generalCheck = false

        // detect changes on the checkboxes form
        this.changesSubscription = this.form.valueChanges.subscribe(
          (formValue) => this.listenFormChanges(formValue)
        )
        this._inbox.totalNumber().subscribe((data) => {
          this.totalNotifications = data
          if (this.autoLoadMoreNotificationsIfRequired()) {
            this._inbox.get(false).pipe(first()).subscribe()
          } else {
            this.loading = false
          }
          this.tryOpenNotificationFromUrl()
        })
      })
  }

  ngAfterViewInit(): void {
    // When the view is ready, try opening again (ViewChildren becomes available)
    this.tryOpenNotificationFromUrl()
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  autoLoadMoreNotificationsIfRequired() {
    if (
      this.notifications.length === 0 &&
      !this.showArchived &&
      this.totalNotifications.nonArchived > 0
    ) {
      return true
    }
  }

  archivedSelected() {
    if (!this.loading) {
      const notificationsToArchived = Object.keys(this.form.controls).filter(
        (key) => this.form.controls[key].value
      )
      const $archiveList = notificationsToArchived
        .map((key, index) => {
          return this._inbox
            .flagAsArchive(parseInt(key, 10), false)
            .pipe(first())
        })
        .filter((value) => value)
      if ($archiveList.length) {
        this.loading = true
        forkJoin($archiveList)
          .pipe(tap(() => this._inbox.emitUpdate()))
          .subscribe()
      }
    }
  }

  toggleShowArchived() {
    this.showArchived = !this.showArchived
    this.loading = true
    this._inbox
      .get(true, this.showArchived)
      .pipe(first())
      .subscribe(() => {
        this.loading = false
      })
  }

  showMore() {
    // subscribe and take only one value without any action
    // allowing the previous subscription on ngOnInit to handle the data
    this.loading = true
    this._inbox.get(true, this.showArchived).pipe(first()).subscribe()
  }

  private getPutCodeFromUrl(): number | null {
    const qp =
      this._route.snapshot.queryParamMap.get('open') ||
      this._route.snapshot.queryParamMap.get('notification')
    if (qp) {
      const asNum = parseInt(qp, 10)
      return Number.isFinite(asNum) ? asNum : null
    }

    const fragment = this._route.snapshot.fragment
    if (fragment?.startsWith('notification-')) {
      const maybe = parseInt(fragment.replace('notification-', ''), 10)
      return Number.isFinite(maybe) ? maybe : null
    }

    return null
  }

  private tryOpenNotificationFromUrl(): void {
    if (!this.openPutCodeFromUrl || !this.notifications?.length) {
      return
    }

    const target = this.openPutCodeFromUrl
    const exists = this.notifications.some((n) => n.putCode === target)

    if (!exists && this.hasMoreNotificationsToLoad()) {
      // Keep loading pages until we find the requested putCode or run out.
      this._inbox.get(true, this.showArchived).pipe(first()).subscribe(() => {
        this.tryOpenNotificationFromUrl()
      })
      return
    }

    // Scroll + open once the component instances exist.
    setTimeout(() => {
      const el = this.window.document.getElementById(`notification-${target}`)
      if (el) {
        // `scrollIntoView` can land the anchor too low depending on fixed headers/layout.
        // Scroll to 20px above the element instead.
        const offsetPx = 50
        const y =
          el.getBoundingClientRect().top + (this.window.scrollY || 0) - offsetPx
        this.window.scrollTo({
          top: Math.max(0, y),
          behavior: 'smooth',
        })
      }

      const cmp = this.notificationComponents
        ?.toArray()
        ?.find((c) => c.notification?.putCode === target)

      if (cmp && !cmp.showNotificationContent) {
        cmp.toggleNotificationContent()
        // Only attempt to auto-open once.
        this.openPutCodeFromUrl = null
      }
    })
  }

  // Use to check if the general checkbox is on indeterminate stated
  listenFormChanges(formValue) {
    this.indeterminate = false
    let allState = null
    Object.keys(formValue).forEach((key) => {
      if (allState === null) {
        allState = formValue[key]
      } else if (allState !== formValue[key]) {
        this.indeterminate = true
      }
    })
    // update the general state if it becomes undefined
    if (!this.indeterminate) {
      this.generalCheck = allState
    }
  }

  // Create a control for each notification using the putcode as key
  // tslint:disable-next-line: max-line-length
  setUpCheckboxForm(value) {
    const checkBoxForm = this._fromBuilder.group({})
    value.forEach((notification) => {
      if (!notification.archivedDate) {
        checkBoxForm.addControl(
          notification.putCode.toString(),
          this._fromBuilder.control(false)
        )
      }
    })
    return checkBoxForm
  }

  isAnEmptyInbox() {
    return this.notifications && this.notifications.length === 0
  }

  navigateTo(url) {
    ;(this.window as any).outOfRouterNavigation(url)
  }

  hasMoreNotificationsToLoad() {
    return (
      (this.showArchived
        ? this.totalNotifications?.all
        : this.totalNotifications?.nonArchived) > this.notifications.length
    )
  }
}
