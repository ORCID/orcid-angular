import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepDComponent } from './step-d.component'

import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-form-notifications',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormNotificationsComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class MockFormNotificationsComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

@Component({
  selector: 'app-form-terms',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormTermsComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class MockFormTermsComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

@Component({
  selector: 'app-form-anti-robots',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormAntiRobotsComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class MockFormAntiRobotsComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

describe('StepDComponent', () => {
  let component: StepDComponent
  let fixture: ComponentFixture<StepDComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        StepDComponent,
        MockFormNotificationsComponent,
        MockFormTermsComponent,
        MockFormAntiRobotsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
    fixture = TestBed.createComponent(StepDComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      sendOrcidNews: new UntypedFormControl(),
      termsOfUse: new UntypedFormControl(),
      captcha: new UntypedFormControl(),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
