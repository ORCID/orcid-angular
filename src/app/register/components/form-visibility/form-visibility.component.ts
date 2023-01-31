import { Component, DoCheck, forwardRef, OnInit } from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { VISIBILITY_OPTIONS } from 'src/app/constants'
import { RegisterService } from 'src/app/core/register/register.service'

import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-visibility',
  templateUrl: './form-visibility.component.html',
  styleUrls: ['./form-visibility.component.scss'],
  preserveWhitespaces: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormVisibilityComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormVisibilityComponent),
      multi: true,
    },
  ],
})
export class FormVisibilityComponent
  extends BaseForm
  implements OnInit, DoCheck
{
  visibilityOptions = VISIBILITY_OPTIONS
  errorState = false
  activitiesVisibilityDefault = new UntypedFormControl('', Validators.required)
  constructor(
    private _register: RegisterService,
    private _errorStateMatcher: ErrorStateMatcher
  ) {
    super()
  }
  ngOnInit() {
    this.form = new UntypedFormGroup({
      activitiesVisibilityDefault: this.activitiesVisibilityDefault,
    })
  }

  ngDoCheck(): void {
    this.errorState = this._errorStateMatcher.isErrorState(
      this.activitiesVisibilityDefault,
      null
    )
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const registerForm = this._register.formGroupToActivitiesVisibilityForm(
        this.form as UntypedFormGroup
      )
      fn(registerForm)
    })
  }
}
