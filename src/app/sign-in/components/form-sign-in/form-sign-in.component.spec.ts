import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormSignInComponent } from './form-sign-in.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { OauthService } from '../../../core/oauth/oauth.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('FormSignInComponent', () => {
  let component: FormSignInComponent
  let fixture: ComponentFixture<FormSignInComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [FormSignInComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        SignInService,
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
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSignInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
