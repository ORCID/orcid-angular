import {
  Component,
  EventEmitter,
  inject,
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
import { UserService } from 'src/app/core'
import { InterstitialObservabilityService } from 'src/app/core/login-interstitials-manager/interstitial-observability.service'
import { AppEventName } from 'src/app/rum/app-event-names'
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

  /**
   * The OAuth flow renders this component inline and then sends the user
   * straight on to the client, so the "added" notice at the top of the record
   * is never seen. The confirmation below is that missing surface. The dialog
   * subclass overrides afterSummit() and keeps relying on the record notice.
   */
  afterSummitStatus = false
  addedBackupEmail: string
  /** Client the user is authorizing, for "Continue to <client>". */
  organizationName: string

  @Output() finish = new EventEmitter<void>()

  // Injected as fields so the dialog subclass only declares what is genuinely
  // its own (MAT_DIALOG_DATA, MatDialogRef) instead of restating every
  // dependency this component happens to have
  public platformInfo = inject(PlatformInfoService)
  private fb = inject(FormBuilder)
  private recordEmailsService = inject(RecordEmailsService)
  private _recordService = inject(RecordService)
  private _registerService = inject(RegisterService)
  private _interstitialObservability = inject(InterstitialObservabilityService)
  private _userService = inject(UserService)
  private window = inject(WINDOW) as Window

  ngOnInit() {
    this.window.scrollTo(0, 0)
    this.loadOrganizationName()
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
   * Only set on the OAuth flow; the sign in flow has no oauthSession, so the
   * confirmation button falls back to a generic label.
   */
  private loadOrganizationName(): void {
    this._userService
      .getUserSession()
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe((session) => {
        this.organizationName = session?.oauthSession?.clientName
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

  /**
   * The one description of an error: which control errors produce it, the id
   * the input points at, and the kind reported to RUM. Order is display
   * priority. Adding an error means one row here, not five members.
   *
   * `required` is submit-only: blurring an untouched empty field must not
   * accuse the user of anything before they try to continue.
   */
  private static readonly ERRORS = [
    {
      kind: 'required',
      keys: ['required'],
      id: 'backup-email-required-error',
      onSubmitOnly: true,
    },
    { kind: 'invalid', keys: ['email'], id: 'backup-email-invalid-error' },
    {
      kind: 'in_use',
      keys: ['backendError', 'duplicated'],
      id: 'backup-email-in-use-error',
    },
  ]

  get backupEmailControl(): AbstractControl {
    return this.form?.get('backupEmail')
  }

  /** The errors sit outside mat-form-field, so the link has to be explicit. */
  get visibleErrorId(): string | null {
    return this.visibleError?.id ?? null
  }

  get hasVisibleError(): boolean {
    return !!this.visibleError
  }

  /** Template hook: `*ngIf="isErrorVisible('required')"`. */
  isErrorVisible(kind: string): boolean {
    const control = this.backupEmailControl
    const error = BackupEmailComponent.ERRORS.find((e) => e.kind === kind)
    if (!control || !error) {
      return false
    }
    const interacted = error.onSubmitOnly
      ? this.submitAttempted
      : control.touched
    return interacted && error.keys.some((key) => control.hasError(key))
  }

  private get visibleError(): (typeof BackupEmailComponent.ERRORS)[number] {
    return BackupEmailComponent.ERRORS.find((e) => this.isErrorVisible(e.kind))
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
    this._interstitialObservability.outcome(AppEventName.InterstitialDismissed)
    this.finishIntertsitial()
  }

  private saveBackupEmailIfValid(): void {
    if (!this.form.valid) {
      const kind = this.visibleError?.kind
      if (kind) {
        this._interstitialObservability.outcome(
          AppEventName.InterstitialValidationError,
          { validationErrorKind: kind, formValid: false }
        )
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
          this._interstitialObservability.outcome(
            AppEventName.InterstitialCompleted
          )
          this.saving = false
          this.afterSummit(newBackupEmail)
        },
        () => {
          this._interstitialObservability.outcome(
            AppEventName.InterstitialSaveError
          )
          this.finishIntertsitial()
        }
      )
  }

  /**
   * Swap the form for the confirmation. Overridden by the dialog subclass,
   * which closes instead and lets the record show its own notice.
   */
  afterSummit(email?: string) {
    this.addedBackupEmail = email
    this.afterSummitStatus = true
    this.window.scrollTo(0, 0)
  }

  /**
   * Ends the interstitial. The dialog subclass overrides this to hand `email`
   * back as the dialog result.
   */
  finishIntertsitial(email?: string) {
    this.saving = false
    this.finish.emit()
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }
}
