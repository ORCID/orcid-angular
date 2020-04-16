import { Component, OnInit, forwardRef } from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'
import { RegisterService } from 'src/app/core/register/register.service'

@Component({
  selector: 'app-form-notifications',
  templateUrl: './form-notifications.component.html',
  styleUrls: ['./form-notifications.component.scss'],
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
    this.form = new FormGroup({
      sendOrcidNews: new FormControl(''),
    })
  }

  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(value => {
      const registerForm = this._register.formGroupToSendOrcidNewsForm(<
        FormGroup
      >this.form)
      fn(registerForm)
    })
  }
}
