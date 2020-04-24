import { AbstractControl, ValidationErrors, Validators } from '@angular/forms'
import { ORCID_REGEXP, TLD_REGEXP } from '../../../constants'

export class UsernameValidator {
  static orcidOrEmail(control: AbstractControl): ValidationErrors | null {
    const emailErrors = Validators.email(control)
    const tldError = Validators.pattern(TLD_REGEXP)(control)
    const orcidError = Validators.pattern(ORCID_REGEXP)(control)

    if (
      orcidError &&
      orcidError.pattern &&
      ((tldError && tldError.pattern) || (emailErrors && emailErrors.email))
    ) {
      return { invalidUserName: true }
    }
    return null
  }
}
