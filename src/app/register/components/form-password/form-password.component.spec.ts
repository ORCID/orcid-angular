import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { MdePopoverModule } from '../../../cdk/popover'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { RegisterService } from '../../../core/register/register.service'
import { FormPasswordComponent } from './form-password.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('FormPasswordComponent', () => {
  let component: FormPasswordComponent
  let fixture: ComponentFixture<FormPasswordComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MdePopoverModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [FormPasswordComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        RegisterService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
