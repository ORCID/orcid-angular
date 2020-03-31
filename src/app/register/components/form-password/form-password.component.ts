import { Component, OnInit, forwardRef } from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms'
import { RegisterFormValidatorService } from '../../services/register-form-validator.service'

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: ['./form-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormPasswordComponent),
      multi: true,
    },
  ],
})
export class FormPasswordComponent extends BaseForm implements OnInit {
  constructor(private validator: RegisterFormValidatorService) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup(
      {
        password: new FormControl(''),
        passwordConfirmation: new FormControl(''),
      },
      this.validator.matchValues('password', 'passwordConfirmation')
    )
  }
}
