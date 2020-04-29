import { Component, OnInit, forwardRef } from '@angular/core'
import { BaseForm } from '../BaseForm'
import { RegisterService } from 'src/app/core/register/register.service'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms'
import { RegisterForm } from 'src/app/types/register.endpoint'

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
export class FormAntiRobotsComponent extends BaseForm implements OnInit {
  captchaFailState = false
  captchaLoadedWithWidgetId: number
  constructor(private _register: RegisterService) {
    super()
    this.form = new FormGroup({
      captcha: new FormControl(null, {
        validators: this.captchaValidator,
      }),
    })
  }

  ngOnInit(): void {}
  // Captcha must be clicked unless it was not loaded
  captchaValidator(): ValidatorFn {
    return (control: FormControl) => {
      const hasError = Validators.required(control)
      if (hasError && hasError.required && this.captchaLoadedWithWidgetId) {
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
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(value => {
      const registerForm = this._register.formGroupToRecaptchaForm(
        this.form,
        this.captchaLoadedWithWidgetId
      )
      fn(registerForm)
    })
  }
}
