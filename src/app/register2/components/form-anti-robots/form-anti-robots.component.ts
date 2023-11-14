import { Component, DoCheck, forwardRef, OnInit } from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { merge, Subject } from 'rxjs'
import { RegisterService } from 'src/app/core/register/register.service'

import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-anti-robots',
  templateUrl: './form-anti-robots.component.html',
  styleUrls: ['./form-anti-robots.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAntiRobotsComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormAntiRobotsComponent),
      multi: true,
    },
  ],
})
export class FormAntiRobotsComponent
  extends BaseForm
  implements OnInit, DoCheck
{
  captchaFailState = false
  captchaLoadedWithWidgetId: number
  $widgetIdUpdated = new Subject()
  errorState = false
  captcha = new UntypedFormControl(null, {
    validators: [this.captchaValidator()],
  })
  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      captcha: this.captcha,
    })
  }

  constructor(
    private _register: RegisterService,
    private _errorStateMatcher: ErrorStateMatcher
  ) {
    super()
  }

  // Captcha must be clicked unless it was not loaded
  captchaValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      const hasError = Validators.required(control)
      if (
        hasError &&
        hasError.required &&
        this.captchaLoadedWithWidgetId !== undefined
      ) {
        return { captcha: true }
      } else {
        return null
      }
    }
  }

  captchaFail($event) {
    this.captchaFailState = $event
  }
  captchaLoaded(widgetId: number) {
    this.captchaLoadedWithWidgetId = widgetId
    this.captcha.updateValueAndValidity()
    this.$widgetIdUpdated.next()
  }

  ngDoCheck(): void {
    this.errorState = this._errorStateMatcher.isErrorState(this.captcha, null)
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    merge(
      this.$widgetIdUpdated.asObservable(),
      this.form.valueChanges
    ).subscribe(() => {
      const registerForm = this._register.formGroupToRecaptchaForm(
        this.form,
        this.captchaLoadedWithWidgetId
      )
      fn(registerForm)
    })
  }
}
