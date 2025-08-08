import { Component, Inject, Input, OnInit } from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { SignInService } from '../../../../core/sign-in/sign-in.service'
import { WINDOW } from '../../../../cdk/window'
import { OrcidValidators } from 'src/app/validators'

@Component({
    selector: 'app-deactivated',
    templateUrl: './deactivated.component.html',
    styleUrls: ['./deactivated.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class DeactivatedComponent implements OnInit {
  @Input() email: string
  loading = false
  showReactivationSent = false
  showReactivationSentError = false
  showReactivationSentErrorMessage: string

  emailFormControl = new UntypedFormControl('', [
    Validators.required,
    OrcidValidators.emailGeneric,
  ])

  deactivatedForm = new UntypedFormGroup({
    email: this.emailFormControl,
  })

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    if (this.email?.includes('@')) {
      this.deactivatedForm.patchValue({
        email: this.email,
      })
    }
  }

  onSubmit() {
    const value = this.deactivatedForm.getRawValue()

    this.deactivatedForm.markAllAsTouched()

    this.showReactivationSentError = false

    if (this.deactivatedForm.valid) {
      this.loading = true
      const $deactivate = this._signIn.reactivation(value.email)
      $deactivate.subscribe((data) => {
        this.loading = false
        this.showReactivationSent = data.sent
        if (data.error) {
          this.showReactivationSentError = true
          this.showReactivationSentErrorMessage = data.error
        }
      })
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
