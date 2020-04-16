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
import { RegisterService } from 'src/app/core/register/register.service'

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
  visibilityOptions = ['PUBLIC', 'LIMITED', 'PRIVATE']

  constructor(private _register: RegisterService) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup({
      activitiesVisibilityDefault: new FormControl(
        this.visibilityOptions[0],
        Validators.required
      ),
    })
  }

  // OVERWRITE
  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(value => {
      const registerForm = this._register.formGroupToActivitiesVisibilityForm(<
        FormGroup
      >this.form)
      fn(registerForm)
    })
  }
}
