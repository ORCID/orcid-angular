import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'

export function unique(
  controlName: string,
  duplicatedOptionAllowed?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const parentFormGroup: FormArray | FormGroup = control.parent
      const formArray: FormArray | FormGroup = parentFormGroup?.parent

      if (formArray instanceof FormArray) {
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
