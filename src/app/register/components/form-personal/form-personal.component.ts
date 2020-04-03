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
  AsyncValidatorFn,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'
import {
  TLD_REGEXP,
  ILLEGAL_NAME_CHARACTERS_REGEXP,
  URL_REGEXP,
} from 'src/app/constants'
import { RegisterFormValidatorService } from '../../services/register-form-validator.service'
import { Observable } from 'rxjs'
import { RegisterService } from 'src/app/core/register/register.service'
import { map } from 'rxjs/operators'
import { OrcidValidators } from 'src/app/validators'

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
  constructor(
    private validator: RegisterFormValidatorService,
    private _register: RegisterService
  ) {
    super()
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        givenNames: new FormControl('', [
          Validators.required,
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ]),
        familyNames: new FormControl(''),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern(TLD_REGEXP),
        ]),
        confirmEmail: new FormControl('', [Validators.required]),
      },
      {
        validators: this.validator.matchValues('email', 'confirmEmail'),
        asyncValidators: [
          this._register.validator('givenNames'),
          this._register.validator('familyNames'),
          this._register.validator('email'),
        ],
      }
    )
  }
}
