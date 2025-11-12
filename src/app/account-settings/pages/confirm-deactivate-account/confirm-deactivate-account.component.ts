import { Component } from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router' // Import Router
import { Subject, takeUntil } from 'rxjs'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountActionsDeactivateService } from 'src/app/core/account-actions-deactivate/account-actions-deactivate.service'
import { ErrorStateMatcherForTwoFactorFields } from 'src/app/sign-in/ErrorStateMatcherForTwoFactorFields'
import {
  DeactivationEndpoint,
  ExpiringLinkVerification,
} from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-confirm-deactivate-account',
  standalone: false,
  templateUrl: './confirm-deactivate-account.component.html',
  styleUrls: [
    './confirm-deactivate-account.component.scss',
    './confirm-deactivate-account.component.scss-theme.scss',
  ],
})
export class ConfirmDeactivateAccountComponent {
  data: DeactivationEndpoint = {}
  token: string = ''
  tokenVerification: ExpiringLinkVerification | undefined
  placeholderPassword = $localize`:@@ngOrcid.signin.yourOrcidPassword:Your ORCID password`
  loading = false
  isMobile = false
  $destroy = new Subject<void>()

  deactivationForm: UntypedFormGroup
  showRecoveryCode = false

  errorMatcher = new ErrorStateMatcherForTwoFactorFields()

  constructor(
    private _deactivationService: AccountActionsDeactivateService,
    private _platform: PlatformInfoService,
    private route: ActivatedRoute
  ) {}

  get twoFactorCodeWasTouched() {
    return (
      this.deactivationForm.get('twoFactorCode').dirty &&
      this.deactivationForm.get('twoFactorCode').touched
    )
  }

  get twoFactorRecoveryCodeWasTouched() {
    return (
      this.deactivationForm.get('twoFactorRecoveryCode').dirty &&
      this.deactivationForm.get('twoFactorRecoveryCode').touched
    )
  }

  ngOnInit() {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
    this.route.data.subscribe((data) => {
      this.tokenVerification = data.tokenVerification
    })
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || ''
    })

    this.deactivationForm = new UntypedFormGroup({
      password: new UntypedFormControl('', {
        validators: [Validators.required, Validators.maxLength(256)],
      }),
      twoFactorCode: new UntypedFormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
      twoFactorRecoveryCode: new UntypedFormControl(null, [
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    })
  }

  private updateTwoFactorValidators() {
    const twoFactorCodeControl = this.deactivationForm.get('twoFactorCode')
    const recoveryCodeControl = this.deactivationForm.get(
      'twoFactorRecoveryCode'
    )

    if (!this.data.twoFactorEnabled) {
      twoFactorCodeControl?.removeValidators(Validators.required)
      recoveryCodeControl?.removeValidators(Validators.required)
    } else {
      if (this.showRecoveryCode) {
        twoFactorCodeControl?.removeValidators(Validators.required)
        recoveryCodeControl?.addValidators(Validators.required)
      } else {
        twoFactorCodeControl?.addValidators(Validators.required)
        recoveryCodeControl?.removeValidators(Validators.required)
      }
    }

    twoFactorCodeControl?.updateValueAndValidity({ emitEvent: false })
    recoveryCodeControl?.updateValueAndValidity({ emitEvent: false })
  }

  toggleRecoveryCode(event: Event) {
    event.preventDefault()
    this.showRecoveryCode = !this.showRecoveryCode
    this.updateTwoFactorValidators()

    if (this.showRecoveryCode) {
      this.deactivationForm.get('twoFactorCode')?.setValue(null)
      this.deactivationForm.get('twoFactorRecoveryCode')?.markAsUntouched()
    } else {
      this.deactivationForm.get('twoFactorRecoveryCode')?.setValue(null)
      this.deactivationForm.get('twoFactorCode')?.markAsUntouched()
    }
  }

  submit() {
    this.deactivationForm.get('password').markAsTouched()
    this.deactivationForm.get('password').markAsDirty()

    if (this.data.twoFactorEnabled) {
      this.deactivationForm.get('twoFactorCode').markAsTouched()
      this.deactivationForm.get('twoFactorCode').markAsDirty()
      this.deactivationForm.get('twoFactorRecoveryCode').markAsTouched()
      this.deactivationForm.get('twoFactorRecoveryCode').markAsDirty()
    }
    if (this.deactivationForm.invalid) {
      return
    }
    this.loading = true

    const formValues = this.deactivationForm.value
    const payload: DeactivationEndpoint = {
      password: formValues.password,
      twoFactorCode: formValues.twoFactorCode,
      twoFactorRecoveryCode: formValues.twoFactorRecoveryCode,
    }

    this._deactivationService
      .deactivateAccount(payload, this.token)
      .subscribe((response) => {
        this.loading = false
        this.tokenVerification = response.tokenVerification
        this.data = response
        this.updateTwoFactorValidators()
        if (response.invalidPassword) {
          this.deactivationForm.get('twoFactorCode')?.setValue(null)
          this.deactivationForm.get('twoFactorRecoveryCode')?.setValue(null)
          this.deactivationForm.get('twoFactorCode')?.markAsUntouched()
          this.deactivationForm.get('twoFactorRecoveryCode')?.markAsUntouched()
        }
        if (response.invalidTwoFactorCode) {
          this.deactivationForm
            .get('twoFactorCode')
            ?.setErrors({ backendInvalid: true })
        }

        if (response.invalidTwoFactorRecoveryCode) {
          this.deactivationForm
            .get('twoFactorRecoveryCode')
            ?.setErrors({ backendInvalid: true })
        }
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
