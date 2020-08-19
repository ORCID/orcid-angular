import { AbstractControl, ValidationErrors, Validators } from '@angular/forms'
import { ORCID_REGEXP, ORCID_URI_REGEXP } from '../../../constants'
import { OrcidValidators } from 'src/app/validators'

export class UsernameValidator {
  static orcidOrEmail(control: AbstractControl): ValidationErrors | null {
    const emailErrors = OrcidValidators.emailGeneric(control)
    const orcidError = Validators.pattern(ORCID_REGEXP)(control)
    const orcidUriError = Validators.pattern(ORCID_URI_REGEXP)(control)

    return control.value.length > 19
      ? validateUsername(orcidUriError, emailErrors)
      : validateUsername(orcidError, emailErrors)
  }
}

function validateUsername(orcidError, emailErrors) {
  if (orcidError?.pattern && emailErrors?.email) {
    return { invalidUserName: true }
  }

  return null
}
