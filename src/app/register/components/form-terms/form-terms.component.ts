import { Component, OnInit, forwardRef } from '@angular/core'
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'
import { RegisterService } from 'src/app/core/register/register.service'

@Component({
  selector: 'app-form-terms',
  templateUrl: './form-terms.component.html',
  styleUrls: ['./form-terms.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTermsComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormTermsComponent),
      multi: true,
    },
  ],
})
export class FormTermsComponent extends BaseForm implements OnInit {
  constructor(private _register: RegisterService) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup({
      termsOfUse: new FormControl('', Validators.requiredTrue),
    })
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(value => {
      const registerForm = this._register.formGroupToTermOfUserRegisterForm(<
        FormGroup
      >this.form)
      fn(registerForm)
    })
  }
}
