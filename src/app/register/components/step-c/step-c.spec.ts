import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepCComponent } from './step-c.component'

import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-form-visibility',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormVisibilityComponent),
      multi: true,
    },
  ],
})
export class MockFormVisibilityComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

describe('StepCComponent', () => {
  let component: StepCComponent
  let fixture: ComponentFixture<StepCComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        MatLegacySnackBarModule,
      ],
      declarations: [StepCComponent, MockFormVisibilityComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        WINDOW_PROVIDERS,
        SnackbarService,
        {
          provide: RegisterStateService,
          useValue: {},
        },
        {
          provide: RegisterObservabilityService,
          useValue: {},
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      activitiesVisibilityDefault: new UntypedFormControl(),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
