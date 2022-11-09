import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'

export function unique(
  controlName: string,
  duplicatedOptionAllowed?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const parentFormGroup: UntypedFormArray | UntypedFormGroup = control.parent
      const formArray: UntypedFormArray | UntypedFormGroup = parentFormGroup?.parent

      if (formArray instanceof UntypedFormArray) {
        for (const formGroup of formArray.controls) {
          if (formGroup !== parentFormGroup) {
            if (formGroup.get(controlName).hasError('unique')) {
              setTimeout(
                () => formGroup.get(controlName).updateValueAndValidity(),
                0
              )
            }
            if (formGroup.value[controlName] === control.value) {
              if (duplicatedOptionAllowed === control.value) {
                return null
              } else {
                return { unique: true }
              }
            }
          }
        }
      }
    }
    return null
  }
}
