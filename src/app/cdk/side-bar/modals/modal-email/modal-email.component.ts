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
  UntypedFormControl,
  UntypedFormGroup,
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
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import {
  AssertionVisibilityString,
  EmailsEndpoint,
  UserInfo,
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
  ariaLabelKnowledgeBase = $localize`:@@side-bar.ariaLabelOrcidTermsOfUseBase:ORCID knowledge base (Opens in a new tab)`
  ariaLabelKnowledgeSupport = $localize`:@@side-bar.ariaLabelOrcidTermsSupport:ORCID support page (Opens in a new tab)`
  ariaLabelOrcidTermsOfUseLink = $localize`:@@side-bar.ariaLabelOrcidTermsOfUseLink:ORCID terms of use (Opens in a new tab)`
  ariaLabelSave = $localize`:@@side-bar.ariaLabelEmailSave:Save changes to Emails`
  ariaLabelCancel = $localize`:@@side-bar.ariaLabelEmailCancel:Cancel changes and close Emails`
  ariaLabelDelete = $localize`:@@side-bar.ariaLabelEmailDelete:Delete Email`
  ariaLabelClose = $localize`:@@side-bar.ariaLabelEmailClose:Close Emails`
  ariaLabelEmail = $localize`:@@side-bar.ariaLabelEmail:Emails`
  ariaLabelVisibilityPrimaryEmailPublic = $localize`:@@side-bar.ariaLabelPrimaryEmailPublic:Set primary email visibility to Everyone`
  ariaLabelVisibilityPrimaryEmailTrustedParty = $localize`:@@side-bar.ariaLabelPrimaryEmailTrustedParties:Set primary email visibility to Trusted Parties`
  ariaLabelVisibilityPrimaryEmailPrivate = $localize`:@@side-bar.ariaLabelPrimaryEmailPrivate:Set primary email visibility to Only Me`
  ariaLabelVisibilityOtherEmailPublic = $localize`:@@side-bar.ariaLabelOtherEmailPublic:Set other email visibility to Everyone`
  ariaLabelVisibilityOtherEmailTrustedParty = $localize`:@@side-bar.ariaLabelOtherEmailTrustedParties:Set other email visibility to Trusted Parties`
  ariaLabelVisibilityOtherEmailPrivate = $localize`:@@side-bar.ariaLabelOtherEmailPrivate:Set other email visibility to Only Me`

  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  verificationsSend: string[] = []
  $destroy: Subject<boolean> = new Subject<boolean>()
  addedEmailsCount = 0
  emailsForm: UntypedFormGroup = new UntypedFormGroup({})
  emails: AssertionVisibilityString[] = []
  originalEmailsBackendCopy: AssertionVisibilityString[]
  defaultVisibility: VisibilityStrings = 'PRIVATE'

  isMobile: boolean
  userInfo: UserInfo

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _snackBar: SnackbarService,
    private _userInfo: UserInfoService
  ) {}

  tempPrivacyState = 'PUBLIC'
  ngOnInit(): void {
    this._userInfo.getUserInfo().subscribe((config) => {
      this.userInfo = config
    })
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
    const group: { [key: string]: UntypedFormGroup } = {}
    this.emailsForm = new UntypedFormGroup(group, {
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
    emailForm: UntypedFormGroup,
    emails: AssertionVisibilityString[]
  ): AssertionVisibilityString[] {
    const allEmails = []

    emails
      .map((email) => email.putCode)
      // Clear empty inputs
      .filter((key) => emailForm.value[key].email)
      .forEach((key, i) => {
        const value = emailForm.value[key].email
        const visibility = emailForm.value[key].visibility
        const primary = emails[i].primary

        if (emailForm.value[key]) {
          allEmails.push({
            value,
            visibility,
            primary,
          } as AssertionVisibilityString)
        }
      })
    return allEmails
  }

  /**
   * Handle adding an email to the form.
   * This can be either with a existingEmail (with backend data)
   * or a new empty email input
   * @param  existingEmail: use when adding an email that already exists on the backend
   * @param  newEmail: use when user is adding an new email
   */
  addEmail(
    existingEmail?: AssertionVisibilityString,
    newEmail?: boolean
  ): void {
    if (existingEmail || (newEmail && this.emailsForm.valid)) {
      const newPutCode =
        (newEmail ? 'newEmailInput' : 'emailInput-') + this.addedEmailsCount

      // Add email to the emails list
      // backend response come with no email putCode, so here we create one to be able to track those on the frontend
      this.emails.push({
        putCode: newPutCode,
        action: existingEmail ? 'UPDATE' : 'ADD',
        ...existingEmail,
      } as AssertionVisibilityString)

      // Add a new control to the formGroup
      this.emailsForm.addControl(
        newPutCode,
        new UntypedFormGroup({
          email: new UntypedFormControl(
            existingEmail ? existingEmail.value : '',
            {
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
            }
          ),
          visibility: new UntypedFormControl(
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
    } else {
      this._snackBar.showValidationError(
        $localize`:@@shared.pleaseReview:Please review and fix the issue`
      )
    }
  }

  /**
   * Mark email as primary, and trigger a validation check on every other email control
   * @param newPrimaryEmail: the email to make primary
   */
  makePrimary(newPrimaryEmail: AssertionVisibilityString): void {
    this.emails.forEach(
      (email) => (email.primary = email.putCode === newPrimaryEmail.putCode)
    )
    this.triggerGeneralFormValidation()
  }

  private triggerGeneralFormValidation() {
    Object.keys(this.emailsForm.controls).forEach((currentControlKey) => {
      ;(
        this.emailsForm.controls[currentControlKey] as UntypedFormGroup
      ).controls.email.updateValueAndValidity()
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
      const formGroupKeysWithDuplicatedValues: string[] =
        this.listDuplicateInputKeys(formGroup)
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
    emailsForm: UntypedFormGroup = new UntypedFormGroup({})
  ): void {
    Object.keys(emailsForm.controls).forEach((currentControlKey) => {
      const otherEmailControl = (
        emailsForm.controls[currentControlKey] as UntypedFormGroup
      ).controls.email as UntypedFormControl
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

  private listDuplicateInputKeys(formGroup: UntypedFormGroup) {
    const formGroupKeysWithDuplicatedValues: string[] = []

    // Add errors error on duplicated emails
    Object.keys(formGroup.controls).forEach((keyX) => {
      let emailControlX: string = (formGroup.controls[keyX] as UntypedFormGroup)
        .controls['email'].value
      emailControlX = emailControlX.toLowerCase().trim()

      Object.keys(formGroup.controls).forEach((keyY) => {
        let emailControlY: string = (
          formGroup.controls[keyY] as UntypedFormGroup
        ).controls['email'].value
        emailControlY = emailControlY.toLowerCase().trim()

        // Only if both controls are not empty
        if (emailControlX && emailControlY) {
          if (emailControlX === emailControlY && keyX !== keyY) {
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
      const data = this.formToBackend(this.emailsForm, this.emails)
      this._recordEmails
        .postEmails({
          emails: data,
          errors: [],
        })
        .pipe(first())
        .subscribe()
      this.closeEvent()
    } else {
      this._snackBar.showValidationError()
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  deleteEmail(controlKey: string) {
    const i = this.emails.findIndex((value) => value.putCode === controlKey)
    this.emails.splice(i, 1)
    this.emailsForm.removeControl(controlKey)
  }

  showNonVerifiedData(controlKey: string, otherEmail?: boolean): boolean {
    if (controlKey.startsWith('new')) {
      return false
    }
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
    if (controlKey.startsWith('new')) {
      return false
    }
    const formValue = this.emailsForm.value[controlKey]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )
    const result = !!realEmailBackendContext

    if (
      result &&
      realEmailBackendContext.primary &&
      this.emailsForm.hasError('duplicated', [controlKey, 'email'])
    ) {
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
    if (controlKey.startsWith('new')) {
      return false
    }
    const formValue = this.emailsForm.value[controlKey]?.email
    return this.verificationsSend.indexOf(formValue) > -1
  }

  showEmailAsVerified(controlKey: string): boolean {
    if (controlKey.startsWith('new')) {
      return false
    }
    const formValue = this.emailsForm.value[controlKey]?.email
    const realEmailBackendContext = this.originalEmailsBackendCopy.find(
      (email) => email.value === formValue
    )

    const result = realEmailBackendContext?.verified

    if (
      result &&
      realEmailBackendContext.primary &&
      this.emailsForm.hasError('duplicated', [controlKey, 'email'])
    ) {
      return false
    }

    return result
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
