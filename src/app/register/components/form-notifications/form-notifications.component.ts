import { Component, forwardRef, OnInit } from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'

import { RegisterService } from 'src/app/core/register/register.service'
import { BaseForm } from '../BaseForm'

@Component({
  selector: 'app-form-notifications',
  templateUrl: './form-notifications.component.html',
  styleUrls: [
    './form-notifications.component.scss',
    '../register.style.scss',
    '../register.scss-theme.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormNotificationsComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => FormNotificationsComponent),
      multi: true,
    },
  ],
})
export class FormNotificationsComponent extends BaseForm implements OnInit {
  constructor(private _register: RegisterService) {
    super()
  }
  ngOnInit() {
    this.form = new UntypedFormGroup({
      sendOrcidNews: new UntypedFormControl(false, {
        validators: Validators.required,
      }),
    })
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe((value) => {
      const registerForm = this._register.formGroupToSendOrcidNewsForm(
        this.form as UntypedFormGroup
      )
      fn(registerForm)
    })
  }
}
