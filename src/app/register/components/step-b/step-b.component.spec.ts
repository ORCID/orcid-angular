import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepBComponent } from './step-b.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { FormPasswordComponent } from '../form-password/form-password.component'
import { HttpClientModule } from '@angular/common/http'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar'

describe('StepBComponent', () => {
  let component: StepBComponent
  let fixture: ComponentFixture<StepBComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        MatLegacySnackBarModule,
      ],
      declarations: [StepBComponent, FormPasswordComponent],
      providers: [WINDOW_PROVIDERS, SnackbarService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepBComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      password: new UntypedFormControl(),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
