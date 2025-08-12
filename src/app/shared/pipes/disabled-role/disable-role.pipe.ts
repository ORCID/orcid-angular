import { Pipe, PipeTransform } from '@angular/core'
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms'

@Pipe({
  name: 'disableRole',
  standalone: false,
})
export class DisableRolePipe implements PipeTransform {
  transform(value: string, control: AbstractControl): boolean {
    const formArray: UntypedFormArray | UntypedFormGroup = control.parent
    if (formArray instanceof UntypedFormArray) {
      for (const formGroup of formArray.controls) {
        if (formGroup.value['role'] === value && formGroup.disabled) {
          return true
        }
      }
    }
    return false
  }
}
