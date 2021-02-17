import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatInput } from '@angular/material/input'
import { MatSelect } from '@angular/material/select'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil, tap } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import {
  Assertion,
  AssertionVisibilityString,
  EmailsEndpoint,
} from 'src/app/types'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-modal-email',
  templateUrl: './modal-email.component.html',
  styleUrls: [
    './modal-email.component.scss-theme.scss',
    './modal-email.component.scss',
  ],
})
export class ModalEmailComponent implements OnInit {
  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  $destroy: Subject<boolean> = new Subject<boolean>()
  addedEmailsCount = 0
  emailsForm: FormGroup = new FormGroup({})
  emails: AssertionVisibilityString[]
  defaultVisibility: VisibilityStrings
  backendJson: EmailsEndpoint
  isMobile: boolean

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) {
    this._recordEmails
      .getEmails()
      .pipe(
        tap((value) => {
          this.backendJson = cloneDeep(value)
          this.backendJsonToForm(this.backendJson)
          this.emails = this.backendJson.emails
        }),
        first()
      )
      .subscribe()
  }

  tempPrivacyState = 'PUBLIC'
  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )
  }

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }

  deleteEmail(email) {
    console.log(email)
  }

  addEmail() {
    this.emailsForm.addControl(
      'new-' + this.addedEmailsCount,
      new FormGroup({
        email: new FormControl(),
        visibility: new FormControl(this.defaultVisibility, {}),
      })
    )
    this.emails.push({
      putCode: 'new-' + this.addedEmailsCount,
      visibility: this.defaultVisibility,
    } as AssertionVisibilityString)
    console.log(this.emails)
    this.addedEmailsCount++
    this._changeDetectorRef.detectChanges()

    const input = this.inputs.last
    console.log(this.inputs)

    console.log(input)
    input.nativeElement.focus()
  }

  backendJsonToForm(emailEndpointJson: EmailsEndpoint) {
    const emails = emailEndpointJson.emails.map((email) => {
      email.putCode = email.value
      return email
    })
    const group: { [key: string]: FormGroup } = {}

    emails.forEach((email) => {
      group[email.value] = new FormGroup({
        email: new FormControl(email.value, {
          validators: [OrcidValidators.email],
        }),
        visibility: new FormControl(email.visibility, {}),
      })
      group[email.value].valueChanges.subscribe((value) => {
        console.log(value)
      })
    })
    this.emailsForm = new FormGroup(group)
  }

  formToBackendJson(fromGroup: FormGroup) {}

  makePrimary(newPrimaryEmail: AssertionVisibilityString) {
    this.emails.forEach(
      (email) => (email.primary = email.value === newPrimaryEmail.value)
    )
  }

  verifyEmail(newPrimaryEmail: AssertionVisibilityString) {
    this._recordEmails.verifyEmail(newPrimaryEmail.value).pipe(first()).subscribe()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
