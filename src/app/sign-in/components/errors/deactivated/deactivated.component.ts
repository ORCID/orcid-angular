import { Component, Inject, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { SignInService } from '../../../../core/sign-in/sign-in.service'
import { WINDOW } from '../../../../cdk/window'
import { TLD_REGEXP } from '../../../../constants'

@Component({
  selector: 'app-deactivated',
  templateUrl: './deactivated.component.html',
  styleUrls: ['./deactivated.component.scss'],
})
export class DeactivatedComponent implements OnInit {
  @Input() email: string
  loading = false
  showReactivationSent = false
  showReactivationSentError = false

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(TLD_REGEXP),
  ])

  deactivatedForm = new FormGroup({
    email: this.emailFormControl,
  })

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    if (this.email.includes('@')) {
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
      const $deactivate = this._signIn.reactivation(value)
      $deactivate.subscribe((data) => {
        this.loading = false
        this.showReactivationSent = data.sent
        this.showReactivationSentError = data.error
      })
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
