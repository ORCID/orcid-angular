import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepBComponent } from './step-b.component'

import { CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core'
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { FormPasswordComponent } from 'src/app/register2/components/form-password/form-password.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window/window.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { Overlay } from '@angular/cdk/overlay'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'

import { Component } from '@angular/core'
import { ControlValueAccessor } from '@angular/forms'

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
})
export class MockFormNotificationsComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(fn: () => void): void {}
  registerOnTouched(fn: () => void): void {}
}

describe('StepBComponent', () => {
  let component: StepBComponent
  let fixture: ComponentFixture<StepBComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        StepBComponent,
        FormPasswordComponent,
        MockFormNotificationsComponent,
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
    fixture = TestBed.createComponent(StepBComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      password: new UntypedFormControl(''),
      sendOrcidNews: new UntypedFormControl(''),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
