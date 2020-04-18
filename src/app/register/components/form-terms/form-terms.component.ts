import { Component, OnInit, forwardRef, DoCheck } from '@angular/core'
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'
import { BaseForm } from '../BaseForm'
import { RegisterService } from 'src/app/core/register/register.service'
import { ErrorStateMatcher } from '@angular/material/core'

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
// tslint:disable-next-line: class-name
export class FormTermsComponent extends BaseForm implements OnInit, DoCheck {
  constructor(
    private _register: RegisterService,
    private _errorStateMatcher: ErrorStateMatcher
  ) {
    super()
  }
  errorState = false

  termsOfUse = new FormControl('', Validators.requiredTrue)
  ngOnInit() {
    this.form = new FormGroup({
      termsOfUse: this.termsOfUse,
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

  ngDoCheck(): void {
    console.log('TEST')
    console.log(this._errorStateMatcher.isErrorState)

    this.errorState = this._errorStateMatcher.isErrorState(
      this.termsOfUse,
      null
    )
  }
}
