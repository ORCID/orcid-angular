import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { of, throwError } from 'rxjs'
import { switchMap, take, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { AccountActionsDuplicatedService } from 'src/app/core/account-actions-duplicated/account-actions-duplicated.service'
import { UserSession } from 'src/app/types/session.local'

import {
  AUTH_CHALLENGE_HEADING_ID,
  AuthChallengeComponent,
} from '@orcid/registry-ui'
import { AuthChallengeFormData } from '../../../types/common.endpoint'
import { DuplicateRemoveEndpoint } from '../../../types/account-actions-duplicated'
import { ErrorStateMatcherForTwoFactorFields } from '../../../sign-in/ErrorStateMatcherForTwoFactorFields'
import { ErrorStateMatcher } from '@angular/material/core'
import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'
export class NeverShowErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return false
  }
}
@Component({
  selector: 'app-settings-actions-duplicated',
  templateUrl: './settings-actions-duplicated.component.html',
  styleUrls: [
    './settings-actions-duplicated.component.scss',
    './settings-actions-duplicated.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class SettingsActionsDuplicatedComponent implements OnInit, OnDestroy {
  errorMatcher = new NeverShowErrorMatcher()
  userSession: UserSession
  constructor(
    private _duplicateService: AccountActionsDuplicatedService,
    private _form: UntypedFormBuilder,
    private _dialog: MatDialog,
    private _user: UserService,
    private _recoveryPhoneChallenge: RecoveryPhoneChallengeService
  ) {}
  @Output() loading = new EventEmitter<boolean>()
  @Output() close = new EventEmitter<void>()

  authChallengeLeadingText = $localize`:@@accountSettings.security.password.authChallengeLeadingText:for`
  authChallengeTrailingText = $localize`:@@accountSettings.security.password.authChallengeDuplicationTrailingText:to continue removing a duplicate account`

  form: UntypedFormGroup
  errors: any[]
  showBadRecoveryCode = false
  showBadVerificationCode = false
  show2FA = true
  authenticated = false
  loadingVerify = false
  cancelAuthentication = false
  success = false
  orcidToDeprecate = ''
  orcid = ''
  data: DuplicateRemoveEndpoint
  baseUrl = runtimeEnvironment.BASE_URL

  ngOnInit(): void {
    this.form = this._form.group({
      deprecatingOrcidOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
      twoFactorRecoveryPhoneCode: [
        null,
        [Validators.minLength(6), Validators.maxLength(6)],
      ],
    })
    this._user
      .getUserSession()
      .pipe(take(1))
      .subscribe((userSession) => {
        this.userSession = userSession
        this.orcid = userSession.userInfo.EFFECTIVE_USER_ORCID
      })
  }

  openAuthChallenge(orcidOrEmail: string) {
    // A challenge answered with a recovery phone number code has already left
    // 2FA off (R5.3), so the deprecation below runs exactly as it does for a
    // challenge that was passed the ordinary way.
    const recoveryPhone = this._recoveryPhoneChallenge.create()
    const dialogRef = this._dialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        ariaLabelledBy: AUTH_CHALLENGE_HEADING_ID,
        data: {
          ...({
            parentForm: this.form,
            showPasswordField: false,
            // Collected on the panel behind the dialog, so the challenge has
            // to be told which control holds the account password.
            passwordControlName: 'password',
            actionDescription: this.authChallengeLeadingText,
            boldText: orcidOrEmail,
            trailingText: this.authChallengeTrailingText,
          } as AuthChallengeFormData),
          recoveryPhone,
        },
      }
    )

    dialogRef.componentInstance.submitAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        this._duplicateService.validateDeprecation(this.form.value).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.orcidToDeprecate = response.deprecatingOrcid
              this.data = response
              dialogRef.close(true)
            } else {
              dialogRef.componentInstance.loading = false
              dialogRef.componentInstance.processBackendResponse(response)
            }
          },
        })
      })

    dialogRef.afterClosed().subscribe((success) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      this.loadingVerify = false
      this.resetFormState()
      if (success) {
        this.authenticated = true
      } else {
        this.cancelAuthentication = true
      }
    })
  }

  submitVerify() {
    if (this.form.valid) {
      this.cancelAuthentication = false
      this.success = false
      this.loadingVerify = true
      this._duplicateService.validateDeprecation(this.form.value).subscribe({
        next: (response: any) => {
          this.errors = []
          this.loading.next(false)
          if (response.success) {
            this.loadingVerify = false
            this.orcidToDeprecate = response.deprecatingOrcid
            this.data = response
            this.authenticated = true
          } else {
            if (response.errors?.length) {
              this.loadingVerify = false
              this.errors = response.errors
            } else if (response.twoFactorEnabled) {
              this.openAuthChallenge(response.deprecatingOrcidOrEmail)
            }
          }
        },
        error: () => {
          this.loadingVerify = false
        },
      })
    }
  }

  onSubmit() {
    this.loading.next(true)
    this._duplicateService.confirmDeprecate(this.data).subscribe({
      next: (data: DuplicateRemoveEndpoint) => {
        this.loading.next(false)
        this.authenticated = false

        if (data.success) {
          this.errors = []
          this.resetFormState()
          this.success = true
        }
        if (data.errors?.length || !data.twoFactorToken) {
          this.errors = data.errors
          this.cancelAuthentication = true
        }
      },
      error: () => {
        this.cancelAuthentication = true
        this.resetFormState()
        this.loading.next(false)
      },
    })
  }

  ngOnDestroy(): void {
    this.resetFormState()
  }

  private resetFormState(): void {
    this.form?.reset()
  }
}
