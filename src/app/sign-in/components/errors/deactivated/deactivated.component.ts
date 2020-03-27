import { Component, Inject, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { SignInService } from '../../../../core/sign-in/sign-in.service'
import { WINDOW } from '../../../../cdk/window'

@Component({
  selector: 'app-deactivated',
  templateUrl: './deactivated.component.html',
  styleUrls: ['./deactivated.component.scss'],
})
export class DeactivatedComponent implements OnInit {
  @Input() email: string
  loading = false
  showReactivationSent = false

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ])

  deactivatedForm = new FormGroup({
    email: this.emailFormControl,
  })

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {
    this.deactivatedForm.patchValue({
      email: this.email,
    })
  }

  onSubmit() {
    const value = this.deactivatedForm.getRawValue()

    this.deactivatedForm.markAllAsTouched()

    if (this.deactivatedForm.valid) {
      this.loading = true
      const $deactivate = this._signIn.reactivation(value)
      $deactivate.subscribe(data => {
        this.loading = false
        this.showReactivationSent = data.sent
      })
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
