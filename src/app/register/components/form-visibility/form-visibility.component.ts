import {
  Component,
  OnInit,
  forwardRef,
  OnChanges,
  DoCheck,
} from '@angular/core'
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
import { VISIBILITY_OPTIONS } from 'src/app/constants'
import { ErrorStateMatcher } from '@angular/material/core'

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
export class FormVisibilityComponent extends BaseForm
  implements OnInit, DoCheck {
  visibilityOptions = VISIBILITY_OPTIONS
  errorState = false
  activitiesVisibilityDefault = new FormControl('', Validators.required)
  constructor(
    private _register: RegisterService,
    private _errorStateMatcher: ErrorStateMatcher
  ) {
    super()
  }
  ngOnInit() {
    this.form = new FormGroup({
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
        <FormGroup>this.form
      )
      fn(registerForm)
    })
  }
}
