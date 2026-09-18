import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ApplicationRoutes } from '../../../constants'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TogglzFlag } from '../../../types/config.endpoint'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { MatDialog } from '@angular/material/dialog'
import { AuthChallengeComponent } from '@orcid/registry-ui'
import { AuthChallengeFormData } from '../../../types/common.endpoint'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { Status } from '../../../types/two-factor.endpoint'

@Component({
  selector: 'app-settings-security-two-factor-auth',
  templateUrl: './settings-security-two-factor-auth.component.html',
  styleUrls: [
    './settings-security-two-factor-auth.component.scss',
    './settings-security-two-factor-auth.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsSecurityTwoFactorAuthComponent implements OnInit, OnDestroy {
  @Input() twoFactorInfo: Status | undefined
  @Output() twoFactorStateOutput = new EventEmitter<any>()

  private readonly $destroy = new Subject<void>()

  form: UntypedFormGroup
  success = false
  cancel = false
  authChallengeLabel = $localize`:@@accountSettings.security.disable2FA:to disable 2FA`

  recoveryPhoneTogglz = false
  loadingTogglz = true
  /** Set from the query param the recovery phone page comes back with. */
  recoveryPhoneOutcome: 'added' | 'updated' | 'failed' | undefined

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _fb: UntypedFormBuilder,
    private _dialog: MatDialog,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      password: [null, Validators.required],
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
    })

    this._togglz
      .getStateOf(TogglzFlag.TWO_FACTOR_RECOVERY_PHONE)
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        this.loadingTogglz = false
        this.recoveryPhoneTogglz = value
      })

    this.readRecoveryPhoneOutcome()
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  /**
   * The add and manage pages come back with the outcome as a query param. Show
   * it once, then drop it so a refresh does not repeat the message.
   */
  private readRecoveryPhoneOutcome(): void {
    const outcome = this._route.snapshot.queryParamMap.get('recoveryPhone')
    if (outcome !== 'added' && outcome !== 'updated' && outcome !== 'failed') {
      return
    }
    this.recoveryPhoneOutcome = outcome
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { recoveryPhone: null },
      queryParamsHandling: 'merge',
      fragment: '2FA',
      replaceUrl: true,
    })
  }

  get hasRecoveryPhone(): boolean {
    return !!this.twoFactorInfo?.maskedRecoveryPhoneNumber
  }

  get recoveryPhoneDate() {
    return this.twoFactorInfo?.recoveryPhoneModified
      ? this.twoFactorInfo?.recoveryPhoneLastModifiedDate
      : this.twoFactorInfo?.recoveryPhoneCreationDate
  }

  manageRecoveryPhone(): void {
    this._router.navigate([ApplicationRoutes.recoveryPhone])
  }

  openAuthChallenge() {
    const dialogRef = this._dialog.open<AuthChallengeComponent>(
      AuthChallengeComponent,
      {
        data: {
          parentForm: this.form,
          actionDescription: this.authChallengeLabel,
        } as AuthChallengeFormData,
      }
    )

    dialogRef.componentInstance.submitAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        this.twoFactorAuthenticationService
          .disable(this.form.value)
          .pipe(first())
          .subscribe({
            next: (response: any) => {
              if (response.success) {
                if (this.twoFactorInfo) {
                  this.twoFactorInfo.enabled = response.enabled
                }
                this.twoFactorStateOutput.emit(false)
                dialogRef.close(true)
              } else {
                dialogRef.componentInstance.loading = false
                dialogRef.componentInstance.processBackendResponse(response)
              }
            },
          })
      })

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.success = true
      } else {
        this.cancel = true
      }
    })
  }

  twoFactor() {
    if (!this.twoFactorInfo?.enabled) {
      this._router.navigate([ApplicationRoutes.twoFactorSetup])
    } else {
      this.cancel = false
      this.success = false
      this.openAuthChallenge()
    }
  }
}
