import {
  ControlValueAccessor,
  Validator,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'

export abstract class BaseForm implements ControlValueAccessor, Validator {
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
      // console.log('on change')
      fn(value)
    })
  }
  registerOnTouched(fn: any): void {
    // console.log('on blur')
    this.onTouchedFunction = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable()
  }
  validate(c: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'internal form is not valid',
          },
        }
  }
}
