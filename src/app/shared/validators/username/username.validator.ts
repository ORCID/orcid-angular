import { AbstractControl, ValidationErrors } from '@angular/forms'
import { EMAIL_REGEXP, ORCID_REGEXP, TLD_REGEXP } from '../../../constants'

export class UsernameValidator {
  static orcidOrEmail(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null
    }

    if (
      !(
        ORCID_REGEXP.test(control.value) ||
        (TLD_REGEXP.test(control.value) && EMAIL_REGEXP.test(control.value))
      )
    ) {
      return { invalidUserName: true }
    }
    return null
  }
}
