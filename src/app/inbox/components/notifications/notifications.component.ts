import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import {
  Observable,
  ObjectUnsubscribedError,
  Subscription,
  concat,
  forkJoin,
} from 'rxjs'
import { InboxNotification } from 'src/app/types/notifications.endpoint'
import { InboxService } from 'src/app/core/inbox/inbox.service'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: InboxNotification[]
  form: FormGroup = this._fromBuilder.group({})
  _allCheck = false
  loading = true
  showArchived = true

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
      this.loading = false
      // Remove previous setup change detection
      if (this.changesSubscription) {
        this.changesSubscription.unsubscribe()
      }

      // setup a new notifications checkboxes form
      this.form = this._fromBuilder.group({})
      value.forEach((notification) => {
        this.form.addControl(
          notification.putCode.toString(),
          this._fromBuilder.control(false)
        )
      })
      this.notifications = value
      this.generalCheck = false

      // detect changes on the checkboxes form
      // to check if the general state is indeterminate
      this.changesSubscription = this.form.valueChanges.subscribe(
        (formValue) => {
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
      )
    })
  }

  archivedSelected() {
    const $archiveList = Object.keys(this.form.controls)
      .map((key) => {
        if (this.form.controls[key].value) {
          return this._inbox.archive(parseInt(key, 10))
        }
      })
      .filter((value) => value)
    forkJoin($archiveList).subscribe()
  }

  toggleShowArchived() {
    this.showArchived = !this.showArchived
  }
}
