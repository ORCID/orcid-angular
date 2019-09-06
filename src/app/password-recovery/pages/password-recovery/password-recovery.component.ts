import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'
import { matFormFieldAnimations } from '@angular/material'

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  animations: [matFormFieldAnimations.transitionMessages],
  preserveWhitespaces: true,
})
export class PasswordRecoveryComponent implements OnInit, AfterViewInit {
  status = false
  value = false
  email = 'test'
  _subscriptAnimationState = ''
  loading = false
  submited = false

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  typeFormControl = new FormControl('', [Validators.required])

  recoveryForm = new FormGroup({
    type: this.typeFormControl,
    email: this.emailFormControl,
  })

  constructor(private _passwordRecovery: PasswordRecoveryService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter'
  }

  onChipSelect(event) {
    console.log(event)
  }

  select() {
    this.status = !this.status
  }

  onSubmit() {
    const value = this.recoveryForm.getRawValue()
    // Mark all elements as touch to display untouched FormControl errors
    this.recoveryForm.markAllAsTouched()
    // Only if the local validations pass, call the backend
    if (this.recoveryForm.valid) {
      this.loading = true
      this._passwordRecovery.resetPassword(value).subscribe(data => {
        this.loading = false
        // Sets the list of backend errors to the control
        if (data.errors && data.errors.length) {
          this.recoveryForm.controls['email'].setErrors({
            backendErrors: data.errors || null,
          })
        } else if (data.successMessage.length) {
          this.submited = true
        }
      })
    }

    console.log(value)
  }

  chipsChange(a) {
    console.log(a)
  }
}
