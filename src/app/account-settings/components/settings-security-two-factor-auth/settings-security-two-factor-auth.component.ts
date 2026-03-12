import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ApplicationRoutes } from '../../../constants'
import { Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { MatDialog } from '@angular/material/dialog'
import { AuthChallengeComponent } from '@orcid/registry-ui'
import { AuthChallengeFormData } from '../../../types/common.endpoint'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'

@Component({
  selector: 'app-settings-security-two-factor-auth',
  templateUrl: './settings-security-two-factor-auth.component.html',
  styleUrls: [
    './settings-security-two-factor-auth.component.scss',
    './settings-security-two-factor-auth.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsSecurityTwoFactorAuthComponent implements OnInit {
  @Input() twoFactorState: boolean
  @Output() twoFactorStateOutput = new EventEmitter<any>()

  form: UntypedFormGroup
  success = false
  cancel = false
  authChallengeLabel = $localize`:@@accountSettings.security.disable2FA:disable 2FA`

  constructor(
    private _router: Router,
    private twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private _fb: UntypedFormBuilder,
    private _dialog: MatDialog
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
      .takeUntil(dialogRef.afterClosed())
      .subscribe(() => {
        this.twoFactorAuthenticationService
          .disable(this.form.value)
          .pipe(first())
          .subscribe({
            next: (response: any) => {
              if (response.success) {
                this.twoFactorState = response.enabled
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
    if (!this.twoFactorState) {
      this._router.navigate([ApplicationRoutes.twoFactorSetup])
    } else {
      this.openAuthChallenge()
    }
  }
}
