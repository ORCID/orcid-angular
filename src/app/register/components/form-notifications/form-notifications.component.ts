import { Component, OnInit, forwardRef } from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'

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
  ngOnInit() {
    this.form = new FormGroup({
      notifications: new FormControl(''),
    })
  }
}
