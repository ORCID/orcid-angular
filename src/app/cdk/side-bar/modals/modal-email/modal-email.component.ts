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
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, take, takeUntil, tap } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import {
  AssertionVisibilityString,
  EmailsEndpoint,
  UserInfo,
} from 'src/app/types'
import {
  VisibilityStrings,
  VisibilityWeightMap,
} from 'src/app/types/common.endpoint'
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
  ariaLabelSaveOld = $localize`:@@side-bar.ariaLabelEmailSave:Save changes to Emails`
  ariaLabelSave = $localize`:@@side-bar.ariaLabelEmailAndDomainsSave:Save changes to Emails & domains`
  ariaLabelNotificationsAreSentToEmail = $localize`:@@side-bar.notificationsAreSentToEmail:Notifications are sent to`
  ariaLabelCancelOld = $localize`:@@side-bar.ariaLabelEmailCancel:Cancel changes and close Emails`
  ariaLabelCancel = $localize`:@@side-bar.ariaLabelEmailAndDomainsCancel:Cancel changes and close Emails & domains`
  ariaLabelDelete = $localize`:@@side-bar.ariaLabelEmailDelete:Delete Email`
  ariaLabelClose = $localize`:@@side-bar.ariaLabelEmailAndDomainsClose:Close Emails & domains`
  ariaLabelCloseOld = $localize`:@@side-bar.ariaLabelEmailClose:Close Emails`
  ariaLabelEmailAddress = $localize`:@@side-bar.emailAddress:Email address`
  ariaLabelNewEmailAddress = $localize`:@@side-bar.newEmailAddress:New email address`
  ariaLabelOtherEmailAddresses = $localize`:@@side-bar.otherEmails:Other email addresses`
  ariaLabelVisibilityPrimaryEmailPublic = $localize`:@@side-bar.ariaLabelPrimaryEmailPublic:Set primary email visibility to Everyone`
  ariaLabelVisibilityPrimaryEmailTrustedParty = $localize`:@@side-bar.ariaLabelPrimaryEmailTrustedParties:Set primary email visibility to Trusted Parties`
  ariaLabelVisibilityPrimaryEmailPrivate = $localize`:@@side-bar.ariaLabelPrimaryEmailPrivate:Set primary email visibility to Only Me`
  ariaLabelVisibilityOtherEmailPublic = $localize`:@@side-bar.ariaLabelOtherEmailPublic:Set other email visibility to Everyone`
  ariaLabelVisibilityOtherEmailTrustedParty = $localize`:@@side-bar.ariaLabelOtherEmailTrustedParties:Set other email visibility to Trusted Parties`
  ariaLabelVisibilityOtherEmailPrivate = $localize`:@@side-bar.ariaLabelOtherEmailPrivate:Set other email visibility to Only Me`
  ariaLabelVisibilityEmailPublic = $localize`:@@side-bar.ariaLabelEmailPublic:Set email visibility to Everyone`
  ariaLabelVisibilityEmailTrustedParty = $localize`:@@side-bar.ariaLabelEmailTrustedParties:Set email visibility to Trusted Parties`
  ariaLabelVisibilityEmailPrivate = $localize`:@@side-bar.ariaLabelEmailPrivate:Set email visibility to Only Me`
  ariaLabelVisibilityDomainPublic = $localize`:@@side-bar.ariaLabelDomainVisibilityPublic:Set domain visibility to Everyone`
  ariaLabelVisibilityDomainTrustedParty = $localize`:@@side-bar.ariaLabelDomainVisibilityTrustedParties:Set domain visibility to Trusted Parties`
  ariaLabelVisibilityDomainPrivate = $localize`:@@side-bar.ariaLabelDomainVisibilityPrivate:Set domain visibility to Only Me`
  ariaOpenAccountSettings = $localize`:@@side-bar.ariaOpenAccountSettings:Open your ORCID account settings`
  selfAssertedSource = $localize`:@@record.selfAssertedSource:Self-asserted source`
  deleteTooltip = $localize`:@@side-bar.deleteTooltip:You can't delete the only email address in your account`
  visibilityTooltip = $localize`:@@side-bar.visibilityTooltip:Visibility set to Only me`
  orcidEmailValidation = $localize`:@@side-bar.orcidEmailValidation:ORCID email validation`

  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  verificationsSend: string[] = []
  $destroy: Subject<boolean> = new Subject<boolean>()
  addedEmailsCount = 0
  emailsForm: UntypedFormGroup = new UntypedFormGroup({})
  emails: AssertionVisibilityString[] = []
  verifiedDomains: AssertionVisibilityString[] = []
  primaryEmail: AssertionVisibilityString | undefined = undefined
  originalEmailsBackendCopy: AssertionVisibilityString[]
  defaultVisibility: VisibilityStrings = 'PRIVATE'
  loadingTogglz = false
  emailDomainsTogglz = false
  disableVisibilities: { [domainPutcode: string]: VisibilityStrings[] } = {}

  isMobile: boolean
  userInfo: UserInfo

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _snackBar: SnackbarService,
    private _userInfo: UserInfoService,
    private _togglz: TogglzService
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

    this._togglz
      .getStateOf('EMAIL_DOMAINS_UI')
      .pipe(take(1))
      .subscribe((value) => {
        this.loadingTogglz = false
        this.emailDomainsTogglz = value
      })
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
    emailEndpointJson.emailDomains?.map((domain) => {
      this.addEmailDomain(domain)
    })

    this.subscribeToVisibilityChanges()
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
  ): [AssertionVisibilityString[], AssertionVisibilityString[]] {
    const allEmails = []
    const domains = []

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

    this.verifiedDomains
      .map((domain) => domain.putCode)
      .forEach((key) => {
        const value = emailForm.value[key].emailDomain
        const visibility = emailForm.value[key].visibility

        if (value && visibility) {
          domains.push({
            value,
            visibility,
          } as AssertionVisibilityString)
        }
      })

    return [allEmails, domains]
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
      const emailEntry: AssertionVisibilityString = {
        putCode: newPutCode,
        action: existingEmail ? 'UPDATE' : 'ADD',
        ...existingEmail,
      }
      this.emails.push(emailEntry)

      if (existingEmail && emailEntry.primary) {
        this.primaryEmail = emailEntry
      }

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
            existingEmail && existingEmail.verified
              ? existingEmail.visibility
              : this.defaultVisibility,
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

  addEmailDomain(emailDomain: AssertionVisibilityString): void {
    emailDomain.putCode = 'domain-' + emailDomain.value
    this.verifiedDomains.push(emailDomain)
    this.emailsForm.addControl(
      emailDomain.putCode,
      new UntypedFormGroup({
        emailDomain: new UntypedFormControl(emailDomain.value),
        visibility: new UntypedFormControl(emailDomain.visibility),
      })
    )
    this.disableDomainVisibilities(emailDomain.value)
  }

  /**
   * Mark email as primary, and trigger a validation check on every other email control
   * @param newPrimaryEmail: the email to make primary
   */
  makePrimary(newPrimaryEmail: AssertionVisibilityString): void {
    this.primaryEmail = newPrimaryEmail
    this.emails.forEach(
      (email) => (email.primary = email.putCode === newPrimaryEmail.putCode)
    )
    this.triggerGeneralFormValidation()
  }

  setNextEmailAsPrimary() {
    let emails = this.emails.filter((email) => email.verified)
    // If there are no verified emails left, set any next email as primary
    // we're counting the one being deleted
    if (emails.length <= 1) {
      emails = this.emails
    }
    const currentIndex = emails.findIndex(
      (value) => value.putCode === this.primaryEmail.putCode
    )
    const nextIndex = (currentIndex + 1) % emails.length
    const nextEmail = emails[nextIndex]
    this.makePrimary(nextEmail)
  }

  private triggerGeneralFormValidation() {
    Object.keys(this.emailsForm.controls).forEach((currentControlKey) => {
      if (!currentControlKey.startsWith('domain-')) {
        ;(
          this.emailsForm.controls[currentControlKey] as UntypedFormGroup
        ).controls.email.updateValueAndValidity()
      }
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
      if (!currentControlKey.startsWith('domain-')) {
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
        .controls['email']?.value
      emailControlX = emailControlX?.toLowerCase().trim()

      Object.keys(formGroup.controls).forEach((keyY) => {
        let emailControlY: string = (
          formGroup.controls[keyY] as UntypedFormGroup
        ).controls['email']?.value
        emailControlY = emailControlY?.toLowerCase().trim()

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
      const [emails, emailDomains] = this.formToBackend(
        this.emailsForm,
        this.emails
      )
      this._recordEmails
        .postEmails({
          emails,
          emailDomains,
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
    if (!this.hasOneEmailAddress(controlKey)) {
      if (controlKey === this.primaryEmail?.putCode) {
        this.setNextEmailAsPrimary()
      }
      const i = this.emails.findIndex((value) => value.putCode === controlKey)
      const domain =
        this.emails[i].value && this.emails[i].value.includes('@')
          ? this.emails[i].value.split('@')[1]
          : null
      this.emails.splice(i, 1)
      this.emailsForm.removeControl(controlKey)

      if (domain) {
        let domains = this.generateSubdomains(domain)
        let remainingEmailsHaveDomain = this.hasMatchingEmail(domains)
        if (!remainingEmailsHaveDomain) {
          this.verifiedDomains = this.verifiedDomains.filter(
            (d) => !domains.includes(d.value)
          )
          this.emailsForm.removeControl('domain-' + domain)
        } else {
          this.updateDomainVisibility(domain)
        }
      }
    }
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

  private subscribeToVisibilityChanges(): void {
    this.emails.forEach((email) => {
      if (email.verified && email.putCode.startsWith('emailInput')) {
        const control = this.emailsForm.get(email.putCode)
        const domain = email.value.split('@')[1]
        if (control) {
          control
            .get('visibility')
            .valueChanges.pipe(takeUntil(this.$destroy))
            .subscribe(() =>
              // timeout is used because the subscription
              // gets triggered before the form is updated
              // https://github.com/angular/angular/issues/13129
              setTimeout(() => this.updateDomainVisibility(domain))
            )
        }
      }
    })
  }

  private updateDomainVisibility(domain: string): void {
    const visibilities: VisibilityStrings[] = []
    const domainControl = this.emailsForm.controls['domain-' + domain]

    if (domainControl) {
      Object.keys(this.emailsForm.controls).forEach((controlKey) => {
        if (controlKey.startsWith('emailInput')) {
          const control = this.emailsForm.get(controlKey).value

          if (
            control.email.split('@')[1].endsWith('.' + domain) ||
            control.email.split('@')[1] === domain
          ) {
            visibilities.push(control.visibility)
          }
        }
      })

      const mostPermissiveVisibility =
        this.getMostPermissiveVisibility(visibilities)
      const domainVisibility = domainControl.get('visibility').value

      if (
        VisibilityWeightMap[domainVisibility] <
        VisibilityWeightMap[mostPermissiveVisibility]
      ) {
        this.emailsForm.patchValue({
          ['domain-' + domain]: {
            visibility: mostPermissiveVisibility,
          },
        })
      }
      this.disableDomainVisibilities(domain, visibilities)
      this._changeDetectorRef.detectChanges()
    }
  }

  disableDomainVisibilities(
    domain: string,
    visibilities: VisibilityStrings[] = []
  ): void {
    if (visibilities.length === 0) {
      Object.keys(this.emailsForm.controls).forEach((controlKey) => {
        if (controlKey.startsWith('emailInput')) {
          const control = this.emailsForm.get(controlKey)
          if (
            control.value.email.split('@')[1].endsWith('.' + domain) ||
            control.value.email.split('@')[1] === domain
          ) {
            if (this.isEmailVerified(control.value.email)) {
              visibilities.push(control.value.visibility)
            }
          }
        }
      })
    }
    const mostPermissiveVisibility =
      this.getMostPermissiveVisibility(visibilities)

    this.disableVisibilities[`domain-${domain}`] =
      this.generateDisabledVisibilitiesMap(mostPermissiveVisibility)
  }

  private generateDisabledVisibilitiesMap(mostPermissiveVisibility) {
    return Object.keys(VisibilityWeightMap).filter(
      (visibility) =>
        VisibilityWeightMap[visibility] <
        VisibilityWeightMap[mostPermissiveVisibility]
    ) as VisibilityStrings[]
  }

  private isEmailVerified(emailToCheck: String) {
    let isVerified = false
    this.emails.forEach((email) => {
      if (email.value === emailToCheck) {
        isVerified = email.verified
      }
    })
    return isVerified
  }

  private getMostPermissiveVisibility(
    visibilities: VisibilityStrings[]
  ): VisibilityStrings {
    return visibilities.reduce((most, current) =>
      VisibilityWeightMap[current] > VisibilityWeightMap[most] ? current : most
    )
  }

  private getLeastPermissiveVisibility(
    visibilities: VisibilityStrings[]
  ): VisibilityStrings {
    return visibilities.reduce((least, current) =>
      VisibilityWeightMap[current] < VisibilityWeightMap[least]
        ? current
        : least
    )
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

  hasOneEmailAddress(controlKey = ''): boolean {
    if (controlKey.startsWith('new')) {
      return false
    }
    return (
      this.emails.filter((email) => !email.putCode.startsWith('newEmailInput'))
        .length === 1
    )
  }

  hasVerifiedEmailAddress(): boolean {
    return this.emails.some((email) => email.verified)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  private hasMatchingEmail(domains: string[]): boolean {
    return domains.some((domain) =>
      this.emails.some(
        (email) =>
          email?.verified &&
          (email.value.split('@')[1] === domain ||
            email.value.split('@')[1].endsWith('.' + domain))
      )
    )
  }

  private generateSubdomains(fullDomain: string): string[] {
    const parts = fullDomain.split('.')
    const subdomains = []
    for (let i = 0; i < parts.length - 1; i++) {
      subdomains.push(parts.slice(i).join('.'))
    }
    return subdomains
  }
}
