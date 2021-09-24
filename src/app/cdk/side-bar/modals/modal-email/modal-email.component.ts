import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil, tap } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import {
  AssertionVisibilityString,
  EmailsActions,
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
  preserveWhitespaces: true,
})
export class ModalEmailComponent implements OnInit, OnDestroy {
  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  verificationsSend: string[] = []
  $destroy: Subject<boolean> = new Subject<boolean>()
  addedEmailsCount = 0
  emailsForm: FormGroup = new FormGroup({})
  emailsActions: EmailsActions[] = []
  emailsDelete: EmailsActions[] = []
  emailPrimary: EmailsActions
  originalEmailsBackendCopy: AssertionVisibilityString[]
  defaultVisibility: VisibilityStrings = 'PRIVATE'

  isMobile: boolean

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _snackBar: SnackbarService
  ) {}

  tempPrivacyState = 'PUBLIC'
  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )

    this._recordEmails
      .getEmails()
      .pipe(
        tap((value) => {
          this.originalEmailsBackendCopy = cloneDeep(value).emails
          this.backendJsonToForm(cloneDeep(value))
        }),
        first()
      )
      .subscribe()
  }

  /**
   * Creates the emails form based on backend data
   * @param emailEndpointJson: backend data

   */
  backendJsonToForm(emailEndpointJson: EmailsEndpoint): void {
    // Create an empty form
    const group: { [key: string]: FormGroup } = {}
    this.emailsForm = new FormGroup(group, {
      validators: [],
      updateOn: 'change',
    })

    emailEndpointJson.emails.map((email) => {
      this.addEmail(email)
    })
  }

  /**
   * Transform the FormGroup data into backend data
   * @param emailForm: The emails FormGroup
   * @param  emails: The local Object data based on the backend JSON structure
   * @returns A JSON build for the backend
   */

  private formToBackend(
    emailForm: FormGroup,
    emailsActions: EmailsActions[]
  ): EmailsActions[] {
    const allEmails = [] as EmailsActions[]

    emailsActions
      .map((e) => e.email.putCode)
      // Clear empty inputs
      .filter((key) => emailForm.value[key].email)
      .forEach((key, i) => {
        const value = emailForm.value[key].email
        const visibility = emailForm.value[key].visibility
        const primary = emailsActions[i].email.primary

        if (emailForm.value[key]) {
          allEmails.push({
            email: {
              value,
              visibility,
              primary,
            },
            action: emailsActions[i].action,
          })
        }
      })
    return allEmails
  }

  /**
   * Handle adding an email to the form.
   * This can be either with a existingEmail (with backend data)
   * or a new empty email input
   * @param  existingEmail: use when adding an email that already exists on the backend
   */
  addEmail(existingEmail?: AssertionVisibilityString): void {
    const newPutCode = 'emailInput-' + this.addedEmailsCount

    // Add email to the emails list
    // backend response come with no email putCode, so here we create one to be able to track those on the frontend
    this.emailsActions.push({
      email: {
        putCode: newPutCode,
        ...existingEmail,
      },
      action: existingEmail ? 'UPDATE' : 'ADD',
    })

    // Add a new control to the formGroup
    this.emailsForm.addControl(
      newPutCode,
      new FormGroup({
        email: new FormControl(existingEmail ? existingEmail.value : '', {
          validators: [
            Validators.required,
            OrcidValidators.email,
            this.allEmailsAreUnique(newPutCode),
          ],
          asyncValidators: [
            this._recordEmails.backendEmailValidate(
              this.originalEmailsBackendCopy
            ),
          ],

          updateOn: 'change',
        }),
        visibility: new FormControl(
          existingEmail ? existingEmail.visibility : this.defaultVisibility,
          {
            validators: [this.emailsIsUnverified(newPutCode)],
          }
        ),
      })
    )

    this.addedEmailsCount++
    if (!existingEmail) {
      this._changeDetectorRef.detectChanges()
      const input = this.inputs.last
      input.nativeElement.focus()
    }
  }

  /**
   * Mark email as primary, and trigger a validation check on every other email control
   * @param newPrimaryEmail: the email to make primary
   */
  makePrimary(newPrimaryEmail: AssertionVisibilityString): void {
    this.emailsActions.forEach(
      (ea) => (ea.email.primary = ea.email.putCode === newPrimaryEmail.putCode)
    )
    this.emailPrimary = {
      email: this.emailsActions.find(
        (value) => value.email.putCode === newPrimaryEmail.putCode
      ).email,
      action: 'PRIMARY',
    }
    this.triggerGeneralFormValidation()
  }

  private triggerGeneralFormValidation() {
    Object.keys(this.emailsForm.controls).forEach((currentControlKey) => {
      ;(this.emailsForm.controls[
        currentControlKey
      ] as FormGroup).controls.email.updateValueAndValidity()
    })
  }

  /**
   * Validator function factory that checks if the current control key is duplicated
   * at the same time remove errors from controls that are not duplicate but are marked as duplicated
   *
   * @param controlKey  key to validate and mark as valid or with 'duplicate' error.
   *
   * @returns return a validator function
   */
  allEmailsAreUnique(controlKey): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = this.emailsForm
      const formGroupKeysWithDuplicatedValues: string[] = this.listDuplicateInputKeys(
        formGroup
      )
      this.removeDuplicateErrorFromOtherControls(
        formGroupKeysWithDuplicatedValues,
        this.emailsForm
      )
      if (formGroupKeysWithDuplicatedValues.indexOf(controlKey) >= 0) {
        return {
          duplicated: true,
        }
      }
      return {}
    }
  }

  emailsIsUnverified(controlKey): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        control.value !== 'PRIVATE' &&
        !this.showEmailAsVerified(controlKey)
      ) {
        return {
          unverified: true,
        }
      }
      return {}
    }
  }

  /**
   * Remove `duplicated` error on controls that are not listed on the list
   * @param formGroupKeysWithDuplicatedValues: List of controls with duplicated emails
   */
  private removeDuplicateErrorFromOtherControls(
    formGroupKeysWithDuplicatedValues: string[],
    emailsForm: FormGroup = new FormGroup({})
  ): void {
    Object.keys(emailsForm.controls).forEach((currentControlKey) => {
      const otherEmailControl = (emailsForm.controls[
        currentControlKey
      ] as FormGroup).controls.email as FormControl
      if (
        formGroupKeysWithDuplicatedValues.indexOf(currentControlKey) === -1 &&
        otherEmailControl.errors &&
        otherEmailControl.errors['duplicated']
      ) {
        delete otherEmailControl.errors['duplicated']
        otherEmailControl.updateValueAndValidity({ onlySelf: true })
      }
    })
  }

  /**
   * Check all the controls on the form, to find duplicated values.
   * This check will not report the primary emails as duplicated.
   *
   * @param formGroup: FormGroup with controls to check
   * @param emails: Emails list to check when an email is primary
   * @returns a list of control keys with duplicated emails
   */

  private listDuplicateInputKeys(formGroup: FormGroup) {
    const formGroupKeysWithDuplicatedValues: string[] = []

    // Add errors error on duplicated emails
    Object.keys(formGroup.controls).forEach((keyX) => {
      const emailControlX = (formGroup.controls[keyX] as FormGroup).controls[
        'email'
      ]
      Object.keys(formGroup.controls).forEach((keyY) => {
        const emailControlY = (formGroup.controls[keyY] as FormGroup).controls[
          'email'
        ]

        // Only if both controls are not empty
        if (emailControlX.value && emailControlY.value) {
          if (emailControlX.value === emailControlY.value && keyX !== keyY) {
            formGroupKeysWithDuplicatedValues.push(keyY)
          }
        }
      })
    })

    return formGroupKeysWithDuplicatedValues
  }

  verifyEmail(email: AssertionVisibilityString) {
    const formValue = this.emailsForm.value[email.putCode]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (emailJson) => emailJson.value === formValue
    )

    this._recordEmails
      .verifyEmail(realEmailBackendContext.value)
      .pipe(first())
      .subscribe(() => {
        this.verificationsSend.push(realEmailBackendContext.value)
      })
  }

  saveEvent() {
    if (this.emailsForm.valid) {
      const data = this.formToBackend(this.emailsForm, this.emailsActions)
      if (this.emailsDelete.length > 0) {
        this.emailsDelete.forEach((emailDelete) => {
          this._recordEmails.delete(emailDelete.email).pipe(first()).subscribe()
        })
      }
      if (this.emailPrimary) {
        this._recordEmails
          .setAsPrimaryEmail(this.emailPrimary.email)
          .pipe(first())
          .subscribe()
      }
      const emailNewPrimary = data.filter(
        (emailActions) => emailActions.email.primary
      )[0].email
      const emailOldPrimary = this.emailsActions.filter(
        (emailActions) => emailActions.email.primary
      )[0].email
      const otherNames = {
        emails: data
          .filter((emailActions) => !emailActions.email.primary)
          .map((emailActions) => emailActions.email),
        errors: [],
      }
      if (emailNewPrimary.value !== emailOldPrimary.value) {
        this._recordEmails
          .editEmail(emailOldPrimary.value, emailNewPrimary.value)
          .pipe(first())
          .subscribe()
      }
      if (emailNewPrimary.visibility !== emailOldPrimary.visibility) {
        this._recordEmails.visibility(emailNewPrimary).pipe(first()).subscribe()
      }

      if (otherNames.emails.length > 0) {
        this._recordEmails
          .postEmails({ emails: otherNames.emails, errors: [] })
          .pipe(first())
          .subscribe()
      }
      this.closeEvent()
    } else {
      this._snackBar.showValidationError()
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  deleteEmail(controlKey: string) {
    this.emailsDelete.push({
      email: this.emailsActions.find(
        (value) => value.email.putCode === controlKey
      ).email,
      action: 'DELETE',
    })
    this.emailsActions = this.emailsActions.filter(
      (value) => value.email.putCode !== controlKey
    )
    this.emailsForm.removeControl(controlKey)
  }

  showNonVerifiedData(controlKey: string, otherEmail?: boolean): boolean {
    const formValue = this.emailsForm.value[controlKey]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )

    if (
      formValue &&
      !(this.verificationsSend.indexOf(formValue) > -1) &&
      otherEmail &&
      this.originalEmailsBackendCopy.find((email) => email.value === formValue)
        ?.primary
    ) {
      return false
    }

    return realEmailBackendContext && !realEmailBackendContext.verified
  }

  showVisibility(controlKey: string, action?: string): boolean {
    const formValue = this.emailsForm.value[controlKey]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )
    const result = !!realEmailBackendContext

    if (result && realEmailBackendContext.primary) {
      return false
    }

    if (!result && action === 'UPDATE') {
      this.emailsForm.patchValue({
        [controlKey]: {
          visibility: 'PRIVATE',
        },
      })
    }
    return result
  }

  verificationEmailWasSend(controlKey: string) {
    const formValue = this.emailsForm.value[controlKey]?.email
    return this.verificationsSend.indexOf(formValue) > -1
  }

  showEmailAsVerified(controlKey: string): boolean {
    const formValue = this.emailsForm.value[controlKey]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )
    return realEmailBackendContext?.verified
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
