import { Pipe, PipeTransform } from '@angular/core'
import { AbstractControl, FormArray, FormGroup } from '@angular/forms'

@Pipe({
  name: 'disableRole',
})
export class DisableRolePipe implements PipeTransform {

  transform(value: string, control: AbstractControl): boolean {
    const formArray: FormArray | FormGroup = control.parent
    if (formArray instanceof FormArray) {
      for (const formGroup of formArray.controls) {
        if (formGroup.value['role'] === value && formGroup.disabled) {
          return true
        }
      }
    }
    return false
  }
}
