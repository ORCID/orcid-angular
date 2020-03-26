import { Component, OnInit, forwardRef } from '@angular/core'
import {
  FormGroup,
  ControlValueAccessor,
  Validator,
  FormControl,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms'

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormPersonalComponent),
      multi: true,
    },
  ],
})
export class FormPersonalComponent
  implements OnInit, ControlValueAccessor, Validator {
  public basicInfoForm: FormGroup

  constructor() {
    this.basicInfoForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      primaryEmail: new FormControl(''),
      confirmEmail: new FormControl(''),
      optionalEmails: new FormGroup({}),
    })
    this.addAdditionalEmail()
  }

  public onTouched: () => void = () => {}

  writeValue(val: any): void {
    if (val) {
      this.basicInfoForm.setValue(val, { emitEvent: false })
    }
  }
  registerOnChange(fn: any): void {
    console.log('on change')
    this.basicInfoForm.valueChanges.subscribe(fn)
  }
  registerOnTouched(fn: any): void {
    console.log('on blur')
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.basicInfoForm.disable() : this.basicInfoForm.enable()
  }

  validate(c: AbstractControl): ValidationErrors | null {
    console.log('Basic Info validation', c, this.basicInfoForm.value)
    return this.basicInfoForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'basicInfoForm fields are invalid',
          },
        }
  }

  addAdditionalEmail(): void {
    console.log(this.basicInfoForm)
    const optionalEmails: FormGroup = <FormGroup>(
      this.basicInfoForm.controls['optionalEmails']
    )
    optionalEmails.addControl(
      Object.keys(optionalEmails).length.toString(),
      new FormControl('')
    )
  }

  ngOnInit() {}
}
