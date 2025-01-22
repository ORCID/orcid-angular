import {
  Component,
  DoCheck,
  forwardRef,
  OnDestroy,
  OnInit,
} from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { VISIBILITY_OPTIONS } from 'src/app/constants'
import { Register2Service } from 'src/app/core/register2/register2.service'

import { BaseForm } from '../BaseForm'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-form-visibility',
  templateUrl: './form-visibility.component.html',
  styleUrls: [
    './form-visibility.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
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
  implements OnInit, DoCheck, OnDestroy
{
  ariaLabelMoreInformationOnVisibility = $localize`:@@register.ariaLabelMoreInformationOnVisibility:More information on visibility settings (Opens in new tab)`
  visibilityOptions = VISIBILITY_OPTIONS
  errorState = false
  activitiesVisibilityDefault = new UntypedFormControl('', Validators.required)
  destroy = new Subject()
  constructor(
    private _register: Register2Service,
    private _errorStateMatcher: ErrorStateMatcher,
    private _registerStateService: RegisterStateService,
    private _registerObservability: RegisterObservabilityService
  ) {
    super()
  }
  ngOnDestroy(): void {
    this.destroy.next()
  }
  ngOnInit() {
    this._registerStateService
      .getNextButtonClickFor('c')
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this._registerObservability.stepCNextButtonClicked(this.form)
      })
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
