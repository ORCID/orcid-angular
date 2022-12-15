import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms'
import { merge, Observable, timer } from 'rxjs'
import { filter, map, startWith, take } from 'rxjs/operators'

export abstract class BaseForm implements ControlValueAccessor, AsyncValidator {
  public form: UntypedFormGroup
  public onTouchedFunction
  constructor() {}
  writeValue(val: any): void {
    if (val != null && val !== undefined && val !== '') {
      this.form.setValue(val, { emitEvent: true })
      // Trigger registerOnChange custom function by calling form.updateValueAndValidity
      // require since most form controls extending this class
      // need to call the xxxxRegisterForm functions to adapt the original angular form value for the backend format
      setTimeout(() => {
        this.form.updateValueAndValidity()
      })
    }
  }
  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe((value) => {
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
    // temporal fix
    // see related issue
    // https://github.com/angular/angular/issues/14542
    // depending of fix
    // https://github.com/angular/angular/pull/20806
    //
    // using form.statusChanges observable only would be a better solution for this scenario (see the code before this fix)
    // but if the form status starts as `pending` Angular wont report the status change because of #14542
    // and the status might now start as `pending` with the introduction of Oauth registration

    return merge(this.form.statusChanges, timer(0, 1000)).pipe(
      map(() => this.form.status),
      startWith(this.form.status),
      filter((value) => value !== 'PENDING'),
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
