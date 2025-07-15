import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatChip } from '@angular/material/chips'
import { matFormFieldAnimations } from '@angular/material/form-field'
import { Observable } from 'rxjs'
import { WINDOW } from 'src/app/cdk/window'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'
import { PasswordRecovery } from 'src/app/types'

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: [
    './password-recovery.component.scss-theme.scss',
    './password-recovery.component.scss',
  ],
  animations: [matFormFieldAnimations.transitionMessages],
  preserveWhitespaces: true,
})
export class PasswordRecoveryComponent implements OnInit, AfterViewInit {
  serverError = null
  status = false
  value = false
  email = 'test'
  _subscriptAnimationState = ''
  loading = false
  submitted = false
  @ViewChild('passwordChip') passwordChip: MatChip

  emailFormControl = new UntypedFormControl('', [Validators.required])
  typeFormControl = new UntypedFormControl('resetPassword', [
    Validators.required,
  ])

  recoveryForm = new UntypedFormGroup({
    type: this.typeFormControl,
    email: this.emailFormControl,
  })

  constructor(
    private _passwordRecovery: PasswordRecoveryService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter'
  }

  onSubmit() {
    const value = this.recoveryForm.getRawValue()
    this.serverError = null
    // Mark all elements as touch to display untouched FormControl errors
    this.recoveryForm.markAllAsTouched()
    // If the local validations pass, call the backend
    if (this.recoveryForm.valid) {
      this.loading = true
      let $recovery: Observable<PasswordRecovery>
      if (this.typeFormControl.value === 'remindOrcidId') {
        $recovery = this._passwordRecovery.remindOrcidId(value)
      } else {
        $recovery = this._passwordRecovery.resetPassword(value)
      }
      $recovery.subscribe(
        (data) => {
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
        (error) => {
          // Display server errors
          this.loading = false
        }
      )
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
