import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FormAuthorizeComponent } from './form-authorize.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { OauthService } from '../../../core/oauth/oauth.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormAuthorizeComponent', () => {
  let component: FormAuthorizeComponent
  let fixture: ComponentFixture<FormAuthorizeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FormAuthorizeComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        OauthService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAuthorizeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
