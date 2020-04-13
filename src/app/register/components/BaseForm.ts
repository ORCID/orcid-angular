import {
  ControlValueAccessor,
  Validator,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
} from '@angular/forms'
import { of, Observable } from 'rxjs'
import { filter, switchMap, map, tap, take } from 'rxjs/operators'

export abstract class BaseForm implements ControlValueAccessor, AsyncValidator {
  public form: FormGroup
  public onTouchedFunction
  constructor() {}
  writeValue(val: any): void {
    if (val) {
      this.form.setValue(val, { emitEvent: false })
    }
  }
  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(value => {
      fn(value)
    })
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFunction = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable()
  }
  validate(c: AbstractControl): Observable<ValidationErrors | null> {
    return this.form.statusChanges.pipe(
      filter(value => value !== 'PENDING'),
      take(1),
      map(() => {
        return this.form.valid
          ? null
          : {
              invalidForm: {
                valid: false,
                message: 'internal form is not valid',
              },
            }
      })
    )
  }
}
