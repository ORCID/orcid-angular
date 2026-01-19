import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { OrcidValidators } from 'src/app/validators'
import { PasswordRecovery } from 'src/app/types'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'

@Component({
  selector: 'app-password-recovery',
  standalone: false,
  templateUrl: './password-recovery.component.html',
  styleUrls: [
    './password-recovery.component.scss',
    './password-recovery.component.scss-theme.scss',
  ],
})
export class PasswordRecoveryComponent implements OnInit {
  recoveryForm: FormGroup = new FormGroup({})
  loading = false
  submitted = false
  constructor(private _passwordRecovery: PasswordRecoveryService) {}
  ariaLabelLostAccess = $localize`:@@recovery.lostAccessToYourEmailAddresses:Lost access to your email addresses?`
  ariaLabelTrySigningIn = $localize`:@@recovery.trySigningIn:Try signing in with your iD and password now`
  ariaLabelIveForgotten = $localize`:@@recovery.iveForgotten:I've forgotten`
  ariaLabelMyOrcidAccountPassword = $localize`:@@recovery.myOrcidAccountPassword:my ORCID account password`
  ariaLabelMy16DigitOrcidId = $localize`:@@recovery.my16DigitOrcidId:my 16-digit ORCID iD`

  ngOnInit() {
    this.recoveryForm = new FormGroup({
      recoveryType: new FormControl('password', Validators.required),
      email: new FormControl('', [Validators.required, OrcidValidators.email]),
    })
  }

  onSubmit() {
    if (this.recoveryForm.valid) {
      this.loading = true
      const { recoveryType, email } = this.recoveryForm.value
      let $recovery: Observable<PasswordRecovery>
      if (recoveryType === 'password') {
        $recovery = this._passwordRecovery.resetPassword(
          this.recoveryForm.getRawValue()
        )
      } else {
        $recovery = this._passwordRecovery.remindOrcidId(
          this.recoveryForm.getRawValue()
        )
      }
      $recovery.subscribe({
        next: (data) => {
          this.loading = false
          // Sets the list of backend errors to the control
          if (data.errors && data.errors.length) {
            this.recoveryForm.controls['email'].setErrors({
              backendErrors: data.errors || null,
            })
          } else if (data.successMessage.length) {
            this.submitted = true
          }
        },
        error: (error) => {
          // Display server errors
          this.loading = false
        },
      })
    } else {
      this.recoveryForm.markAllAsTouched()
      this.recoveryForm.markAllAsDirty()
    }
  }
}
