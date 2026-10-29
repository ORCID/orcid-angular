import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepC2Component } from './step-c2.component'

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  forwardRef,
  Output,
} from '@angular/core'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { By } from '@angular/platform-browser'
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
  standalone: false,
})
export class MockFormCurrentEmploymentComponent
  implements ControlValueAccessor
{
  @Output() skipStep = new EventEmitter<void>()
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

describe('StepC2Component', () => {
  let component: StepC2Component
  let fixture: ComponentFixture<StepC2Component>
  let registerStateServiceStub: { registerStepperButtonClicked: jasmine.Spy }

  beforeEach(() => {
    registerStateServiceStub = {
      registerStepperButtonClicked: jasmine.createSpy(
        'registerStepperButtonClicked'
      ),
    }
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [StepC2Component, MockFormCurrentEmploymentComponent],
      providers: [
        {
          provide: RegisterStateService,
          useValue: registerStateServiceStub,
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

  it('marks the step subtitle as optional', () => {
    const subtitle: HTMLElement = fixture.nativeElement.querySelector(
      'mat-card-subtitle h2'
    )

    expect(subtitle.textContent).toContain('Step 3 of 5 - Current employment')
    expect(subtitle.querySelector('em').textContent).toContain('(Optional)')
  })

  it('offers to skip the step and continue registration', () => {
    const skipButton: HTMLElement = fixture.nativeElement.querySelector(
      '#step-c2-skip-button'
    )

    expect(skipButton.textContent).toContain(
      'Skip this step and continue registration'
    )
  })

  it('flags the step as optional and advances when skipped', () => {
    const optionalChange = jasmine.createSpy('formGroupStepC2OptionalChange')
    component.formGroupStepC2OptionalChange.subscribe(optionalChange)

    component.optionalNextStep()

    expect(optionalChange).toHaveBeenCalledWith(true)
    expect(
      registerStateServiceStub.registerStepperButtonClicked
    ).toHaveBeenCalledWith('c2', 'skip')
  })

  it('skips the step when the employment form requests it', () => {
    spyOn(component, 'optionalNextStep')
    const employmentForm = fixture.debugElement.query(
      By.directive(MockFormCurrentEmploymentComponent)
    ).componentInstance as MockFormCurrentEmploymentComponent

    employmentForm.skipStep.emit()

    expect(component.optionalNextStep).toHaveBeenCalled()
  })
})
