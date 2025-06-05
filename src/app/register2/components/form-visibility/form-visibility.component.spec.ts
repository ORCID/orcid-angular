import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { Register2Service } from '../../../core/register2/register2.service'
import { FormVisibilityComponent } from './form-visibility.component'

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
        Register2Service,
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
