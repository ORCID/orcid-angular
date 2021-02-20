import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatInput } from '@angular/material/input'
import { MatSelect } from '@angular/material/select'
import { cloneDeep } from 'lodash'
import { Observable, of, Subject } from 'rxjs'
import { first, map, takeUntil, tap } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { RegisterService } from 'src/app/core/register/register.service'
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
  verificationsSend: string[] = []
  $destroy: Subject<boolean> = new Subject<boolean>()
  addedEmailsCount = 0
  emailsForm: FormGroup = new FormGroup({})
  emails: AssertionVisibilityString[]
  originalEmailsBackendCopy: AssertionVisibilityString[]
  defaultVisibility: VisibilityStrings = 'PRIVATE'
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
          this.originalEmailsBackendCopy = cloneDeep(value).emails
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
    this.emailsForm.statusChanges.subscribe((value) => {
      console.log(this.emailsForm.controls)
    })
  }

  saveEvent() {
    const call = this.formToBackend(this.emailsForm)
    this._recordEmails.postEmails(call).pipe(first()).subscribe()
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }

  deleteEmail(putcode: string) {
    const i = this.emails.findIndex((value) => value.putCode === putcode)
    this.emails.splice(i, 1)
    this.emailsForm.removeControl(putcode)
  }

  addEmail() {
    const newPutCode = 'new-' + this.addedEmailsCount
    this.emailsForm.addControl(
      newPutCode,
      new FormGroup({
        email: new FormControl('', {
          validators: [
            OrcidValidators.email,
            this.allEmailsAreUnique(newPutCode),
          ],
          asyncValidators: [this._recordEmails.backendEmailValidate()],

          updateOn: 'change',
        }),
        visibility: new FormControl('PRIVATE', {}),
      })
    )
    this.emails.push({
      putCode: newPutCode,
      visibility: this.defaultVisibility,
    } as AssertionVisibilityString)
    this.addedEmailsCount++
    this._changeDetectorRef.detectChanges()

    const input = this.inputs.last

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
          validators: [
            OrcidValidators.email,
            this.allEmailsAreUnique(email.value),
          ],
          asyncValidators: [this._recordEmails.backendEmailValidate()],
          updateOn: 'change',
        }),
        visibility: new FormControl(email.visibility, {}),
      })
    })
    this.emailsForm = new FormGroup(group, {
      validators: [],
      updateOn: 'change',
    })
  }

  formToBackend(emailForm: FormGroup): EmailsEndpoint {
    const endpointCall: EmailsEndpoint = {
      errors: [],
      emails: [],
    }

    this.emails
      .map((email) => email.putCode)
      // Clear empty inputs
      .filter((key) => emailForm.value[key].email)
      .forEach((key, i) => {
        const value = emailForm.value[key].email
        const visibility = emailForm.value[key].visibility
        const primary = this.emails[i].primary

        if (emailForm.value[key]) {
          endpointCall.emails.push({
            value,
            visibility,
            primary,
          } as AssertionVisibilityString)
        }
      })
    return endpointCall
  }

  saveEmails(emails: EmailsEndpoint) {}

  makePrimary(newPrimaryEmail: AssertionVisibilityString) {
    this.emails.forEach(
      (email) => (email.primary = email.putCode === newPrimaryEmail.putCode)
    )
    Object.keys(this.emailsForm.controls).forEach((currentControlKey) => {
      ;(this.emailsForm.controls[
        currentControlKey
      ] as FormGroup).controls.email.updateValueAndValidity()
    })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  allEmailsAreUnique(putCode): ValidatorFn {
    return (control: AbstractControl) => {
      const formGroup = this.emailsForm
      const emailsWithErrorPutCodes: string[] = []

      if (this.emails) {
        // Add errors error on duplicated emails
        Object.keys(formGroup.controls).forEach((emailPutCodeX) => {
          const emailControlX = (formGroup.controls[emailPutCodeX] as FormGroup)
            .controls['email']
          Object.keys(formGroup.controls).forEach((emailPutCodeY) => {
            const emailControlY = (formGroup.controls[
              emailPutCodeY
            ] as FormGroup).controls['email']

            // Only if both controls are not empty
            if (emailControlX.value && emailControlY.value) {
              const emailYCompleteObject = this.emails.find(
                (email) => email.putCode === emailPutCodeY
              )

              if (
                emailControlX.value === emailControlY.value &&
                !emailYCompleteObject.primary &&
                emailPutCodeX !== emailPutCodeY
              ) {
                //  emailControlY.setErrors({ duplicated: true })
                emailsWithErrorPutCodes.push(emailPutCodeY)
              }
            }
          })
        })
      }
      Object.keys(this.emailsForm.controls).forEach((currentControlKey) => {
        const otherEmailControl = (this.emailsForm.controls[
          currentControlKey
        ] as FormGroup).controls.email as FormControl
        if (
          emailsWithErrorPutCodes.indexOf(currentControlKey) == -1 &&
          otherEmailControl.errors &&
          otherEmailControl.errors['duplicated']
        ) {
          delete otherEmailControl.errors['duplicated']
          otherEmailControl.updateValueAndValidity({ onlySelf: true })
        } else {
          otherEmailControl.setErrors({
            duplicated: true,
          })
        }
      })

      // if (emailsWithErrorPutCodes.indexOf(putCode) >= 0) {
      //   return {
      //     duplicated: true,
      //   }
      // }

      return {}
    }
  }

  verifyEmail(email: AssertionVisibilityString) {
    const formValue = this.emailsForm.value[email.putCode]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )

    this._recordEmails
      .verifyEmail(realEmailBackendContext.value)
      .pipe(first())
      .subscribe(() => {
        this.verificationsSend.push(realEmailBackendContext.value)
      })
  }

  showNonVerifiedData(email: AssertionVisibilityString): boolean {
    const formValue = this.emailsForm.value[email.putCode]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )
    return realEmailBackendContext && !realEmailBackendContext.verified
  }

  verificationEmailWasSend(email: AssertionVisibilityString) {
    const formValue = this.emailsForm.value[email.putCode]?.email
    return this.verificationsSend.indexOf(formValue) > -1
  }

  showEmailAsVerified(email: AssertionVisibilityString): boolean {
    const formValue = this.emailsForm.value[email.putCode]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )
    return realEmailBackendContext?.verified
  }
}
