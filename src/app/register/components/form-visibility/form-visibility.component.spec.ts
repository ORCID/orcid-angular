import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormVisibilityComponent } from './form-visibility.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RegisterService } from '../../../core/register/register.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormVisibilityComponent', () => {
  let component: FormVisibilityComponent
  let fixture: ComponentFixture<FormVisibilityComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FormVisibilityComponent],
      providers: [
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
    fixture = TestBed.createComponent(FormVisibilityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
