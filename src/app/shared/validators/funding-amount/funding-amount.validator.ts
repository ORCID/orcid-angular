import { AbstractControl, ValidatorFn } from '@angular/forms'
import {
  AMOUNT_DIGITS_ONLY_REGEX,
  AMOUNT_FULLY_FORMATTED_REGEX,
  AMOUNT_FORMATTED_WITH_DECIMAL_REGEXP,
} from 'src/app/constants'

export function validateFundingAmount(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      if (
        control.value.match(AMOUNT_DIGITS_ONLY_REGEX) ||
        control.value.match(AMOUNT_FORMATTED_WITH_DECIMAL_REGEXP) ||
        control.value.match(AMOUNT_FULLY_FORMATTED_REGEX)
      ) {
        return null
      } else {
        return { pattern: control.value }
      }
    }
    return null
  }
}
