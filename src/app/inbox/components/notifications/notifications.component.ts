import { Component, OnInit } from '@angular/core'
import { Subscription, forkJoin } from 'rxjs'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  archiveNotifications: InboxNotification[]
  notifications: InboxNotification[]
  form: FormGroup = this._fromBuilder.group({})
  _allCheck = false
  loading = true
  showArchived = true
  moreNotificationsMightExist = false

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
    private _fromBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this._fromBuilder.group({})
    this.loading = true
    this._inbox.get().subscribe((value) => {
      // get retrieved values
      this.loading = false
      this.notifications = value
      this.archiveNotifications = this.notifications.filter(
        (notification) => notification.archivedDate
      )

      // Remove previous setup change listener (if exist)
      if (this.changesSubscription) {
        this.changesSubscription.unsubscribe()
      }

      // setup a new notifications checkboxes form
      this.form = this.setUpCheckboxForm(value)
      this.generalCheck = false

      // detect changes on the checkboxes form
      this.changesSubscription = this.form.valueChanges.subscribe((formValue) =>
        this.listenFormChanges(formValue)
      )

      // check if there might be more notifications
      this.moreNotificationsMightExist = this._inbox.mightHaveMoreNotifications()
    })
  }

  archivedSelected() {
    const $archiveList = Object.keys(this.form.controls)
      .map((key) => {
        if (this.form.controls[key].value) {
          return this._inbox.flagAsArchive(parseInt(key, 10))
        }
      })
      .filter((value) => value)
    forkJoin($archiveList).subscribe()
  }

  toggleShowArchived() {
    this.showArchived = !this.showArchived
  }

  showMore() {
    // subscribe and take only one value without any action
    // allowing the previous subscription on ngOnInit to handle the data
    this.loading = true
    this._inbox
      .get(true)
      .pipe(first())
      .subscribe(() => {
        this.loading = false
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
}
