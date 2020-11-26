import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { forkJoin, Subject, Subscription } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import {
  InboxNotification,
  TotalNotificationCount,
} from 'src/app/types/notifications.endpoint'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  preserveWhitespaces: true,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: InboxNotification[]
  $destroy: Subject<boolean> = new Subject<boolean>()
  form: FormGroup = this._fromBuilder.group({})
  _allCheck = false
  loading = true
  showArchived = false
  totalNotifications: TotalNotificationCount

  indeterminate = false
  changesSubscription: Subscription

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
    private _fromBuilder: FormBuilder,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
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
        this.generalCheck = false

        // detect changes on the checkboxes form
        this.changesSubscription = this.form.valueChanges.subscribe(
          (formValue) => this.listenFormChanges(formValue)
        )

        this._inbox.totalNumber().subscribe((data) => {
          this.totalNotifications = data
          if (this.autoLoadMoreNotificationsIfRequired()) {
            this.showMore()
          } else {
            this.loading = false
          }
        })
      })
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
    this.loading = true
    const notificationsToArchived = Object.keys(this.form.controls).filter(
      (key) => this.form.controls[key].value
    )
    const $archiveList = notificationsToArchived
      .map((key, index) => {
        // Only emit changes when all the queue has been archived
        const emitUpdate = index + 1 === notificationsToArchived.length
        return this._inbox.flagAsArchive(parseInt(key, 10), emitUpdate)
      })
      .filter((value) => value)
    forkJoin($archiveList).subscribe()
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
  setUpCheckboxForm(value) {
    const checkBoxForm = this._fromBuilder.group({})
    value.forEach((notification) => {
      checkBoxForm.addControl(
        notification.putCode.toString(),
        this._fromBuilder.control(false)
      )
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
