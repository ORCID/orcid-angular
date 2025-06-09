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
import { FormVisibilityComponent } from '../form-visibility/form-visibility.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window/window.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { FormTermsComponent } from '../form-terms/form-terms.component'
import { FormAntiRobotsComponent } from '../form-anti-robots/form-anti-robots.component'

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
})
export class MockFormAntiRobotsComponent implements ControlValueAccessor {
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
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        StepCComponent,
        MockFormVisibilityComponent,
        MockFormTermsComponent,
        MockFormAntiRobotsComponent,
      ],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        MatSnackBar,
        MatDialog,
        SnackbarService,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepCComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      activitiesVisibilityDefault: new UntypedFormControl(''),
      termsOfUse: new UntypedFormControl(''),
      captcha: new UntypedFormControl(''),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
