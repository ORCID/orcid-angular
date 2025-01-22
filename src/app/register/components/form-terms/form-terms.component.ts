import { Component, DoCheck, forwardRef, Input, OnInit } from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { RegisterService } from 'src/app/core/register/register.service'
import { environment } from 'src/environments/environment'

import { BaseForm } from '../BaseForm'
import { RegisterStateService } from '../../register-state.service'

@Component({
  selector: 'app-form-terms',
  templateUrl: './form-terms.component.html',
  styleUrls: [
    './form-terms.component.scss',
    '../register.style.scss',
    '../register.scss-theme.scss',
  ],
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
  preserveWhitespaces: true,
})
// tslint:disable-next-line: class-name
export class FormTermsComponent extends BaseForm implements OnInit, DoCheck {
  nextButtonWasClicked: boolean
  environment = environment
  constructor(
    private _register: RegisterService,
    private _errorStateMatcher: ErrorStateMatcher,
    private _registerStateService: RegisterStateService
  ) {
    super()
  }
  errorState = false

  termsOfUse = new UntypedFormControl('', Validators.requiredTrue)
  dataProcessed = new UntypedFormControl('', Validators.requiredTrue)
  ngOnInit() {
    this.form = new UntypedFormGroup({
      termsOfUse: this.termsOfUse,
      dataProcessed: this.dataProcessed,
    })
    this._registerStateService.getNextButtonClickFor('d').subscribe(() => {
      this.nextButtonWasClicked = true
    })
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const registerForm =
        this._register.formGroupTermsOfUseAndDataProcessedRegisterForm(
          this.form as UntypedFormGroup
        )
      fn(registerForm)
    })
  }

  ngDoCheck(): void {
    this.errorState =
      this._errorStateMatcher.isErrorState(this.termsOfUse, null) ||
      this._errorStateMatcher.isErrorState(this.dataProcessed, null)
  }
}
