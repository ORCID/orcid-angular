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
  Validators,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'
import { TLD_REGEXP } from 'src/app/constants'
import { RegisterFormValidatorService } from '../../services/register-form-validator.service'

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
export class FormPersonalComponent extends BaseForm
  implements OnInit, ControlValueAccessor, Validator {
  constructor(private validator: RegisterFormValidatorService) {
    super()
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl(''),
        primaryEmail: new FormControl('', [
          Validators.required,
          Validators.pattern(TLD_REGEXP),
        ]),
        confirmEmail: new FormControl('', [Validators.required]),
      },
      this.validator.matchValues('primaryEmail', 'confirmEmail')
    )
  }
}
