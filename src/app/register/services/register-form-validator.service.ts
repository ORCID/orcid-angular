import { Injectable } from '@angular/core'
import { FormGroup, ValidatorFn } from '@angular/forms'
import { RegisterServicesModule } from './register-services.module'

@Injectable({
  providedIn: RegisterServicesModule,
})
export class RegisterFormValidatorService {
  constructor() {}
  matchValues(value1: string, value2: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[value1]
      const confirmControl = formGroup.controls[value2]

      if (!control || !confirmControl) {
        return null
      }

      if (confirmControl.errors && !confirmControl.errors.passwordMismatch) {
        return null
      }

      if (control.value !== confirmControl.value) {
        confirmControl.setErrors({ passwordMismatch: true })
      } else {
        confirmControl.setErrors(null)
      }
    }
  }
}
