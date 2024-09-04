import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AuthorizeComponent } from './authorize.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AuthorizeComponent', () => {
  let component: AuthorizeComponent
  let fixture: ComponentFixture<AuthorizeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AuthorizeComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
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
    fixture = TestBed.createComponent(AuthorizeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
