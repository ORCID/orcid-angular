import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepC2Component } from './step-c2.component'

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
    selector: 'app-form-current-employment',
    template: '<div></div>',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MockFormCurrentEmploymentComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class MockFormCurrentEmploymentComponent
  implements ControlValueAccessor
{
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

describe('StepCComponent', () => {
  let component: StepC2Component
  let fixture: ComponentFixture<StepC2Component>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [StepC2Component, MockFormCurrentEmploymentComponent],
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepC2Component)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      affiliations: new UntypedFormControl(''),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
