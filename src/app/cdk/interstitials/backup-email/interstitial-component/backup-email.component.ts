import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { cloneDeep } from 'lodash'
import { of, Subject } from 'rxjs'
import { catchError, filter, take, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW } from 'src/app/cdk/window/window.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { RecordService } from 'src/app/core/record/record.service'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { AssertionVisibilityString, EmailsEndpoint } from 'src/app/types'
import { EmailCategory } from 'src/app/types/register.email-category'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-backup-email',
  templateUrl: './backup-email.component.html',
  styleUrls: [
    './backup-email.component.scss',
    './backup-email.component.scss-theme.scss',
  ],
  standalone: false,
})
export class BackupEmailComponent implements OnInit, OnDestroy {
  backupEmailPlaceholder = $localize`:@@interstitial.addAnAdditionalEmailAsBackup:Add an additional email as backup`
  saving = false
  submitAttempted = false
  primaryEmail: AssertionVisibilityString
  primaryEmailCategory: EmailCategory
  userEmailsJson: EmailsEndpoint
  form: FormGroup
  $destroy: Subject<void> = new Subject<void>()

  @Output() finish = new EventEmitter<void>()

  constructor(
    public platformInfo: PlatformInfoService,
    private fb: FormBuilder,
    private recordEmailsService: RecordEmailsService,
    private _recordService: RecordService,
    private _registerService: RegisterService,
    private _interstitialObservability: InterstitialObservabilityService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.window.scrollTo(0, 0)
    this._recordService
      .getRecord()
      .pipe(
        filter((record) => !!record?.emails?.emails?.length),
        take(1),
        takeUntil(this.$destroy)
      )
      .subscribe((record) => {
        this.userEmailsJson = record.emails
        // The interstitial only shows when there is a single email, it is the
        // primary one even when the backend has not flagged it as such
        this.primaryEmail =
          this.userEmailsJson.emails.find((email) => email.primary) ||
          this.userEmailsJson.emails[0]
        this.loadPrimaryEmailCategory()

        this.form = this.fb.group({
          backupEmail: new FormControl('', {
            validators: [
              Validators.required,
              this.notOnlyWhitespace(),
              OrcidValidators.email,
              this.notAnEmailAlreadyOnTheRecord(),
            ],
            asyncValidators: [
              this.recordEmailsService.backendEmailValidate(
                this.userEmailsJson.emails
              ),
            ],
            updateOn: 'change',
          }),
        })
      })
  }

  /**
   * The primary email is labelled as professional or personal. When the domain
   * is not categorized the label is left out entirely.
   */
  private loadPrimaryEmailCategory(): void {
    const domain = this.primaryEmail?.value?.split('@')[1]
    if (!domain) {
      return
    }
    this._registerService
      .getEmailCategory(domain)
      .pipe(
        take(1),
        catchError(() => of(null)),
        takeUntil(this.$destroy)
      )
      .subscribe((response) => {
        this.primaryEmailCategory = response?.category
      })
  }

  get backupEmailControl(): AbstractControl {
    return this.form?.get('backupEmail')
  }

  /**
   * The required error is only surfaced once the user submits, the button click
   * itself does not touch or dirty the control.
   */
  get showRequiredError(): boolean {
    return (
      !!this.backupEmailControl?.hasError('required') && this.submitAttempted
    )
  }

  get showInvalidEmailError(): boolean {
    return this.showErrorOnceInteracted('email')
  }

  get showEmailAlreadyInUseError(): boolean {
    return (
      this.showErrorOnceInteracted('backendError') ||
      this.showErrorOnceInteracted('duplicated')
    )
  }

  get hasVisibleError(): boolean {
    return (
      this.showRequiredError ||
      this.showInvalidEmailError ||
      this.showEmailAlreadyInUseError
    )
  }

  /** The errors sit outside mat-form-field, so the link has to be explicit. */
  get visibleErrorId(): string | null {
    if (this.showRequiredError) {
      return 'backup-email-required-error'
    }
    if (this.showInvalidEmailError) {
      return 'backup-email-invalid-error'
    }
    if (this.showEmailAlreadyInUseError) {
      return 'backup-email-in-use-error'
    }
    return null
  }

  private get validationErrorKind(): string | null {
    if (this.showRequiredError) {
      return 'required'
    }
    if (this.showInvalidEmailError) {
      return 'invalid'
    }
    if (this.showEmailAlreadyInUseError) {
      return 'in_use'
    }
    return null
  }

  private showErrorOnceInteracted(error: string): boolean {
    const control = this.backupEmailControl
    return (
      !!control?.hasError(error) && (control.touched || this.submitAttempted)
    )
  }

  private notOnlyWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      control.value && !control.value.trim() ? { required: true } : null
  }

  /**
   * The backend validation ignores the current user, so an address already on
   * this record comes back clean and would be silently dropped on save.
   */
  private notAnEmailAlreadyOnTheRecord(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim().toLowerCase()
      if (!value) {
        return null
      }
      const alreadyOnRecord = this.userEmailsJson?.emails?.some(
        (email) => email.value?.toLowerCase() === value
      )
      return alreadyOnRecord ? { duplicated: true } : null
    }
  }

  addBackupEmail(): void {
    if (this.saving || !this.form) {
      return
    }
    this.submitAttempted = true
    this.form.markAllAsTouched()

    if (this.form.pending) {
      this.form.statusChanges
        .pipe(
          filter((status) => status !== 'PENDING'),
          take(1),
          takeUntil(this.$destroy)
        )
        .subscribe(() => this.saveBackupEmailIfValid())
    } else {
      this.saveBackupEmailIfValid()
    }
  }

  /** Distinct from the save-failure exit, so the two are separable in RUM. */
  declineBackupEmail(): void {
    this._interstitialObservability.dismissed()
    this.finishIntertsitial()
  }

  private saveBackupEmailIfValid(): void {
    if (!this.form.valid) {
      const kind = this.validationErrorKind
      if (kind) {
        this._interstitialObservability.validationError(kind)
      }
      return
    }
    this.saving = true
    const newBackupEmail = this.backupEmailControl.value.trim()
    // The endpoint replaces the whole email set, so existing emails must travel
    // with the new one or they get deleted
    const emailsToSave = cloneDeep(this.userEmailsJson)
    emailsToSave.emails.push({
      value: newBackupEmail,
      visibility: 'PRIVATE',
      primary: false,
    } as AssertionVisibilityString)

    // postEmails replays the cached email list before the reloaded one arrives,
    // so the saved record cannot be inspected here. A rejected address is caught
    // by the validators above and by the backend on write.
    this.recordEmailsService
      .postEmails(emailsToSave)
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe(
        () => {
          this.saving = false
          this._interstitialObservability.backupEmailAdded()
          this.afterSummit(newBackupEmail)
        },
        () => {
          this._interstitialObservability.saveError()
          this.finishIntertsitial()
        }
      )
  }

  /**
   * There is no success state inside the panel, the confirmation is shown as a
   * notice at the top of the record once the interstitial closes.
   */
  afterSummit(email: string) {
    this.finishIntertsitial(email)
  }

  finishIntertsitial(email?: string) {
    this.finish.emit()
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }
}
