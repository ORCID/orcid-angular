import { Component, OnInit, forwardRef } from '@angular/core'
import { BaseForm } from '../BaseForm'
import {
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validators,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms'

@Component({
  selector: 'app-form-visibility',
  templateUrl: './form-visibility.component.html',
  styleUrls: ['./form-visibility.component.scss'],
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
export class FormVisibilityComponent extends BaseForm implements OnInit {
  visibilityOptions = ['Everyone', 'Trusted', 'only']
  ngOnInit() {
    this.form = new FormGroup({
      visibility: new FormControl('', Validators.required),
    })
  }
}
